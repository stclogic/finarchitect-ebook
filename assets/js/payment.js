// PayPal / Stripe / 토스페이먼츠 결제 처리 — eBook 낱권 구매
(function () {

  // ── SDK 로더 ───────────────────────────────────
  function loadPayPalSDK(clientId) {
    if (window.paypal) return Promise.resolve();
    if (window._paypalLoading) return window._paypalLoading;
    window._paypalLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window._paypalLoading;
  }

  function loadTossSDK() {
    if (window.TossPayments) return Promise.resolve();
    if (window._tossLoading) return window._tossLoading;
    window._tossLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://js.tosspayments.com/v1/payment';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window._tossLoading;
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
          <div class="pay-tabs">
            <button class="pay-tab active" data-tab="paypal" onclick="switchPayTab('paypal')">PayPal</button>
            <button class="pay-tab" data-tab="stripe" onclick="switchPayTab('stripe')">해외 카드</button>
            <button class="pay-tab" data-tab="toss" onclick="switchPayTab('toss')">국내 카드</button>
          </div>
          <div id="payTabPaypal" class="pay-tab-content">
            <div id="bookPaypalBtn"></div>
          </div>
          <div id="payTabStripe" class="pay-tab-content hidden">
            <button class="pay-stripe-btn" id="stripePayBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="display:inline;vertical-align:middle;margin-right:6px"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#fff" opacity=".3"/><path d="M22 10H2v2h20v-2z" fill="#fff"/></svg>
              Stripe로 결제 (Visa / Mastercard)
            </button>
            <p class="pay-note-sub">해외 발급 신용·체크카드로 결제합니다.</p>
          </div>
          <div id="payTabToss" class="pay-tab-content hidden">
            <button class="pay-toss-btn" id="tossPayBtn">
              <img src="https://static.tosspayments.com/icons/svg/toss.svg" alt="토스" width="20" style="display:inline;vertical-align:middle;margin-right:6px">
              토스페이먼츠로 결제
            </button>
            <p class="pay-note-sub">국내 카드·계좌이체·토스페이로 결제합니다.</p>
          </div>
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
      .pay-tabs { display: flex; gap: 0.4rem; margin-bottom: 1rem; }
      .pay-tab {
        flex: 1; padding: 7px 4px; border-radius: 8px; border: none;
        background: #EEF2FF; color: #6B7280; font-weight: 600;
        font-size: 0.82rem; cursor: pointer; transition: background .15s;
      }
      .pay-tab.active { background: #4F46E5; color: #fff; }
      .pay-tab-content { min-height: 60px; }
      .pay-tab-content.hidden { display: none; }
      .pay-stripe-btn, .pay-toss-btn {
        width: 100%; padding: 13px; border: none; border-radius: 10px;
        font-size: 0.95rem; font-weight: 700; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: opacity .15s;
      }
      .pay-stripe-btn { background: #635BFF; color: #fff; }
      .pay-stripe-btn:hover { opacity: 0.88; }
      .pay-toss-btn { background: #0064FF; color: #fff; }
      .pay-toss-btn:hover { opacity: 0.88; }
      .pay-note { text-align: center; font-size: 0.75rem; color: #9CA3AF; margin-top: 0.75rem; }
      .pay-note-sub { text-align: center; font-size: 0.72rem; color: #9CA3AF; margin-top: 0.5rem; }
      .pay-success {
        text-align: center; padding: 1.5rem 0;
        font-size: 1rem; font-weight: 700; color: #10B981;
      }
      .pay-success .pay-ok-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    `;
    document.head.appendChild(style);
  }

  window.switchPayTab = function (tab) {
    document.querySelectorAll('.pay-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab)
    );
    document.querySelectorAll('.pay-tab-content').forEach(c =>
      c.classList.add('hidden')
    );
    document.getElementById('payTab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
  };

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
      document.getElementById('bookPaypalBtn').innerHTML = '';
      document.getElementById('bookPayOverlay').classList.add('open');

      const cfg = await fetch('/.netlify/functions/get-config').then(r => r.json());

      // PayPal 버튼 렌더
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
              <div class="pay-success"><div class="pay-ok-icon">✅</div>결제 완료! 열람을 시작합니다.</div>
            `;
            setTimeout(() => { location.href = readUrl; }, 1500);
          }
        },
        onError: () => alert('PayPal 결제 중 오류가 발생했습니다. 다른 결제수단을 이용해 주세요.'),
      }).render('#bookPaypalBtn');

      // Stripe 버튼
      document.getElementById('stripePayBtn').onclick = async () => {
        const btn = document.getElementById('stripePayBtn');
        btn.disabled = true; btn.textContent = '결제 페이지로 이동 중...';
        const res = await fetch('/.netlify/functions/create-stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, title, price, userId: user.id, readUrl }),
        });
        const { url, error } = await res.json();
        if (error) { alert('Stripe 오류: ' + error); btn.disabled = false; btn.textContent = 'Stripe로 결제 (Visa / Mastercard)'; return; }
        location.href = url;
      };

      // 토스페이먼츠 버튼
      document.getElementById('tossPayBtn').onclick = async () => {
        const btn = document.getElementById('tossPayBtn');
        btn.disabled = true; btn.textContent = '결제 준비 중...';
        try {
          await loadTossSDK();
          const tossPayments = TossPayments(cfg.tossClientKey);
          const orderId = `book_${bookId}_${user.id}_${Date.now()}`;
          await tossPayments.requestPayment('카드', {
            amount: Math.round(price * 1350), // USD → KRW 환산 (고정 환율, 추후 API 교체 가능)
            orderId,
            orderName: title,
            customerName: user.name || user.email,
            successUrl: `${location.origin}/payment-success.html?method=toss&readUrl=${encodeURIComponent(readUrl)}`,
            failUrl: `${location.origin}/library.html`,
          });
        } catch (err) {
          if (err.code !== 'USER_CANCEL') alert('토스 결제 오류: ' + err.message);
          btn.disabled = false; btn.textContent = '토스페이먼츠로 결제';
        }
      };
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
