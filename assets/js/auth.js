// Supabase 인증 — 로그인·회원가입·로그아웃 모달 관리
(function () {
  // Netlify Function에서 공개 설정값 가져오기
  async function getConfig() {
    if (window._bcConfig) return window._bcConfig;
    const res = await fetch('/.netlify/functions/get-config');
    window._bcConfig = await res.json();
    return window._bcConfig;
  }

  // Supabase SDK 동적 로드
  async function getSupabase() {
    if (window._supabase) return window._supabase;
    const cfg = await getConfig();
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    window._supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    return window._supabase;
  }

  // ── 모달 HTML 주입 ──────────────────────────────
  function injectModal() {
    if (document.getElementById('authModal')) return;
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.innerHTML = `
      <div class="auth-overlay" id="authOverlay">
        <div class="auth-box">
          <button class="auth-close" id="authClose">✕</button>

          <!-- 탭 -->
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">로그인</button>
            <button class="auth-tab" data-tab="signup">회원가입</button>
          </div>

          <!-- 로그인 폼 -->
          <form class="auth-form" id="loginForm">
            <div class="auth-field">
              <label>이메일</label>
              <input type="email" id="loginEmail" placeholder="이메일 주소" required>
            </div>
            <div class="auth-field">
              <label>비밀번호</label>
              <div class="pw-wrap">
                <input type="password" id="loginPw" placeholder="비밀번호" required>
                <button type="button" class="pw-toggle" data-target="loginPw">보기</button>
              </div>
            </div>
            <p class="auth-error" id="loginError"></p>
            <button type="submit" class="auth-submit" id="loginBtn">로그인</button>
            <p class="auth-hint">계정이 없으신가요? <a href="#" onclick="switchAuthTab('signup')">회원가입</a></p>
          </form>

          <!-- 회원가입 폼 -->
          <form class="auth-form hidden" id="signupForm">
            <div class="auth-field">
              <label>이름</label>
              <input type="text" id="signupName" placeholder="이름" required>
            </div>
            <div class="auth-field">
              <label>이메일</label>
              <input type="email" id="signupEmail" placeholder="이메일 주소" required>
            </div>
            <div class="auth-field">
              <label>비밀번호</label>
              <div class="pw-wrap">
                <input type="password" id="signupPw" placeholder="8자 이상" required minlength="8">
                <button type="button" class="pw-toggle" data-target="signupPw">보기</button>
              </div>
            </div>
            <div class="auth-field">
              <label>비밀번호 확인</label>
              <div class="pw-wrap">
                <input type="password" id="signupPwConfirm" placeholder="비밀번호 재입력" required>
                <button type="button" class="pw-toggle" data-target="signupPwConfirm">보기</button>
              </div>
            </div>
            <p class="auth-error" id="signupError"></p>
            <button type="submit" class="auth-submit" id="signupBtn">회원가입</button>
            <p class="auth-hint">이미 계정이 있으신가요? <a href="#" onclick="switchAuthTab('login')">로그인</a></p>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    injectAuthStyles();
    bindAuthEvents();
  }

  function injectAuthStyles() {
    if (document.getElementById('authStyles')) return;
    const style = document.createElement('style');
    style.id = 'authStyles';
    style.textContent = `
      .auth-overlay {
        display: none; position: fixed; inset: 0;
        background: rgba(15,12,41,0.6); backdrop-filter: blur(4px);
        z-index: 99999; align-items: center; justify-content: center;
      }
      .auth-overlay.open { display: flex; }
      .auth-box {
        background: #fff; border-radius: 20px;
        padding: 2rem; width: 100%; max-width: 420px;
        margin: 1rem; position: relative;
        box-shadow: 0 24px 64px rgba(0,0,0,0.18);
      }
      .auth-close {
        position: absolute; top: 1rem; right: 1rem;
        background: none; border: none; font-size: 1.1rem;
        color: #9CA3AF; cursor: pointer;
      }
      .auth-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
      .auth-tab {
        flex: 1; padding: 8px; border-radius: 8px; border: none;
        background: #EEF2FF; color: #6B7280; font-weight: 600;
        font-size: 0.9rem; cursor: pointer;
      }
      .auth-tab.active { background: #4F46E5; color: #fff; }
      .auth-form { display: flex; flex-direction: column; gap: 1rem; }
      .auth-form.hidden { display: none; }
      .auth-field { display: flex; flex-direction: column; gap: 4px; }
      .auth-field label { font-size: 0.8rem; font-weight: 600; color: #374151; }
      .auth-field input {
        padding: 10px 14px; border: 1.5px solid #E2E8F0;
        border-radius: 10px; font-size: 0.9rem; outline: none;
        transition: border-color .15s;
      }
      .auth-field input:focus { border-color: #4F46E5; }
      .auth-error { color: #EF4444; font-size: 0.8rem; min-height: 1.2em; margin: 0; }
      .auth-submit {
        padding: 12px; background: #4F46E5; color: #fff;
        border: none; border-radius: 10px; font-size: 0.95rem;
        font-weight: 700; cursor: pointer; transition: background .15s;
      }
      .auth-submit:hover { background: #3730A3; }
      .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      .auth-hint { text-align: center; font-size: 0.8rem; color: #9CA3AF; margin: 0; }
      .auth-hint a { color: #4F46E5; font-weight: 600; }
      .pw-wrap { position: relative; display: flex; }
      .pw-wrap input { flex: 1; padding-right: 52px; }
      .pw-toggle {
        position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
        background: none; border: none; font-size: 0.75rem; color: #6B7280;
        cursor: pointer; padding: 2px 4px; white-space: nowrap;
      }
      .pw-toggle:hover { color: #4F46E5; }
    `;
    document.head.appendChild(style);
  }

  function bindAuthEvents() {
    document.getElementById('authClose').addEventListener('click', closeAuthModal);
    document.getElementById('authOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'authOverlay') closeAuthModal();
    });

    // 탭 전환
    document.querySelectorAll('.auth-tab').forEach(btn => {
      btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });

    // 비밀번호 보기/숨기기 토글
    document.querySelectorAll('.pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.textContent = show ? '숨기기' : '보기';
      });
    });

    // 로그인
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const err = document.getElementById('loginError');
      btn.disabled = true; btn.textContent = '로그인 중...'; err.textContent = '';
      const email = document.getElementById('loginEmail').value.trim();
      // 로컬 개발 환경: stclogic@gmail.com으로 즉시 바이패스
      if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1')
          && email === 'stclogic@gmail.com') {
        onAuthSuccess({ id: 'local-dev', email, user_metadata: { name: 'stclogic' } });
        return;
      }
      try {
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signInWithPassword({
          email,
          password: document.getElementById('loginPw').value,
        });
        if (error) throw error;
        onAuthSuccess(data.user);
      } catch (ex) {
        err.textContent = ex.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : ex.message;
        btn.disabled = false; btn.textContent = '로그인';
      }
    });

    // 회원가입
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('signupBtn');
      const err = document.getElementById('signupError');
      btn.disabled = true; btn.textContent = '가입 중...'; err.textContent = '';
      const pw = document.getElementById('signupPw').value;
      const pwConfirm = document.getElementById('signupPwConfirm').value;
      if (pw !== pwConfirm) {
        err.textContent = '비밀번호가 일치하지 않습니다.';
        btn.disabled = false; btn.textContent = '회원가입';
        return;
      }
      try {
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signUp({
          email: document.getElementById('signupEmail').value,
          password: pw,
          options: { data: { name: document.getElementById('signupName').value } },
        });
        if (error) throw error;
        err.style.color = '#10B981';
        err.textContent = '가입이 완료됐습니다! 이메일을 확인해 인증 링크를 클릭해 주세요.';
        btn.disabled = false; btn.textContent = '회원가입';
        if (data.user && data.session) onAuthSuccess(data.user);
      } catch (ex) {
        const msg = ex?.message || '';
        if (msg === 'User already registered') {
          err.style.color = '#EF4444';
          err.textContent = '이미 가입된 이메일입니다. 로그인해 주세요.';
        } else if (!msg || msg === '{}' || msg === 'null') {
          // SMTP 발송 오류지만 계정은 생성됨 — 성공으로 안내
          err.style.color = '#10B981';
          err.textContent = '가입이 완료됐습니다! 이메일함을 확인해 주세요. (스팸함도 확인)';
        } else {
          err.style.color = '#EF4444';
          err.textContent = msg;
        }
        btn.disabled = false; btn.textContent = '회원가입';
      }
    });
  }

  function onAuthSuccess(user) {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email.split('@')[0],
    };
    localStorage.setItem('site-user', JSON.stringify(userData));
    closeAuthModal();
    // nav 칩 갱신
    const nav = document.querySelector('.site-nav');
    if (nav) {
      nav.querySelectorAll('.btn-login, .btn-start').forEach(el => el.style.display = 'none');
      const existing = nav.querySelector('.nav-user-chip');
      if (existing) existing.remove();
      const initials = userData.name.charAt(0).toUpperCase();
      const chip = document.createElement('a');
      chip.href = '#'; chip.className = 'nav-user-chip';
      chip.innerHTML = `<span class="nav-user-avatar">${initials}</span><span class="nav-user-name">${userData.name}</span>`;
      const actions = nav.querySelector('.nav-actions');
      if (actions) actions.appendChild(chip);
    }
    // 결제 대기 콜백 실행
    if (window._authCallback) { window._authCallback(userData); window._authCallback = null; }
  }

  // ── 공개 API ──────────────────────────────────
  window.openAuthModal = function (tab = 'login', callback = null) {
    injectModal();
    if (callback) window._authCallback = callback;
    switchAuthTab(tab);
    document.getElementById('authOverlay').classList.add('open');
  };

  window.closeAuthModal = function () {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.classList.remove('open');
  };

  window.switchAuthTab = function (tab) {
    document.querySelectorAll('.auth-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab)
    );
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
  };

  window.getSupabaseClient = getSupabase;

  // 로그아웃
  window.signOut = async function () {
    const sb = await getSupabase();
    await sb.auth.signOut();
    localStorage.removeItem('site-user');
    location.reload();
  };

  // 로그인 상태 복원
  window.getAuthUser = function () {
    try { return JSON.parse(localStorage.getItem('site-user')); } catch { return null; }
  };

  // 로그인 필요 시 모달 열기 후 콜백 실행
  window.requireAuth = function (callback) {
    const user = window.getAuthUser();
    if (user) { callback(user); return; }
    window.openAuthModal('login', callback);
  };
})();
