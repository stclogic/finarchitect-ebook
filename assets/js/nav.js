// 모바일 햄버거 메뉴 + 로그인 사용자 정보 표시
(function () {

  // ── 사용자 칩 + 드롭다운 렌더링 ──────────────────
  function renderUserChip(nav) {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem('site-user')); } catch { return null; }
    })();
    if (!user) return;

    nav.querySelectorAll('.btn-login, .btn-start').forEach(el => el.style.display = 'none');
    injectUserDropdownStyles();

    const initials = (user.name || user.email || '?').charAt(0).toUpperCase();
    const wrap = document.createElement('div');
    wrap.className = 'nav-user-wrap';
    wrap.innerHTML = `
      <button class="nav-user-chip" id="userChipBtn" aria-expanded="false">
        <span class="nav-user-avatar">${initials}</span>
        <span class="nav-user-name">${user.name || user.email}</span>
        <span class="nav-user-caret">▾</span>
      </button>
      <div class="nav-user-dropdown" id="userDropdown">
        <div class="nav-user-dropdown-info">
          <div class="nav-user-dropdown-name">${user.name || ''}</div>
          <div class="nav-user-dropdown-email">${user.email}</div>
        </div>
        <div class="nav-user-dropdown-divider"></div>
        <a href="ebook.html" class="nav-user-dropdown-item">📚 내 eBook</a>
        <button class="nav-user-dropdown-item nav-user-dropdown-logout" onclick="signOut()">로그아웃</button>
      </div>
    `;
    const navActions = nav.querySelector('.nav-actions');
    if (navActions) navActions.appendChild(wrap);

    // 드롭다운 토글
    const chipBtn = wrap.querySelector('#userChipBtn');
    const dropdown = wrap.querySelector('#userDropdown');
    chipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('open');
      chipBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
      chipBtn.setAttribute('aria-expanded', false);
    });
  }

  // ── 드롭다운 CSS ────────────────────────────────
  function injectUserDropdownStyles() {
    if (document.getElementById('userDropdownStyles')) return;
    const s = document.createElement('style');
    s.id = 'userDropdownStyles';
    s.textContent = `
      .nav-user-wrap { position: relative; }
      .nav-user-chip { display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; background: var(--cream); border: 1px solid var(--border); border-radius: 999px; cursor: pointer; transition: box-shadow .2s; font-family: inherit; }
      .nav-user-chip:hover { box-shadow: var(--shadow); }
      .nav-user-caret { font-size: 0.65rem; color: var(--text3); }
      .nav-user-dropdown {
        display: none; position: absolute; top: calc(100% + 8px); right: 0;
        background: #fff; border: 1px solid var(--border); border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-width: 200px; z-index: 9999;
        overflow: hidden;
      }
      .nav-user-dropdown.open { display: block; }
      .nav-user-dropdown-info { padding: 0.85rem 1rem; }
      .nav-user-dropdown-name { font-size: 0.88rem; font-weight: 700; color: var(--dark); }
      .nav-user-dropdown-email { font-size: 0.75rem; color: var(--text3); margin-top: 2px; }
      .nav-user-dropdown-divider { height: 1px; background: var(--border); }
      .nav-user-dropdown-item {
        display: block; width: 100%; padding: 0.7rem 1rem; text-align: left;
        font-size: 0.875rem; color: var(--text); background: none; border: none;
        cursor: pointer; font-family: inherit; transition: background .12s;
        text-decoration: none;
      }
      .nav-user-dropdown-item:hover { background: var(--cream); }
      .nav-user-dropdown-logout { color: #EF4444; }
    `;
    document.head.appendChild(s);
  }

  function init() {
    const nav = document.querySelector('.site-nav');
    if (!nav || nav.querySelector('.hamburger-btn')) return;

    // 기존 nav-links 에서 링크 목록 복사
    const srcLinks = Array.from(nav.querySelectorAll('.nav-links a'));
    const currentLang = localStorage.getItem('site-lang') || 'ko';

    // ── 햄버거 버튼 ──────────────────────────────
    const hbtn = document.createElement('button');
    hbtn.className = 'hamburger-btn';
    hbtn.setAttribute('aria-label', '메뉴');
    hbtn.innerHTML = '<span></span><span></span><span></span>';

    // ── 오버레이 패널 ─────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';

    const linksHTML = srcLinks.map(a =>
      `<a href="${a.getAttribute('href')}"
          class="mobile-nav-link${a.classList.contains('active') ? ' active' : ''}"
          data-i18n="${a.dataset.i18n || ''}">${a.textContent.trim()}</a>`
    ).join('');

    const langs = [
      { code: 'ko', label: '한국어' },
      { code: 'en', label: 'English' },
      { code: 'ja', label: '日本語' },
    ];

    overlay.innerHTML = `
      <div class="mobile-nav-panel">
        <div class="mobile-nav-header">
          <div class="mobile-nav-logo-wrap">
            <div class="nav-logo-icon"><img src="https://blogger.googleusercontent.com/img/a/AVvXsEjFZrsRnLlC4aifw-JUzJkfbS8tSYPxpjr1YmUaEm96HodxBm3uXQH16q1mDpn2SyiH7siAmuuKVGGcvwFrltDxLxOWk-LGNsmiwGTHE2j3cuvTbYNIgTUbczIRNR2DbYyIOXasAtP0WqDkGGB_Wst1eFNkJuk1MHfzhRU6VwWo9E2lCon9RE6Ax57W36Wm" alt="bookcoupling logo"></div>
            <span class="mobile-nav-logo-text">bookcoupling</span>
          </div>
          <button class="mobile-nav-close" aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <nav class="mobile-nav-links">${linksHTML}</nav>

        <div class="mobile-nav-divider"></div>

        <div class="mobile-nav-lang-section">
          <p class="mobile-nav-label" id="mnLangLabel">언어 선택</p>
          <div class="mobile-nav-lang">
            ${langs.map(l =>
              `<button class="mobile-ls-btn${currentLang === l.code ? ' active' : ''}" data-lang="${l.code}">${l.label}</button>`
            ).join('')}
          </div>
        </div>

        <div class="mobile-nav-divider"></div>

        <div class="mobile-nav-cta">
          <a href="pricing.html" class="btn-mobile-primary" data-i18n="nav.start">시작하기</a>
          <a href="#" class="btn-mobile-login" data-i18n="nav.login">로그인</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 햄버거 버튼 위치 — nav-actions 앞
    const navActions = nav.querySelector('.nav-actions');
    if (navActions) nav.insertBefore(hbtn, navActions);
    else nav.appendChild(hbtn);

    // 로그인 사용자 칩 렌더링
    renderUserChip(nav);

    // ── open / close ──────────────────────────────
    function openMenu() {
      overlay.classList.add('open');
      hbtn.classList.add('open');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('visible'));
      });
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      overlay.classList.remove('visible');
      hbtn.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => overlay.classList.remove('open'), 320);
    }

    hbtn.addEventListener('click', openMenu);
    overlay.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });
    overlay.querySelectorAll('.mobile-nav-link').forEach(a =>
      a.addEventListener('click', closeMenu)
    );

    // ── 언어 버튼 연결 ─────────────────────────────
    overlay.querySelectorAll('.mobile-ls-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const lang = btn.dataset.lang;
        if (typeof applyLang === 'function') applyLang(lang);
        overlay.querySelectorAll('.mobile-ls-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // 메인 nav 언어 버튼도 동기화
        document.querySelectorAll('.ls-btn[data-lang]').forEach(b =>
          b.classList.toggle('active', b.dataset.lang === lang)
        );
        closeMenu();
      });
    });

    // ── applyLang 연동 — 언어 변경 시 모바일 메뉴 텍스트 갱신 ──
    const _origApply = typeof applyLang === 'function' ? applyLang : null;
    window.applyLang = function (lang) {
      if (_origApply) _origApply(lang);
      // 모바일 메뉴 링크 텍스트 갱신 (data-i18n 기준)
      overlay.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (window.SITE_I18N && window.SITE_I18N[lang] && window.SITE_I18N[lang][key] !== undefined) {
          el.textContent = window.SITE_I18N[lang][key];
        }
      });
      // 언어 선택 레이블
      const langLabel = { ko: '언어 선택', en: 'Language', ja: '言語選択' };
      const lbl = overlay.querySelector('#mnLangLabel');
      if (lbl) lbl.textContent = langLabel[lang] || langLabel.ko;
      // 버튼 active 동기화
      overlay.querySelectorAll('.mobile-ls-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === lang)
      );
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
