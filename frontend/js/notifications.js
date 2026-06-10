/**
 * TaskFlow Design System — Notification Center Actions Controller
 */

// Initial Seed Database representing all required Notification Types
let mockNotifications = [
  {
    id: 'nt-1',
    type: 'assigned',
    user: 'Sarah Jenkins',
    actionText: 'assigned you to the task',
    targetText: 'Design Mobile Onboarding Flow',
    targetLink: '#',
    project: 'Mobile App',
    projectColor: '#7C3AED',
    time: '12 minutes ago',
    dateGroup: 'Today',
    unread: true
  },
  {
    id: 'nt-2',
    type: 'completed',
    user: 'Michael Chen',
    actionText: 'completed the task',
    targetText: 'Setup OAuth2 Authentication Middleware',
    targetLink: '#',
    project: 'API Gateway',
    projectColor: '#0891B2',
    time: '2 hours ago',
    dateGroup: 'Today',
    unread: true
  },
  {
    id: 'nt-3',
    type: 'comment',
    user: 'David Miller',
    actionText: 'left a comment on your design spec',
    targetText: 'Database Schema Review v2',
    targetLink: '#',
    bodyText: '"We should look into adding a structured composite index on the tenant_id column to optimize querying performance across large data sets workflow grids."',
    project: 'Platform v3',
    projectColor: '#2563EB',
    time: 'Yesterday at 4:15 PM',
    dateGroup: 'Yesterday',
    unread: false
  },
  {
    id: 'nt-4',
    type: 'invitation',
    user: 'Acme Growth Team',
    actionText: 'invited you to join the private channel',
    targetText: 'Marketing Funnel Optimization & Analytics',
    targetLink: '#',
    bodyText: 'Collaborate with growth marketers and engineering pods to track core registration flow conversion performance parameters.',
    project: 'Workspace Integration',
    projectColor: '#F59E0B',
    time: '2 days ago',
    dateGroup: 'Earlier this week',
    unread: false
  },
  {
    id: 'nt-5',
    type: 'update',
    user: 'System DevOps',
    actionText: 'updated the status of project',
    targetText: 'Platform v3 Core Deployment Pipeline',
    targetLink: '#',
    bodyText: 'Project lifecycle status shifted automatically from "In Review" status to "Completed" following successful continuous deployment run sequence.',
    project: 'Platform v3',
    projectColor: '#2563EB',
    time: '4 days ago',
    dateGroup: 'Earlier this week',
    unread: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Layout Controls
  setupAppShellToggles();
  
  // Notification System Context Engine
  initNotificationEngine();
});

/**
 * Structural Shell Framework Event Handlers
 */
function setupAppShellToggles() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const appShell = document.getElementById('appShell');

  if (sidebarToggle && sidebar && appShell) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      appShell.classList.toggle('sidebar-collapsed');
    });
  }
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

/**
 * Notifications Central Management Engine Code
 */
function initNotificationEngine() {
  const timelineContainer = document.getElementById('notifTimelineContainer');
  const filterButtons = document.querySelectorAll('.notif-filter-btn');
  const markAllReadBtn = document.getElementById('markAllReadBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  let currentFilter = 'all';

  // Render initialization loop
  render();

  // Tab Filtering Click Hooks
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      const activeTab = e.currentTarget;
      activeTab.classList.add('active');
      currentFilter = activeTab.getAttribute('data-filter');
      render();
    });
  });

  // Action: Mark All as Read
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      mockNotifications.forEach(n => n.unread = false);
      render();
    });
  }

  // Action: Clear All Notifications completely
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      // Clear corresponding to currently visible filter context list
      if (currentFilter === 'all') {
        mockNotifications = [];
      } else if (currentFilter === 'unread') {
        mockNotifications = mockNotifications.filter(n => !n.unread);
      } else if (currentFilter === 'read') {
        mockNotifications = mockNotifications.filter(n => n.unread);
      }
      render();
    });
  }

  /**
   * Evaluates UI node lists and injects content rows dynamically
   */
  function render() {
    updateCounts();

    let targetList = mockNotifications;
    if (currentFilter === 'unread') {
      targetList = mockNotifications.filter(n => n.unread);
    } else if (currentFilter === 'read') {
      targetList = mockNotifications.filter(n => !n.unread);
    }

    // Handle Empty Array State
    if (targetList.length === 0) {
      timelineContainer.innerHTML = `
        <div class="notif-empty">
          <div class="notif-empty-icon">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 11V7a6 6 0 0 0-12 0v4L1 13h14l-1-2zM8 15a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div class="notif-empty-title">All caught up!</div>
          <p>No notifications found in this segment section view.</p>
        </div>
      `;
      return;
    }

    let dynamicHtml = '';
    let lastRenderedDateGroup = '';

    targetList.forEach(item => {
      // Section title injection logic on dates
      if (item.dateGroup !== lastRenderedDateGroup) {
        lastRenderedDateGroup = item.dateGroup;
        dynamicHtml += `<div class="notif-group-title">${lastRenderedDateGroup}</div>`;
      }

      const unreadClass = item.unread ? 'unread' : '';
      const iconMarkup = getIconByNotificationType(item.type);
      
      const actionButtonMarkup = item.unread ? `
        <button class="notif-action-btn action-read" data-id="${item.id}" title="Mark as read">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l4 4 8-8"/></svg>
        </button>
      ` : '';

      dynamicHtml += `
        <div class="notif-item ${unreadClass}" data-id="${item.id}">
          <div class="notif-node"></div>
          <div class="notif-icon-wrapper notif-type-${item.type}">
            ${iconMarkup}
          </div>
          <div class="notif-content">
            <div class="notif-title">
              <strong>${item.user}</strong> ${item.actionText} <a href="${item.targetLink}">${item.targetText}</a>
            </div>
            ${item.bodyText ? `<div class="notif-body">${item.bodyText}</div>` : ''}
            <div class="notif-meta">
              <span class="notif-project-badge">
                <span class="notif-project-dot" style="background: ${item.projectColor}"></span>
                ${item.project}
              </span>
              <span class="notif-sep">•</span>
              <span class="notif-time">${item.time}</span>
            </div>
          </div>
          <div class="notif-actions">
            ${actionButtonMarkup}
            <button class="notif-action-btn delete action-delete" data-id="${item.id}" title="Delete notification">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h11M4.5 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4M6 6.5v4M10 6.5v4"/></svg>
            </button>
          </div>
        </div>
      `;
    });

    timelineContainer.innerHTML = dynamicHtml;
    bindItemRowButtons();
  }

  /**
   * Binds click triggers securely to individual row items inside container template
   */
  function bindItemRowButtons() {
    // Individual Mark Read Action
    timelineContainer.querySelectorAll('.action-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const entity = mockNotifications.find(n => n.id === id);
        if (entity) {
          entity.unread = false;
          render();
        }
      });
    });

    // Individual Delete Row Item (With Animation Engine Handlers)
    timelineContainer.querySelectorAll('.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const targetRowElement = e.currentTarget.closest('.notif-item');
        
        if (targetRowElement) {
          targetRowElement.classList.add('fade-out');
          // Wait briefly for CSS transition duration before execution splice
          setTimeout(() => {
            mockNotifications = mockNotifications.filter(n => n.id !== id);
            render();
          }, 200);
        }
      });
    });
  }

  /**
   * Synchronizes internal status element count arrays across headers and filter navigation elements
   */
  function updateCounts() {
    const totalAll = mockNotifications.length;
    const totalUnread = mockNotifications.filter(n => n.unread).length;
    const totalRead = totalAll - totalUnread;

    // Badges counters
    const cAll = document.getElementById('countAll');
    const cUnread = document.getElementById('countUnread');
    const cRead = document.getElementById('countRead');
    const topbarBadge = document.getElementById('topbarNotifBadge');

    if (cAll) cAll.textContent = totalAll;
    if (cUnread) cUnread.textContent = totalUnread;
    if (cRead) cRead.textContent = totalRead;

    // Synchronize Topbar Global Indicator Badge State
    if (topbarBadge) {
      if (totalUnread > 0) {
        topbarBadge.style.display = 'inline-flex';
        topbarBadge.textContent = totalUnread;
      } else {
        topbarBadge.style.display = 'none';
      }
    }
  }

  /**
   * Crisp 16x16 SVG Icon Matrix map matching design specification tokens
   */
  function getIconByNotificationType(type) {
    switch (type) {
      case 'assigned':
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14v-1a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13.5 4.5v3M15 6h-3"/></svg>`;
      case 'completed':
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8A6 6 0 1 1 8 2a6 6 0 0 1 4.5 2.05L8 9 6 7"/></svg>`;
      case 'comment':
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 10a1.5 1.5 0 0 1-1.5 1.5H4.5L1.5 14V3.5A1.5 1.5 0 0 1 3 2h9.5A1.5 1.5 0 0 1 14 3.5V10z"/></svg>`;
      case 'invitation':
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M14.5 4.5L8 9 1.5 4.5"/></svg>`;
      case 'update':
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 4.5L8 1.5l6.5 3L8 7.5l-6.5-3zM1.5 8l6.5 3 6.5-3M1.5 11.5l6.5 3 6.5-3"/></svg>`;
      default:
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/></svg>`;
    }
  }
}