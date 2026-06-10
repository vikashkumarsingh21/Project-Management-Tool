/**
 * dashboard.js — TaskFlow Dashboard
 * Production-ready, no external libraries
 * ES6+, modular, fully commented
 */

'use strict';

/* ═══════════════════════════════════════════
   CONSTANTS & STATE
═══════════════════════════════════════════ */

const STATE = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  activeTaskFilter: 'all',
  notifOpen: false,
  profileOpen: false,
  createModalOpen: false,
  searchOpen: false,
  unreadCount: 3,
};

/* ═══════════════════════════════════════════
   DOM REFERENCES
═══════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

const EL = {
  appShell:         $('appShell'),
  sidebar:          $('sidebar'),
  sidebarToggle:    $('sidebarToggle'),
  sidebarOverlay:   $('sidebarOverlay'),
  mobileMenuBtn:    $('mobileMenuBtn'),
  topbar:           $('topbar'),
  searchInput:      $('searchInput'),
  notifBtn:         $('notifBtn'),
  notifDropdown:    $('notifDropdown'),
  notifDot:         $('notifDot'),
  notifList:        $('notifList'),
  markAllRead:      $('markAllRead'),
  profileBtn:       $('profileBtn'),
  profileDropdown:  $('profileDropdown'),
  createBtn:        $('createBtn'),
  createModal:      $('createModal'),
  closeCreateModal: $('closeCreateModal'),
  taskList:         $('taskList'),
  taskFilterTabs:   $('taskFilterTabs'),
  addTaskBtn:       $('addTaskBtn'),
  velocityChart:    $('velocityChart'),
  velocityLabels:   $('velocityLabels'),
  todayDate:        $('todayDate'),
  workspaceBtn:     $('workspaceBtn'),
};

/* ═══════════════════════════════════════════
   INIT — entry point
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initDate();
  initSidebar();
  initTopbar();
  initSearch();
  initNotifications();
  initProfileDropdown();
  initCreateModal();
  initTaskList();
  initProgressBars();
  initVelocityChart();
  initStatCounters();
  initKeyboard();
  createToastContainer();
});

/* ═══════════════════════════════════════════
   DATE DISPLAY
═══════════════════════════════════════════ */

function initDate() {
  if (!EL.todayDate) return;
  const now = new Date();
  EL.todayDate.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
    year:    'numeric',
  });
}

/* ═══════════════════════════════════════════
   SIDEBAR — collapse / expand / mobile
═══════════════════════════════════════════ */

function initSidebar() {
  // Restore collapsed state from localStorage
  const saved = localStorage.getItem('tf_sidebar_collapsed');
  if (saved === 'true') {
    STATE.sidebarCollapsed = true;
    EL.appShell.classList.add('sidebar-collapsed');
  }

  // Desktop collapse toggle
  EL.sidebarToggle?.addEventListener('click', toggleSidebar);

  // Mobile hamburger
  EL.mobileMenuBtn?.addEventListener('click', openMobileSidebar);

  // Overlay click → close mobile sidebar
  EL.sidebarOverlay?.addEventListener('click', closeMobileSidebar);

  // Active nav item highlight
  highlightActiveNavItem();
}

function toggleSidebar() {
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  EL.appShell.classList.toggle('sidebar-collapsed', STATE.sidebarCollapsed);
  localStorage.setItem('tf_sidebar_collapsed', STATE.sidebarCollapsed);

  // Update aria-label
  EL.sidebarToggle.setAttribute(
    'aria-label',
    STATE.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
  );
}

function openMobileSidebar() {
  STATE.mobileSidebarOpen = true;
  EL.appShell.classList.add('mobile-open');
  EL.sidebarOverlay.style.display = 'block';
  EL.sidebar.setAttribute('aria-hidden', 'false');
  // Focus first nav item for accessibility
  const firstItem = EL.sidebar.querySelector('.sb-item');
  firstItem?.focus();
}

function closeMobileSidebar() {
  STATE.mobileSidebarOpen = false;
  EL.appShell.classList.remove('mobile-open');
  EL.sidebarOverlay.style.display = '';
  EL.sidebar.setAttribute('aria-hidden', 'true');
}

function highlightActiveNavItem() {
  const currentPage = location.pathname.split('/').pop() || 'dashboard.html';
  $$('.sb-item').forEach((item) => {
    const href = item.getAttribute('href') || '';
    const itemPage = href.split('/').pop();
    if (itemPage === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/* ═══════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════ */

function initTopbar() {
  // Close dropdowns when clicking outside
  document.addEventListener('click', handleGlobalClick);
  // Keyboard esc
  document.addEventListener('keydown', handleGlobalKeydown);
}

function handleGlobalClick(e) {
  // Close notification dropdown
  if (STATE.notifOpen && !EL.notifBtn?.closest('#notifWrap')?.contains(e.target)) {
    closeNotifDropdown();
  }
  // Close profile dropdown
  if (STATE.profileOpen && !EL.profileBtn?.closest('#profileWrap')?.contains(e.target)) {
    closeProfileDropdown();
  }
  // Close search results
  if (STATE.searchOpen) {
    const wrap = EL.searchInput?.closest('.topbar-search');
    if (wrap && !wrap.contains(e.target)) {
      closeSearchResults();
    }
  }
}

/* ═══════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════ */

// Sample data for client-side search
const SEARCH_DATA = [
  { type: 'task',    name: 'Implement JWT refresh token logic',  meta: 'Platform v3' },
  { type: 'task',    name: 'API rate limiting spec',             meta: 'API Gateway' },
  { type: 'task',    name: 'Sprint 43 retro doc',                meta: 'Platform v3' },
  { type: 'task',    name: 'Set up Datadog alerting',            meta: 'API Gateway' },
  { type: 'task',    name: 'Design tokens v2 review',            meta: 'Mobile App' },
  { type: 'project', name: 'Platform v3',                        meta: '34 tasks · Active' },
  { type: 'project', name: 'Mobile App',                         meta: '21 tasks · Review' },
  { type: 'project', name: 'API Gateway',                        meta: '18 tasks · On track' },
  { type: 'person',  name: 'Alex Dawson',                        meta: 'You · Pro plan' },
  { type: 'person',  name: 'Jamie Lee',                          meta: '9 tasks assigned' },
  { type: 'person',  name: 'Maya K.',                            meta: '7 tasks assigned' },
  { type: 'person',  name: 'Raj Patel',                          meta: '11 tasks assigned' },
];

const TYPE_ICONS = {
  task:    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.25"/><path d="M3.5 6l2 2 3-3.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  project: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.6"/><rect x="6.5" y="1" width="4.5" height="4.5" rx="1" fill="currentColor"/><rect x="1" y="6.5" width="4.5" height="4.5" rx="1" fill="currentColor"/><rect x="6.5" y="6.5" width="4.5" height="4.5" rx="1" fill="currentColor" opacity="0.6"/></svg>',
  person:  '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2.25" stroke="currentColor" stroke-width="1.25"/><path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
};

let searchResultsEl = null;

function initSearch() {
  if (!EL.searchInput) return;

  EL.searchInput.addEventListener('input', debounce(onSearchInput, 150));
  EL.searchInput.addEventListener('focus', () => {
    if (EL.searchInput.value.trim()) renderSearchResults(EL.searchInput.value.trim());
  });
  EL.searchInput.addEventListener('keydown', onSearchKeydown);

  // ⌘K / Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      EL.searchInput.focus();
      EL.searchInput.select();
    }
  });
}

function onSearchInput(e) {
  const q = e.target.value.trim();
  if (q.length === 0) {
    closeSearchResults();
    return;
  }
  renderSearchResults(q);
}

function onSearchKeydown(e) {
  if (!searchResultsEl) return;
  const items = [...searchResultsEl.querySelectorAll('.search-result-item')];
  const focused = searchResultsEl.querySelector('.search-result-item.focused');
  const idx = items.indexOf(focused);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const next = items[idx + 1] || items[0];
    setSearchFocus(items, next);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = items[idx - 1] || items[items.length - 1];
    setSearchFocus(items, prev);
  } else if (e.key === 'Enter' && focused) {
    focused.click();
  } else if (e.key === 'Escape') {
    closeSearchResults();
    EL.searchInput.blur();
  }
}

function setSearchFocus(items, target) {
  items.forEach((i) => i.classList.remove('focused'));
  target?.classList.add('focused');
  target?.scrollIntoView({ block: 'nearest' });
}

function renderSearchResults(query) {
  const q = query.toLowerCase();
  const results = SEARCH_DATA.filter(
    (d) => d.name.toLowerCase().includes(q) || d.meta.toLowerCase().includes(q)
  ).slice(0, 8);

  const wrap = EL.searchInput.closest('.topbar-search');
  if (!wrap) return;

  closeSearchResults();

  searchResultsEl = document.createElement('div');
  searchResultsEl.className = 'search-results-dropdown';
  searchResultsEl.setAttribute('role', 'listbox');

  if (results.length === 0) {
    searchResultsEl.innerHTML = `<div class="search-empty">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
  } else {
    // Group by type
    const groups = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });

    const typeLabels = { task: 'Tasks', project: 'Projects', person: 'People' };
    let html = '';
    for (const [type, items] of Object.entries(groups)) {
      html += `<div class="search-results-section-label">${typeLabels[type] || type}</div>`;
      items.forEach((item) => {
        const highlighted = highlightMatch(item.name, q);
        html += `
          <div class="search-result-item" role="option" tabindex="-1">
            <div class="search-result-icon">${TYPE_ICONS[type] || ''}</div>
            <div class="search-result-body">
              <div class="search-result-name">${highlighted}</div>
              <div class="search-result-meta">${escapeHtml(item.meta)}</div>
            </div>
            <span class="search-result-type">${typeLabels[type] || type}</span>
          </div>`;
      });
    }
    searchResultsEl.innerHTML = html;
  }

  wrap.appendChild(searchResultsEl);
  STATE.searchOpen = true;

  // Click handler
  searchResultsEl.querySelectorAll('.search-result-item').forEach((item) => {
    item.addEventListener('click', () => {
      showToast(`Navigating to "${item.querySelector('.search-result-name')?.textContent}"`, 'info');
      closeSearchResults();
      EL.searchInput.value = '';
    });
  });
}

function closeSearchResults() {
  searchResultsEl?.remove();
  searchResultsEl = null;
  STATE.searchOpen = false;
}

function highlightMatch(text, query) {
  const safe = escapeHtml(text);
  const safeQ = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${safeQ})`, 'gi'), '<mark style="background:var(--warning-light);color:var(--text);border-radius:2px">$1</mark>');
}

/* ═══════════════════════════════════════════
   NOTIFICATIONS DROPDOWN
═══════════════════════════════════════════ */

function initNotifications() {
  EL.notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNotifDropdown();
  });

  EL.markAllRead?.addEventListener('click', markAllNotificationsRead);
}

function toggleNotifDropdown() {
  if (STATE.notifOpen) {
    closeNotifDropdown();
  } else {
    closeProfileDropdown();
    openNotifDropdown();
  }
}

function openNotifDropdown() {
  STATE.notifOpen = true;
  EL.notifDropdown.style.display = 'block';
  EL.notifBtn.setAttribute('aria-expanded', 'true');
}

function closeNotifDropdown() {
  STATE.notifOpen = false;
  EL.notifDropdown.style.display = 'none';
  EL.notifBtn?.setAttribute('aria-expanded', 'false');
}

function markAllNotificationsRead() {
  const unreadItems = EL.notifList?.querySelectorAll('.notif-item.unread');
  unreadItems?.forEach((item) => {
    item.classList.add('marking-read');
    setTimeout(() => {
      item.classList.remove('unread', 'marking-read');
      const dot = item.querySelector('.notif-unread-dot');
      dot?.remove();
    }, 400);
  });

  STATE.unreadCount = 0;
  updateNotifBadge();
  showToast('All notifications marked as read', 'success');
}

function updateNotifBadge() {
  if (!EL.notifDot) return;
  if (STATE.unreadCount === 0) {
    EL.notifDot.classList.add('hidden');
  } else {
    EL.notifDot.classList.remove('hidden');
  }
}

/* ═══════════════════════════════════════════
   PROFILE DROPDOWN
═══════════════════════════════════════════ */

function initProfileDropdown() {
  EL.profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleProfileDropdown();
  });
}

function toggleProfileDropdown() {
  if (STATE.profileOpen) {
    closeProfileDropdown();
  } else {
    closeNotifDropdown();
    openProfileDropdown();
  }
}

function openProfileDropdown() {
  STATE.profileOpen = true;
  EL.profileDropdown.style.display = 'block';
  EL.profileBtn.setAttribute('aria-expanded', 'true');
}

function closeProfileDropdown() {
  STATE.profileOpen = false;
  EL.profileDropdown.style.display = 'none';
  EL.profileBtn?.setAttribute('aria-expanded', 'false');
}

/* ═══════════════════════════════════════════
   CREATE MODAL
═══════════════════════════════════════════ */

function initCreateModal() {
  EL.createBtn?.addEventListener('click', openCreateModal);
  EL.closeCreateModal?.addEventListener('click', closeCreateModal);

  EL.createModal?.addEventListener('click', (e) => {
    if (e.target === EL.createModal) closeCreateModal();
  });
}

function openCreateModal() {
  EL.createModal.style.display = 'flex';
  STATE.createModalOpen = true;
  EL.createModal.setAttribute('aria-hidden', 'false');
  // Focus close button
  setTimeout(() => EL.closeCreateModal?.focus(), 50);
}

function closeCreateModal() {
  EL.createModal.style.display = 'none';
  STATE.createModalOpen = false;
  EL.createModal.setAttribute('aria-hidden', 'true');
  EL.createBtn?.focus();
}

/* ═══════════════════════════════════════════
   TASK LIST — filter, check, add
═══════════════════════════════════════════ */

function initTaskList() {
  // Filter tabs
  EL.taskFilterTabs?.addEventListener('click', (e) => {
    const pill = e.target.closest('.tab-pill');
    if (!pill) return;
    const filter = pill.dataset.filter;
    setTaskFilter(filter);
  });

  // Task check buttons
  EL.taskList?.addEventListener('click', (e) => {
    const checkBtn = e.target.closest('.task-check-btn');
    if (checkBtn) {
      toggleTaskComplete(checkBtn);
      return;
    }
  });

  // Add task button
  EL.addTaskBtn?.addEventListener('click', () => {
    showToast('Task creation coming soon — use the New button above', 'info');
  });
}

function setTaskFilter(filter) {
  STATE.activeTaskFilter = filter;

  // Update tab UI
  $$('.tab-pill', EL.taskFilterTabs).forEach((pill) => {
    pill.classList.toggle('active', pill.dataset.filter === filter);
  });

  // Show/hide task rows
  const rows = $$('.task-row', EL.taskList);
  rows.forEach((row) => {
    const status = row.dataset.status || 'all';
    const visible = filter === 'all' || status === filter || row.classList.contains('completed');
    row.style.display = visible ? '' : 'none';
  });
}

function toggleTaskComplete(checkBtn) {
  const row = checkBtn.closest('.task-row');
  if (!row) return;

  const isDone = checkBtn.classList.contains('done');

  if (!isDone) {
    checkBtn.classList.add('done');
    row.classList.add('completed');

    // Animate checkmark appearance
    checkBtn.innerHTML = `<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4l3 3 5-6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    const taskName = row.querySelector('.task-name')?.textContent?.trim() || 'Task';
    showToast(`"${truncate(taskName, 40)}" marked complete`, 'success');

    // Re-apply current filter after short delay
    setTimeout(() => setTaskFilter(STATE.activeTaskFilter), 600);
  } else {
    checkBtn.classList.remove('done');
    row.classList.remove('completed');
    checkBtn.innerHTML = '<span class="task-check-circle"></span>';
  }
}

/* ═══════════════════════════════════════════
   PROGRESS BARS — animate on load
═══════════════════════════════════════════ */

function initProgressBars() {
  // Use IntersectionObserver for performance
  const bars = $$('[data-width]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Small delay to ensure transition is visible after paint
          requestAnimationFrame(() => {
            setTimeout(() => {
              el.style.width = el.dataset.width;
            }, 120);
          });
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ═══════════════════════════════════════════
   VELOCITY CHART — rendered by JS
═══════════════════════════════════════════ */

const VELOCITY_DATA = [
  { label: 'S37', value: 28, current: false },
  { label: 'S38', value: 32, current: false },
  { label: 'S39', value: 24, current: false },
  { label: 'S40', value: 37, current: false },
  { label: 'S41', value: 41, current: false },
  { label: 'S42', value: 35, current: false },
  { label: 'S43', value: 40, current: true  },
];

function initVelocityChart() {
  if (!EL.velocityChart || !EL.velocityLabels) return;

  const maxVal = Math.max(...VELOCITY_DATA.map((d) => d.value));

  // Build bars
  let barsHtml = '';
  VELOCITY_DATA.forEach((d) => {
    const pct = Math.round((d.value / maxVal) * 100);
    const cls = d.current ? 'current' : 'prev';
    barsHtml += `
      <div class="velocity-bar-wrap" title="${d.label}: ${d.value} tasks" style="height:100%">
        <div class="velocity-bar ${cls}"
             style="height:0%; width:100%"
             data-height="${pct}%"
             aria-label="${d.label}: ${d.value} tasks completed"
        ></div>
      </div>`;
  });
  EL.velocityChart.innerHTML = barsHtml;

  // Build labels
  EL.velocityLabels.innerHTML = VELOCITY_DATA
    .map((d) => `<span class="velocity-label">${d.label}</span>`)
    .join('');

  // Animate bars after paint
  requestAnimationFrame(() => {
    setTimeout(() => {
      $$('.velocity-bar', EL.velocityChart).forEach((bar) => {
        bar.style.transition = 'height 600ms cubic-bezier(0.34,1.2,0.64,1)';
        bar.style.height = bar.dataset.height;
      });
    }, 300);
  });
}

/* ═══════════════════════════════════════════
   STAT CARD COUNTERS — animated number roll
═══════════════════════════════════════════ */

function initStatCounters() {
  const values = $$('.stat-card-value[data-target]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  values.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 900;
  const startTime = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
═══════════════════════════════════════════ */

function initKeyboard() {
  document.addEventListener('keydown', handleGlobalKeydown);
}

function handleGlobalKeydown(e) {
  // Escape key
  if (e.key === 'Escape') {
    if (STATE.createModalOpen) { closeCreateModal(); return; }
    if (STATE.notifOpen)       { closeNotifDropdown(); return; }
    if (STATE.profileOpen)     { closeProfileDropdown(); return; }
    if (STATE.mobileSidebarOpen) { closeMobileSidebar(); return; }
  }

  // Tab trap inside create modal
  if (STATE.createModalOpen && EL.createModal) {
    trapFocus(e, EL.createModal);
  }
}

function trapFocus(e, container) {
  if (e.key !== 'Tab') return;
  const focusable = [...container.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter((el) => !el.closest('[aria-hidden="true"]'));

  if (focusable.length === 0) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
}

/* ═══════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════ */

let toastContainer = null;

function createToastContainer() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('role', 'region');
  toastContainer.setAttribute('aria-label', 'Notifications');
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'info'|'warning'|'error'} type
 * @param {number} duration - ms before auto-dismiss (default 3500)
 */
function showToast(message, type = 'info', duration = 3500) {
  if (!toastContainer) createToastContainer();

  const ICONS = {
    success: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info:    '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="3.5" r=".75" fill="#fff"/><path d="M5 5.5v2.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
    warning: '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v3.5M5 7.5v.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
    error:   '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
    <div class="toast-message">${escapeHtml(message)}</div>
    <button class="toast-close" aria-label="Dismiss notification">×</button>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;

  toastContainer.appendChild(toast);

  // Dismiss on close button
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  // Auto-dismiss
  const timer = setTimeout(() => dismissToast(toast), duration);

  // Pause progress on hover
  toast.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    toast.querySelector('.toast-progress').style.animationPlayState = 'paused';
  });

  return toast;
}

function dismissToast(toast) {
  if (!toast.parentNode) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

/* ═══════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════ */

/**
 * Debounce — delays fn execution until after wait ms of inactivity
 */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Escape HTML to prevent XSS in dynamically rendered content
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Truncate a string to maxLen characters, appending "…"
 */
function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}