// 모든 페이지에 표준 site-footer를 주입하는 스크립트
(function () {
  // 이미 site-footer가 있으면 아무것도 하지 않음
  if (document.querySelector('.site-footer')) return;

  var LOGO_IMG = 'https://blogger.googleusercontent.com/img/a/AVvXsEiAG9mjc7D01ZuSOVpPIy7bQoHB7IjWDadH_zBaWymx3cKXVsqdFJlNP0URua9EgCDQSUS-4OeaLPJgHpcsmm90srnmDCZ0nUuoN9Xw-_0iL_NxZQOsRp83DEPuJiVOlKP5QTci3BBtUEc_37Sq-m0CAWhd9du_pSW91HmUP90sygR8y46CuhAhOQmj3mfR';

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="footer-row1">' +
      '<div class="footer-logo">' +
        '<div class="footer-logo-icon"><img src="' + LOGO_IMG + '" alt="bookcoupling logo" style="width:100%;height:100%;object-fit:cover;border-radius:6px;"></div>' +
        'bookcoupling <span style="font-weight:400;opacity:0.6;font-size:0.8em;">provided by ziggle link</span>' +
      '</div>' +
      '<span class="footer-sep">&nbsp;|&nbsp;</span>' +
      '<div class="footer-copy" data-i18n="footer.copy">© 2025 Book Coupling. All rights reserved.</div>' +
    '</div>' +
    '<div class="footer-biz">Ziggle Link &nbsp;|&nbsp; Business Registration Number: 579-38-01513 &nbsp;|&nbsp; E-commerce Registration Number: No. 2025-Chungnam Cheonan-2233 &nbsp;|&nbsp; Service: Book Coupling</div>' +
    '<div class="footer-links">' +
      '<a href="terms.html" data-i18n="footer.terms">이용약관</a>' +
      '<a href="privacy.html" data-i18n="footer.privacy">개인정보처리방침</a>' +
      '<a href="about.html" data-i18n="footer.about">소개서</a>' +
    '</div>';

  document.body.appendChild(footer);
})();
