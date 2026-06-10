/* ============================================
   AUTH.JS — TaskFlow Login / Register
   ============================================ */

'use strict';

/* ── Helpers ─────────────────────────────────── */

const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

function showError(fieldId, message) {
  const group = $(`group-${fieldId}`);
  const errorEl = $(`error-${fieldId}`);
  const input = $(fieldId) || group && group.querySelector('input');

  if (group) group.classList.add('has-error');
  if (group) group.classList.remove('is-valid');
  if (input) input.setAttribute('aria-invalid', 'true');

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearError(fieldId) {
  const group = $(`group-${fieldId}`);
  const errorEl = $(`error-${fieldId}`);
  const input = $(fieldId) || group && group.querySelector('input');

  if (group) group.classList.remove('has-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
  if (input) input.removeAttribute('aria-invalid');
}

function markValid(fieldId) {
  const group = $(`group-${fieldId}`);
  if (group) {
    group.classList.remove('has-error');
    group.classList.add('is-valid');
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function setLoading(btn, spinnerEl, isLoading) {
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
    if (spinnerEl) spinnerEl.style.display = 'block';
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
    if (spinnerEl) spinnerEl.style.display = 'none';
  }
}

function showGlobalError(message) {
  const el = $('globalError');
  const textEl = $('globalErrorText');
  if (!el) return;
  if (textEl) textEl.textContent = message;
  el.style.display = 'flex';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideGlobalError() {
  const el = $('globalError');
  if (el) el.style.display = 'none';
}

/* ── Field live-validation ───────────────────── */

function attachLiveValidation() {
  const emailInput = $('email');
  const passwordInput = $('password');

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (!val) {
        clearError('email');
        return;
      }
      if (!isValidEmail(val)) {
        showError('email', 'Please enter a valid email address.');
      } else {
        clearError('email');
        markValid('email');
      }
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim()) clearError('email');
      hideGlobalError();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      if (passwordInput.value) clearError('password');
      hideGlobalError();
    });
  }
}

/* ── Password visibility toggle ─────────────── */

function initPasswordToggle() {
  const btn = $('togglePassword');
  const input = $('password');
  if (!btn || !input) return;

  const eyeShow = btn.querySelector('.eye-show');
  const eyeHide = btn.querySelector('.eye-hide');

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    if (eyeShow) eyeShow.style.display = isPassword ? 'none' : 'block';
    if (eyeHide) eyeHide.style.display = isPassword ? 'block' : 'none';
  });
}

/* ── Login form submission ───────────────────── */

function initLoginForm() {
  const form = $('loginForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    hideGlobalError();

    const emailInput = $('email');
    const passwordInput = $('password');
    const submitBtn = $('submitBtn');
    const spinner = $('btnSpinner');

    // Clear previous errors
    clearError('email');
    clearError('password');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    let hasError = false;

    // Validate email
    if (!email) {
      showError('email', 'Email address is required.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    // Validate password
    if (!password) {
      showError('password', 'Password is required.');
      hasError = true;
    }

    if (hasError) return;

    // Simulate async login request
    setLoading(submitBtn, spinner, true);

    try {
      await simulateAuthRequest({ email, password });

      // Success: redirect to dashboard
      window.location.href = 'dashboard.html';

    } catch (err) {
      setLoading(submitBtn, spinner, false);
      showGlobalError(err.message || 'Invalid email or password. Please try again.');

      // Shake animation on form
      form.classList.add('shake');
      form.addEventListener('animationend', () => form.classList.remove('shake'), { once: true });
    }
  });
}

/* ── Simulate network request (replace with real API) ── */

function simulateAuthRequest({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo: accept demo@taskflow.io / password123
      if (email === 'demo@taskflow.io' && password === 'password123') {
        resolve({ token: 'demo-token-xyz', user: { email, name: 'Demo User' } });
      } else {
        reject(new Error('Invalid email or password. Please try again.'));
      }
    }, 1400);
  });
}

/* ── Google sign-in ──────────────────────────── */

function initGoogleSignIn() {
  const btn = $('googleBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Simulate Google OAuth redirect
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation:spin 0.65s linear infinite">
        <circle cx="8" cy="8" r="6" stroke="#D1D5DB" stroke-width="2"/>
        <path d="M8 2a6 6 0 016 6" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Redirecting to Google…
    `;
    // In production: window.location.href = '/auth/google';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      `;
    }, 2000);
  });
}

/* ── Forgot Password Modal ───────────────────── */

function initForgotPassword() {
  const forgotLink = $('forgotLink');
  const modal = $('forgotModal');
  const closeBtn = $('modalClose');
  const cancelBtn = $('cancelReset');
  const resetForm = $('resetForm');
  const resetSubmitBtn = $('resetSubmitBtn');
  const resetSpinner = $('resetSpinner');
  const successPanel = $('resetSuccess');
  const formPanel = resetForm;
  const emailDisplay = $('resetEmailDisplay');
  const closeSuccessBtn = $('closeSuccessModal');

  if (!forgotLink || !modal) return;

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const resetEmailInput = $('resetEmail');
    if (resetEmailInput) {
      // Pre-fill with login email if available
      const loginEmail = $('email');
      if (loginEmail && loginEmail.value) resetEmailInput.value = loginEmail.value;
      setTimeout(() => resetEmailInput.focus(), 150);
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Reset form state
    if (resetForm) resetForm.style.display = 'flex';
    if (successPanel) successPanel.style.display = 'none';
    if (resetForm) resetForm.reset();
    clearError('reset-email');
    const resetEmailInput = $('resetEmail');
    if (resetEmailInput) {
      const group = resetEmailInput.closest('.form-group');
      if (group) {
        group.classList.remove('has-error', 'is-valid');
      }
    }
  }

  forgotLink.addEventListener('click', e => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
  });

  // Reset form submit
  if (resetForm) {
    resetForm.addEventListener('submit', async e => {
      e.preventDefault();
      const input = $('resetEmail');
      const email = input ? input.value.trim() : '';

      // Clear previous error
      const group = input && input.closest('.form-group');
      const errorEl = $('error-reset-email');
      if (group) group.classList.remove('has-error');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }

      if (!email) {
        if (group) group.classList.add('has-error');
        if (errorEl) { errorEl.textContent = 'Please enter your email address.'; errorEl.classList.add('visible'); }
        if (input) input.focus();
        return;
      }
      if (!isValidEmail(email)) {
        if (group) group.classList.add('has-error');
        if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.classList.add('visible'); }
        if (input) input.focus();
        return;
      }

      setLoading(resetSubmitBtn, null, true);
      if (resetSpinner) resetSpinner.style.display = 'inline-block';

      // Simulate sending reset email
      await new Promise(r => setTimeout(r, 1500));

      setLoading(resetSubmitBtn, null, false);
      if (resetSpinner) resetSpinner.style.display = 'none';

      // Show success
      if (emailDisplay) emailDisplay.textContent = email;
      resetForm.style.display = 'none';
      if (successPanel) successPanel.style.display = 'flex';
    });
  }
}

/* ── Shake animation (CSS keyframe injected) ─── */

function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15%       { transform: translateX(-5px); }
      30%       { transform: translateX(5px); }
      45%       { transform: translateX(-4px); }
      60%       { transform: translateX(4px); }
      75%       { transform: translateX(-2px); }
      90%       { transform: translateX(2px); }
    }
    .shake { animation: shake 0.45s ease; }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

/* ── Demo hint (removes itself after 4 s) ─────── */

function injectDemoHint() {
  const wrap = document.querySelector('.auth-form-wrap');
  if (!wrap) return;

  const hint = document.createElement('div');
  hint.style.cssText = `
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.8125rem;
    color: #1D4ED8;
    line-height: 1.5;
    animation: slideDown 300ms ease;
    transition: opacity 400ms ease;
  `;
  hint.innerHTML = `
    <strong>Demo credentials:</strong><br/>
    Email: <code>demo@taskflow.io</code> &nbsp;|&nbsp; Password: <code>password123</code>
  `;
  wrap.appendChild(hint);

  setTimeout(() => {
    hint.style.opacity = '0';
    setTimeout(() => hint.remove(), 400);
  }, 8000);
}

/* ── Init ────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  injectShakeAnimation();
  attachLiveValidation();
  initPasswordToggle();
  initLoginForm();
  initGoogleSignIn();
  initForgotPassword();
  injectDemoHint();
});



/**
 * TaskFlow Design System — Client Validation & Authentication Subsystem
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Form Element Selectors Hub ---
  const registerForm = document.getElementById('registerForm');
  const googleBtn = document.getElementById('googleSignupBtn');
  
  const fields = {
    name: { input: document.getElementById('fullName'), error: document.getElementById('fullNameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    role: { input: document.getElementById('userRole'), error: document.getElementById('userRoleError') },
    password: { input: document.getElementById('password'), error: document.getElementById('passwordError') },
    confirmPassword: { input: document.getElementById('confirmPassword'), error: document.getElementById('confirmPasswordError') },
    terms: { input: document.getElementById('termsAgreement'), error: document.getElementById('termsError') }
  };

  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');

  // --- Password Visibility Toggle Actions Mechanism ---
  const revealButtons = document.querySelectorAll('.password-reveal-toggle');
  revealButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        btn.textContent = 'Hide';
      } else {
        targetInput.type = 'password';
        btn.textContent = 'Show';
      }
    });
  });

  // --- Real-time Complexity Scoring Array Engine ---
  if (fields.password.input) {
    fields.password.input.addEventListener('input', () => {
      const val = fields.password.input.value;
      const metrics = calculatePasswordStrength(val);
      updateStrengthUI(metrics);
    });
  }

  function calculatePasswordStrength(pwd) {
    let score = 0;
    if (!pwd) return { score: 0, label: 'Enter at least 8 structured characters.', color: 'transparent' };
    
    // Test parameters
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1; // Extra length index allocation
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak configuration syntax.', color: '#EF4444' }; // --danger
    if (score <= 4) return { score: 60, label: 'Medium safety tracking score.', color: '#F59E0B' }; // --warning
    return { score: 100, label: 'Strong cryptographic structure secured.', color: '#22C55E' }; // --success
  }

  function updateStrengthUI(metrics) {
    if (!strengthBar || !strengthText) return;
    strengthBar.style.width = `${metrics.score}%`;
    strengthBar.style.backgroundColor = metrics.color;
    strengthText.textContent = metrics.label;
    strengthText.style.color = metrics.score === 25 ? 'var(--danger)' : metrics.score === 60 ? 'var(--warning)' : 'var(--text-secondary)';
  }

  // --- Client Validation Validation Pipeline ---
  function clearErrors() {
    Object.keys(fields).forEach(key => {
      if (fields[key].error) fields[key].error.textContent = '';
      if (fields[key].input) fields[key].input.classList.remove('error');
    });
  }

  function setError(fieldKey, message) {
    if (fields[fieldKey].error) fields[fieldKey].error.textContent = message;
    if (fields[fieldKey].input) fields[fieldKey].input.classList.add('error');
  }

  function validateRegistrationForm() {
    clearErrors();
    let isPipelineClear = true;

    // Full Name verification execution
    if (!fields.name.input.value.trim()) {
      setError('name', 'Full identity name configuration required.');
      isPipelineClear = false;
    }

    // Email matching rules processing
    const emailValue = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setError('email', 'Corporate email identity node address required.');
      isPipelineClear = false;
    } else if (!emailPattern.test(emailValue)) {
      setError('email', 'Invalid email schema resolution format detected.');
      isPipelineClear = false;
    }

    // Role profile selection testing
    if (!fields.role.input.value) {
      setError('role', 'Select an workspace assignment profile role node.');
      isPipelineClear = false;
    }

    // Password baseline structural verification execution
    const passwordValue = fields.password.input.value;
    if (!passwordValue) {
      setError('password', 'Password string security value parameter needed.');
      isPipelineClear = false;
    } else if (passwordValue.length < 8) {
      setError('password', 'Security requirements mismatch: minimum length is 8.');
      isPipelineClear = false;
    }

    // Confirm passwords match verification matching check
    const confirmPasswordValue = fields.confirmPassword.input.value;
    if (!confirmPasswordValue) {
      setError('confirmPassword', 'Confirmation authorization repeat check required.');
      isPipelineClear = false;
    } else if (passwordValue !== confirmPasswordValue) {
      setError('confirmPassword', 'Verification error: credential strings do not match.');
      isPipelineClear = false;
    }

    // Terms check box enforcement parameter validation
    if (!fields.terms.input.checked) {
      setError('terms', 'Workspace usage terms compliance acceptance required.');
      isPipelineClear = false;
    }

    return isPipelineClear;
  }

  // --- Submissions Execution Interceptor ---
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const formPassedValidation = validateRegistrationForm();
      
      if (formPassedValidation) {
        // Collect form data payload parameters
        const registrationPayload = {
          name: fields.name.input.value.trim(),
          email: fields.email.input.value.trim(),
          role: fields.role.input.value,
          password: fields.password.input.value
        };
        
        console.log('TaskFlow Registration Processing Payload Transmission:', registrationPayload);
        
        // Simulating backend execution delay. Replace with window.location.href target upon implementation.
        const submitButton = document.getElementById('submitBtn');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating workspace...';
        
        setTimeout(() => {
          alert('Registration compiled successfully! Redirecting downstream to dashboard setup pipelines.');
          window.location.href = 'login.html';
        }, 1200);
      }
    });
  }

  // Google OAuth Hook Sandbox Stub 
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      console.log('Initiating Google Federated Identity OAuth Pipeline Redirection API...');
    });
  }
});