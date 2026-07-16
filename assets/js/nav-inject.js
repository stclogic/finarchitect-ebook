// 모든 페이지에 표준 site-nav를 주입하는 스크립트
(function () {
  // 이미 site-nav가 있으면 아무것도 하지 않음
  if (document.querySelector('.site-nav')) return;

  var LOGO_IMG = 'https://blogger.googleusercontent.com/img/a/AVvXsEhTRH1ue_k8m5K50HkxS1r7OTUPQ3kGFa3jjvYtTeXcexrNd_LKV8SyVVXRj0rLiVSjiUAMjXidi92y_JngIIBNLqEyzpuGw_OcWhakb4djvEB2jDrPk2nrjyKmnBSly0-Uq8YqwmvNdlgnS0MgDVYmSSGLrO-VKndzuodO27f31bj1emME5YhWjv8Wx7i7';

  // 현재 경로 깊이에 맞는 루트 상대 prefix 계산
  // 예: /insights/2026-07-16.html → depth=2 → prefix='../'
  var pathParts = window.location.pathname.split('/').filter(Boolean);
  var depth = pathParts.length > 1 ? pathParts.length - 1 : 0;
  var ROOT = depth > 0 ? Array(depth).fill('..').join('/') + '/' : '';

  var LINKS = [
    { href: 'landing.html',    i18n: 'nav.home',       ko: '홈',        en: 'Home',      ja: 'ホーム' },
    { href: 'library.html',    i18n: 'nav.library',    ko: '라이브러리', en: 'Library',   ja: 'ライブラリ' },
    { href: 'forms.html',      i18n: 'nav.forms',      ko: '서식',      en: 'Forms',     ja: '書式' },
    { href: 'consulting.html', i18n: 'nav.consulting', ko: '컨설팅',    en: 'Consulting', ja: 'コンサル' },
    { href: 'pricing.html',    i18n: 'nav.pricing',    ko: '요금제',    en: 'Pricing',   ja: '料金' },
  ];

  var page = window.location.pathname.split('/').pop() || 'landing.html';
  var activeHref = page;
  if (page.indexOf('contract') === 0) activeHref = 'consulting.html';

  var lang = localStorage.getItem('site-lang') || 'ko';

  function linkLabel(link, l) {
    return l === 'en' ? link.en : l === 'ja' ? link.ja : link.ko;
  }

  function buildLinks(l) {
    return LINKS.map(function (link) {
      var active = (link.href === activeHref) ? ' active' : '';
      return '<a href="' + ROOT + link.href + '" class="nav-link' + active + '" data-i18n="' + link.i18n + '">' + linkLabel(link, l) + '</a>';
    }).join('');
  }

  var navEl = document.createElement('nav');
  navEl.className = 'site-nav';
  navEl.innerHTML =
    '<a href="' + ROOT + 'landing.html" class="nav-logo">' +
      '<div class="nav-logo-icon"><img src="' + LOGO_IMG + '" alt="bookcoupling logo"></div>' +
      '<span class="nav-logo-text">bookcoupling</span>' +
    '</a>' +
    '<div class="nav-links">' + buildLinks(lang) + '</div>' +
    '<div class="nav-actions">' +
      '<div class="lang-switcher">' +
        '<button class="ls-btn" data-lang="ko">KO</button>' +
        '<button class="ls-btn" data-lang="en">EN</button>' +
        '<button class="ls-btn" data-lang="ja">JA</button>' +
      '</div>' +
      '<button class="btn-login" onclick="typeof openAuthModal!==\'undefined\'&&openAuthModal(\'login\')" data-i18n="nav.login">로그인</button>' +
      '<a href="' + ROOT + 'pricing.html" class="btn-start" data-i18n="nav.start">시작하기</a>' +
    '</div>';

  var existing = document.querySelector('nav.topbar') || document.querySelector('nav');
  if (existing) {
    existing.parentNode.replaceChild(navEl, existing);
  } else {
    document.body.insertBefore(navEl, document.body.firstChild);
  }

  // nav 언어 버튼 active 상태만 갱신 (로고/링크 텍스트 분리)
  function syncNavLangBtns(l) {
    navEl.querySelectorAll('.ls-btn[data-lang]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === l);
    });
  }

  // .nav-links 안의 링크 텍스트만 갱신 (로고 링크는 건드리지 않음)
  function updateNavLinkTexts(l) {
    var linksEl = navEl.querySelector('.nav-links');
    if (!linksEl) return;
    LINKS.forEach(function (link) {
      var a = linksEl.querySelector('a[href="' + ROOT + link.href + '"]');
      if (a) a.textContent = linkLabel(link, l);
    });
  }

  syncNavLangBtns(lang);

  // nav 언어 버튼 클릭
  navEl.querySelectorAll('.ls-btn[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var l = btn.dataset.lang;
      localStorage.setItem('site-lang', l);
      syncNavLangBtns(l);
      updateNavLinkTexts(l);
      // 계약서 페이지 자체 setLang이 있으면 호출 (패널 UI + 계약서 본문 갱신)
      if (typeof window.setLang === 'function') {
        window.setLang(l);
      } else if (typeof window.applyLang === 'function') {
        window.applyLang(l);
      }
    });
  });

  // 페이지의 setLang/applyLang이 나중에 정의될 경우를 위해
  // window.syncNavLang을 노출해 두고, 페이지에서 직접 호출 가능하게 함
  window.syncNavLang = function (l) {
    syncNavLangBtns(l);
    updateNavLinkTexts(l);
  };

  // 기존 applyLang 래핑 (site-nav가 없는 기존 페이지 호환)
  var _prevApply = typeof window.applyLang === 'function' ? window.applyLang : null;
  window.applyLang = function (l) {
    syncNavLangBtns(l);
    updateNavLinkTexts(l);
    if (_prevApply) _prevApply(l);
  };
})();
