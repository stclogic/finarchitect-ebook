#!/usr/bin/env python3
"""
form-lang-audit.py — 서식 언어 전환 한글 잔존 감사 스크립트

Static analysis: HTML 구조 + setLang JS 교차 분석
True Positive 원칙: setLang이 실제로 업데이트하는 요소는 OK 처리

Usage:
  python3 tools/form-lang-audit.py                 # 전체 서식
  python3 tools/form-lang-audit.py form-iou.html   # 특정 서식
  python3 tools/form-lang-audit.py --fix           # 가능한 항목 자동 수정
"""

import re, os, sys

FORMS_DIR = os.path.join(os.path.dirname(__file__), '..', 'forms')

# ──────────────────────────────────────────────────────
# 핵심 검사 항목 (구조적 체크)
# ──────────────────────────────────────────────────────
REQUIRED_MARKERS = {
    '__th_translated__':      'th 요소 범용 번역 블록',
    '__siglbl_translated__':  'sig-field-label 범용 번역 블록',
}

REQUIRED_PATTERNS = {
    'ctrlBackLink':           (r'ctrlBackLink', '← 서식 목록 번역'),
    'langNotice':             (r'lang-notice.*textContent|langNotice', '⚠ 언어 전환 안내 번역'),
    'printBtn':               (r'print-btn.*textContent|printBtn', '인쇄 버튼 번역'),
    'ctrlLabels':             (r'ctrlL0|ctrlLabels\s*:|ctrlLbl\d+|ctrlLabel[A-Z]|ctrlLogo\s*:|ctrlQuick', '컨트롤 라벨 배열 번역'),
    'en_in_LANG_DATA':        (r"en\s*:\s*\{", 'LANG_DATA.en 정의'),
    'ja_in_LANG_DATA':        (r"ja\s*:\s*\{", 'LANG_DATA.ja 정의'),
    'samples_or_docbody':     (r'__.*(?:samples|docvals|docbody)_(?:done|fixed)__', '샘플 초기화 블록'),
    'localStorage':           (r"localStorage\.setItem\('site-lang'", 'localStorage 저장'),
}

LOGO_PATTERNS = [
    (r'<label class="ctrl-file-btn"', r'ctrlFileBtn|logo-btn-text|ctrlLogoBtn', '로고 버튼 텍스트 번역'),
    (r'id="logoPlaceholder"|id="logoHolder"|id="logo-placeholder"',
     r'logo-ph-text|logoPlaceholder.*textContent|logoHolder.*innerHTML|logoPH|__logoph|d\.logoPlaceholder|lh\.innerHTML',
     '로고 플레이스홀더 번역'),
]

# setLang이 담당하는 선택자 패턴 (이 ID/class를 가진 요소는 setLang이 처리함)
SETLANG_HANDLES = [
    # ctrl panel
    r'id="ctrlTitle"', r'class="ctrl-section"', r'class="ctrl-panel"',
    r'class="back-link"', r'class="ctrl-back-link"',
    r'class="lang-notice"', r'class="tip-box"', r'class="print-btn"',
    r'class="reset-btn"', r'class="lang-btn"',
    # i18n 시스템
    r'data-i18n=',
    # 언어 버튼
    r'btn-ko.*한국어', r'한국어.*btn-ko',
    # 이미 번역된 스팬
    r'id="lbl-docno"', r'id="lbl-docdate"',
    r'id="logo-ph-text"', r'id="logo-btn-text"',
    # 동적 ID 패턴 (bi0-5, ar0-4 등)
    r'id="(ar|bi|bh|sec)\d+"',
    # 제목
    r'id="formDocTitle"',
    # 범용 번역 마커
    r'__th_translated__', r'__siglbl_translated__',
]


def read(fname):
    return open(os.path.join(FORMS_DIR, fname), encoding='utf-8').read()


def get_js(raw):
    return '\n'.join(re.findall(r'<script[^>]*>(.*?)</script>', raw, re.DOTALL))


def get_html_body(raw):
    """script/style/head/comments 제거"""
    h = re.sub(r'<script[^>]*>.*?</script>', '', raw, flags=re.DOTALL)
    h = re.sub(r'<style[^>]*>.*?</style>', '', h, flags=re.DOTALL)
    h = re.sub(r'<head[^>]*>.*?</head>', '', h, flags=re.DOTALL)
    h = re.sub(r'<!--.*?-->', '', h, flags=re.DOTALL)
    return h


def is_handled_by_setlang(line, js):
    """이 HTML 라인이 setLang에 의해 처리되는지 확인"""
    # ctrl panel 패턴
    for pat in SETLANG_HANDLES:
        if re.search(pat, line):
            return True
    # 이 라인의 ID/class가 JS에서 참조되는지 확인
    ids = re.findall(r'id="([^"]+)"', line)
    for el_id in ids:
        if el_id and re.search(re.escape(el_id), js):
            return True
    classes = re.findall(r'class="([^"]+)"', line)
    for cls in classes:
        for c in cls.split():
            if c.startswith('f-') and re.search(r'\.' + re.escape(c), js):
                return True
    return False


def is_in_rebuilt_section(line, js):
    """이 요소가 setLang에서 innerHTML 재구성되는 섹션 안에 있는지"""
    # articleBodies, clauses, sections 등이 JS에 있으면 대부분의 doc body가 rebuild됨
    return bool(re.search(r'articleBodies|clauseBody|__.*(?:docbody|samples)_(?:done|fixed)__', js))


def audit_file(fname):
    raw = read(fname)
    js = get_js(raw)
    html = get_html_body(raw)
    issues = []

    # ── 1. 구조적 필수 항목 체크 ──────────────────
    for marker, desc in REQUIRED_MARKERS.items():
        if marker not in js:
            issues.append(('구조', f'누락: {marker} ({desc})'))

    for key, (pat, desc) in REQUIRED_PATTERNS.items():
        if not re.search(pat, js):
            issues.append(('구조', f'누락: {desc}'))

    # ── 2. 로고 버튼/플레이스홀더 ──────────────────
    for html_pat, js_pat, desc in LOGO_PATTERNS:
        if re.search(html_pat, html) and not re.search(js_pat, js):
            issues.append(('로고', f'미번역: {desc}'))

    # ── 3. 문서번호/작성일 라벨 (ctrl panel·th·label 제거 후 확인) ──
    html_stripped = re.sub(r'<(th|label|div class="ctrl-panel")[^>]*>.*?</\1>', '', html, flags=re.DOTALL)
    if re.search(r'[^<\w]문서번호[^<\w]*[:<]', html_stripped) and 'lbl-docno' not in html and 'invMetaLabel' not in html:
        issues.append(('doc-label', '문서번호: 라벨 미번역 (span#lbl-docno 누락)'))
    if re.search(r'[^<\w]작성일[^<\w]*[:<]', html_stripped) and 'lbl-docdate' not in html and 'invMeta' not in html:
        issues.append(('doc-label', '작성일: 라벨 미번역 (span#lbl-docdate 누락)'))

    # ── 4. input placeholder 한글 체크 ──────────────
    ctrl_ph_count = len(re.findall(r'ctrlP\d+', js))
    ctrl_inputs = re.findall(r'<input[^>]*type="text"[^>]*class="ctrl-[^"]*"[^>]*>', html)
    # placeholder가 한글이고 JS에서 업데이트 안 되는 경우
    ph_issues = []
    for ph_m in re.finditer(r'placeholder="([^"]*[가-힣][^"]*)"', html):
        ph = ph_m.group(1)
        # 예: 로 시작하는 예시 텍스트는 ctrlP*로 처리됨
        if '예:' in ph or '예)' in ph:
            continue  # ctrlP* 배열로 처리된다고 가정
        # 직접 JS에서 해당 placeholder를 업데이트하는지 확인
        ph_clean = ph[:10]
        if not re.search(re.escape(ph_clean), js) and not re.search(r'ctrlP\d+.*placeholder', js):
            ph_issues.append(ph[:40])
    if ph_issues:
        for ph in ph_issues[:3]:
            issues.append(('placeholder', f'placeholder 미번역: "{ph}"'))

    # ── 5. th 요소 한글 (universal th block 없을 때만) ──
    if '__th_translated__' not in js:
        th_ko = re.findall(r'<th[^>]*>([가-힣 ·/]+)</th>', html)
        for th in th_ko[:3]:
            issues.append(('th', f'<th>{th}</th> 미번역'))

    # ── 6. doc body contenteditable 한글 (setLang 미처리) ──
    # rebuild가 있는 경우 건너뜀
    has_rebuild = bool(re.search(r'articleBodies|clauseBody', js))
    has_docbody_fix = bool(re.search(r'__.*(?:docbody|docvals|samples)_(?:done|fixed)__', js))

    ce_lines = re.finditer(r'<[^>]*contenteditable="true"[^>]*>([^<]+)</[^>]+>', html)
    ce_issues = []
    for m in ce_lines:
        val = m.group(1).strip()
        if not re.search(r'[가-힣]', val) or len(val) < 3:
            continue
        line = m.group(0)
        if is_handled_by_setlang(line, js):
            continue
        if has_rebuild and not re.search(r'class="party-|class="sig-field-value"', line):
            continue
        if has_docbody_fix:
            continue
        ce_issues.append(val[:50])

    for val in ce_issues[:3]:
        issues.append(('contenteditable', f'초기값 미번역: "{val}"'))

    # ── 7. sigDate 년/월/일 하드코딩 ──
    sig_date_pat = re.search(r'innerHTML\s*=.*?년.*?월.*?일', js)
    if sig_date_pat and 'lang===' not in js[max(0,sig_date_pat.start()-50):sig_date_pat.start()+200]:
        issues.append(('sigdate', 'sigDate 년/월/일 하드코딩 (lang 분기 필요)'))

    return issues


def auto_fix_file(fname):
    """자동 수정 가능한 항목 처리"""
    raw = read(fname)
    orig = raw

    # ── Fix 1: __th_translated__ 없으면 삽입 ──
    if '__th_translated__' not in raw and "localStorage.setItem('site-lang', lang);" in raw:
        th_block = UNIVERSAL_TH_BLOCK
        raw = raw.replace(
            "localStorage.setItem('site-lang', lang);",
            th_block + "\n  localStorage.setItem('site-lang', lang);",
            1
        )

    # ── Fix 2: __siglbl_translated__ 없으면 삽입 ──
    if '__siglbl_translated__' not in raw and "localStorage.setItem('site-lang', lang);" in raw:
        sl_block = UNIVERSAL_SIGLBL_BLOCK
        raw = raw.replace(
            "localStorage.setItem('site-lang', lang);",
            sl_block + "\n  localStorage.setItem('site-lang', lang);",
            1
        )

    # ── Fix 3: lbl-docno / lbl-docdate span 삽입 ──
    if '문서번호: <span' in raw and 'lbl-docno' not in raw:
        raw = raw.replace('문서번호: <span', '<span id="lbl-docno">문서번호</span>: <span', 1)
        raw = _inject_before_ls(raw,
            "  var _ln=document.getElementById('lbl-docno');"
            "if(_ln)_ln.textContent=lang==='en'?'Document No.':lang==='ja'?'文書番号':'문서번호';",
            '__doclabel_fixed__')

    if '작성일: <span' in raw and 'lbl-docdate' not in raw:
        raw = raw.replace('작성일: <span', '<span id="lbl-docdate">작성일</span>: <span', 1)
        raw = _inject_before_ls(raw,
            "  var _ld=document.getElementById('lbl-docdate');"
            "if(_ld)_ld.textContent=lang==='en'?'Date':lang==='ja'?'作成日':'작성일';",
            '__doclabel_fixed__')

    if raw != orig:
        with open(os.path.join(FORMS_DIR, fname), 'w', encoding='utf-8') as f:
            f.write(raw)
        return True
    return False


def _inject_before_ls(c, code, marker):
    if marker and marker in c: return c
    tgt = "localStorage.setItem('site-lang', lang);"
    if tgt not in c: return c
    return c.replace(tgt, (f'  {marker}\n' if marker else '') + code + '\n  ' + tgt, 1)


UNIVERSAL_TH_BLOCK = """  // __th_translated__
  if(lang!=='ko')(function(){
    var _tm={
      en:{'발언자':'Speaker','발언 내용':'Remarks','성명':'Name','성 명':'Name',
          '생년월일':'Date of Birth','연락처':'Phone','직위':'Position',
          '직위·직책':'Position/Title','소속':'Department','소속부서':'Department',
          '소속 부서':'Department','입사일':'Hire Date','사직예정일':'Resignation Date',
          '주민번호 앞자리':'ID No. (Front)','주민등록번호':'Resident ID',
          '고용형태':'Employment Type','경쟁사':'Competitor','강점':'Strengths',
          '약점':'Weaknesses','당사 차별점':'Our Edge','구분':'Category',
          '내용':'Details','금액':'Amount','금액(원)':'Amount (KRW)',
          '지급일':'Payment Date','지급방법':'Method','공정 명칭':'Work Item',
          '시작일':'Start Date','완료일':'End Date','담당':'In Charge','비율(%)':'%',
          '항목명':'Item Name','항목':'Item','수량':'Qty','상태':'Condition','비고':'Notes',
          '파트너':'Partner','출자형태':'Type','출자금액':'Capital','지분율':'Equity %',
          '품목':'Description','번호':'No.','발행자':'Issuer',
          '1년차':'Year 1','2년차':'Year 2','3년차':'Year 3',
          '성명 / 법인명':'Name / Corp.','주민번호 / 사업자번호':'ID / Reg. No.',
          '보유 주식 수':'Shares','인수자':'Recipient','인계자':'Handover'},
      ja:{'발언자':'発言者','발언 내용':'発言内容','성명':'氏名','성 명':'氏名',
          '생년월일':'生年月日','연락처':'連絡先','직위':'職位',
          '직위·직책':'職位・職責','소속':'所属','소속부서':'所属部署',
          '소속 부서':'所属部署','입사일':'入社日','사직예정일':'退職予定日',
          '주민번호 앞자리':'住民番号（前）','주민등록번호':'住民登録番号',
          '고용형태':'雇用形態','경쟁사':'競合','강점':'強み',
          '약점':'弱み','당사 차별점':'差別化','구분':'区分',
          '내용':'内容','금액':'金額','금액(원)':'金額（ウォン）',
          '지급일':'支払日','지급방법':'支払方法','공정 명칭':'工程名',
          '시작일':'開始日','완료일':'完了日','담당':'担当','비율(%)':'割合(%)',
          '항목명':'項目名','항목':'項目','수량':'数量','상태':'状態','비고':'備考',
          '파트너':'パートナー','출자형태':'出資形態','출자금액':'出資額','지분율':'持分率',
          '품목':'品目','번호':'番号','발행자':'発行者',
          '1년차':'1年目','2년차':'2年目','3년차':'3年目',
          '성명 / 법인명':'氏名・法人名','주민번호 / 사업자번호':'住民番号・事業者番号',
          '보유 주식 수':'保有株式数','인수자':'引継先','인계자':'引継者'}
    };
    document.querySelectorAll('th').forEach(function(el){
      var t=el.textContent.trim().replace(/\\s+/g,' ');
      if(_tm[lang]&&_tm[lang][t])el.textContent=_tm[lang][t];
    });
  })();"""

UNIVERSAL_SIGLBL_BLOCK = """  // __siglbl_translated__
  if(lang!=='ko')(function(){
    var _sm={
      en:{'성명':'Name','성 명':'Name','주소':'Address','연락처':'Phone','서명':'Signature',
          '상호/법인명':'Trade Name','상호':'Trade Name','대표이사':'CEO',
          '대표자':'Representative','사업자번호':'Reg. No.',
          '사업자등록번호':'Reg. No.','생년월일':'Date of Birth',
          '주민번호':'ID No.','인감':'Seal','도장':'Seal'},
      ja:{'성명':'氏名','성 명':'氏名','주소':'住所','연락처':'連絡先','서명':'署名',
          '상호/법인명':'商号/法人名','상호':'商号','대표이사':'代表取締役',
          '대표자':'代表者','사업자번호':'登録番号',
          '사업자등록번호':'事業者登録番号','생년월일':'生年月日',
          '주민번호':'住民番号','인감':'印鑑','도장':'印鑑'}
    };
    document.querySelectorAll('.sig-field-label,.sig-lbl,.sign-lbl,.iou-sig-lbl').forEach(function(el){
      var t=el.textContent.trim().replace(/\\s+/g,' ');
      if(_sm[lang]&&_sm[lang][t])el.textContent=_sm[lang][t];
    });
  })();"""


def main():
    do_fix = '--fix' in sys.argv
    files_arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    files = files_arg if files_arg else sorted(f for f in os.listdir(FORMS_DIR) if f.endswith('.html'))

    total_issues = 0
    problem_files = []

    for fname in files:
        path = os.path.join(FORMS_DIR, fname)
        if not os.path.exists(path):
            print(f'❌ 파일 없음: {fname}')
            continue

        issues = audit_file(fname)
        count = len(issues)
        total_issues += count

        if count == 0:
            print(f'✅ {fname}')
        else:
            problem_files.append(fname)
            print(f'\n⚠️  {fname} ({count}개 이슈)')
            for category, msg in issues:
                emoji = {'구조':'🔵','로고':'🟡','doc-label':'🟡','placeholder':'🔴',
                         'th':'🟡','contenteditable':'🟠','sigdate':'🔵'}.get(category,'•')
                print(f'  {emoji} [{category}] {msg}')

        if do_fix and issues:
            fixed = auto_fix_file(fname)
            if fixed:
                print(f'  → 자동 수정 적용됨')

    print(f'\n{"="*60}')
    print(f'총 이슈: {total_issues}개  |  문제 서식: {len(problem_files)}개')
    if not problem_files:
        print('✅ 모든 서식 언어 전환 이슈 없음')
    print(f'{"="*60}')


if __name__ == '__main__':
    main()
