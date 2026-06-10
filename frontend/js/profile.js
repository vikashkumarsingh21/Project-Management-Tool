/**
 * TaskFlow Design System — User Profile Page Manager
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Tab Switching Mechanics ──
  const tabButtons = document.querySelectorAll('.profile-tab-btn');
  const tabPanes = document.querySelectorAll('.profile-tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPaneId = button.getAttribute('data-tab');

      // Sync active classes across selectors
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Display matching segment viewport
      tabPanes.forEach(pane => {
        if (pane.id === targetPaneId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // ── Action Buttons Interaction Routing ──
  const editProfileBtn = document.getElementById('editProfileBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const settingsTabTrigger = document.querySelector('.profile-tab-btn[data-tab="settings"]');

  if (editProfileBtn && settingsTabTrigger) {
    editProfileBtn.addEventListener('click', () => {
      settingsTabTrigger.click();
      const nameInput = document.getElementById('inputName');
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInput.focus();
      }
    });
  }

  if (changePasswordBtn && settingsTabTrigger) {
    changePasswordBtn.addEventListener('click', () => {
      settingsTabTrigger.click();
      const passwordInput = document.getElementById('currentPassword');
      if (passwordInput) {
        passwordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        passwordInput.focus();
      }
    });
  }

  // ── Toast Status Helper ──
  const toastElement = document.getElementById('profileToast');
  const toastMsgSpan = document.getElementById('toastMessage');
  let toastTimeout;

  function emitFeedback(text, isAlert = false) {
    if (!toastElement || !toastMsgSpan) return;

    clearTimeout(toastTimeout);
    toastMsgSpan.textContent = text;
    
    if (isAlert) {
      toastElement.style.backgroundColor = 'var(--danger)';
    } else {
      toastElement.style.backgroundColor = 'var(--sidebar)';
    }

    toastElement.classList.add('show');
    toastTimeout = setTimeout(() => {
      toastElement.classList.remove('show');
    }, 3500);
  }

  // ── Reactive Form Processor: Profile Info Modification ──
  const editProfileForm = document.getElementById('editProfileForm');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameVal = document.getElementById('inputName').value.trim();
      const roleVal = document.getElementById('inputRole').value.trim();
      const emailVal = document.getElementById('inputEmail').value.trim();
      const locationVal = document.getElementById('inputLocation').value.trim();
      const bioVal = document.getElementById('inputBio').value.trim();

      if (!nameVal || !roleVal || !emailVal) {
        emitFeedback('Please populate all mandatory identity metrics.', true);
        return;
      }

      // Mutate UI nodes instantly across views
      document.querySelectorAll('.display-user-name').forEach(node => node.textContent = nameVal);
      document.querySelectorAll('.display-user-role').forEach(node => node.textContent = roleVal);
      document.querySelectorAll('.display-user-email').forEach(node => node.textContent = emailVal);
      
      const locNode = document.getElementById('displayUserLocation');
      if (locNode) locNode.textContent = locationVal || 'Remote';

      const bioNode = document.getElementById('displayUserBio');
      if (bioNode) bioNode.textContent = bioVal || 'No biography written yet.';

      // Generate replacement profile initials fallback
      const derivedInitials = nameVal.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
      if (derivedInitials) {
        document.querySelectorAll('.profile-avatar-initials, .profile-avatar-lg').forEach(avatar => {
          avatar.textContent = derivedInitials;
        });
      }

      emitFeedback('Profile structural elements successfully synchronized.');
    });
  }

  // ── Reactive Form Processor: Account Security Credentials ──
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const currentPass = document.getElementById('currentPassword').value;
      const newPass = document.getElementById('newPassword').value;
      const confirmPass = document.getElementById('confirmPassword').value;

      if (!currentPass || !newPass || !confirmPass) {
        emitFeedback('Please provide values for all password credentials.', true);
        return;
      }

      if (newPass !== confirmPass) {
        emitFeedback('Verification mismatch. Ensure passwords match perfectly.', true);
        return;
      }

      if (newPass.length < 6) {
        emitFeedback('Security threshold error. Minimum size is 6 characters.', true);
        return;
      }

      // Clear the credential modification containers securely
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';

      emitFeedback('Account security credentials updated successfully.');
    });
  }

  // ── Standard Shell Controller Hooks (Topbar & Side Toggle Coordination) ──
  const profileDropdownBtn = document.getElementById('profileBtn');
  const profileDropdownMenu = document.getElementById('profileDropdown');

  if (profileDropdownBtn && profileDropdownMenu) {
    profileDropdownBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const displaying = profileDropdownMenu.style.display === 'block';
      profileDropdownMenu.style.display = displaying ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      profileDropdownMenu.style.display = 'none';
    });
  }

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