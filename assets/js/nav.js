// 모바일 햄버거 메뉴 + 로그인 사용자 정보 표시
(function () {

  // ── 사용자 칩 렌더링 ─────────────────────────────
  function renderUserChip(nav) {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem('site-user')); } catch { return null; }
    })();
    if (!user) return;

    // 로그인/시작하기 버튼 숨김
    nav.querySelectorAll('.btn-login, .btn-start').forEach(el => el.style.display = 'none');

    const initials = (user.name || user.email || '?').charAt(0).toUpperCase();
    const chip = document.createElement('a');
    chip.href = '#';
    chip.className = 'nav-user-chip';
    chip.innerHTML = `
      <span class="nav-user-avatar">${initials}</span>
      <span class="nav-user-name">${user.name || user.email}</span>
    `;
    const navActions = nav.querySelector('.nav-actions');
    if (navActions) navActions.appendChild(chip);
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
            <div class="nav-logo-icon"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg></div>
            <span class="mobile-nav-logo-text">finarchitect</span>
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
