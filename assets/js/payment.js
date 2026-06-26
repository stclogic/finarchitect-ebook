// PayPal(+ Google Pay / Apple Pay / 카드) 결제 처리 — eBook 낱권 구매
(function () {

  // ── SDK 로더 ───────────────────────────────────
  function loadPayPalSDK(clientId) {
    if (window.paypal) return Promise.resolve();
    if (window._paypalLoading) return window._paypalLoading;
    window._paypalLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&enable-funding=card`;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window._paypalLoading;
  }

  // ── 결제 모달 ──────────────────────────────────
  function injectBookPaymentModal() {
    if (document.getElementById('bookPayModal')) return;
    const el = document.createElement('div');
    el.id = 'bookPayModal';
    el.innerHTML = `
      <div class="pay-overlay" id="bookPayOverlay">
        <div class="pay-box">
          <button class="auth-close" onclick="closeBookPayModal()">✕</button>
          <div class="pay-header">
            <div class="pay-book-info" id="payBookInfo"></div>
          </div>
          <div class="pay-divider"></div>
          <div id="bookPaypalBtn"></div>
          <p class="pay-note">PayPal 계정 또는 신용·체크카드로 결제할 수 있습니다.</p>
          <p class="pay-note">결제 후 즉시 열람 가능합니다.</p>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    injectPayStyles();
    document.getElementById('bookPayOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'bookPayOverlay') closeBookPayModal();
    });
  }

  function injectPayStyles() {
    if (document.getElementById('payStyles')) return;
    const style = document.createElement('style');
    style.id = 'payStyles';
    style.textContent = `
      .pay-overlay {
        display: none; position: fixed; inset: 0;
        background: rgba(15,12,41,0.6); backdrop-filter: blur(4px);
        z-index: 99998; align-items: center; justify-content: center;
      }
      .pay-overlay.open { display: flex; }
      .pay-box {
        background: #fff; border-radius: 20px; padding: 2rem;
        width: 100%; max-width: 420px; margin: 1rem; position: relative;
        box-shadow: 0 24px 64px rgba(0,0,0,0.18);
      }
      .pay-header { margin-bottom: 1rem; }
      .pay-book-title { font-size: 1.1rem; font-weight: 800; color: #1E1B4B; margin-bottom: 0.3rem; }
      .pay-book-price { font-size: 1.5rem; font-weight: 800; color: #4F46E5; }
      .pay-book-price span { font-size: 0.85rem; font-weight: 500; color: #9CA3AF; margin-left: 4px; }
      .pay-divider { height: 1px; background: #E2E8F0; margin: 1rem 0; }
      #bookPaypalBtn { min-height: 60px; }
      .pay-note { text-align: center; font-size: 0.75rem; color: #9CA3AF; margin-top: 0.5rem; }
      .pay-success {
        text-align: center; padding: 1.5rem 0;
        font-size: 1rem; font-weight: 700; color: #10B981;
      }
      .pay-success .pay-ok-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    `;
    document.head.appendChild(style);
  }

  // ── eBook 결제 시작 ────────────────────────────
  window.startBookPayment = async function ({ bookId, title, price, readUrl }) {
    window.requireAuth(async (user) => {
      const sb = await window.getSupabaseClient();
      const { data } = await sb
        .from('book_purchases').select('id')
        .eq('user_id', user.id).eq('book_id', bookId).maybeSingle();

      if (data) { location.href = readUrl; return; }

      injectBookPaymentModal();
      document.getElementById('payBookInfo').innerHTML = `
        <div class="pay-book-title">${title}</div>
        <div class="pay-book-price">$${price} <span>USD</span></div>
      `;
      const oldBtn = document.getElementById('bookPaypalBtn');
      const newBtn = document.createElement('div');
      newBtn.id = 'bookPaypalBtn';
      oldBtn.replaceWith(newBtn);
      document.getElementById('bookPayOverlay').classList.add('open');

      const cfg = await fetch('/.netlify/functions/get-config').then(r => r.json());

      await loadPayPalSDK(cfg.paypalClientId);
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch('/.netlify/functions/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: price, description: title }),
          });
          const { id } = await res.json();
          return id;
        },
        onApprove: async (data) => {
          const res = await fetch('/.netlify/functions/capture-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID, type: 'book', bookId, userId: user.id }),
          });
          const result = await res.json();
          if (result.success) {
            document.getElementById('bookPaypalBtn').innerHTML = `
              <div class="pay-success"><div class="pay-ok-icon">✅</div>결제 완료. 열람을 시작합니다.</div>
            `;
            setTimeout(() => { location.href = readUrl; }, 1500);
          }
        },
        onError: () => alert('결제 중 오류가 발생했습니다. 다시 시도해 주세요.'),
      }).render('#bookPaypalBtn');
    });
  };

  window.closeBookPayModal = function () {
    const el = document.getElementById('bookPayOverlay');
    if (el) el.classList.remove('open');
  };

  // ── 구매 여부 확인 ────────────────────────────
  window.checkBookAccess = async function (bookId, onUnlocked, onLocked) {
    const user = window.getAuthUser();
    if (!user) { onLocked(); return; }
    const sb = await window.getSupabaseClient();
    const { data } = await sb
      .from('book_purchases').select('id')
      .eq('user_id', user.id).eq('book_id', bookId).maybeSingle();
    if (data) onUnlocked(); else onLocked();
  };

})();
