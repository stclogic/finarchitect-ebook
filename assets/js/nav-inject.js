// 모든 페이지에 표준 site-nav를 주입하는 스크립트
(function () {
  // 이미 site-nav가 있으면 아무것도 하지 않음
  if (document.querySelector('.site-nav')) return;

  var LOGO_IMG = 'https://blogger.googleusercontent.com/img/a/AVvXsEhTRH1ue_k8m5K50HkxS1r7OTUPQ3kGFa3jjvYtTeXcexrNd_LKV8SyVVXRj0rLiVSjiUAMjXidi92y_JngIIBNLqEyzpuGw_OcWhakb4djvEB2jDrPk2nrjyKmnBSly0-Uq8YqwmvNdlgnS0MgDVYmSSGLrO-VKndzuodO27f31bj1emME5YhWjv8Wx7i7';

  var LINKS = [
    { href: 'landing.html',    i18n: 'nav.home',       ko: '홈',        en: 'Home',     ja: 'ホーム' },
    { href: 'library.html',    i18n: 'nav.library',    ko: '라이브러리', en: 'Library',  ja: 'ライブラリ' },
    { href: 'forms.html',      i18n: 'nav.forms',      ko: '서식',      en: 'Forms',    ja: '書式' },
    { href: 'consulting.html', i18n: 'nav.consulting', ko: '컨설팅',    en: 'Consulting',ja: 'コンサル' },
    { href: 'pricing.html',    i18n: 'nav.pricing',    ko: '요금제',    en: 'Pricing',  ja: '料金' },
  ];

  // 현재 페이지 파일명으로 활성 링크 판별
  var page = window.location.pathname.split('/').pop() || 'landing.html';
  // contract* 페이지는 consulting 탭을 활성화
  var activeHref = page;
  if (page.indexOf('contract') === 0) activeHref = 'consulting.html';

  var lang = localStorage.getItem('site-lang') || 'ko';

  function buildLinks() {
    return LINKS.map(function (l) {
      var active = (l.href === activeHref) ? ' active' : '';
      var label = lang === 'en' ? l.en : lang === 'ja' ? l.ja : l.ko;
      return '<a href="' + l.href + '" class="nav-link' + active + '" data-i18n="' + l.i18n + '">' + label + '</a>';
    }).join('');
  }

  var navEl = document.createElement('nav');
  navEl.className = 'site-nav';
  navEl.innerHTML =
    '<a href="landing.html" class="nav-logo">' +
      '<div class="nav-logo-icon"><img src="' + LOGO_IMG + '" alt="bookcoupling logo"></div>' +
      'bookcoupling' +
    '</a>' +
    '<div class="nav-links">' + buildLinks() + '</div>' +
    '<div class="nav-actions">' +
      '<div class="lang-switcher">' +
        '<button class="ls-btn" data-lang="ko">KO</button>' +
        '<button class="ls-btn" data-lang="en">EN</button>' +
        '<button class="ls-btn" data-lang="ja">JA</button>' +
      '</div>' +
      '<button class="btn-login" onclick="openAuthModal && openAuthModal(\'login\')" data-i18n="nav.login">로그인</button>' +
      '<a href="pricing.html" class="btn-start" data-i18n="nav.start">시작하기</a>' +
    '</div>';

  // 기존 topbar 또는 nav 요소가 있으면 교체, 없으면 body 맨 앞에 삽입
  var existing = document.querySelector('nav.topbar') || document.querySelector('nav');
  if (existing) {
    existing.parentNode.replaceChild(navEl, existing);
  } else {
    document.body.insertBefore(navEl, document.body.firstChild);
  }

  // 언어 버튼 활성화
  function syncLangBtns(l) {
    navEl.querySelectorAll('.ls-btn[data-lang]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === l);
    });
  }
  syncLangBtns(lang);

  // 언어 버튼 클릭 → 기존 applyLang 연동
  navEl.querySelectorAll('.ls-btn[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var l = btn.dataset.lang;
      localStorage.setItem('site-lang', l);
      syncLangBtns(l);
      // nav 링크 텍스트 갱신
      LINKS.forEach(function (link) {
        var a = navEl.querySelector('a[href="' + link.href + '"]');
        if (a) a.textContent = l === 'en' ? link.en : l === 'ja' ? link.ja : link.ko;
      });
      if (typeof applyLang === 'function') applyLang(l);
    });
  });

  // applyLang 호출 시 nav 언어도 동기화
  var _prev = typeof window.applyLang === 'function' ? window.applyLang : null;
  window.applyLang = function (l) {
    syncLangBtns(l);
    LINKS.forEach(function (link) {
      var a = navEl.querySelector('a[href="' + link.href + '"]');
      if (a) a.textContent = l === 'en' ? link.en : l === 'ja' ? link.ja : link.ko;
    });
    if (_prev) _prev(l);
  };
})();
