/* ============================================
   TASKS.JS — TaskFlow Task Management
   ============================================ */

'use strict';

// ============================================
// DATA
// ============================================

const ASSIGNEES = {
  jd: { initials: 'JD', name: 'James Doe',  color: '#2563EB' },
  sk: { initials: 'SK', name: 'Sarah Kim',   color: '#7C3AED' },
  al: { initials: 'AL', name: 'Alex Lee',    color: '#059669' },
  mr: { initials: 'MR', name: 'Maria Ruiz',  color: '#D97706' },
  tc: { initials: 'TC', name: 'Tom Chen',    color: '#DC2626' },
};

const PROJECTS = {
  platform: { name: 'Platform v3',    color: '#2563EB' },
  mobile:   { name: 'Mobile App',     color: '#7C3AED' },
  api:      { name: 'API Overhaul',   color: '#059669' },
  design:   { name: 'Design System',  color: '#D97706' },
  infra:    { name: 'Infrastructure', color: '#DC2626' },
};

const SEED_TASKS = [
  { id:'TF-001', name:'Redesign authentication flow',            project:'platform', assignee:'jd', priority:'high',     status:'completed', due:'2025-06-05', estimate:8,  created:'2025-05-20', desc:'Overhaul the login, registration, and password-reset flows to match the new design system.'},
  { id:'TF-002', name:'API rate limiting implementation',         project:'api',      assignee:'sk', priority:'critical', status:'completed', due:'2025-06-07', estimate:12, created:'2025-05-21', desc:'Implement per-endpoint rate limiting using token buckets. Document limits in API reference.'},
  { id:'TF-003', name:'Dashboard performance audit',             project:'platform', assignee:'al', priority:'medium',   status:'inprogress', due:'2025-06-18', estimate:6,  created:'2025-05-22', desc:'Profile the main dashboard and fix any render bottlenecks. Target < 1s LCP.'},
  { id:'TF-004', name:'Mobile push notifications',               project:'mobile',   assignee:'jd', priority:'high',     status:'review',     due:'2025-06-15', estimate:10, created:'2025-05-23', desc:'Integrate FCM and APNs. Handle token refresh, deep links, and quiet hours settings.'},
  { id:'TF-005', name:'SAML SSO implementation',                 project:'infra',    assignee:'sk', priority:'critical', status:'review',     due:'2025-06-20', estimate:16, created:'2025-05-24', desc:'Support SAML 2.0 SP-initiated and IdP-initiated flows. Tested with Okta and Azure AD.'},
  { id:'TF-006', name:'Billing integration testing',             project:'platform', assignee:'al', priority:'medium',   status:'inprogress', due:'2025-06-22', estimate:5,  created:'2025-05-25', desc:'Write integration tests for Stripe webhook handling, proration, and failed-payment retry.'},
  { id:'TF-007', name:'User onboarding checklist',               project:'platform', assignee:'mr', priority:'low',      status:'todo',       due:'2025-06-28', estimate:4,  created:'2025-05-26', desc:'Build the interactive onboarding checklist that fires on first login for new workspaces.'},
  { id:'TF-008', name:'API documentation update',                project:'api',      assignee:'sk', priority:'low',      status:'todo',       due:'2025-06-30', estimate:3,  created:'2025-05-27', desc:'Update OpenAPI spec and regenerate reference docs. Add code samples for top 10 endpoints.'},
  { id:'TF-009', name:'Email notification templates',            project:'platform', assignee:'mr', priority:'medium',   status:'todo',       due:'2025-07-02', estimate:6,  created:'2025-05-28', desc:'Create responsive HTML email templates for task assignments, mentions, and digest emails.'},
  { id:'TF-010', name:'Search indexing overhaul',                project:'api',      assignee:'tc', priority:'high',     status:'inprogress', due:'2025-06-25', estimate:14, created:'2025-05-29', desc:'Replace naive full-scan search with Elasticsearch. Tasks, projects, and comments should be indexed.'},
  { id:'TF-011', name:'Design token migration',                  project:'design',   assignee:'mr', priority:'medium',   status:'inprogress', due:'2025-06-19', estimate:8,  created:'2025-05-30', desc:'Migrate all hardcoded color values to CSS variables from the new design token spec.'},
  { id:'TF-012', name:'Kanban board drag-and-drop',              project:'platform', assignee:'al', priority:'high',     status:'completed',  due:'2025-06-10', estimate:10, created:'2025-06-01', desc:'Implement smooth native drag-and-drop across columns with optimistic UI updates.'},
  { id:'TF-013', name:'Infrastructure cost review',              project:'infra',    assignee:'tc', priority:'medium',   status:'todo',       due:'2025-07-05', estimate:3,  created:'2025-06-01', desc:'Audit AWS spend and identify savings opportunities. Target 20% reduction in monthly bill.'},
  { id:'TF-014', name:'Two-factor authentication',               project:'infra',    assignee:'sk', priority:'critical', status:'completed',  due:'2025-06-08', estimate:8,  created:'2025-06-02', desc:'Add TOTP-based 2FA with backup codes. Enforce 2FA for enterprise workspaces.'},
  { id:'TF-015', name:'Component library storybook',             project:'design',   assignee:'mr', priority:'low',      status:'review',     due:'2025-06-24', estimate:12, created:'2025-06-02', desc:'Document all shared components in Storybook with usage examples and prop tables.'},
  { id:'TF-016', name:'File upload service',                     project:'api',      assignee:'tc', priority:'medium',   status:'todo',       due:'2025-07-08', estimate:9,  created:'2025-06-03', desc:'Build a signed-URL upload service backed by S3. Support multipart uploads up to 5GB.'},
  { id:'TF-017', name:'Analytics event pipeline',                project:'infra',    assignee:'al', priority:'high',     status:'inprogress', due:'2025-06-26', estimate:11, created:'2025-06-03', desc:'Build Kafka-based event pipeline to feed the analytics dashboard with real-time task events.'},
  { id:'TF-018', name:'Billing invoice PDF export',              project:'platform', assignee:'jd', priority:'low',      status:'todo',       due:'2025-07-10', estimate:4,  created:'2025-06-04', desc:'Generate printable PDF invoices for Pro and Enterprise plans on demand and via monthly email.'},
  { id:'TF-019', name:'GitHub integration webhooks',             project:'api',      assignee:'tc', priority:'high',     status:'completed',  due:'2025-06-12', estimate:7,  created:'2025-06-04', desc:'Receive GitHub push, PR, and deployment events and auto-link to TaskFlow tasks via branch names.'},
  { id:'TF-020', name:'Dark mode implementation',                project:'design',   assignee:'mr', priority:'medium',   status:'todo',       due:'2025-07-12', estimate:10, created:'2025-06-05', desc:'Implement full dark mode using CSS variables. Persist preference to user profile.'},
  { id:'TF-021', name:'Workspace audit log',                     project:'infra',    assignee:'sk', priority:'critical', status:'inprogress', due:'2025-06-21', estimate:9,  created:'2025-06-05', desc:'Record all admin actions and sensitive data access to an immutable audit log. Required for SOC 2.'},
  { id:'TF-022', name:'Calendar sync integration',               project:'platform', assignee:'jd', priority:'medium',   status:'review',     due:'2025-06-27', estimate:8,  created:'2025-06-06', desc:'Sync task due dates with Google Calendar and Outlook via CalDAV. Two-way sync where supported.'},
  { id:'TF-023', name:'Keyboard shortcuts system',               project:'platform', assignee:'al', priority:'low',      status:'todo',       due:'2025-07-15', estimate:5,  created:'2025-06-07', desc:'Implement a global shortcut system (⌘K palette, navigation shortcuts). Display shortcut hints in UI.'},
  { id:'TF-024', name:'Custom webhook builder',                  project:'api',      assignee:'tc', priority:'high',     status:'todo',       due:'2025-07-18', estimate:13, created:'2025-06-07', desc:'Let users configure outbound webhooks for task events with custom payload templates and retry logic.'},
];

// ============================================
// STATE
// ============================================

const state = {
  tasks: SEED_TASKS.map(t => ({ ...t })),
  filteredTasks: [],
  selectedIds: new Set(),
  currentPage: 1,
  perPage: 20,
  sortField: 'default',
  sortDir: 'asc',
  searchQuery: '',
  filters: { status: [], priority: [], assignee: [] },
  view: 'table',
  editingId: null,
  deletingId: null,
  drawerTaskId: null,
};

// ============================================
// DOM REFERENCES
// ============================================

const $ = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);

const dom = {
  taskTableBody:  $('taskTableBody'),
  cardView:       $('cardView'),
  tableView:      $('tableView'),
  emptyState:     $('emptyState'),
  taskSearch:     $('taskSearch'),
  searchClear:    $('searchClear'),
  sortSelect:     $('sortSelect'),
  viewTable:      $('viewTable'),
  viewCards:      $('viewCards'),
  resultsCount:   $('resultsCount'),
  filterChips:    $('filterChips'),
  clearFilters:   $('clearFilters'),
  pagination:     $('pagination'),
  paginationInfo: $('paginationInfo'),
  pageNumbers:    $('pageNumbers'),
  prevPage:       $('prevPage'),
  nextPage:       $('nextPage'),
  selectAll:      $('selectAll'),
  tableSelectAll: $('tableSelectAll'),

  // Stats
  statTotal:      $('statTotal'),
  statInProgress: $('statInProgress'),
  statReview:     $('statReview'),
  statCompleted:  $('statCompleted'),
  statCritical:   $('statCritical'),

  // Create/Edit modal
  taskModal:      $('taskModal'),
  modalTitle:     $('modalTitle'),
  modalClose:     $('modalClose'),
  modalCancel:    $('modalCancel'),
  modalSave:      $('modalSave'),
  taskForm:       $('taskForm'),
  taskName:       $('taskName'),
  taskNameError:  $('taskNameError'),
  taskDesc:       $('taskDesc'),
  taskProject:    $('taskProject'),
  taskAssignee:   $('taskAssignee'),
  taskPriority:   $('taskPriority'),
  taskStatus:     $('taskStatus'),
  taskDue:        $('taskDue'),
  taskEstimate:   $('taskEstimate'),

  // Delete modal
  deleteModal:    $('deleteModal'),
  deleteModalClose:$('deleteModalClose'),
  deleteTaskName: $('deleteTaskName'),
  deleteCancelBtn:$('deleteCancelBtn'),
  deleteConfirmBtn:$('deleteConfirmBtn'),

  // Drawer
  drawerOverlay:  $('drawerOverlay'),
  taskDrawer:     $('taskDrawer'),
  drawerClose:    $('drawerClose'),
  drawerEditBtn:  $('drawerEditBtn'),
  drawerTaskId:   $('drawerTaskId'),
  drawerTaskName: $('drawerTaskName'),
  drawerStatus:   $('drawerStatus'),
  drawerPriority: $('drawerPriority'),
  drawerAssignee: $('drawerAssignee'),
  drawerDue:      $('drawerDue'),
  drawerProject:  $('drawerProject'),
  drawerEstimate: $('drawerEstimate'),
  drawerDesc:     $('drawerDesc'),
  drawerActivity: $('drawerActivity'),
  activityInput:  $('activityInput'),
  activitySubmit: $('activitySubmit'),

  // Sidebar
  sidebar:         $('sidebar'),
  sidebarCollapse: $('sidebarCollapse'),
  mobileMenuBtn:   $('mobileMenuBtn'),

  createTaskBtn:  $('createTaskBtn'),
  exportBtn:      $('exportBtn'),
  emptyResetBtn:  $('emptyResetBtn'),
  toastContainer: $('toastContainer'),
};

// ============================================
// HELPERS
// ============================================

function generateId() {
  const nums = state.tasks.map(t => parseInt(t.id.replace('TF-',''),10));
  const next = Math.max(...nums) + 1;
  return `TF-${String(next).padStart(3,'0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function dueDateClass(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  now.setHours(0,0,0,0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((due - now) / 86400000);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff <= 3) return 'soon';
  return '';
}

function avatarHTML(assigneeKey, size = 'sm') {
  if (!assigneeKey || !ASSIGNEES[assigneeKey]) {
    return `<span class="unassigned-label">Unassigned</span>`;
  }
  const a = ASSIGNEES[assigneeKey];
  return `<div class="user-avatar-sm" style="background:${a.color}">${a.initials}</div>`;
}

function priorityBadgeHTML(priority) {
  const map = {
    critical: 'Critical',
    high:     'High',
    medium:   'Medium',
    low:      'Low',
  };
  return `<span class="priority-badge ${priority}"><span class="dot"></span>${map[priority] || priority}</span>`;
}

function statusBadgeHTML(status) {
  const map = {
    todo:       'To Do',
    inprogress: 'In Progress',
    review:     'Review',
    completed:  'Completed',
  };
  return `<span class="status-badge ${status}"><span class="dot"></span>${map[status] || status}</span>`;
}

function projectTagHTML(projectKey) {
  const p = PROJECTS[projectKey];
  if (!p) return `<span class="project-tag">—</span>`;
  return `<span class="project-tag"><span class="project-dot" style="background:${p.color}"></span>${p.name}</span>`;
}

// ============================================
// FILTER & SORT
// ============================================

function applyFiltersAndSort() {
  let tasks = [...state.tasks];

  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    tasks = tasks.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      (PROJECTS[t.project]?.name || '').toLowerCase().includes(q) ||
      (ASSIGNEES[t.assignee]?.name || '').toLowerCase().includes(q)
    );
  }

  // Status filter
  if (state.filters.status.length) {
    tasks = tasks.filter(t => state.filters.status.includes(t.status));
  }

  // Priority filter
  if (state.filters.priority.length) {
    tasks = tasks.filter(t => state.filters.priority.includes(t.priority));
  }

  // Assignee filter
  if (state.filters.assignee.length) {
    tasks = tasks.filter(t => state.filters.assignee.includes(t.assignee));
  }

  // Sort
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const statusOrder   = { inprogress: 0, review: 1, todo: 2, completed: 3 };

  if (state.sortField !== 'default') {
    tasks.sort((a, b) => {
      let va, vb;
      switch (state.sortField) {
        case 'name':     va = a.name.toLowerCase(); vb = b.name.toLowerCase(); break;
        case 'priority': va = priorityOrder[a.priority] ?? 9; vb = priorityOrder[b.priority] ?? 9; break;
        case 'status':   va = statusOrder[a.status] ?? 9;     vb = statusOrder[b.status] ?? 9;     break;
        case 'duedate':  va = a.due || '9999'; vb = b.due || '9999'; break;
        case 'created':  va = a.created || ''; vb = b.created || ''; break;
        default: return 0;
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return state.sortDir === 'desc' ? -cmp : cmp;
    });
  }

  state.filteredTasks = tasks;
  updateStats();
  updateResultsMeta();
  updateFilterChips();
  renderCurrentPage();
  renderPagination();
}

// ============================================
// STATS
// ============================================

function updateStats() {
  dom.statTotal.textContent      = state.tasks.length;
  dom.statInProgress.textContent = state.tasks.filter(t => t.status === 'inprogress').length;
  dom.statReview.textContent     = state.tasks.filter(t => t.status === 'review').length;
  dom.statCompleted.textContent  = state.tasks.filter(t => t.status === 'completed').length;
  dom.statCritical.textContent   = state.tasks.filter(t => t.priority === 'critical').length;
}

// ============================================
// RESULTS META
// ============================================

function updateResultsMeta() {
  const n = state.filteredTasks.length;
  dom.resultsCount.textContent = n === 1 ? 'Showing 1 task' : `Showing ${n} tasks`;
}

// ============================================
// FILTER CHIPS
// ============================================

function updateFilterChips() {
  const hasFilters = state.filters.status.length ||
                     state.filters.priority.length ||
                     state.filters.assignee.length ||
                     state.searchQuery;

  dom.clearFilters.classList.toggle('hidden', !hasFilters);
  dom.filterChips.classList.toggle('hidden', !hasFilters);

  if (!hasFilters) { dom.filterChips.innerHTML = ''; return; }

  const chips = [];

  const labelMap = {
    todo:'To Do', inprogress:'In Progress', review:'Review', completed:'Completed',
    critical:'Critical', high:'High', medium:'Medium', low:'Low',
  };

  state.filters.status.forEach(v => {
    chips.push({ type:'status', value:v, label:`Status: ${labelMap[v]}` });
  });
  state.filters.priority.forEach(v => {
    chips.push({ type:'priority', value:v, label:`Priority: ${labelMap[v]}` });
  });
  state.filters.assignee.forEach(v => {
    chips.push({ type:'assignee', value:v, label:`Assignee: ${ASSIGNEES[v]?.name || v}` });
  });
  if (state.searchQuery) {
    chips.push({ type:'search', value:'', label:`"${state.searchQuery}"` });
  }

  dom.filterChips.innerHTML = chips.map(c => `
    <span class="filter-chip" data-type="${c.type}" data-value="${c.value}">
      ${c.label}
      <button class="chip-remove" aria-label="Remove filter">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </span>
  `).join('');

  dom.filterChips.querySelectorAll('.chip-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const chip = btn.closest('.filter-chip');
      const { type, value } = chip.dataset;
      if (type === 'search') {
        state.searchQuery = '';
        dom.taskSearch.value = '';
        dom.searchClear.classList.add('hidden');
      } else {
        state.filters[type] = state.filters[type].filter(v => v !== value);
        // uncheck in menu
        const cb = document.querySelector(`#${type}Filter input[value="${value}"]`);
        if (cb) cb.checked = false;
      }
      updateFilterButtonStates();
      state.currentPage = 1;
      applyFiltersAndSort();
    });
  });
}

function updateFilterButtonStates() {
  ['status','priority','assignee'].forEach(type => {
    const btn = document.querySelector(`#${type}Filter .filter-btn`);
    if (btn) btn.classList.toggle('active', state.filters[type].length > 0);
  });
}

// ============================================
// RENDER
// ============================================

function renderCurrentPage() {
  const start = (state.currentPage - 1) * state.perPage;
  const page  = state.filteredTasks.slice(start, start + state.perPage);

  const isEmpty = state.filteredTasks.length === 0;
  dom.emptyState.classList.toggle('hidden', !isEmpty);

  if (state.view === 'table') {
    renderTable(page);
  } else {
    renderCards(page);
  }
}

// ---------- TABLE ----------

function renderTable(tasks) {
  if (!tasks.length) {
    dom.taskTableBody.innerHTML = '';
    return;
  }

  dom.taskTableBody.innerHTML = tasks.map(task => {
    const isSelected = state.selectedIds.has(task.id);
    const isDone = task.status === 'completed';
    const a = task.assignee ? ASSIGNEES[task.assignee] : null;
    const dClass = dueDateClass(task.due);

    return `
      <tr data-id="${task.id}" class="${isSelected ? 'selected' : ''}">
        <td class="col-check">
          <div class="td-inner">
            <input type="checkbox" class="row-checkbox" data-id="${task.id}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation()" />
          </div>
        </td>
        <td class="col-task">
          <div class="td-inner" style="gap:10px">
            <div class="task-check-icon ${isDone ? 'done' : task.status === 'inprogress' ? 'in-progress' : ''}">
              ${isDone ? `<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
              ${task.status === 'inprogress' && !isDone ? `<div style="width:6px;height:6px;border-radius:50%;background:var(--primary)"></div>` : ''}
            </div>
            <div class="task-cell-content">
              <span class="task-cell-name ${isDone ? 'completed-text' : ''}">${escHtml(task.name)}</span>
              <span class="task-cell-id">#${task.id}</span>
            </div>
          </div>
        </td>
        <td class="col-project">
          <div class="td-inner">${projectTagHTML(task.project)}</div>
        </td>
        <td class="col-assignee">
          <div class="td-inner">
            <div class="assignee-cell">
              ${avatarHTML(task.assignee)}
              ${a ? `<span class="assignee-name">${a.name.split(' ')[0]}</span>` : '<span class="unassigned-label">—</span>'}
            </div>
          </div>
        </td>
        <td class="col-priority">
          <div class="td-inner">${priorityBadgeHTML(task.priority)}</div>
        </td>
        <td class="col-status">
          <div class="td-inner">${statusBadgeHTML(task.status)}</div>
        </td>
        <td class="col-due">
          <div class="td-inner">
            <span class="due-date ${dClass}">${formatDate(task.due)}</span>
          </div>
        </td>
        <td class="col-actions">
          <div class="td-inner">
            <div class="row-actions">
              <button class="row-action-btn" title="Edit task" onclick="event.stopPropagation();openEditModal('${task.id}')">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 2l2 2L4.5 10.5H2.5v-2L9 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
              </button>
              <button class="row-action-btn danger" title="Delete task" onclick="event.stopPropagation();openDeleteModal('${task.id}')">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v4M7.5 6v4M3 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Row click → drawer
  dom.taskTableBody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => openDrawer(row.dataset.id));
  });

  // Checkbox
  dom.taskTableBody.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.id;
      if (cb.checked) state.selectedIds.add(id);
      else state.selectedIds.delete(id);
      syncSelectAllCheckbox();
    });
  });
}

// ---------- CARDS ----------

function renderCards(tasks) {
  if (!tasks.length) {
    dom.cardView.innerHTML = '';
    return;
  }
  dom.cardView.innerHTML = tasks.map(task => {
    const a = task.assignee ? ASSIGNEES[task.assignee] : null;
    const dClass = dueDateClass(task.due);
    return `
      <div class="task-card" data-id="${task.id}">
        <div class="tc-top">
          <span class="tc-name">${escHtml(task.name)}</span>
          <span class="tc-id">#${task.id}</span>
        </div>
        <div class="tc-badges">
          ${priorityBadgeHTML(task.priority)}
          ${statusBadgeHTML(task.status)}
        </div>
        <div class="tc-project">${projectTagHTML(task.project)}</div>
        <div class="tc-footer">
          <div class="tc-assignee">
            ${avatarHTML(task.assignee)}
            ${a ? `<span>${a.name.split(' ')[0]}</span>` : '<span style="color:var(--text-muted)">Unassigned</span>'}
          </div>
          <span class="tc-due ${dClass}">${formatDate(task.due)}</span>
        </div>
      </div>
    `;
  }).join('');

  dom.cardView.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('click', () => openDrawer(card.dataset.id));
  });
}

// ============================================
// PAGINATION
// ============================================

function renderPagination() {
  const total = state.filteredTasks.length;
  const pages = Math.ceil(total / state.perPage);
  const cp    = state.currentPage;

  if (pages <= 1) {
    dom.pagination.style.display = 'none';
    return;
  }
  dom.pagination.style.display = '';

  const start = (cp - 1) * state.perPage + 1;
  const end   = Math.min(cp * state.perPage, total);
  dom.paginationInfo.textContent = `Showing ${start}–${end} of ${total}`;

  dom.prevPage.disabled = cp === 1;
  dom.nextPage.disabled = cp === pages;

  // Page numbers
  const nums = getPaginationNums(cp, pages);
  dom.pageNumbers.innerHTML = nums.map(n =>
    n === '...'
      ? `<span class="page-num ellipsis">…</span>`
      : `<button class="page-num ${n === cp ? 'active' : ''}" data-page="${n}">${n}</button>`
  ).join('');

  dom.pageNumbers.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => goToPage(+btn.dataset.page));
  });
}

function getPaginationNums(cur, total) {
  if (total <= 7) return Array.from({length:total},(_,i)=>i+1);
  const nums = [];
  nums.push(1);
  if (cur > 3) nums.push('...');
  for (let i = Math.max(2,cur-1); i <= Math.min(total-1,cur+1); i++) nums.push(i);
  if (cur < total - 2) nums.push('...');
  nums.push(total);
  return nums;
}

function goToPage(n) {
  state.currentPage = n;
  renderCurrentPage();
  renderPagination();
  scrollToTop();
}

function scrollToTop() {
  dom.tableView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// SELECTION
// ============================================

function syncSelectAllCheckbox() {
  const page = state.filteredTasks.slice(
    (state.currentPage-1)*state.perPage,
    state.currentPage*state.perPage
  );
  const allSelected = page.length && page.every(t => state.selectedIds.has(t.id));
  dom.tableSelectAll.checked = allSelected;
  dom.selectAll.checked      = allSelected;
}

// ============================================
// CREATE / EDIT MODAL
// ============================================

function openCreateModal() {
  state.editingId = null;
  dom.modalTitle.textContent = 'New Task';
  dom.modalSave.textContent = '';
  dom.modalSave.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 6-6" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg> Create Task`;
  dom.taskForm.reset();
  dom.taskNameError.classList.add('hidden');
  dom.taskName.classList.remove('error');
  dom.taskModal.classList.remove('hidden');
  setTimeout(() => dom.taskName.focus(), 100);
}

function openEditModal(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  state.editingId = id;
  dom.modalTitle.textContent = 'Edit Task';
  dom.modalSave.textContent = '';
  dom.modalSave.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 6-6" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg> Save Changes`;

  dom.taskName.value     = task.name;
  dom.taskDesc.value     = task.desc || '';
  dom.taskProject.value  = task.project || '';
  dom.taskAssignee.value = task.assignee || '';
  dom.taskPriority.value = task.priority;
  dom.taskStatus.value   = task.status;
  dom.taskDue.value      = task.due || '';
  dom.taskEstimate.value = task.estimate || '';

  dom.taskNameError.classList.add('hidden');
  dom.taskName.classList.remove('error');
  dom.taskModal.classList.remove('hidden');
  setTimeout(() => dom.taskName.focus(), 100);
}

function closeTaskModal() {
  dom.taskModal.classList.add('hidden');
  state.editingId = null;
}

function saveTask() {
  const name = dom.taskName.value.trim();
  if (!name) {
    dom.taskName.classList.add('error');
    dom.taskNameError.classList.remove('hidden');
    dom.taskName.focus();
    return;
  }
  dom.taskName.classList.remove('error');
  dom.taskNameError.classList.add('hidden');

  if (state.editingId) {
    const idx = state.tasks.findIndex(t => t.id === state.editingId);
    if (idx !== -1) {
      state.tasks[idx] = {
        ...state.tasks[idx],
        name,
        desc:      dom.taskDesc.value.trim(),
        project:   dom.taskProject.value,
        assignee:  dom.taskAssignee.value,
        priority:  dom.taskPriority.value,
        status:    dom.taskStatus.value,
        due:       dom.taskDue.value,
        estimate:  parseFloat(dom.taskEstimate.value) || null,
      };
    }
    closeTaskModal();
    applyFiltersAndSort();
    showToast('Task updated successfully.', 'success');
    if (state.drawerTaskId === state.editingId) openDrawer(state.editingId);
  } else {
    const newTask = {
      id:        generateId(),
      name,
      desc:      dom.taskDesc.value.trim(),
      project:   dom.taskProject.value,
      assignee:  dom.taskAssignee.value,
      priority:  dom.taskPriority.value,
      status:    dom.taskStatus.value,
      due:       dom.taskDue.value,
      estimate:  parseFloat(dom.taskEstimate.value) || null,
      created:   new Date().toISOString().slice(0,10),
    };
    state.tasks.unshift(newTask);
    closeTaskModal();
    state.currentPage = 1;
    applyFiltersAndSort();
    showToast(`Task ${newTask.id} created.`, 'success');
  }
}

// ============================================
// DELETE MODAL
// ============================================

function openDeleteModal(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  state.deletingId = id;
  dom.deleteTaskName.textContent = task.name;
  dom.deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  dom.deleteModal.classList.add('hidden');
  state.deletingId = null;
}

function confirmDelete() {
  if (!state.deletingId) return;
  const task = state.tasks.find(t => t.id === state.deletingId);
  state.tasks = state.tasks.filter(t => t.id !== state.deletingId);
  state.selectedIds.delete(state.deletingId);

  if (state.drawerTaskId === state.deletingId) closeDrawer();

  closeDeleteModal();
  applyFiltersAndSort();
  showToast(`Task ${task?.id || ''} deleted.`, 'info');
}

// ============================================
// DRAWER
// ============================================

const ACTIVITY_SEED = [
  { actor:'jd', text:'Created this task.',              time:'May 20, 2025' },
  { actor:'sk', text:'Changed status to <strong>In Progress</strong>.', time:'May 22, 2025' },
  { actor:'al', text:'Left a comment: "Looks good, will start today".',  time:'May 24, 2025' },
];

function openDrawer(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  state.drawerTaskId = id;

  dom.drawerTaskId.textContent   = `#${task.id}`;
  dom.drawerTaskName.textContent = task.name;

  dom.drawerStatus.innerHTML   = statusBadgeHTML(task.status);
  dom.drawerPriority.innerHTML = priorityBadgeHTML(task.priority);

  const a = task.assignee ? ASSIGNEES[task.assignee] : null;
  dom.drawerAssignee.innerHTML = a
    ? `${avatarHTML(task.assignee)} <span>${a.name}</span>`
    : `<span style="color:var(--text-muted)">Unassigned</span>`;

  const dClass = dueDateClass(task.due);
  dom.drawerDue.innerHTML = task.due
    ? `<span class="due-date ${dClass}">${formatDate(task.due)}</span>`
    : '<span style="color:var(--text-muted)">Not set</span>';

  dom.drawerProject.innerHTML  = projectTagHTML(task.project);
  dom.drawerEstimate.textContent = task.estimate ? `${task.estimate}h` : '—';
  dom.drawerDesc.textContent   = task.desc || 'No description provided.';

  // Activity
  dom.drawerActivity.innerHTML = ACTIVITY_SEED.map(act => {
    const actor = ASSIGNEES[act.actor];
    return `
      <div class="activity-item">
        <div class="user-avatar-sm" style="background:${actor?.color||'#6B7280'};flex-shrink:0">${actor?.initials||'?'}</div>
        <div>
          <div class="activity-text">${act.text}</div>
          <div class="activity-time">${act.time}</div>
        </div>
      </div>
    `;
  }).join('');

  dom.drawerOverlay.classList.remove('hidden');
  dom.taskDrawer.classList.remove('hidden');
}

function closeDrawer() {
  dom.drawerOverlay.classList.add('hidden');
  dom.taskDrawer.classList.add('hidden');
  state.drawerTaskId = null;
}

// ============================================
// TOAST
// ============================================

function showToast(message, type = 'info') {
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#4ADE80" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#FCA5A5" stroke-width="1.5"/><path d="M8 5v4M8 10.5v.5" stroke="#FCA5A5" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#93C5FD" stroke-width="1.5"/><path d="M8 7v5M8 5v.5" stroke="#93C5FD" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  dom.toastContainer.appendChild(t);

  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove(), { once: true });
  }, 3200);
}

// ============================================
// SORT COLUMN HEADERS
// ============================================

function initSortableHeaders() {
  document.querySelectorAll('.tasks-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (state.sortField === field) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDir   = 'asc';
        dom.sortSelect.value = field === 'name' ? 'name' : field;
      }
      document.querySelectorAll('.tasks-table th.sortable').forEach(h => {
        h.classList.remove('sort-asc','sort-desc');
      });
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      state.currentPage = 1;
      applyFiltersAndSort();
    });
  });
}

// ============================================
// FILTER DROPDOWNS
// ============================================

function initFilterDropdowns() {
  document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
    const btn  = dropdown.querySelector('.filter-btn');
    const menu = dropdown.querySelector('.filter-menu');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) dropdown.classList.add('open');
    });

    menu.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const filterType = dropdown.id.replace('Filter','');
        const val = cb.value;
        if (cb.checked) {
          if (!state.filters[filterType].includes(val)) {
            state.filters[filterType].push(val);
          }
        } else {
          state.filters[filterType] = state.filters[filterType].filter(v => v !== val);
        }
        btn.classList.toggle('active', state.filters[filterType].length > 0);
        state.currentPage = 1;
        applyFiltersAndSort();
      });
    });
  });

  document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll('.filter-dropdown.open').forEach(d => d.classList.remove('open'));
}

// ============================================
// EXPORT
// ============================================

function exportCSV() {
  const headers = ['ID','Name','Project','Assignee','Priority','Status','Due Date','Estimate'];
  const rows = state.filteredTasks.map(t => [
    t.id,
    `"${t.name.replace(/"/g,'""')}"`,
    PROJECTS[t.project]?.name || '',
    ASSIGNEES[t.assignee]?.name || 'Unassigned',
    t.priority,
    t.status,
    t.due || '',
    t.estimate ? `${t.estimate}h` : '',
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'taskflow-tasks.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported tasks to CSV.', 'success');
}

// ============================================
// ESCAPE HTML
// ============================================

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================
// INIT
// ============================================

function init() {
  applyFiltersAndSort();
  initSortableHeaders();
  initFilterDropdowns();

  // Search
  dom.taskSearch.addEventListener('input', () => {
    state.searchQuery = dom.taskSearch.value.trim();
    dom.searchClear.classList.toggle('hidden', !state.searchQuery);
    state.currentPage = 1;
    applyFiltersAndSort();
  });

  dom.searchClear.addEventListener('click', () => {
    dom.taskSearch.value = '';
    state.searchQuery = '';
    dom.searchClear.classList.add('hidden');
    state.currentPage = 1;
    applyFiltersAndSort();
  });

  // Sort select
  dom.sortSelect.addEventListener('change', () => {
    state.sortField = dom.sortSelect.value;
    state.sortDir   = 'asc';
    state.currentPage = 1;
    document.querySelectorAll('.tasks-table th.sortable').forEach(h => h.classList.remove('sort-asc','sort-desc'));
    applyFiltersAndSort();
  });

  // View toggle
  dom.viewTable.addEventListener('click', () => {
    state.view = 'table';
    dom.viewTable.classList.add('active');
    dom.viewCards.classList.remove('active');
    dom.tableView.classList.remove('hidden');
    dom.cardView.classList.add('hidden');
    renderCurrentPage();
  });

  dom.viewCards.addEventListener('click', () => {
    state.view = 'cards';
    dom.viewCards.classList.add('active');
    dom.viewTable.classList.remove('active');
    dom.cardView.classList.remove('hidden');
    dom.tableView.classList.add('hidden');
    renderCurrentPage();
  });

  // Pagination
  dom.prevPage.addEventListener('click', () => {
    if (state.currentPage > 1) goToPage(state.currentPage - 1);
  });
  dom.nextPage.addEventListener('click', () => {
    const pages = Math.ceil(state.filteredTasks.length / state.perPage);
    if (state.currentPage < pages) goToPage(state.currentPage + 1);
  });

  // Select all
  dom.selectAll.addEventListener('change', () => {
    const page = state.filteredTasks.slice(
      (state.currentPage-1)*state.perPage,
      state.currentPage*state.perPage
    );
    page.forEach(t => {
      if (dom.selectAll.checked) state.selectedIds.add(t.id);
      else state.selectedIds.delete(t.id);
    });
    renderCurrentPage();
  });

  dom.tableSelectAll.addEventListener('change', () => {
    const page = state.filteredTasks.slice(
      (state.currentPage-1)*state.perPage,
      state.currentPage*state.perPage
    );
    page.forEach(t => {
      if (dom.tableSelectAll.checked) state.selectedIds.add(t.id);
      else state.selectedIds.delete(t.id);
    });
    dom.selectAll.checked = dom.tableSelectAll.checked;
    renderCurrentPage();
  });

  // Create task
  dom.createTaskBtn.addEventListener('click', openCreateModal);

  // Modal close
  dom.modalClose.addEventListener('click', closeTaskModal);
  dom.modalCancel.addEventListener('click', closeTaskModal);
  dom.modalSave.addEventListener('click', saveTask);
  dom.taskModal.addEventListener('click', e => {
    if (e.target === dom.taskModal) closeTaskModal();
  });

  // Enter in name field
  dom.taskName.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveTask();
  });

  // Delete modal
  dom.deleteModalClose.addEventListener('click', closeDeleteModal);
  dom.deleteCancelBtn.addEventListener('click', closeDeleteModal);
  dom.deleteConfirmBtn.addEventListener('click', confirmDelete);
  dom.deleteModal.addEventListener('click', e => {
    if (e.target === dom.deleteModal) closeDeleteModal();
  });

  // Drawer
  dom.drawerClose.addEventListener('click', closeDrawer);
  dom.drawerOverlay.addEventListener('click', closeDrawer);
  dom.drawerEditBtn.addEventListener('click', () => {
    closeDrawer();
    openEditModal(state.drawerTaskId);
  });

  // Activity submit
  dom.activitySubmit.addEventListener('click', () => {
    const msg = dom.activityInput.value.trim();
    if (!msg) return;
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.innerHTML = `
      <div class="user-avatar-sm" style="background:#2563EB;flex-shrink:0">JD</div>
      <div>
        <div class="activity-text"><strong>You</strong> commented: "${escHtml(msg)}"</div>
        <div class="activity-time">Just now</div>
      </div>
    `;
    dom.drawerActivity.appendChild(newItem);
    dom.activityInput.value = '';
    newItem.scrollIntoView({ behavior: 'smooth' });
  });

  dom.activityInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') dom.activitySubmit.click();
  });

  // Clear filters
  dom.clearFilters.addEventListener('click', resetFilters);
  dom.emptyResetBtn.addEventListener('click', resetFilters);

  // Export
  dom.exportBtn.addEventListener('click', exportCSV);

  // Sidebar collapse
  dom.sidebarCollapse.addEventListener('click', () => {
    dom.sidebar.classList.toggle('collapsed');
  });

  dom.mobileMenuBtn.addEventListener('click', () => {
    dom.sidebar.style.display = dom.sidebar.style.display === 'flex' ? 'none' : 'flex';
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!dom.taskModal.classList.contains('hidden'))   closeTaskModal();
      if (!dom.deleteModal.classList.contains('hidden')) closeDeleteModal();
      if (!dom.taskDrawer.classList.contains('hidden'))  closeDrawer();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      dom.taskSearch.focus();
      dom.taskSearch.select();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      openCreateModal();
    }
  });
}

function resetFilters() {
  state.searchQuery = '';
  state.filters = { status: [], priority: [], assignee: [] };
  dom.taskSearch.value = '';
  dom.searchClear.classList.add('hidden');

  document.querySelectorAll('.filter-menu input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

  state.currentPage = 1;
  applyFiltersAndSort();
}

// Boot
document.addEventListener('DOMContentLoaded', init);


/**
 * TaskFlow Design System — Enterprise Task Architecture Engine
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- Core Element Mappings ---
  const taskStatusSelect = document.getElementById('taskStatusSelect');
  const progressFillBar = document.getElementById('progressFillBar');
  const progressPctText = document.getElementById('progressPctText');
  const newCommentInput = document.getElementById('newCommentInput');
  const submitCommentBtn = document.getElementById('submitCommentBtn');
  const activityTimeline = document.getElementById('activityTimeline');
  const toggleWatchBtn = document.getElementById('toggleWatchBtn');

  // Action Buttons
  const editTaskBtn = document.getElementById('editTaskBtn');
  const deleteTaskBtn = document.getElementById('deleteTaskBtn');

  // --- Progress Mapping Definition Engine ---
  const statusProgressValueMap = {
    todo: { pct: 0, text: "0% Complete" },
    progress: { pct: 50, text: "50% Complete" },
    review: { pct: 85, text: "85% Component Review" },
    completed: { pct: 100, text: "100% Resolved" }
  };

  if (taskStatusSelect) {
    taskStatusSelect.addEventListener('change', (e) => {
      const activeStatus = e.target.value;
      const metrics = statusProgressValueMap[activeStatus];
      
      if (metrics !== undefined) {
        // Sync layout view elements
        progressFillBar.style.width = `${metrics.pct}%`;
        progressPctText.textContent = metrics.text;
        
        // Push a log tracking notification element downstream to the feed stack
        const statusLabelText = taskStatusSelect.options[taskStatusSelect.selectedIndex].text;
        injectSystemTimelineLog(`changed status pipeline position to <strong>${statusLabelText}</strong>`);
      }
    });
  }

  // --- Interactive Comments Generator Engine ---
  if (submitCommentBtn && newCommentInput) {
    submitCommentBtn.addEventListener('click', () => {
      const commentMessageText = newCommentInput.value.trim();
      
      if (!commentMessageText) {
        alert('Please supply an activity tracking note description before transmission.');
        return;
      }

      // Construct a new comment layout element
      const commentRowNode = document.createElement('div');
      commentRowNode.className = 'timeline-event-row type-comment';
      
      commentRowNode.innerHTML = `
        <div class="timeline-avatar-space">
          <div class="user-avatar-node">AD</div>
        </div>
        <div class="timeline-body-content">
          <div class="event-meta-line">
            <span class="event-actor-name">Alex Dawson</span>
            <span class="event-timestamp-label">Just now</span>
          </div>
          <div class="comment-bubble-text">
            ${escapeHtmlEntities(commentMessageText)}
          </div>
        </div>
      `;

      // Prepend the node directly at the top of the timeline feed block
      activityTimeline.insertBefore(commentRowNode, activityTimeline.firstChild);
      
      // Wipe the workspace entry text input area clean
      newCommentInput.value = '';
    });
  }

  // --- Dynamic System Event Logging Pipeline ---
  function injectSystemTimelineLog(htmlActionLogMessage) {
    if (!activityTimeline) return;

    const systemRowNode = document.createElement('div');
    systemRowNode.className = 'timeline-event-row type-system';
    
    systemRowNode.innerHTML = `
      <div class="timeline-avatar-space">
        <div class="system-node-dot status-change"></div>
      </div>
      <div class="timeline-body-content">
        <div class="event-meta-line">
          <span class="event-actor-name">Alex Dawson</span>
          <span class="event-system-message">${htmlActionLogMessage}</span>
          <span class="event-timestamp-label">Just now</span>
        </div>
      </div>
    `;

    activityTimeline.insertBefore(systemRowNode, activityTimeline.firstChild);
  }

  // --- Helper String Sanitization Utility ---
  function escapeHtmlEntities(textStr) {
    const outputElement = document.createElement('div');
    outputElement.innerText = textStr;
    return outputElement.innerHTML;
  }

  // --- Mock Workspace Actions Click Catchers ---
  if (editTaskBtn) {
    editTaskBtn.addEventListener('click', () => {
      const titleField = document.getElementById('taskTitle');
      const alternateTitle = prompt("Modify project task summary title string value:", titleField.textContent);
      if (alternateTitle && alternateTitle.trim() !== "") {
        titleField.textContent = alternateTitle.trim();
        injectSystemTimelineLog('updated the task statement title configuration summary');
      }
    });
  }

  if (deleteTaskBtn) {
    deleteTaskBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to permanently delete this task record from the tracking database?')) {
        alert('Task execution target purged. Redirecting back to project matrix view dashboard.');
        window.location.href = 'projects.html';
      }
    });
  }

  if (toggleWatchBtn) {
    toggleWatchBtn.addEventListener('click', () => {
      toggleWatchBtn.classList.toggle('active');
      if (toggleWatchBtn.classList.contains('active')) {
        toggleWatchBtn.style.borderColor = 'var(--success)';
        toggleWatchBtn.style.color = 'var(--success)';
        injectSystemTimelineLog('subscribed to instant notification monitoring alerts for this task node');
      } else {
        toggleWatchBtn.style.borderColor = 'var(--text-muted)';
        toggleWatchBtn.style.color = 'var(--text-secondary)';
        injectSystemTimelineLog('unsubscribed from active tracking notification updates');
      }
    });
  }

  // --- Persistent Workspace Navigation Controls Sync (App Shell Frame) ---
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