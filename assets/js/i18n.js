// 사이트 전체 다국어 번역 데이터 및 적용 함수
const SITE_I18N = {
  ko: {
    // NAV
    'nav.home': '홈',
    'nav.library': '라이브러리',
    'nav.ebook': 'eBook',
    'nav.forms': '서식',
    'nav.consulting': '컨설팅',
    'nav.pricing': '요금제',
    'nav.login': '로그인',
    'nav.start': '시작하기',

    // LIBRARY page
    'library.tag': 'EBOOK LIBRARY',
    'library.hero.title': '금융 전문 eBook 라이브러리',
    'library.hero.desc': '한국어 · English · 日本語 — 3개 언어로 출판된 금융 구조 설계 전문서',
    'library.filter.all': '전체',
    'library.filter.finance': '금융·투자',
    'library.filter.law': '법률·계약',
    'library.filter.tax': '세무·회계',
    'library.section.published': '출판 완료',
    'library.section.soon': '출판 예정',
    'library.modal.label': '읽을 언어를 선택하세요',

    // LANDING — hero
    'landing.badge': 'FINANCIAL EDUCATION PLATFORM',
    'landing.hero.title': '구조로 돈을<br><span class="gold">설계하는</span> 사람들',
    'landing.hero.desc': '금융 설계의 언어를 배우는 가장 체계적인 플랫폼.<br>eBook · 서식 라이브러리 · AI 자동완성이 하나로 연결됩니다.',
    'landing.hero.btn1': '📖 eBook 시작하기',
    'landing.hero.btn2': '📄 서식 라이브러리',
    'landing.stat.members': '회원',
    'landing.stat.downloads': '다운로드',
    'landing.stat.rating': '평점',
    'landing.stat.forms': '서식',

    // LANDING — feature strip
    'feature.ebook.title': 'eBook 라이브러리',
    'feature.ebook.sub': '3개국어 전자책',
    'feature.forms.title': '서식 라이브러리',
    'feature.forms.sub': '250+ 서식 템플릿',
    'feature.ai.title': 'AI 자동완성',
    'feature.ai.sub': '서식 자동 작성',
    'feature.download.title': '원클릭 다운로드',
    'feature.download.sub': 'DOCX·PDF·HWP',
    'feature.legal.title': '법률 검토',
    'feature.legal.sub': '변호사 감수 완료',
    'feature.lang.title': '3개국어 지원',
    'feature.lang.sub': '한국어·영어·일본어',

    // LANDING — workflow
    'workflow.tag': 'WORKFLOW',
    'workflow.title': '배움에서 실행까지, 하나의 흐름으로',
    'workflow.step1.title': 'eBook으로 배우기',
    'workflow.step1.desc': '금융 구조의 원리를 체계적으로 학습합니다. 각 챕터는 실무 사례와 서식으로 연결됩니다.',
    'workflow.step2.title': '서식으로 적용하기',
    'workflow.step2.desc': '학습 내용과 연결된 서식을 바로 다운로드하세요. AI가 자동으로 내용을 채워드립니다.',
    'workflow.step3.title': '구조를 완성하다',
    'workflow.step3.desc': '법률·세무·재무 서류를 완성하여 실제 금융 구조를 구축합니다.',

    // LANDING — youtube
    'yt.tag': 'VIDEO GUIDE',
    'yt.title': '거래 전 반드시 알아야 할 것들',
    'yt.desc': '실제 거래에서 발생하는 법적 리스크와 금융 함정을 영상으로 확인하세요.<br>전문가가 직접 사례를 분석합니다.',
    'yt.soon': '영상 준비 중',
    'yt1.tag': '⚠ 계약 리스크',
    'yt1.title': '계약서 한 줄이 수천만 원을 날린다',
    'yt1.desc': '놓치기 쉬운 계약서 독소 조항 5가지와 실제 분쟁 사례를 분석합니다.',
    'yt2.tag': '⚠ 부동산 함정',
    'yt2.title': '전세 사기를 막는 등기부등본 읽는 법',
    'yt2.desc': '깡통전세·이중계약·불법전대 피해를 예방하는 체크리스트를 공개합니다.',
    'yt3.tag': '⚠ 투자 사기',
    'yt3.title': '투자 권유 시 반드시 확인해야 할 5가지',
    'yt3.desc': '유사수신·다단계·불법 투자자문업의 공통적인 패턴을 실제 사례로 분석합니다.',
    'yt4.tag': '⚠ 세무 리스크',
    'yt4.title': '사업자 등록 전 반드시 알아야 할 세금',
    'yt4.desc': '부가세·종합소득세·4대보험 구조를 모르면 첫 해부터 세금 폭탄을 맞습니다.',

    // LANDING — reviews
    'reviews.tag': 'REVIEWS',
    'reviews.title': '12,847명이 선택했습니다',
    'review1.text': '"법인 설립부터 투자 계약까지 필요한 서식이 다 있어요. 변호사 비용을 크게 줄였습니다."',
    'review1.role': '스타트업 창업자',
    'review2.text': '"임대차 계약서 세트 하나로 모든 계약 상황을 커버할 수 있어요. AI 자동완성이 특히 편리합니다."',
    'review2.role': '부동산 투자자',
    'review3.text': '"고객들에게 항상 추천합니다. 세무 신고 서식이 최신 법령에 맞게 업데이트되어 신뢰할 수 있습니다."',
    'review3.role': '세무사',

    // LANDING — CTA
    'cta.title': '지금 바로 시작하세요',
    'cta.desc': '무료 챕터 3개와 기본 서식 세트는<br>회원가입 없이 이용 가능합니다.',
    'cta.btn1': '무료로 시작하기',
    'cta.btn2': '서식 라이브러리 보기',

    // FOOTER
    'footer.copy': '© 2025 Finarchitect. All rights reserved.',
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',
    'footer.about': '소개서',

    // EBOOK page
    'ebook.header.title': 'eBook 라이브러리',
    'ebook.header.sub': 'Vol.1 · 16챕터 · 3개국어',
    'ebook.progress.title': '읽기 진행도',
    'ebook.progress.sub': 'Ch.3까지 완료 · 5챕터 남음',
    'ebook.toc': '목차',
    'ebook.upgrade.title': '모든 챕터 잠금 해제하기',
    'ebook.badge.free': 'FREE',
    'ebook.badge.lock': '잠금 해제',

    // FORMS page
    'forms.header.title': '서식 라이브러리',
    'forms.header.sub': '250+ 법률·금융·세무 서식 템플릿',
    'forms.search.placeholder': '서식 검색...',
    'forms.filter.all': '전체',
    'forms.filter.legal': '법률',
    'forms.filter.finance': '금융',
    'forms.filter.tax': '세무',
    'forms.filter.labor': '노무',
    'forms.badge.free': '무료',
    'forms.badge.pro': 'PRO',
    'forms.btn.download': '다운로드',
    'forms.upgrade.title': 'PRO 서식 전체 이용',
    'forms.upgrade.desc': '월 ₩29,000으로 250+ 서식 전체와 AI 자동완성을 이용하세요.',
    'forms.upgrade.btn': 'PRO로 업그레이드',

    // PRICING page
    'pricing.tag': 'PRICING',
    'pricing.title': '투명한 요금제',
    'pricing.desc': 'PayPal · 신용카드 · 체크카드로 결제 가능합니다.',
    'pricing.plan1.name': '서식 라이브러리',
    'pricing.plan1.desc': '법률·금융·세무 250+ 서식 템플릿 연간 무제한 이용',
    'pricing.plan1.period': '/ 1년',
    'pricing.plan1.f1': '250+ 서식 템플릿 전체 이용',
    'pricing.plan1.f2': 'DOCX · PDF · HWP 다운로드',
    'pricing.plan1.f3': '법률·금융·세무·노무 전 카테고리',
    'pricing.plan1.f4': '신규 서식 업데이트 자동 포함',
    'pricing.plan2.badge': '⭐ 가장 인기',
    'pricing.plan2.name': 'eBook Vol.1',
    'pricing.plan2.desc': '구조로 돈을 설계하는 사람들 — 전체 16챕터 + 1년 서식 이용권 포함',
    'pricing.plan2.period': '/ 도서 1권',
    'pricing.plan2.f1': '전체 16챕터 + 부록 무제한 열람',
    'pricing.plan2.f2': '한국어 · English · 日本語 3개국어',
    'pricing.plan2.f3': '서식 라이브러리 1년 무료 이용',
    'pricing.plan2.f4': '향후 업데이트 콘텐츠 자동 포함',
    'pricing.plan2.f5': 'PDF 저장 가능',
    'pricing.plan3.name': '금융 컨설팅',
    'pricing.plan3.desc': '프로젝트별 맞춤 금융 구조 설계 · PF · SPV · STO 전략 수립',
    'pricing.plan3.range': '$9,999 ~ $499,999',
    'pricing.plan3.range.sub': '프로젝트 규모에 따라 협의',
    'pricing.plan3.f1': '금융 구조 설계 (PF · SPV · STO)',
    'pricing.plan3.f2': '투자 유치 전략 수립',
    'pricing.plan3.f3': '법률·세무 연계 자문',
    'pricing.plan3.f4': 'IR 자료 · 계약서 검토',
    'pricing.plan3.f5': '1:1 전담 컨설턴트 배정',
    'pricing.consult.name': '성함',
    'pricing.consult.email': '이메일',
    'pricing.consult.budget': '예상 프로젝트 규모',
    'pricing.consult.budget.opt1': '$999 ~ $4,999',
    'pricing.consult.budget.opt2': '$5,000 ~ $49,999',
    'pricing.consult.budget.opt3': '$50,000 ~ $499,999',
    'pricing.consult.budget.opt4': '$500,000+',
    'pricing.consult.message': '프로젝트 개요를 간략히 설명해 주세요.',
    'pricing.consult.submit': '무료 상담 신청',
    'pricing.note': 'PayPal 계정 없이 카드 결제 가능',
    'pricing.footer.note': '모든 결제는 PayPal을 통해 안전하게 처리됩니다. · 환불 정책: 구매 후 7일 이내 미사용 시 전액 환불',
    'pricing.consult.done': '📩',
    'pricing.consult.done.title': '문의 접수 완료!',
    'pricing.consult.done.desc': '영업일 1~2일 내 stclogic@gmail.com으로 연락드리겠습니다.',
  },

  en: {
    'nav.home': 'Home',
    'nav.library': 'Library',
    'nav.ebook': 'eBook',
    'nav.forms': 'Forms',
    'nav.consulting': 'Consulting',
    'nav.pricing': 'Pricing',
    'nav.login': 'Log in',
    'nav.start': 'Get Started',

    // LIBRARY page
    'library.tag': 'EBOOK LIBRARY',
    'library.hero.title': 'Financial eBook Library',
    'library.hero.desc': 'Korean · English · Japanese — Finance & Structure Design Books in 3 Languages',
    'library.filter.all': 'All',
    'library.filter.finance': 'Finance & Investment',
    'library.filter.law': 'Law & Contracts',
    'library.filter.tax': 'Tax & Accounting',
    'library.section.published': 'Published',
    'library.section.soon': 'Coming Soon',
    'library.modal.label': 'Select reading language',

    'landing.badge': 'FINANCIAL EDUCATION PLATFORM',
    'landing.hero.title': 'People Who<br><span class="gold">Design Money</span> with Structure',
    'landing.hero.desc': 'The most systematic platform for learning the language of financial design.<br>eBook · Forms Library · AI Autocomplete — all in one.',
    'landing.hero.btn1': '📖 Start eBook',
    'landing.hero.btn2': '📄 Forms Library',
    'landing.stat.members': 'Members',
    'landing.stat.downloads': 'Downloads',
    'landing.stat.rating': 'Rating',
    'landing.stat.forms': 'Forms',

    'feature.ebook.title': 'eBook Library',
    'feature.ebook.sub': 'Trilingual e-books',
    'feature.forms.title': 'Forms Library',
    'feature.forms.sub': '250+ form templates',
    'feature.ai.title': 'AI Autocomplete',
    'feature.ai.sub': 'Auto-fill forms',
    'feature.download.title': 'One-Click Download',
    'feature.download.sub': 'DOCX · PDF · HWP',
    'feature.legal.title': 'Legal Review',
    'feature.legal.sub': 'Attorney-verified',
    'feature.lang.title': 'Trilingual Support',
    'feature.lang.sub': 'Korean · English · Japanese',

    'workflow.tag': 'WORKFLOW',
    'workflow.title': 'From Learning to Execution, in One Flow',
    'workflow.step1.title': 'Learn via eBook',
    'workflow.step1.desc': 'Study the principles of financial structure systematically. Each chapter connects to real cases and forms.',
    'workflow.step2.title': 'Apply via Forms',
    'workflow.step2.desc': 'Download forms linked to what you learned. AI fills in the content automatically.',
    'workflow.step3.title': 'Complete the Structure',
    'workflow.step3.desc': 'Finalize legal, tax, and financial documents to build your actual financial structure.',

    'yt.tag': 'VIDEO GUIDE',
    'yt.title': 'What You Must Know Before Any Deal',
    'yt.desc': 'Watch experts analyze legal risks and financial traps from real transactions.<br>Case-by-case breakdowns.',
    'yt.soon': 'Video coming soon',
    'yt1.tag': '⚠ Contract Risk',
    'yt1.title': 'One Line in a Contract Can Cost Millions',
    'yt1.desc': 'An analysis of 5 toxic clauses often missed in contracts, with real dispute case studies.',
    'yt2.tag': '⚠ Real Estate Trap',
    'yt2.title': 'How to Read a Registry Certificate to Avoid Lease Fraud',
    'yt2.desc': 'A checklist to prevent damages from hollow leases, double contracts, and illegal subletting.',
    'yt3.tag': '⚠ Investment Scam',
    'yt3.title': '5 Things You Must Check When Offered an Investment',
    'yt3.desc': 'Common patterns of ponzi schemes, MLMs, and unlicensed investment advisory services.',
    'yt4.tag': '⚠ Tax Risk',
    'yt4.title': 'Taxes You Must Understand Before Registering a Business',
    'yt4.desc': "If you don't understand VAT, income tax, and social insurance, you'll face a tax shock in your first year.",

    'reviews.tag': 'REVIEWS',
    'reviews.title': '12,847 Members Have Chosen Us',
    'review1.text': '"All the forms I needed from company formation to investment contracts. Saved a lot on legal fees."',
    'review1.role': 'Startup Founder',
    'review2.text': '"One lease contract set covers every situation. The AI autocomplete is especially convenient."',
    'review2.role': 'Real Estate Investor',
    'review3.text': '"I always recommend this to clients. The tax filing forms are regularly updated to current regulations."',
    'review3.role': 'Tax Accountant',

    'cta.title': 'Get Started Today',
    'cta.desc': '3 free chapters and a basic forms set are<br>available without registration.',
    'cta.btn1': 'Start for Free',
    'cta.btn2': 'Browse Forms Library',

    'footer.copy': '© 2025 Finarchitect. All rights reserved.',
    'footer.terms': 'Terms of Use',
    'footer.privacy': 'Privacy Policy',
    'footer.about': 'About',

    'ebook.header.title': 'eBook Library',
    'ebook.header.sub': 'Vol.1 · 16 Chapters · 3 Languages',
    'ebook.progress.title': 'Reading Progress',
    'ebook.progress.sub': 'Ch.3 done · 5 chapters left',
    'ebook.toc': 'Table of Contents',
    'ebook.upgrade.title': 'Unlock All Chapters',
    'ebook.badge.free': 'FREE',
    'ebook.badge.lock': 'Unlock',

    'forms.header.title': 'Forms Library',
    'forms.header.sub': '250+ Legal, Financial & Tax Form Templates',
    'forms.search.placeholder': 'Search forms...',
    'forms.filter.all': 'All',
    'forms.filter.legal': 'Legal',
    'forms.filter.finance': 'Finance',
    'forms.filter.tax': 'Tax',
    'forms.filter.labor': 'Labor',
    'forms.badge.free': 'FREE',
    'forms.badge.pro': 'PRO',
    'forms.btn.download': 'Download',
    'forms.upgrade.title': 'Full Access to PRO Forms',
    'forms.upgrade.desc': 'Get all 250+ forms and AI autocomplete for $10/year.',
    'forms.upgrade.btn': 'Upgrade to PRO',

    'pricing.tag': 'PRICING',
    'pricing.title': 'Transparent Pricing',
    'pricing.desc': 'Pay with PayPal, credit card, or debit card.',
    'pricing.plan1.name': 'Forms Library',
    'pricing.plan1.desc': 'Unlimited annual access to 250+ legal, financial & tax form templates',
    'pricing.plan1.period': '/ year',
    'pricing.plan1.f1': 'Full access to 250+ form templates',
    'pricing.plan1.f2': 'Download as DOCX · PDF · HWP',
    'pricing.plan1.f3': 'All categories: legal, finance, tax, labor',
    'pricing.plan1.f4': 'New forms included automatically',
    'pricing.plan2.badge': '⭐ Most Popular',
    'pricing.plan2.name': 'eBook Vol.1',
    'pricing.plan2.desc': 'Designing Money with Structure — All 16 chapters + 1-year forms access included',
    'pricing.plan2.period': '/ book',
    'pricing.plan2.f1': 'Unlimited access to all 16 chapters + appendix',
    'pricing.plan2.f2': 'Korean · English · Japanese (3 languages)',
    'pricing.plan2.f3': '1-year free access to Forms Library',
    'pricing.plan2.f4': 'Future content updates included',
    'pricing.plan2.f5': 'PDF export available',
    'pricing.plan3.name': 'Financial Consulting',
    'pricing.plan3.desc': 'Custom financial structure design by project · PF · SPV · STO strategy',
    'pricing.plan3.range': '$9,999 ~ $499,999',
    'pricing.plan3.range.sub': 'Negotiated by project scope',
    'pricing.plan3.f1': 'Financial structure design (PF · SPV · STO)',
    'pricing.plan3.f2': 'Investment attraction strategy',
    'pricing.plan3.f3': 'Legal & tax advisory',
    'pricing.plan3.f4': 'IR materials & contract review',
    'pricing.plan3.f5': 'Dedicated 1:1 consultant',
    'pricing.consult.name': 'Full Name',
    'pricing.consult.email': 'Email',
    'pricing.consult.budget': 'Estimated Project Scale',
    'pricing.consult.budget.opt1': '$999 ~ $4,999',
    'pricing.consult.budget.opt2': '$5,000 ~ $49,999',
    'pricing.consult.budget.opt3': '$50,000 ~ $499,999',
    'pricing.consult.budget.opt4': '$500,000+',
    'pricing.consult.message': 'Briefly describe your project.',
    'pricing.consult.submit': 'Request Free Consultation',
    'pricing.note': 'Card payment available without a PayPal account',
    'pricing.footer.note': 'All payments processed securely via PayPal. · Refund policy: Full refund within 7 days of purchase if unused.',
    'pricing.consult.done': '📩',
    'pricing.consult.done.title': 'Inquiry Received!',
    'pricing.consult.done.desc': 'We will contact you at stclogic@gmail.com within 1–2 business days.',
  },

  ja: {
    'nav.home': 'ホーム',
    'nav.library': 'ライブラリ',
    'nav.ebook': 'eBook',
    'nav.forms': '書式',
    'nav.consulting': 'コンサルティング',
    'nav.pricing': '料金',
    'nav.login': 'ログイン',
    'nav.start': '始める',

    // LIBRARY page
    'library.tag': 'EBOOK LIBRARY',
    'library.hero.title': '金融専門 eBookライブラリ',
    'library.hero.desc': '한국어 · English · 日本語 — 3言語で出版された金融構造設計の専門書',
    'library.filter.all': 'すべて',
    'library.filter.finance': '金融·投資',
    'library.filter.law': '法律·契約',
    'library.filter.tax': '税務·会計',
    'library.section.published': '出版済み',
    'library.section.soon': '出版予定',
    'library.modal.label': '読む言語を選択してください',

    'landing.badge': 'FINANCIAL EDUCATION PLATFORM',
    'landing.hero.title': '構造でお金を<br><span class="gold">設計する</span>人たち',
    'landing.hero.desc': '金融設計の言語を学ぶ最も体系的なプラットフォーム。<br>eBook・書式ライブラリ・AI自動補完がひとつに繋がります。',
    'landing.hero.btn1': '📖 eBookを始める',
    'landing.hero.btn2': '📄 書式ライブラリ',
    'landing.stat.members': '会員',
    'landing.stat.downloads': 'ダウンロード',
    'landing.stat.rating': '評価',
    'landing.stat.forms': '書式',

    'feature.ebook.title': 'eBookライブラリ',
    'feature.ebook.sub': '3言語電子書籍',
    'feature.forms.title': '書式ライブラリ',
    'feature.forms.sub': '250+書式テンプレート',
    'feature.ai.title': 'AI自動補完',
    'feature.ai.sub': '書式自動入力',
    'feature.download.title': 'ワンクリックDL',
    'feature.download.sub': 'DOCX·PDF·HWP',
    'feature.legal.title': '法律レビュー',
    'feature.legal.sub': '弁護士監修済み',
    'feature.lang.title': '3言語対応',
    'feature.lang.sub': '韓国語·英語·日本語',

    'workflow.tag': 'WORKFLOW',
    'workflow.title': '学びから実践まで、ひとつの流れで',
    'workflow.step1.title': 'eBookで学ぶ',
    'workflow.step1.desc': '金融構造の原理を体系的に学びます。各チャプターは実務事例と書式に繋がっています。',
    'workflow.step2.title': '書式で適用する',
    'workflow.step2.desc': '学習内容に連携した書式をすぐにダウンロード。AIが自動的に内容を入力します。',
    'workflow.step3.title': '構造を完成させる',
    'workflow.step3.desc': '法律・税務・財務書類を完成させ、実際の金融構造を構築します。',

    'yt.tag': 'VIDEO GUIDE',
    'yt.title': '取引前に必ず知っておくべきこと',
    'yt.desc': '実際の取引で発生する法的リスクと金融の落とし穴を動画で確認してください。<br>専門家が実際の事例を分析します。',
    'yt.soon': '動画準備中',
    'yt1.tag': '⚠ 契約リスク',
    'yt1.title': '契約書の一行が数千万円を失わせる',
    'yt1.desc': '見落としがちな契約書の毒素条項5つと実際の紛争事例を分析します。',
    'yt2.tag': '⚠ 不動産の罠',
    'yt2.title': '敷金詐欺を防ぐ登記簿の読み方',
    'yt2.desc': '空き家詐欺・二重契約・違法転貸の被害を防ぐチェックリストを公開します。',
    'yt3.tag': '⚠ 投資詐欺',
    'yt3.title': '投資勧誘時に必ず確認すべき5つのこと',
    'yt3.desc': 'ねずみ講・マルチ商法・無許可投資助言業の共通パターンを実例で分析します。',
    'yt4.tag': '⚠ 税務リスク',
    'yt4.title': '開業前に必ず知っておくべき税金',
    'yt4.desc': '消費税・所得税・社会保険の構造を知らないと、初年度から税金爆弾を受けます。',

    'reviews.tag': 'REVIEWS',
    'reviews.title': '12,847名が選びました',
    'review1.text': '「法人設立から投資契約まで必要な書式が揃っています。弁護士費用を大幅に削減できました。」',
    'review1.role': 'スタートアップ創業者',
    'review2.text': '「賃貸借契約書セット一つで全ての契約状況に対応できます。AI自動補完が特に便利です。」',
    'review2.role': '不動産投資家',
    'review3.text': '「いつもお客様に勧めています。税務申告書式が最新の法令に合わせて更新されており信頼できます。」',
    'review3.role': '税理士',

    'cta.title': '今すぐ始めましょう',
    'cta.desc': '無料チャプター3つと基本書式セットは<br>会員登録なしでご利用いただけます。',
    'cta.btn1': '無料で始める',
    'cta.btn2': '書式ライブラリを見る',

    'footer.copy': '© 2025 Finarchitect. All rights reserved.',
    'footer.terms': '利用規約',
    'footer.privacy': '個人情報保護方針',
    'footer.about': '会社概要',

    'ebook.header.title': 'eBookライブラリ',
    'ebook.header.sub': 'Vol.1 · 16チャプター · 3言語',
    'ebook.progress.title': '読書進捗',
    'ebook.progress.sub': 'Ch.3完了 · 残り5チャプター',
    'ebook.toc': '目次',
    'ebook.upgrade.title': '全チャプターのロックを解除',
    'ebook.badge.free': 'FREE',
    'ebook.badge.lock': 'ロック解除',

    'forms.header.title': '書式ライブラリ',
    'forms.header.sub': '250+ 法律·金融·税務書式テンプレート',
    'forms.search.placeholder': '書式を検索...',
    'forms.filter.all': '全て',
    'forms.filter.legal': '法律',
    'forms.filter.finance': '金融',
    'forms.filter.tax': '税務',
    'forms.filter.labor': '労務',
    'forms.badge.free': '無料',
    'forms.badge.pro': 'PRO',
    'forms.btn.download': 'ダウンロード',
    'forms.upgrade.title': 'PRO書式フルアクセス',
    'forms.upgrade.desc': '月₩29,000で250+書式全てとAI自動補完をご利用いただけます。',
    'forms.upgrade.btn': 'PROにアップグレード',

    'pricing.tag': 'PRICING',
    'pricing.title': '明確な料金体系',
    'pricing.desc': 'PayPal・クレジットカード・デビットカードでお支払いいただけます。',
    'pricing.plan1.name': '書式ライブラリ',
    'pricing.plan1.desc': '法律·金融·税務 250+ 書式テンプレート年間無制限利用',
    'pricing.plan1.period': '/ 1年',
    'pricing.plan1.f1': '250+書式テンプレート全て利用可能',
    'pricing.plan1.f2': 'DOCX · PDF · HWP ダウンロード',
    'pricing.plan1.f3': '法律·金融·税務·労務 全カテゴリ',
    'pricing.plan1.f4': '新規書式アップデート自動含む',
    'pricing.plan2.badge': '⭐ 最も人気',
    'pricing.plan2.name': 'eBook Vol.1',
    'pricing.plan2.desc': '構造でお金を設計する人たち — 全16チャプター + 1年書式利用権含む',
    'pricing.plan2.period': '/ 書籍1冊',
    'pricing.plan2.f1': '全16チャプター + 付録 無制限閲覧',
    'pricing.plan2.f2': '韓国語 · 英語 · 日本語 3言語',
    'pricing.plan2.f3': '書式ライブラリ1年無料利用',
    'pricing.plan2.f4': '今後のアップデートコンテンツ自動含む',
    'pricing.plan2.f5': 'PDF保存可能',
    'pricing.plan3.name': '金融コンサルティング',
    'pricing.plan3.desc': 'プロジェクト別カスタム金融構造設計 · PF · SPV · STO戦略立案',
    'pricing.plan3.range': '$9,999 ~ $499,999',
    'pricing.plan3.range.sub': 'プロジェクト規模により協議',
    'pricing.plan3.f1': '金融構造設計 (PF · SPV · STO)',
    'pricing.plan3.f2': '投資誘致戦略立案',
    'pricing.plan3.f3': '法律·税務連携アドバイス',
    'pricing.plan3.f4': 'IR資料 · 契約書レビュー',
    'pricing.plan3.f5': '専任1:1コンサルタント配置',
    'pricing.consult.name': 'お名前',
    'pricing.consult.email': 'メールアドレス',
    'pricing.consult.budget': 'プロジェクト規模の目安',
    'pricing.consult.budget.opt1': '$999 ~ $4,999',
    'pricing.consult.budget.opt2': '$5,000 ~ $49,999',
    'pricing.consult.budget.opt3': '$50,000 ~ $499,999',
    'pricing.consult.budget.opt4': '$500,000+',
    'pricing.consult.message': 'プロジェクトの概要を簡単にご説明ください。',
    'pricing.consult.submit': '無料相談申し込み',
    'pricing.note': 'PayPalアカウントなしでカード決済可能',
    'pricing.footer.note': '全ての決済はPayPalを通じて安全に処理されます。· 返金ポリシー: 購入後7日以内の未使用分は全額返金',
    'pricing.consult.done': '📩',
    'pricing.consult.done.title': 'お問い合わせを受け付けました！',
    'pricing.consult.done.desc': '営業日1〜2日以内にstclogic@gmail.comよりご連絡いたします。',
  }
};

// ── 언어 적용 함수 ──
function applyLang(lang) {
  const dict = SITE_I18N[lang] || SITE_I18N.ko;

  // data-i18n 텍스트 교체
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else if (el.tagName === 'OPTION') {
        el.textContent = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // data-i18n-value (input value 교체)
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    if (dict[key] !== undefined) el.value = dict[key];
  });

  // html lang 속성
  document.documentElement.lang = lang === 'ko' ? 'ko' : lang === 'ja' ? 'ja' : 'en';

  // 저장
  localStorage.setItem('site-lang', lang);
  window._siteLang = lang;
}

function getSiteLang() {
  return localStorage.getItem('site-lang') || 'ko';
}

// 언어 스위처 초기화 (nav 안의 .lang-switcher 버튼들)
function initLangSwitcher() {
  const current = getSiteLang();
  document.querySelectorAll('.ls-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === current);
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      document.querySelectorAll('.ls-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyLang(lang);
      // ebook.html의 자체 LANGS 렌더러가 있으면 연동
      if (typeof renderChapters === 'function') renderChapters(lang);
    });
  });
  applyLang(current);
}

document.addEventListener('DOMContentLoaded', initLangSwitcher);
