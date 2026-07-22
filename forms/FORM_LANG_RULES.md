# Form 언어 전환 규칙 (Language Switch Rules)

새 서식을 만들거나 기존 서식을 수정할 때 반드시 이 규칙을 따른다.  
AI 에이전트도 이 파일을 먼저 읽은 후 작업한다.

---

## 핵심 원칙

**사용자에게 보이는 모든 문자열은 반드시 `LANG_DATA.ko/en/ja`에 있어야 하며, `setLang()`에서 DOM에 적용되어야 한다.**

---

## 1. 필수 LANG_DATA 항목

서식마다 LANG_DATA.ko / en / ja 에 반드시 포함해야 하는 키:

```js
const LANG_DATA = {
  ko: {
    // ── 컨트롤 패널 ──
    ctrlTitle: '⚙ 서식 설정',
    ctrlBackLink: '← 서식 목록',
    langNotice: '⚠ 언어 전환 시 내용이 초기화됩니다.',
    printBtn: '🖨️ 인쇄 / PDF 저장',
    resetBtn: '↺ 초기화',
    tipBox: '💡 팁 내용',

    // ── 로고 버튼 (ctrl-file-btn 있을 때) ──
    ctrlFileBtn: '🏢 로고 업로드',   // label 텍스트
    ctrlLogoLabel: '로고 업로드',      // ctrl-section label

    // ── 문서 본문 라벨 ──
    docTitle: '서식 제목',
    lbl_docno: '문서번호',             // 문서번호: 라벨 span
    lbl_docdate: '작성일',             // 작성일: 라벨 span

    // ── 로고 플레이스홀더 ──
    logoPlaceholder: '+ 로고 추가',   // doc body logoPlaceholder div

    // ── 컨트롤 라벨 배열 (label:not(.ctrl-file-btn) 순서대로) ──
    ctrlL0: '문서번호',
    ctrlL1: '작성일',
    // ...

    // ── 컨트롤 input placeholder 배열 (input[type="text"] 순서대로) ──
    ctrlP0: '예: DOC-2026-001',
    // ...

    // ── 서명란 라벨 배열 ──
    sigFieldLabelsA: ['상호/법인명', '대표이사', '사업자번호', '주소', '서명'],
    sigFieldLabelsB: ['성명', '생년월일', '연락처', '주소', '서명'],

    // ── 문서 본문 샘플 데이터 ──
    sampleName: '홍길동',
    sampleAddr: '서울특별시 강남구 테헤란로 123',
    // ... (서식별 추가)
  },
  en: {
    ctrlTitle: '⚙ Document Settings',
    ctrlBackLink: '← Back to Forms',
    langNotice: '⚠ Content will reset when switching language.',
    printBtn: '🖨️ Print / Save PDF',
    resetBtn: '↺ Reset',
    tipBox: '💡 Tip content',
    ctrlFileBtn: '🏢 Upload Logo',
    ctrlLogoLabel: 'Logo Upload',
    docTitle: 'DOCUMENT TITLE',
    lbl_docno: 'Document No.',
    lbl_docdate: 'Date',
    logoPlaceholder: '+ Add Logo',
    // ...
  },
  ja: {
    ctrlTitle: '⚙ 文書設定',
    ctrlBackLink: '← 書式一覧',
    langNotice: '⚠ 言語切替時に内容がリセットされます。',
    printBtn: '🖨️ 印刷 / PDF保存',
    resetBtn: '↺ リセット',
    tipBox: '💡 ヒント内容',
    ctrlFileBtn: '🏢 ロゴをアップロード',
    ctrlLogoLabel: 'ロゴアップロード',
    docTitle: '文書タイトル',
    lbl_docno: '文書番号',
    lbl_docdate: '作成日',
    logoPlaceholder: '+ ロゴ追加',
    // ...
  }
};
```

---

## 2. setLang() 필수 업데이트 목록

아래 항목을 **빠짐없이** 처리해야 한다. 체크리스트로 활용하라.

```js
function setLang(lang) {
  var d = LANG_DATA[lang]; if (!d) return;

  // ① 언어 버튼 active 표시
  ['ko','en','ja'].forEach(l => document.getElementById('btn-'+l).classList.toggle('active', l===lang));

  // ② 컨트롤 패널
  var h2 = document.querySelector('.ctrl-panel h2, #ctrlTitle'); if(h2) h2.textContent = d.ctrlTitle;
  var bk = document.querySelector('.back-link, .ctrl-back-link'); if(bk) bk.textContent = d.ctrlBackLink;
  var ln = document.querySelector('.lang-notice'); if(ln) ln.textContent = d.langNotice;
  var pb = document.querySelector('.print-btn'); if(pb) pb.textContent = d.printBtn;
  var rb = document.querySelector('.reset-btn'); if(rb) rb.textContent = d.resetBtn;
  var tb = document.querySelector('.tip-box'); if(tb) tb.innerHTML = d.tipBox || '';

  // ③ ctrl-section 라벨 배열 (ctrlL0, ctrlL1, ...)
  var cls = document.querySelectorAll('.ctrl-section label:not(.ctrl-file-btn)');
  ['ctrlL0','ctrlL1','ctrlL2','ctrlL3','ctrlL4','ctrlL5','ctrlL6','ctrlL7'].forEach((k,i) => {
    if(cls[i] && d[k]) cls[i].textContent = d[k];
  });

  // ④ ctrl-section input placeholder 배열 (ctrlP0, ctrlP1, ...)
  var inps = document.querySelectorAll('.ctrl-section input[type="text"]');
  ['ctrlP0','ctrlP1','ctrlP2','ctrlP3','ctrlP4'].forEach((k,i) => {
    if(inps[i] && d[k] !== undefined) inps[i].placeholder = d[k];
  });

  // ⑤ 로고 업로드 버튼 (ctrl-file-btn)
  // 방법 A: textContent 직접 변경 (input을 살리면서)
  var fb = document.querySelector('.ctrl-file-btn');
  if(fb && d.ctrlFileBtn) {
    var inp = fb.querySelector('input'); fb.textContent = d.ctrlFileBtn; if(inp) fb.appendChild(inp);
  }
  // 방법 B: span id 방식 (span#logo-btn-text 사용 시)
  var lbt = document.getElementById('logo-btn-text'); if(lbt) lbt.textContent = d.ctrlFileBtn || '';

  // ⑥ 문서 본문 — 로고 플레이스홀더
  var lph = document.getElementById('logo-ph-text') || document.getElementById('logoPlaceholder');
  if(lph) lph.textContent = d.logoPlaceholder || '';
  // logoHolder (id=logoHolder 사용 폼)
  var lh = document.getElementById('logoHolder');
  if(lh && d.logoPlaceholder && !lh.querySelector('img[src]:not([src=""])'))
    lh.innerHTML = d.logoPlaceholder;

  // ⑦ 문서 본문 — 문서번호/작성일 라벨
  var lno = document.getElementById('lbl-docno'); if(lno) lno.textContent = d.lbl_docno || '';
  var ldt = document.getElementById('lbl-docdate'); if(ldt) ldt.textContent = d.lbl_docdate || '';

  // ⑧ 문서 본문 — 제목
  var dt = document.getElementById('formDocTitle') || document.querySelector('.doc-title');
  if(dt && d.docTitle) dt.textContent = d.docTitle;

  // ⑨ 서명란 라벨
  if(d.sigFieldLabelsA) {
    var sfla = document.querySelectorAll('.sig-party:first-child .sig-field-label');
    d.sigFieldLabelsA.forEach((t,i) => { if(sfla[i]) sfla[i].textContent = t; });
  }
  if(d.sigFieldLabelsB) {
    var sflb = document.querySelectorAll('.sig-party:last-child .sig-field-label');
    d.sigFieldLabelsB.forEach((t,i) => { if(sflb[i]) sflb[i].textContent = t; });
  }

  // ⑩ th 번역 (universal)
  if(lang !== 'ko') {
    var TH_MAP = { en:{/*...*/}, ja:{/*...*/} };
    document.querySelectorAll('th').forEach(el => {
      var t = el.textContent.trim(); if(TH_MAP[lang]&&TH_MAP[lang][t]) el.textContent = TH_MAP[lang][t];
    });
  }

  // ⑪ 문서 본문 샘플 초기화 (contenteditable 초기값 EN/JA 전환)
  // __formid_samples_done__ 마커로 idempotency 보장
  // __formid_samples_done__
  (function(){
    var _s = { ko:{...}, en:{...}, ja:{...} }[lang] || {};
    // 각 서식별: 이름, 주소, 날짜, 금액 등 contenteditable 초기값 교체
    var nameEl = document.querySelector('.f-name[contenteditable]');
    if(nameEl) nameEl.textContent = _s.name || '';
    // ...
  })();

  // ⑫ sigDate: 년/월/일 언어별 처리
  // 한국어: 2026년 7월 22일 / 영어: July 22, 2026 / 일본어: 2026年7月22日
  // 하드코딩 금지 — 반드시 lang 분기로 처리

  localStorage.setItem('site-lang', lang);
  _activeLang = lang;
}
```

---

## 3. HTML 작성 규칙

### 3-1. 문서 본문 라벨 (정적 텍스트 노드)
```html
<!-- ❌ 금지: 정적 한글 텍스트 노드 -->
문서번호: <span contenteditable="true">DOC-001</span>

<!-- ✅ 올바른 방법: span으로 감싸고 id 부여 -->
<span id="lbl-docno">문서번호</span>: <span contenteditable="true">DOC-001</span>
```

### 3-2. 로고 업로드 버튼
```html
<!-- ❌ 금지: 텍스트 노드 직접 -->
<label class="ctrl-file-btn">
  🏢 로고 업로드
  <input type="file">
</label>

<!-- ✅ 올바른 방법 A: span 감싸기 -->
<label class="ctrl-file-btn">
  <span id="logo-btn-text">🏢 로고 업로드</span>
  <input type="file">
</label>
```

### 3-3. 로고 플레이스홀더
```html
<!-- ❌ 금지 -->
<div id="logoPlaceholder">+ 로고 추가</div>

<!-- ✅ 올바른 방법 -->
<div id="logoPlaceholder"><span id="logo-ph-text">+ 로고 추가</span></div>
```

### 3-4. contenteditable 초기값
```html
<!-- ❌ 금지: 한글 초기값을 그대로 HTML에 박기 -->
<span contenteditable="true">홍길동</span>

<!-- ✅ 올바른 방법: class 지정 + samples_done 블록에서 언어별 초기화 -->
<span class="f-name" contenteditable="true">홍길동</span>
```

### 3-5. 날짜 형식 (년/월/일)
```html
<!-- ❌ 금지: 하드코딩 -->
<span id="year">2026</span>년 <span id="month">7</span>월 <span id="day">22</span>일

<!-- ✅ 올바른 방법: JS로 언어별 렌더링 -->
```
```js
var sep = lang==='en' ? [' ',' ',''] : lang==='ja' ? ['年','月','日'] : ['년 ','월 ','일'];
el.innerHTML = `<span>${y}</span>${sep[0]}<span>${m}</span>${sep[1]}<span>${d}</span>${sep[2]}`;
```

---

## 4. 자동 감사 스크립트

```bash
# 한글 잔존 여부 빠른 확인
python3 tools/form-lang-audit.py

# 특정 서식만 확인
python3 tools/form-lang-audit.py form-employment-contract.html
```

---

## 5. 새 서식 체크리스트

새 서식을 만들 때 아래 항목을 전부 체크한 후 푸시한다.

- [ ] LANG_DATA.ko / en / ja 에 모든 사용자 노출 문자열 포함
- [ ] setLang()에서 모든 컨트롤 패널 라벨 업데이트 (ctrlL* 배열)
- [ ] setLang()에서 모든 input placeholder 업데이트 (ctrlP* 배열)
- [ ] 로고 업로드 버튼 텍스트 → `<span id="logo-btn-text">` 또는 ctrlFileBtn
- [ ] 로고 플레이스홀더 → `<span id="logo-ph-text">` 사용
- [ ] 문서번호/작성일 라벨 → `<span id="lbl-docno/lbl-docdate">` 사용
- [ ] 문서 본문 contenteditable 초기값 → `__formid_samples_done__` 블록에서 EN/JA 초기화
- [ ] 날짜 년/월/일 → lang 분기로 처리
- [ ] 서명란 라벨 → sigFieldLabels 배열로 처리
- [ ] 테이블 헤더(th) → LANG_DATA 배열 + forEach로 처리
- [ ] `python3 tools/form-lang-audit.py <filename>` 실행 후 이슈 0개 확인
