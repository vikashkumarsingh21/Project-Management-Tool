/**
 * TaskFlow Design System — Settings Workspace Management Architecture
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Section Transition System (Atlassian Split Pane Core) ──
  const navItems = document.querySelectorAll('.settings-nav-item');
  const sections = document.querySelectorAll('.settings-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSectionId = item.getAttribute('data-target');

      // Update active navigation state indicator
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Expose the targeted parameter pane group
      sections.forEach(section => {
        if (section.id === `section-${targetSectionId}`) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });

  // ── Appearance System Hook: Real-time Dark Mode Syncing ──
  const darkModeToggle = document.getElementById('appearanceDarkMode');
  
  // Load configuration from localStorage on startup
  const activeTheme = localStorage.getItem('taskflow-theme') || 'light';
  if (activeTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('taskflow-theme', 'dark');
        emitNotification('Dark theme profile active.');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('taskflow-theme', 'light');
        emitNotification('Light theme profile active.');
      }
    });
  }

  // ── Interactive Actions Management: Form Submission & State Resets ──
  const settingsForm = document.getElementById('settingsMasterForm');
  const resetBtn = document.getElementById('resetSettingsBtn');

  // Snapshot fallback default object configuration for reset capabilities
  const baselineSettingsDefaults = {
    name: "Alex Dawson",
    email: "alex@acmecorp.io",
    lang: "en",
    twoFA: false,
    emailNotify: true,
    weeklyDigest: false,
    darkMode: false,
    density: "standard",
    privacySearch: true,
    telemetry: false
  };

  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Capture inputs from standard blocks
      const currentPass = document.getElementById('currentPassword').value;
      const newPass = document.getElementById('newPassword').value;
      const confirmPass = document.getElementById('confirmPassword').value;

      // Conditional execution block targeting password security validations
      if (currentPass || newPass || confirmPass) {
        if (!currentPass) {
          emitNotification('Please declare current verification password.', true);
          return;
        }
        if (newPass.length < 8) {
          emitNotification('Security threshold error. Minimum size is 8 characters.', true);
          return;
        }
        if (newPass !== confirmPass) {
          emitNotification('Verification mismatch. Ensure passwords match perfectly.', true);
          return;
        }
        
        // Wipe password value input shells securely following successful validation checks
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
      }

      // Simulation node interface hook: persist state changes or push to API endpoint
      emitNotification('Workspace configuration definitions compiled and saved.');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to revert all workspace parameters to default states?')) {
        
        // Revert form nodes to fallback positions
        document.getElementById('accountName').value = baselineSettingsDefaults.name;
        document.getElementById('accountEmail').value = baselineSettingsDefaults.email;
        document.getElementById('accountLanguage').value = baselineSettingsDefaults.lang;
        document.getElementById('security2FA').checked = baselineSettingsDefaults.twoFA;
        document.getElementById('notifyEmailUpdates').checked = baselineSettingsDefaults.emailNotify;
        document.getElementById('notifyDigest').checked = baselineSettingsDefaults.weeklyDigest;
        document.getElementById('privacySearchable').checked = baselineSettingsDefaults.privacySearch;
        document.getElementById('privacyTelemetry').checked = baselineSettingsDefaults.telemetry;
        
        // Clear active changes inside operational inputs
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        // Reset system radio parameters
        const standardRadio = document.querySelector('input[name="layoutDensity"][value="standard"]');
        if (standardRadio) standardRadio.checked = true;

        // Force reset the theme environment configurations
        if (darkModeToggle) {
          darkModeToggle.checked = baselineSettingsDefaults.darkMode;
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('taskflow-theme', 'light');
        }

        emitNotification('Configuration values standard defaults restored.');
      }
    });
  }

  // ── Global System Alert Feedback Toast Handler ──
  const toastContainer = document.getElementById('settingsToast');
  const toastMessageField = document.getElementById('settingsToastMsg');
  let runtimeToastTracker;

  function emitNotification(textMsg, isError = false) {
    if (!toastContainer || !toastMessageField) return;

    clearTimeout(runtimeToastTracker);
    toastMessageField.textContent = textMsg;

    if (isError) {
      toastContainer.style.backgroundColor = 'var(--danger)';
    } else {
      toastContainer.style.backgroundColor = 'var(--sidebar)';
    }

    toastContainer.classList.add('show');
    runtimeToastTracker = setTimeout(() => {
      toastContainer.classList.remove('show');
    }, 3500);
  }

  // ── Core Side Navigation Frame Collapsible Utilities (Layout Standard Sync) ──
  const sidebarCollapseBtn = document.getElementById('sidebarToggle');
  const appShellContainer = document.getElementById('appShell');
  if (sidebarCollapseBtn && appShellContainer) {
    sidebarCollapseBtn.addEventListener('click', () => {
      appShellContainer.classList.toggle('sidebar-collapsed');
    });
  }

  const mobileToggleBtn = document.getElementById('mobileMenuBtn');
  if (mobileToggleBtn && appShellContainer) {
    mobileToggleBtn.addEventListener('click', () => {
      appShellContainer.classList.toggle('mobile-sidebar-open');
    });
  }
});