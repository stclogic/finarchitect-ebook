// STCLOGIC eBook Viewer — 메인 뷰어 스크립트

let bookData = null;
let currentChapterIdx = 0;
let chapters = [];
let fontSize = 16;
let popupCounter = 0;

const I18N = {
  ko: { glossary: '용어집', glossaryTitle: '금융 용어집', glossaryDesc: '책에서 사용된 핵심 금융 용어 정리 — 클릭하면 상세 설명이 펼쳐집니다.', prev: '이전 챕터', next: '다음 챕터', loading: '콘텐츠 파일을 찾을 수 없습니다. (vol1.js)', fn2026: '2026 개정' },
  en: { glossary: 'Glossary', glossaryTitle: 'Financial Glossary', glossaryDesc: 'Key financial terms used in this book — click to expand definitions.', prev: 'Previous Chapter', next: 'Next Chapter', loading: 'Content file not found. (vol1_en.js)', fn2026: '2026 Update' },
  ja: { glossary: '用語集', glossaryTitle: '金融用語集', glossaryDesc: '本書で使用される主要な金融用語 — クリックで詳細説明が開きます。', prev: '前のチャプター', next: '次のチャプター', loading: 'コンテンツファイルが見つかりません。(vol1_ja.js)', fn2026: '2026 改訂' }
};
function t(key) { return (I18N[(bookData && bookData.lang) || 'ko'] || I18N.ko)[key]; }

const ICON_MAP = {
  clock: 'ti-clock', shield: 'ti-shield', users: 'ti-users',
  'chart-bar': 'ti-chart-bar', building: 'ti-building', coin: 'ti-coin',
  'trending-up': 'ti-trending-up', 'arrow-down': 'ti-arrow-down',
  star: 'ti-star', check: 'ti-check', alert: 'ti-alert-triangle',
  book: 'ti-book', globe: 'ti-globe', lock: 'ti-lock',
  refresh: 'ti-refresh', target: 'ti-target', layers: 'ti-layers'
};

// [[용어|정의]] 형식의 인라인 팝업을 파싱하는 함수
function parseRichText(text, prefix) {
  if (!text) return '';
  const pid = prefix || ('p' + (++popupCounter));
  let counter = 0;
  return text.replace(/\[\[([^\|]+)\|([^\]]+)\]\]/g, (m, term, def) => {
    const id = `rt-${pid}-${counter++}`;
    return `<span class="term-link" onclick="togglePopup('${id}')">${term} ⓘ</span><span class="term-popup" id="${id}"><div class="term-popup-head"><i class="ti ti-info-circle" aria-hidden="true"></i>${term}</div>${def}</span>`;
  });
}

// ── 초기화 ──
async function init() {
  const saved = localStorage.getItem('stclogic-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  const savedFont = localStorage.getItem('stclogic-font');
  if (savedFont) { fontSize = parseInt(savedFont); document.documentElement.style.setProperty('--font-size', fontSize + 'px'); }
  document.getElementById('font-size-val').textContent = fontSize;

  if (typeof VOL1_DATA === 'undefined') {
    document.getElementById('content').innerHTML = '<p style="color:var(--text2);padding:2rem;">콘텐츠 파일을 찾을 수 없습니다. (vol1.js)</p>';
    return;
  }
  bookData = VOL1_DATA;
  chapters = bookData.chapters;
  currentChapterIdx = 0;
  buildToc();
  renderChapter(0);
  updateProgress();
  updateBookmarkBtn();
}

// ── 목차 생성 ──
function buildToc() {
  const toc = document.getElementById('toc');
  toc.innerHTML = '';

  // 저장된 책갈피가 있으면 목차 상단에 표시
  const bmSaved = localStorage.getItem(BOOKMARK_KEY);
  if (bmSaved) {
    const { idx: bmIdx, title: bmTitle } = JSON.parse(bmSaved);
    const bmDiv = document.createElement('div');
    bmDiv.className = 'toc-item toc-bookmark-entry';
    bmDiv.style.cssText = 'border-bottom:1px solid var(--border);margin-bottom:6px;padding-bottom:6px;';
    bmDiv.innerHTML = `<i class="ti ti-bookmark-filled" style="color:#f59e0b" aria-hidden="true"></i><span style="color:#f59e0b">내 책갈피 — ${bmTitle}</span>`;
    bmDiv.addEventListener('click', () => { goChapter(bmIdx); closeSidebar(); });
    toc.appendChild(bmDiv);
  }
  chapters.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'toc-item' + (i === currentChapterIdx ? ' active' : '');
    div.setAttribute('data-idx', i);
    const icon = ch.type === 'cover' ? 'ti-book-2'
      : ch.type === 'epilogue' ? 'ti-sunset'
      : ch.type === 'appendix' ? 'ti-clipboard-list'
      : 'ti-file-text';
    div.innerHTML = `<i class="ti ${icon}" aria-hidden="true"></i><span>${ch.subtitle || ch.title}</span>`;
    div.addEventListener('click', () => { goChapter(i); closeSidebar(); });
    toc.appendChild(div);
  });

  const glDiv = document.createElement('div');
  glDiv.className = 'toc-item' + (currentChapterIdx === chapters.length ? ' active' : '');
  glDiv.setAttribute('data-idx', chapters.length);
  glDiv.innerHTML = `<i class="ti ti-bookmarks" aria-hidden="true"></i><span>${t('glossary')}</span>`;
  glDiv.addEventListener('click', () => { goChapter(chapters.length); closeSidebar(); });
  toc.appendChild(glDiv);
}

function updateTocActive() {
  document.querySelectorAll('.toc-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.idx) === currentChapterIdx);
  });
}

// ── 챕터 렌더링 ──
function goChapter(idx) {
  // 무료 접근 상태에서 유료 챕터 클릭 시 구매 페이지로 이동
  if (window.IS_FREE_ACCESS) {
    const FREE_IDS = new Set(['ch-cover', 'cover-proposal', 'cover-preface', 'ch1', 'ch2', 'ch3']);
    const ch = chapters[idx];
    if (ch && !FREE_IDS.has(ch.id)) {
      location.href = 'ebook.html';
      return;
    }
  }
  currentChapterIdx = idx;
  renderChapter(idx);
  updateTocActive();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateProgress();
  updateBookmarkBtn();
}

function renderChapter(idx) {
  const content = document.getElementById('content');
  const total = chapters.length + 1;
  popupCounter = 0;

  if (idx === chapters.length) {
    renderGlossary();
    updateBreadcrumb('용어집');
    return;
  }

  const ch = chapters[idx];
  updateBreadcrumb(ch.subtitle || ch.title);

  // 표지 챕터 전용 렌더링
  if (ch.type === 'cover') {
    content.innerHTML = renderCoverChapter(ch, idx, total);
    bindEvents();
    return;
  }

  let html = '';

  html += `<div class="ch-hero">
    <div class="ch-label">${ch.title}</div>
    <div class="ch-title">${ch.subtitle}</div>
    ${ch.description ? `<div class="ch-desc">${ch.description}</div>` : ''}
  </div>`;

  if (ch.chapterImage) {
    html += `<div class="ch-img-wrap"><img class="ch-img" src="${ch.chapterImage}" alt="${ch.title}" loading="lazy"></div>`;
  }

  if (ch.sections) {
    ch.sections.forEach(sec => { html += renderSection(sec); });
  }

  html += renderChNav(idx, total);
  content.innerHTML = html;
  bindEvents();
}

function renderCoverChapter(ch, idx, total) {
  let html = '';

  // 책 표지 이미지 + 제목
  if (ch.coverImage) {
    html += `<div class="cover-page">
      <div class="cover-img-wrap">
        <img class="cover-img" src="${ch.coverImage}" alt="책 표지" loading="lazy">
      </div>
      <div class="cover-meta">
        <div class="cover-main-title">${ch.coverTitle || bookData.title}</div>
        <div class="cover-subtitle">${ch.coverSubtitle || bookData.subtitle}</div>
        <div class="cover-author">저자: ${bookData.author}</div>
      </div>
    </div>`;
  }

  if (ch.sections) {
    ch.sections.forEach(sec => { html += renderSection(sec); });
  }

  html += renderChNav(idx, total);
  return html;
}

function renderChNav(idx, total) {
  return `<div class="ch-nav">
    <button class="ch-nav-btn" onclick="goChapter(${idx - 1})" ${idx === 0 ? 'disabled' : ''}>
      <i class="ti ti-arrow-left" aria-hidden="true"></i> ${t('prev')}
    </button>
    <span style="font-size:0.78rem;color:var(--text3)">${idx + 1} / ${total}</span>
    <button class="ch-nav-btn" onclick="goChapter(${idx + 1})" ${idx >= total - 1 ? 'disabled' : ''}>
      ${t('next')} <i class="ti ti-arrow-right" aria-hidden="true"></i>
    </button>
  </div>`;
}

function renderSection(sec) {
  let html = `<div class="section">`;
  if (sec.title) html += `<h2 class="section-title">${sec.title}</h2>`;
  if (sec.intro) html += `<p class="section-intro">${parseRichText(sec.intro, sec.id + '-intro')}</p>`;
  if (sec.content) html += `<p class="prose">${parseRichText(sec.content, sec.id + '-c')}</p>`;

  if (sec.quote && !sec.blocks) html += `<blockquote class="quote-block">${sec.quote}${sec.quoteAttr ? `<span class="quote-attr">— ${sec.quoteAttr}</span>` : ''}</blockquote>`;

  if (sec.terms) {
    sec.terms.forEach((t, i) => {
      const id = `term-${sec.id}-${i}`;
      html += `<p class="prose">
        <span class="term-link" onclick="togglePopup('${id}')">${t.term} ⓘ</span>
        <span class="term-popup" id="${id}">
          <div class="term-popup-head"><i class="ti ti-info-circle" aria-hidden="true"></i>${t.term}</div>
          ${t.def}
        </span>
      </p>`;
    });
  }

  if (sec.blocks) {
    sec.blocks.forEach((block, bi) => { html += renderBlock(block, sec.id, bi); });
  }

  if (sec.quote && sec.blocks) html += `<blockquote class="quote-block">${sec.quote}${sec.quoteAttr ? `<span class="quote-attr">— ${sec.quoteAttr}</span>` : ''}</blockquote>`;

  if (sec.summary) {
    html += `<div class="summary-box"><div class="summary-title">${sec.summary.title}</div>`;
    sec.summary.items.forEach((item, i) => {
      html += `<div class="summary-item"><div class="summary-num">${i + 1}</div><span>${parseRichText(item, sec.id + '-sum' + i)}</span></div>`;
    });
    html += `</div>`;
  }

  if (sec.closing) html += `<p class="closing-text">${parseRichText(sec.closing, sec.id + '-cl')}</p>`;
  html += `</div>`;
  return html;
}

function renderBlock(block, secId, bi) {
  const uid = `${secId}-b${bi}`;
  switch (block.type) {
    case 'timeline': {
      let h = '<div class="timeline">';
      block.items.forEach((item, i) => {
        const tid = `${uid}-tl${i}`;
        const hasTerm = item.term && item.termDef;
        const itemText = hasTerm
          ? item.text.replace(item.term, `<span class="term-link" onclick="togglePopup('${tid}')">${item.term} ⓘ</span>`)
          : item.text;
        h += `<div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-era">${item.era}</div>
          <div class="tl-text">${parseRichText(itemText, tid + 'x')}</div>
          ${hasTerm ? `<div class="term-popup" id="${tid}"><div class="term-popup-head"><i class="ti ti-info-circle" aria-hidden="true"></i>${item.term}</div>${item.termDef}</div>` : ''}
        </div>`;
      });
      return h + '</div>';
    }
    case 'cards': {
      let h = '<div class="card-grid">';
      block.items.forEach(card => {
        const iconClass = ICON_MAP[card.icon] || 'ti-circle';
        h += `<div class="info-card">
          <div class="ic-icon"><i class="ti ${iconClass}" aria-hidden="true"></i></div>
          <div class="ic-name">${card.name}</div>
          ${card.desc ? `<div class="ic-desc">${parseRichText(card.desc, uid + card.name)}</div>` : ''}
          ${card.tag ? `<span class="ic-tag">${card.tag}</span>` : ''}
        </div>`;
      });
      return h + '</div>';
    }
    case 'case': {
      const cid = `case-${uid}`;
      const termLinks = block.termLinks || [];
      let bodyContent = parseRichText(block.content, cid);
      termLinks.forEach((tl, ti) => {
        const tlid = `${cid}-tl${ti}`;
        bodyContent = bodyContent.replace(tl.term,
          `<span class="term-link" onclick="togglePopup('${tlid}')">${tl.term} ⓘ</span><span class="term-popup" id="${tlid}"><div class="term-popup-head"><i class="ti ti-info-circle" aria-hidden="true"></i>${tl.term}</div>${tl.def}</span>`);
      });
      return `<div class="case-box">
        <div class="case-header" onclick="toggleCase('${cid}')">
          <div class="case-header-left">
            <span class="case-badge">${block.label}</span>
            <span class="case-title">${block.title}</span>
          </div>
          <i class="ti ti-chevron-down case-arrow" id="${cid}-arrow" aria-hidden="true"></i>
        </div>
        <div class="case-body" id="${cid}">${bodyContent}</div>
      </div>`;
    }
    case 'axis': {
      let h = '<div class="axis-diagram">';
      block.items.forEach(item => {
        const colorClass = item.color === 'teal' ? 'ax-teal' : item.color === 'gold' ? 'ax-gold' : 'ax-blue';
        h += `<div class="ax-row">
          <div class="ax-label">${item.label}</div>
          <div class="ax-bar-wrap">
            <div class="ax-bar ${colorClass}" style="width:${item.width}%">${item.tag}</div>
            <div class="ax-note">${item.note}</div>
          </div>
        </div>`;
      });
      return h + '</div>';
    }
    case 'formula': {
      let h = '<div class="formula-box">';
      block.items.forEach(item => {
        h += `<div class="formula-row">
          <span class="formula-label">${item.label}</span>
          <span>${parseRichText(item.text, uid + item.label)}</span>
        </div>`;
      });
      return h + '</div>';
    }
    case 'table': {
      let h = '<table class="data-table"><thead><tr>';
      block.headers.forEach(th => { h += `<th>${th}</th>`; });
      h += '</tr></thead><tbody>';
      block.rows.forEach((row, ri) => {
        h += '<tr>';
        row.forEach((cell, ci) => { h += `<td>${parseRichText(cell, uid + 'r' + ri + 'c' + ci)}</td>`; });
        h += '</tr>';
      });
      return h + '</tbody></table>';
    }
    case 'point':
      return `<div class="point-block"><div class="point-dot"></div><span>${parseRichText(block.text, uid)}</span></div>`;
    case 'summary': {
      let h = `<div class="summary-box"><div class="summary-title">${block.title}</div>`;
      block.items.forEach((item, i) => {
        h += `<div class="summary-item"><div class="summary-num">${i + 1}</div><span>${parseRichText(item, uid + i)}</span></div>`;
      });
      return h + '</div>';
    }
    case 'deep':
      return `<div class="deep-box">
        <div class="deep-title"><i class="ti ti-microscope" aria-hidden="true"></i> ${block.title || '심층분석'}</div>
        <div class="deep-content">${parseRichText(block.content, uid)}</div>
      </div>`;
    case 'fn2026':
      return `<div class="footnote-2026"><span class="fn-badge">${t('fn2026')}</span><span>${parseRichText(block.text, uid)}</span></div>`;
    case 'disclaimer':
      return renderDisclaimer(block);
    case 'proposal':
      return renderProposal(block);
    case 'numlist': {
      let h = '<div class="num-list">';
      block.items.forEach((item, i) => {
        h += `<div class="num-item"><div class="num-badge">${i + 1}</div><span>${parseRichText(item, uid + i)}</span></div>`;
      });
      return h + '</div>';
    }
    case 'prose':
      return `<p class="prose">${parseRichText(block.text, uid)}</p>`;
    case 'divider':
      return '<hr class="divider">';
    case 'story': {
      const ep = block.episode || '';
      const char = block.character || '';
      const txt = parseRichText(block.text || '', uid);
      return `<div class="story-block">
        <div class="story-quote-mark">"</div>
        ${ep ? `<div class="story-header"><i class="ti ti-book-2 story-icon" aria-hidden="true"></i><span class="story-episode">${ep}</span></div>` : ''}
        <div class="story-text">${txt}</div>
        ${char ? `<div class="story-char">${char}</div>` : ''}
      </div>`;
    }
    default: return '';
  }
}

function renderDisclaimer(block) {
  let h = `<div class="disclaimer-box">
    <h4><i class="ti ti-shield-check" aria-hidden="true"></i> ${block.title || '면책조항 및 저작권'}</h4>`;
  (block.paras || []).forEach(p => {
    h += `<div class="disclaimer-para">${p.ko}`;
    if (p.en) h += `<div class="disclaimer-en">${p.en}</div>`;
    h += `</div>`;
  });
  if (block.copyright) {
    h += `<div class="copyright-box">${block.copyright}</div>`;
  }
  return h + '</div>';
}

function renderProposal(block) {
  let h = `<div class="proposal-box">
    <div class="proposal-header">
      <div>
        <div class="proposal-header-title">${block.title}</div>
        ${block.subtitle ? `<div class="proposal-header-sub">${block.subtitle}</div>` : ''}
      </div>
    </div>
    <div class="proposal-sections">`;
  (block.sections || []).forEach(sec => {
    h += `<div class="proposal-section">
      <div class="proposal-section-num">${sec.num}</div>
      <div class="proposal-section-title">${sec.title}</div>`;
    if (sec.body) h += `<div class="proposal-section-body">${sec.body}</div>`;
    if (sec.list) {
      h += `<ul class="proposal-list">`;
      sec.list.forEach(item => { h += `<li>${item}</li>`; });
      h += `</ul>`;
    }
    if (sec.table) {
      h += `<table class="proposal-table"><thead><tr>`;
      sec.table.headers.forEach(th => { h += `<th>${th}</th>`; });
      h += `</tr></thead><tbody>`;
      sec.table.rows.forEach(row => {
        h += '<tr>';
        row.forEach(cell => { h += `<td>${cell}</td>`; });
        h += '</tr>';
      });
      h += '</tbody></table>';
    }
    if (sec.link) {
      h += `<p style="margin-top:0.5rem"><a class="author-blog-link" href="${sec.link}" target="_blank" rel="noopener">${sec.link}</a></p>`;
    }
    h += `</div>`;
  });
  return h + '</div></div>';
}

// ── 용어집 ──
function renderGlossary() {
  const content = document.getElementById('content');
  const gl = bookData.glossary;
  let html = `<div class="ch-hero">
    <div class="ch-label">APPENDIX</div>
    <div class="ch-title">${t('glossaryTitle')}</div>
    <div class="ch-desc">${t('glossaryDesc')}</div>
  </div>
  <div class="glossary-grid">`;
  gl.forEach((item, i) => {
    const cid = `gl-${i}`;
    html += `<div class="glossary-card">
      <div class="gl-term" onclick="toggleCase('${cid}')" style="cursor:pointer">
        ${item.term} <i class="ti ti-chevron-down" style="font-size:11px;opacity:0.5"></i>
      </div>
      <div class="gl-def case-body open" id="${cid}" style="display:block;padding:0;border:none;animation:none;white-space:normal">${item.def}</div>
    </div>`;
  });
  html += `</div>
  <div class="ch-nav">
    <button class="ch-nav-btn" onclick="goChapter(${chapters.length - 1})">
      <i class="ti ti-arrow-left" aria-hidden="true"></i> ${t('prev')}
    </button>
    <span style="font-size:0.78rem;color:var(--text3)">${chapters.length + 1} / ${chapters.length + 1}</span>
    <button class="ch-nav-btn" disabled>${t('next')} <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
  </div>`;
  content.innerHTML = html;
}

// ── 이벤트 바인딩 ──
function bindEvents() {}

function togglePopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.term-popup.open').forEach(p => p.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

function toggleCase(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById(id + '-arrow');
  if (!body) return;
  body.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open');
}

// ── UI 컨트롤 ──
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('stclogic-theme', next);
  const btn = document.getElementById('theme-btn');
  btn.querySelector('i').className = next === 'dark' ? 'ti ti-sun' : 'ti ti-moon';
}

function changeFont(dir) {
  fontSize = Math.min(Math.max(fontSize + dir * 2, 12), 22);
  document.documentElement.style.setProperty('--font-size', fontSize + 'px');
  document.getElementById('font-size-val').textContent = fontSize;
  localStorage.setItem('stclogic-font', fontSize);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function updateBreadcrumb(name) {
  document.getElementById('breadcrumb-ch').textContent = name;
}

function updateProgress() {
  const pct = (currentChapterIdx / chapters.length * 100).toFixed(1);
  document.getElementById('progress-fill').style.width = pct + '%';
}

// ── 책갈피 ──
const BOOKMARK_KEY = 'stclogic-bookmark';

function saveBookmark() {
  const user = JSON.parse(localStorage.getItem('site-user') || 'null');
  if (!user) { showBookmarkToast('로그인 후 이용할 수 있습니다.'); return; }

  const saved = localStorage.getItem(BOOKMARK_KEY);
  const savedIdx = saved ? JSON.parse(saved).idx : -1;

  if (savedIdx === currentChapterIdx) {
    // 이미 이 챕터가 책갈피 → 해제
    localStorage.removeItem(BOOKMARK_KEY);
    updateBookmarkBtn();
    buildToc();
    showBookmarkToast('책갈피가 해제되었습니다.');
  } else {
    // 새 위치로 저장
    const ch = chapters[currentChapterIdx];
    const title = ch ? (ch.subtitle || ch.title || '') : '용어집';
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify({ idx: currentChapterIdx, title }));
    updateBookmarkBtn();
    buildToc();
    showBookmarkToast('책갈피가 저장되었습니다.');
  }
}

function goBookmark() {
  const saved = localStorage.getItem(BOOKMARK_KEY);
  if (!saved) return;
  const { idx } = JSON.parse(saved);
  goChapter(idx);
  closeSidebar();
}

function updateBookmarkBtn() {
  const btn = document.getElementById('bookmark-btn');
  if (!btn) return;
  const user = JSON.parse(localStorage.getItem('site-user') || 'null');
  const saved = localStorage.getItem(BOOKMARK_KEY);
  const savedIdx = saved ? JSON.parse(saved).idx : -1;
  const isHere = !!user && savedIdx === currentChapterIdx;
  const hasAny = !!user && !!saved;
  if (!user) {
    btn.innerHTML = '<i class="ti ti-bookmark" style="opacity:0.4" aria-hidden="true"></i>';
    btn.title = '로그인 후 이용 가능';
  } else if (isHere) {
    btn.innerHTML = '<i class="ti ti-bookmark-filled" style="color:#f59e0b" aria-hidden="true"></i>';
    btn.title = '책갈피 해제';
  } else if (hasAny) {
    btn.innerHTML = '<i class="ti ti-bookmark" style="color:#f59e0b;opacity:0.6" aria-hidden="true"></i>';
    btn.title = '이 위치로 책갈피 변경';
  } else {
    btn.innerHTML = '<i class="ti ti-bookmark" aria-hidden="true"></i>';
    btn.title = '책갈피 저장';
  }
}

function showBookmarkToast(msg) {
  let toast = document.getElementById('bm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bm-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e1b4b;color:#fff;padding:8px 18px;border-radius:999px;font-size:0.82rem;z-index:9999;pointer-events:none;transition:opacity .3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

// ── 검색 ──
function handleSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  if (!q || !bookData) return;
  for (let ci = 0; ci < chapters.length; ci++) {
    const ch = chapters[ci];
    const chText = (ch.title + (ch.subtitle || '')).toLowerCase();
    if (chText.includes(q)) { goChapter(ci); return; }
    for (const sec of (ch.sections || [])) {
      if ((sec.title + (sec.content || '')).toLowerCase().includes(q)) {
        goChapter(ci); return;
      }
    }
  }
}

// ── 키보드 단축키 ──
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' && currentChapterIdx < chapters.length) goChapter(currentChapterIdx + 1);
  if (e.key === 'ArrowLeft' && currentChapterIdx > 0) goChapter(currentChapterIdx - 1);
});

// ── 터치 스와이프 ──
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 60) {
    if (diff > 0 && currentChapterIdx < chapters.length) goChapter(currentChapterIdx + 1);
    if (diff < 0 && currentChapterIdx > 0) goChapter(currentChapterIdx - 1);
  }
});

document.addEventListener('DOMContentLoaded', init);
