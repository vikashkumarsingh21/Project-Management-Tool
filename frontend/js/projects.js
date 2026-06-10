/* ============================================
   PROJECTS.JS — TaskFlow Projects Page
   Complete production-ready functionality
   ============================================ */

'use strict';

/* ─────────────────────────────────────────
   DATA STORE
───────────────────────────────────────── */

const PROJECTS_DATA = [
  {
    id: 'proj-1',
    name: 'Platform v3',
    description: 'Full redesign of the core platform with improved performance, new design system, and modular architecture.',
    color: '#2563EB',
    status: 'active',
    progress: 68,
    tasks: { open: 34, total: 58 },
    members: [
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
      { initials: 'JL', color: '#7C3AED', name: 'Jamie Lee' },
      { initials: 'MK', color: '#0891B2', name: 'Maya K.' },
      { initials: 'SR', color: '#22C55E', name: 'Sarah R.' },
    ],
    due: '2026-07-15',
    updatedAt: Date.now() - 1000 * 60 * 10,
    favorite: true,
  },
  {
    id: 'proj-2',
    name: 'Mobile App',
    description: 'Native iOS and Android application with offline support, push notifications, and biometric auth.',
    color: '#7C3AED',
    status: 'active',
    progress: 45,
    tasks: { open: 52, total: 95 },
    members: [
      { initials: 'JL', color: '#7C3AED', name: 'Jamie Lee' },
      { initials: 'TR', color: '#EF4444', name: 'Tom R.' },
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
    ],
    due: '2026-08-30',
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    favorite: true,
  },
  {
    id: 'proj-3',
    name: 'API Gateway',
    description: 'Centralised API gateway with rate limiting, auth middleware, analytics, and developer portal.',
    color: '#0891B2',
    status: 'review',
    progress: 87,
    tasks: { open: 8, total: 40 },
    members: [
      { initials: 'MK', color: '#0891B2', name: 'Maya K.' },
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
    ],
    due: '2026-06-20',
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
    favorite: false,
  },
  {
    id: 'proj-4',
    name: 'Design System v2',
    description: 'Component library and token system for brand-consistent UI across all products.',
    color: '#D97706',
    status: 'active',
    progress: 32,
    tasks: { open: 41, total: 60 },
    members: [
      { initials: 'SR', color: '#22C55E', name: 'Sarah R.' },
      { initials: 'JL', color: '#7C3AED', name: 'Jamie Lee' },
      { initials: 'BW', color: '#EC4899', name: 'Ben W.' },
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
    ],
    due: '2026-09-10',
    updatedAt: Date.now() - 1000 * 60 * 60 * 8,
    favorite: false,
  },
  {
    id: 'proj-5',
    name: 'Data Pipeline',
    description: 'Real-time data ingestion, transformation, and analytics pipeline using event-driven architecture.',
    color: '#22C55E',
    status: 'review',
    progress: 74,
    tasks: { open: 15, total: 45 },
    members: [
      { initials: 'MK', color: '#0891B2', name: 'Maya K.' },
      { initials: 'TR', color: '#EF4444', name: 'Tom R.' },
    ],
    due: '2026-06-25',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    favorite: false,
  },
  {
    id: 'proj-6',
    name: 'Auth Service',
    description: 'Centralised authentication and authorisation service with SSO, OAuth 2.0, and MFA support.',
    color: '#EF4444',
    status: 'active',
    progress: 55,
    tasks: { open: 22, total: 48 },
    members: [
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
      { initials: 'MK', color: '#0891B2', name: 'Maya K.' },
      { initials: 'JL', color: '#7C3AED', name: 'Jamie Lee' },
    ],
    due: '2026-08-01',
    updatedAt: Date.now() - 1000 * 60 * 60 * 30,
    favorite: false,
  },
  {
    id: 'proj-7',
    name: 'Marketing Site',
    description: 'Revamped marketing website with improved conversion, performance, and content management.',
    color: '#EC4899',
    status: 'completed',
    progress: 100,
    tasks: { open: 0, total: 38 },
    members: [
      { initials: 'SR', color: '#22C55E', name: 'Sarah R.' },
      { initials: 'BW', color: '#EC4899', name: 'Ben W.' },
    ],
    due: '2026-05-15',
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    favorite: false,
  },
  {
    id: 'proj-8',
    name: 'Legacy Migration',
    description: 'Migration of legacy systems to modern cloud-native infrastructure.',
    color: '#0F172A',
    status: 'archived',
    progress: 100,
    tasks: { open: 0, total: 120 },
    members: [
      { initials: 'TR', color: '#EF4444', name: 'Tom R.' },
      { initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' },
    ],
    due: '2025-12-31',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    favorite: false,
  },
];

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */

const state = {
  projects: [],
  filter: 'all',
  sort: 'updated',
  view: 'grid',
  searchQuery: '',
  favorites: new Set(),
  recentlyViewed: [],
  selectedColor: '#2563EB',
  editingProjectId: null,
};

const MAX_RECENT = 5;
const LS_FAVORITES = 'tf_project_favorites';
const LS_RECENT = 'tf_project_recent';
const LS_VIEW = 'tf_project_view';
const LS_SORT = 'tf_project_sort';

/* ─────────────────────────────────────────
   PERSISTENCE
───────────────────────────────────────── */

function persistLoad() {
  try {
    const favs = JSON.parse(localStorage.getItem(LS_FAVORITES) || '[]');
    state.favorites = new Set(favs);

    const recent = JSON.parse(localStorage.getItem(LS_RECENT) || '[]');
    state.recentlyViewed = recent.filter(id => PROJECTS_DATA.some(p => p.id === id));

    state.view = localStorage.getItem(LS_VIEW) || 'grid';
    state.sort = localStorage.getItem(LS_SORT) || 'updated';
  } catch {
    state.favorites = new Set();
    state.recentlyViewed = [];
  }
}

function persistFavorites() {
  try {
    localStorage.setItem(LS_FAVORITES, JSON.stringify([...state.favorites]));
  } catch { /* storage full */ }
}

function persistRecent() {
  try {
    localStorage.setItem(LS_RECENT, JSON.stringify(state.recentlyViewed));
  } catch { /* storage full */ }
}

function persistView() {
  try {
    localStorage.setItem(LS_VIEW, state.view);
    localStorage.setItem(LS_SORT, state.sort);
  } catch { /* storage full */ }
}

/* ─────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────── */

function getProject(id) {
  return state.projects.find(p => p.id === id) || null;
}

function formatDue(dateStr) {
  if (!dateStr) return { text: '—', cls: '' };
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  const opts = { month: 'short', day: 'numeric' };
  const formatted = due.toLocaleDateString('en-US', opts);

  if (diffDays < 0) return { text: formatted, cls: 'overdue' };
  if (diffDays <= 7) return { text: formatted, cls: 'due-soon' };
  return { text: formatted, cls: '' };
}

function timeAgo(ts) {
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStatusLabel(status) {
  return { active: 'Active', review: 'In review', completed: 'Completed', archived: 'Archived' }[status] || status;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ─────────────────────────────────────────
   FILTERING & SORTING
───────────────────────────────────────── */

function getFilteredSorted() {
  let projects = [...state.projects];

  // Status filter
  if (state.filter !== 'all') {
    projects = projects.filter(p => p.status === state.filter);
  }

  // Search query
  const q = state.searchQuery.trim().toLowerCase();
  if (q) {
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  // Sort
  switch (state.sort) {
    case 'name':
      projects.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'progress':
      projects.sort((a, b) => b.progress - a.progress);
      break;
    case 'due':
      projects.sort((a, b) => {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
      });
      break;
    case 'tasks':
      projects.sort((a, b) => b.tasks.open - a.tasks.open);
      break;
    case 'updated':
    default:
      projects.sort((a, b) => b.updatedAt - a.updatedAt);
      break;
  }

  return projects;
}

function getCounts() {
  const all = state.projects.length;
  const active = state.projects.filter(p => p.status === 'active').length;
  const review = state.projects.filter(p => p.status === 'review').length;
  const completed = state.projects.filter(p => p.status === 'completed').length;
  const archived = state.projects.filter(p => p.status === 'archived').length;
  return { all, active, review, completed, archived };
}

/* ─────────────────────────────────────────
   RENDER — FILTER COUNTS
───────────────────────────────────────── */

function renderFilterCounts() {
  const counts = getCounts();
  const el = id => document.getElementById(id);
  safeSetText(el('countAll'),       counts.all);
  safeSetText(el('countActive'),    counts.active);
  safeSetText(el('countReview'),    counts.review);
  safeSetText(el('countCompleted'), counts.completed);
  safeSetText(el('countArchived'),  counts.archived);
  safeSetText(el('allCount'),       counts.all);
}

function safeSetText(el, text) {
  if (el) el.textContent = text;
}

/* ─────────────────────────────────────────
   RENDER — STATS ROW (count-up animation)
───────────────────────────────────────── */

function animateCountUp(el, target, duration = 800) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const pct = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(eased * target);
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderStats() {
  document.querySelectorAll('.pstat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    animateCountUp(el, target, 900);
  });
}

/* ─────────────────────────────────────────
   RENDER — AVATAR STACK HTML
───────────────────────────────────────── */

function renderAvatarStack(members, maxVisible = 3) {
  const visible = members.slice(0, maxVisible);
  const extra = members.length - maxVisible;
  let html = '<div class="avatar-stack">';
  visible.forEach(m => {
    const bg = m.color.startsWith('linear') ? m.color : m.color;
    html += `<div class="avatar-stack-item" style="background:${escapeHtml(bg)}" title="${escapeHtml(m.name)}">${escapeHtml(m.initials)}</div>`;
  });
  if (extra > 0) {
    html += `<div class="avatar-stack-item avatar-stack-more">+${extra}</div>`;
  }
  html += '</div>';
  return html;
}

/* ─────────────────────────────────────────
   RENDER — SINGLE PROJECT CARD
───────────────────────────────────────── */

function renderProjectCard(project) {
  const isFav = state.favorites.has(project.id);
  const due = formatDue(project.due);
  const statusLabel = getStatusLabel(project.status);
  const fillClass = `progress-fill-${project.status}`;

  // Accent bar color via inline style (reuses card accent ::before)
  const accentStyle = `background:${escapeHtml(project.color)}`;

  const card = document.createElement('article');
  card.className = 'project-card card-enter';
  card.dataset.id = project.id;
  card.dataset.status = project.status;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Open ${project.name}`);
  card.style.setProperty('--accent', project.color);

  // Accent bar uses CSS var
  card.style.setProperty('--card-accent', project.color);

  card.innerHTML = `
    <style>.project-card[data-id="${escapeHtml(project.id)}"]::before{background:${escapeHtml(project.color)};}</style>
    <div class="project-card-header">
      <div class="project-card-title-row">
        <div class="project-card-icon" style="background:${escapeHtml(project.color)}">
          ${escapeHtml(getInitials(project.name))}
        </div>
        <span class="project-card-name">${escapeHtml(project.name)}</span>
      </div>
      <div class="project-card-actions">
        <button class="project-card-action-btn fav-btn${isFav ? ' fav-active' : ''}"
          data-id="${escapeHtml(project.id)}"
          aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
          title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="${isFav ? '#F59E0B' : 'none'}">
            <path d="M6.5 1L8.2 4.8l4 .58-2.9 2.83.69 4L6.5 10.2l-3.49 1.9.69-4L.8 5.38l4-.58L6.5 1z"
              stroke="${isFav ? '#F59E0B' : 'currentColor'}" stroke-width="1.2" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="project-card-action-btn more-btn"
          data-id="${escapeHtml(project.id)}"
          aria-label="More options"
          title="More options">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="2.5" r="1" fill="currentColor"/>
            <circle cx="6.5" cy="6.5" r="1" fill="currentColor"/>
            <circle cx="6.5" cy="10.5" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <p class="project-card-desc">${escapeHtml(project.description || '')}</p>

    <div class="project-card-progress">
      <div class="project-card-progress-label">
        <span class="project-card-progress-text">Progress</span>
        <span class="project-card-progress-pct">${project.progress}%</span>
      </div>
      <div class="project-card-progress-bar">
        <div class="project-card-progress-fill ${fillClass}" style="width:0%" data-target="${project.progress}"></div>
      </div>
    </div>

    <div class="project-card-footer">
      <div class="project-card-meta">
        ${renderAvatarStack(project.members)}
        <span class="project-card-tasks">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style="display:inline-block;vertical-align:-1px">
            <rect x="1" y="1" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M3.5 5.5l1.5 1.5 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${project.tasks.open} open
        </span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="status-badge status-${escapeHtml(project.status)}">${escapeHtml(statusLabel)}</span>
        ${due.text !== '—' ? `<span class="project-card-due ${due.cls}">${escapeHtml(due.text)}</span>` : ''}
      </div>
    </div>
  `;

  return card;
}

/* ─────────────────────────────────────────
   RENDER — PROJECT LIST ROW
───────────────────────────────────────── */

function renderListRow(project) {
  const isFav = state.favorites.has(project.id);
  const due = formatDue(project.due);
  const fillClass = `progress-fill-${project.status}`;
  const statusLabel = getStatusLabel(project.status);

  const row = document.createElement('div');
  row.className = 'list-row';
  row.dataset.id = project.id;

  row.innerHTML = `
    <div class="list-col-name-cell">
      <div class="list-project-icon" style="background:${escapeHtml(project.color)}">${escapeHtml(getInitials(project.name))}</div>
      <div>
        <div class="list-project-name">${escapeHtml(project.name)}</div>
        <div class="list-project-tasks">${project.tasks.open} open tasks</div>
      </div>
    </div>
    <div>
      <span class="status-badge status-${escapeHtml(project.status)}">${escapeHtml(statusLabel)}</span>
    </div>
    <div class="list-col-progress-cell">
      <div class="list-mini-bar">
        <div class="list-mini-fill ${fillClass}" style="width:${project.progress}%"></div>
      </div>
      <span class="list-mini-pct">${project.progress}%</span>
    </div>
    <div class="list-col-members-cell">${renderAvatarStack(project.members, 3)}</div>
    <div class="list-col-tasks-cell">${project.tasks.open}/${project.tasks.total}</div>
    <div class="list-col-due-cell ${due.cls}">${due.text}</div>
    <div class="list-col-actions-cell">
      <button class="project-card-action-btn fav-btn${isFav ? ' fav-active' : ''}" data-id="${escapeHtml(project.id)}" title="Favorite">
        <svg width="12" height="12" viewBox="0 0 13 13" fill="${isFav ? '#F59E0B' : 'none'}">
          <path d="M6.5 1L8.2 4.8l4 .58-2.9 2.83.69 4L6.5 10.2l-3.49 1.9.69-4L.8 5.38l4-.58L6.5 1z"
            stroke="${isFav ? '#F59E0B' : 'currentColor'}" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  row.addEventListener('click', e => {
    if (e.target.closest('.fav-btn')) return;
    openDrawer(project.id);
  });

  return row;
}

/* ─────────────────────────────────────────
   RENDER — PROJECTS GRID & LIST
───────────────────────────────────────── */

function renderProjects() {
  const filtered = getFilteredSorted();
  const gridEl = document.getElementById('projectsGrid');
  const listEl = document.getElementById('projectsListRows');
  const emptyEl = document.getElementById('projectsEmpty');
  const emptyDesc = document.getElementById('emptyDesc');
  const allCount = document.getElementById('allCount');

  if (allCount) allCount.textContent = filtered.length;

  const isEmpty = filtered.length === 0;
  if (emptyEl) emptyEl.style.display = isEmpty ? '' : 'none';

  if (isEmpty && emptyDesc) {
    emptyDesc.textContent = state.searchQuery
      ? `No projects match "${state.searchQuery}". Try a different term.`
      : 'No projects match the current filter.';
  }

  // Grid view
  if (gridEl) {
    gridEl.innerHTML = '';
    filtered.forEach((project, i) => {
      const card = renderProjectCard(project);
      card.style.animationDelay = `${i * 40}ms`;
      gridEl.appendChild(card);

      // Animate progress bar after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const fill = card.querySelector('.project-card-progress-fill');
          if (fill) fill.style.width = fill.dataset.target + '%';
        });
      });
    });
  }

  // List view
  if (listEl) {
    listEl.innerHTML = '';
    filtered.forEach(project => {
      listEl.appendChild(renderListRow(project));
    });
  }
}

/* ─────────────────────────────────────────
   RENDER — FAVORITES SECTION
───────────────────────────────────────── */

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const section = document.getElementById('favoritesSection');
  const favCount = document.getElementById('favCount');

  const favorites = state.projects.filter(p => state.favorites.has(p.id));

  if (favCount) favCount.textContent = favorites.length;
  if (section) section.style.display = favorites.length === 0 ? 'none' : '';

  if (!grid) return;
  grid.innerHTML = '';

  favorites.forEach((project, i) => {
    const card = renderProjectCard(project);
    card.style.animationDelay = `${i * 40}ms`;
    grid.appendChild(card);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fill = card.querySelector('.project-card-progress-fill');
        if (fill) fill.style.width = fill.dataset.target + '%';
      });
    });
  });
}

/* ─────────────────────────────────────────
   RENDER — RECENTLY VIEWED
───────────────────────────────────────── */

function renderRecent() {
  const container = document.getElementById('recentChips');
  const section = document.getElementById('recentSection');
  if (!container) return;

  const recent = state.recentlyViewed
    .map(id => state.projects.find(p => p.id === id))
    .filter(Boolean);

  if (section) section.style.display = recent.length === 0 ? 'none' : '';
  container.innerHTML = '';

  recent.forEach(project => {
    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.dataset.id = project.id;
    chip.innerHTML = `
      <span class="recent-chip-dot" style="background:${escapeHtml(project.color)}"></span>
      <span class="recent-chip-name">${escapeHtml(project.name)}</span>
      <span class="recent-chip-time">${timeAgo(project.updatedAt)}</span>
    `;
    chip.addEventListener('click', () => openDrawer(project.id));
    container.appendChild(chip);
  });
}

/* ─────────────────────────────────────────
   RENDER — FULL PAGE
───────────────────────────────────────── */

function renderAll() {
  renderFilterCounts();
  renderFavorites();
  renderProjects();
  renderRecent();
  updateFilterButtons();
  updateViewToggle();
  updateSortSelect();
}

/* ─────────────────────────────────────────
   SEARCH
───────────────────────────────────────── */

let searchTimeout;

function initSearch() {
  const input = document.getElementById('projectSearch');
  if (!input) return;

  input.value = state.searchQuery;

  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = input.value.trim();
      renderProjects();
    }, 180);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      state.searchQuery = '';
      renderProjects();
      input.blur();
    }
  });
}

/* ─────────────────────────────────────────
   FILTERS
───────────────────────────────────────── */

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter || 'all';
      updateFilterButtons();
      renderProjects();
    });
  });
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  });
}

/* ─────────────────────────────────────────
   SORT
───────────────────────────────────────── */

function initSort() {
  const select = document.getElementById('sortSelect');
  if (!select) return;
  select.value = state.sort;
  select.addEventListener('change', () => {
    state.sort = select.value;
    persistView();
    renderProjects();
  });
}

function updateSortSelect() {
  const select = document.getElementById('sortSelect');
  if (select) select.value = state.sort;
}

/* ─────────────────────────────────────────
   VIEW TOGGLE
───────────────────────────────────────── */

function initViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      updateViewToggle();
      persistView();
    });
  });
}

function updateViewToggle() {
  const gridEl = document.getElementById('projectsGrid');
  const listEl = document.getElementById('projectsListView');

  document.querySelectorAll('.view-btn').forEach(btn => {
    const active = btn.dataset.view === state.view;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (gridEl) gridEl.style.display = state.view === 'grid' ? '' : 'none';
  if (listEl) listEl.style.display = state.view === 'list' ? '' : 'none';
}

/* ─────────────────────────────────────────
   FAVORITES
───────────────────────────────────────── */

function toggleFavorite(projectId) {
  const project = getProject(projectId);
  if (!project) return;

  if (state.favorites.has(projectId)) {
    state.favorites.delete(projectId);
    showToast('info', `Removed "${project.name}" from favorites`);
  } else {
    state.favorites.add(projectId);
    showToast('success', `Added "${project.name}" to favorites`);
  }

  persistFavorites();
  renderFavorites();

  // Update all fav buttons for this project
  document.querySelectorAll(`.fav-btn[data-id="${projectId}"]`).forEach(btn => {
    const isFav = state.favorites.has(projectId);
    btn.classList.toggle('fav-active', isFav);
    btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
    btn.querySelector('path')?.setAttribute('fill', isFav ? '#F59E0B' : 'none');
    btn.querySelector('path')?.setAttribute('stroke', isFav ? '#F59E0B' : 'currentColor');
  });

  // Update count
  const favCount = document.getElementById('favCount');
  if (favCount) favCount.textContent = state.favorites.size;
}

/* ─────────────────────────────────────────
   RECENTLY VIEWED TRACKING
───────────────────────────────────────── */

function trackRecent(projectId) {
  state.recentlyViewed = [
    projectId,
    ...state.recentlyViewed.filter(id => id !== projectId),
  ].slice(0, MAX_RECENT);
  persistRecent();
  renderRecent();

  // Update project's updatedAt
  const project = getProject(projectId);
  if (project) project.updatedAt = Date.now();
}

/* ─────────────────────────────────────────
   PROJECT DRAWER
───────────────────────────────────────── */

function openDrawer(projectId) {
  const project = getProject(projectId);
  if (!project) return;

  trackRecent(projectId);

  const backdrop = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('projectDrawer');
  const iconEl = document.getElementById('drawerIcon');
  const nameEl = document.getElementById('drawerName');
  const metaEl = document.getElementById('drawerMeta');
  const bodyEl = document.getElementById('drawerBody');

  if (!drawer) return;

  // Header
  if (iconEl) {
    iconEl.style.background = project.color;
    iconEl.textContent = getInitials(project.name);
  }
  if (nameEl) nameEl.textContent = project.name;
  if (metaEl) metaEl.textContent = `${getStatusLabel(project.status)} · Updated ${timeAgo(project.updatedAt)}`;

  // Body
  if (bodyEl) {
    const isFav = state.favorites.has(project.id);
    const due = formatDue(project.due);
    const fillClass = `progress-fill-${project.status}`;

    bodyEl.innerHTML = `
      <div class="drawer-section">
        <div class="drawer-section-title">Overview</div>
        <p class="drawer-desc">${escapeHtml(project.description || 'No description provided.')}</p>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Progress</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:.875rem;font-weight:500;color:var(--text)">${project.progress}% complete</span>
          <span class="status-badge status-${escapeHtml(project.status)}">${escapeHtml(getStatusLabel(project.status))}</span>
        </div>
        <div class="drawer-progress-bar">
          <div class="drawer-progress-fill ${fillClass}" style="width:0%" data-target="${project.progress}"></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Stats</div>
        <div class="drawer-stat-row">
          <div class="drawer-stat">
            <div class="drawer-stat-value">${project.tasks.open}</div>
            <div class="drawer-stat-label">Open tasks</div>
          </div>
          <div class="drawer-stat">
            <div class="drawer-stat-value">${project.tasks.total - project.tasks.open}</div>
            <div class="drawer-stat-label">Completed</div>
          </div>
          <div class="drawer-stat">
            <div class="drawer-stat-value">${project.members.length}</div>
            <div class="drawer-stat-label">Members</div>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Due date</div>
        <span style="font-size:.875rem;font-weight:500;color:var(--text)" class="${due.cls}">${due.text !== '—' ? due.text : 'No due date set'}</span>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Team (${project.members.length})</div>
        <div class="drawer-member-list">
          ${project.members.map((m, i) => `
            <div class="drawer-member-row">
              <div class="drawer-member-avatar" style="background:${escapeHtml(m.color)}">${escapeHtml(m.initials)}</div>
              <div>
                <div class="drawer-member-name">${escapeHtml(m.name)}</div>
                <div class="drawer-member-role">${i === 0 ? 'Project lead' : 'Contributor'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="drawer-section" style="padding-bottom:var(--sp-4)">
        <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="window.location.href='tasks.html'">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 6l2 2 3.5-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            View tasks
          </button>
          <button class="btn btn-outline btn-sm fav-btn-drawer" data-id="${escapeHtml(project.id)}">
            ${isFav ? 'Remove favorite' : 'Add to favorites'}
          </button>
        </div>
      </div>
    `;

    // Animate progress bar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fill = bodyEl.querySelector('.drawer-progress-fill');
        if (fill) fill.style.width = fill.dataset.target + '%';
      });
    });

    // Drawer fav button
    bodyEl.querySelector('.fav-btn-drawer')?.addEventListener('click', () => {
      toggleFavorite(project.id);
      // Update drawer button text
      const btn = bodyEl.querySelector('.fav-btn-drawer');
      if (btn) btn.textContent = state.favorites.has(project.id) ? 'Remove favorite' : 'Add to favorites';
    });
  }

  // Store editing context
  state.editingProjectId = projectId;

  // Show
  if (backdrop) {
    backdrop.style.display = '';
  }
  drawer.style.display = '';
  requestAnimationFrame(() => {
    drawer.classList.add('open');
  });

  // Edit button
  const editBtn = document.getElementById('drawerEditBtn');
  if (editBtn) {
    editBtn.onclick = () => {
      closeDrawer();
      openModal(projectId);
    };
  }

  document.addEventListener('keydown', handleDrawerEsc);
}

function closeDrawer() {
  const backdrop = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('projectDrawer');
  if (!drawer) return;

  drawer.classList.remove('open');
  setTimeout(() => {
    if (backdrop) backdrop.style.display = 'none';
  }, 280);

  document.removeEventListener('keydown', handleDrawerEsc);
  state.editingProjectId = null;
}

function handleDrawerEsc(e) {
  if (e.key === 'Escape') closeDrawer();
}

function initDrawer() {
  document.getElementById('closeDrawer')?.addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeDrawer);
}

/* ─────────────────────────────────────────
   PROJECT MODAL
───────────────────────────────────────── */

function openModal(editId = null) {
  const modal = document.getElementById('projectModal');
  const title = document.getElementById('projectModalTitle');
  const saveBtn = document.getElementById('saveProjectBtn');
  const nameInput = document.getElementById('projectName');
  const descInput = document.getElementById('projectDesc');
  const statusSelect = document.getElementById('projectStatus');
  const dueInput = document.getElementById('projectDue');

  if (!modal) return;

  if (editId) {
    const project = getProject(editId);
    if (project) {
      if (title) title.textContent = 'Edit project';
      if (saveBtn) saveBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5L5.5 11 12 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Save changes`;
      if (nameInput) nameInput.value = project.name;
      if (descInput) descInput.value = project.description || '';
      if (statusSelect) statusSelect.value = project.status;
      if (dueInput) dueInput.value = project.due || '';
      state.selectedColor = project.color;
      updateColorSwatches();
    }
    state.editingProjectId = editId;
  } else {
    if (title) title.textContent = 'New project';
    if (saveBtn) saveBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5L5.5 11 12 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Create project`;
    if (nameInput) nameInput.value = '';
    if (descInput) descInput.value = '';
    if (statusSelect) statusSelect.value = 'active';
    if (dueInput) dueInput.value = '';
    state.selectedColor = '#2563EB';
    updateColorSwatches();
    state.editingProjectId = null;
  }

  // Clear errors
  nameInput?.classList.remove('error');

  modal.style.display = '';
  modal.style.animation = 'fadeIn 150ms ease';
  requestAnimationFrame(() => nameInput?.focus());

  document.addEventListener('keydown', handleModalEsc);
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.style.display = 'none';
  }
  document.removeEventListener('keydown', handleModalEsc);
  state.editingProjectId = null;
}

function handleModalEsc(e) {
  if (e.key === 'Escape') closeModal();
}

function saveProject() {
  const nameInput = document.getElementById('projectName');
  const descInput = document.getElementById('projectDesc');
  const statusSelect = document.getElementById('projectStatus');
  const dueInput = document.getElementById('projectDue');

  const name = nameInput?.value.trim() || '';
  if (!name) {
    nameInput?.classList.add('error');
    nameInput?.focus();
    showToast('error', 'Project name is required.');
    return;
  }
  nameInput?.classList.remove('error');

  if (state.editingProjectId) {
    // Edit existing
    const project = getProject(state.editingProjectId);
    if (project) {
      project.name = name;
      project.description = descInput?.value.trim() || '';
      project.status = statusSelect?.value || 'active';
      project.due = dueInput?.value || '';
      project.color = state.selectedColor;
      project.updatedAt = Date.now();
      showToast('success', `"${name}" updated.`);
    }
  } else {
    // Create new
    const newProject = {
      id: `proj-${Date.now()}`,
      name,
      description: descInput?.value.trim() || '',
      color: state.selectedColor,
      status: statusSelect?.value || 'active',
      progress: 0,
      tasks: { open: 0, total: 0 },
      members: [{ initials: 'AD', color: 'linear-gradient(135deg,#2563EB,#7C3AED)', name: 'Alex Dawson' }],
      due: dueInput?.value || '',
      updatedAt: Date.now(),
      favorite: false,
    };
    state.projects.unshift(newProject);
    showToast('success', `Project "${name}" created!`);
  }

  closeModal();
  renderAll();
}

function updateColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color === state.selectedColor);
  });
}

function initModal() {
  // Open modal buttons
  ['createProjectBtn', 'emptyCreateBtn', 'sidebarNewProject'].forEach(btnId => {
    document.getElementById(btnId)?.addEventListener('click', () => openModal());
  });

  document.getElementById('closeProjectModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelProjectModal')?.addEventListener('click', closeModal);
  document.getElementById('saveProjectBtn')?.addEventListener('click', saveProject);

  // Close on backdrop click
  document.getElementById('projectModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('projectModal')) closeModal();
  });

  // Color swatches
  document.getElementById('colorSwatches')?.addEventListener('click', e => {
    const swatch = e.target.closest('.color-swatch');
    if (swatch) {
      state.selectedColor = swatch.dataset.color;
      updateColorSwatches();
    }
  });

  // Name input enter
  document.getElementById('projectName')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveProject();
  });
}

/* ─────────────────────────────────────────
   EVENT DELEGATION — CARD INTERACTIONS
───────────────────────────────────────── */

function initCardDelegation() {
  // Grid and favorites grid
  ['projectsGrid', 'favoritesGrid'].forEach(gridId => {
    document.getElementById(gridId)?.addEventListener('click', e => {
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        toggleFavorite(favBtn.dataset.id);
        return;
      }

      const moreBtn = e.target.closest('.more-btn');
      if (moreBtn) {
        e.stopPropagation();
        showMoreMenu(moreBtn, moreBtn.dataset.id);
        return;
      }

      const card = e.target.closest('.project-card');
      if (card) openDrawer(card.dataset.id);
    });

    // Keyboard support
    document.getElementById(gridId)?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.project-card');
        if (card) {
          e.preventDefault();
          openDrawer(card.dataset.id);
        }
      }
    });
  });
}

/* ─────────────────────────────────────────
   CONTEXT MENU (MORE OPTIONS)
───────────────────────────────────────── */

let activeMenu = null;

function showMoreMenu(trigger, projectId) {
  closeMoreMenu();
  const project = getProject(projectId);
  if (!project) return;

  const menu = document.createElement('div');
  menu.className = 'more-menu';
  menu.style.cssText = `
    position:fixed;
    background:var(--card);
    border:1px solid var(--border);
    border-radius:var(--radius-lg);
    box-shadow:var(--shadow-lg);
    z-index:900;
    min-width:160px;
    padding:4px;
    animation:dropIn 150ms cubic-bezier(0.34,1.2,0.64,1);
  `;

  const isFav = state.favorites.has(projectId);
  const items = [
    { label: 'Open project', action: () => openDrawer(projectId) },
    { label: isFav ? 'Remove from favorites' : 'Add to favorites', action: () => toggleFavorite(projectId) },
    { label: 'Edit project', action: () => openModal(projectId) },
    { divider: true },
    { label: 'Archive', action: () => archiveProject(projectId), danger: true },
  ];

  items.forEach(item => {
    if (item.divider) {
      const div = document.createElement('div');
      div.style.cssText = 'height:1px;background:var(--border);margin:4px 0;';
      menu.appendChild(div);
      return;
    }
    const btn = document.createElement('button');
    btn.textContent = item.label;
    btn.style.cssText = `
      display:block;
      width:100%;
      text-align:left;
      font-family:var(--font-sans);
      font-size:.8125rem;
      font-weight:500;
      color:${item.danger ? 'var(--danger)' : 'var(--text-secondary)'};
      background:transparent;
      border:none;
      padding:7px 12px;
      border-radius:6px;
      cursor:pointer;
      transition:background var(--transition),color var(--transition);
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = item.danger ? 'var(--danger-light)' : 'var(--border-subtle)';
      if (!item.danger) btn.style.color = 'var(--text)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
      btn.style.color = item.danger ? 'var(--danger)' : 'var(--text-secondary)';
    });
    btn.addEventListener('click', () => {
      closeMoreMenu();
      item.action();
    });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  activeMenu = menu;

  // Position
  const rect = trigger.getBoundingClientRect();
  const menuW = 160;
  const menuH = 180;
  let left = rect.right - menuW;
  let top = rect.bottom + 4;
  if (left < 8) left = 8;
  if (top + menuH > window.innerHeight - 8) top = rect.top - menuH - 4;
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;

  setTimeout(() => {
    document.addEventListener('click', closeMoreMenu, { once: true });
    document.addEventListener('keydown', e => e.key === 'Escape' && closeMoreMenu());
  }, 0);
}

function closeMoreMenu() {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

function archiveProject(projectId) {
  const project = getProject(projectId);
  if (!project) return;
  if (project.status === 'archived') {
    showToast('info', `"${project.name}" is already archived.`);
    return;
  }
  project.status = 'archived';
  project.updatedAt = Date.now();
  showToast('info', `"${project.name}" archived.`);
  renderAll();
}

/* ─────────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────────── */

const TOAST_DURATION = 3500;

function showToast(type, message, duration = TOAST_DURATION) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '<path d="M3 8l3 3 5-6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    error: '<path d="M4 4l8 8M12 4l-8 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/>',
    warning: '<path d="M8 5v4M8 11v.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/>',
    info: '<circle cx="8" cy="8" r="6.5" stroke="white" stroke-width="1.4"/><path d="M8 6.5V9M8 11v.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">${icons[type] || icons.info}</svg>
    </div>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Dismiss">✕</button>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => dismiss(toast));
  container.appendChild(toast);

  const timer = setTimeout(() => dismiss(toast), duration);

  function dismiss(el) {
    clearTimeout(timer);
    el.classList.add('toast-exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  return toast;
}

/* ─────────────────────────────────────────
   SIDEBAR TOGGLE
───────────────────────────────────────── */

function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const shell = document.getElementById('appShell');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('sidebarOverlay');

  toggle?.addEventListener('click', () => {
    shell?.classList.toggle('sidebar-collapsed');
  });

  mobileBtn?.addEventListener('click', () => {
    shell?.classList.add('mobile-open');
  });

  overlay?.addEventListener('click', () => {
    shell?.classList.remove('mobile-open');
  });
}

/* ─────────────────────────────────────────
   TOPBAR DROPDOWNS
───────────────────────────────────────── */

function initDropdowns() {
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const markAllRead = document.getElementById('markAllRead');
  const notifDot = document.getElementById('notifDot');

  function toggleDropdown(dropdown, btn) {
    const isOpen = dropdown.style.display !== 'none';
    // Close all
    [notifDropdown, profileDropdown].forEach(d => {
      if (d) d.style.display = 'none';
    });
    [notifBtn, profileBtn].forEach(b => {
      if (b) b.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      dropdown.style.display = '';
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  notifBtn?.addEventListener('click', e => {
    e.stopPropagation();
    if (notifDropdown) toggleDropdown(notifDropdown, notifBtn);
  });

  profileBtn?.addEventListener('click', e => {
    e.stopPropagation();
    if (profileDropdown) toggleDropdown(profileDropdown, profileBtn);
  });

  document.addEventListener('click', () => {
    [notifDropdown, profileDropdown].forEach(d => {
      if (d) d.style.display = 'none';
    });
    [notifBtn, profileBtn].forEach(b => {
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });

  markAllRead?.addEventListener('click', () => {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
      item.classList.add('marking-read');
      setTimeout(() => {
        item.classList.remove('unread', 'marking-read');
        item.querySelector('.notif-unread-dot')?.remove();
      }, 400);
    });
    if (notifDot) notifDot.classList.add('hidden');
    showToast('success', 'All notifications marked as read.');
  });
}

/* ─────────────────────────────────────────
   TOPBAR SEARCH (CMD+K)
───────────────────────────────────────── */

function initTopbarSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

/* ─────────────────────────────────────────
   LOADING SKELETONS
───────────────────────────────────────── */

function showSkeletons(container, count = 4) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const sk = document.createElement('div');
    sk.className = 'project-card-skeleton';
    sk.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <div class="skeleton skeleton-icon" style="width:34px;height:34px;flex-shrink:0"></div>
        <div class="skeleton skeleton-text" style="width:60%;"></div>
      </div>
      <div class="skeleton skeleton-text" style="width:90%;margin-top:8px"></div>
      <div class="skeleton skeleton-text-sm" style="width:75%;margin-top:5px"></div>
      <div style="margin-top:14px">
        <div class="skeleton skeleton-text-sm" style="width:100%;height:6px;border-radius:99px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle)">
        <div style="display:flex;gap:-4px">
          <div class="skeleton skeleton-avatar" style="width:22px;height:22px"></div>
          <div class="skeleton skeleton-avatar" style="width:22px;height:22px;margin-left:-5px"></div>
        </div>
        <div class="skeleton skeleton-text-sm" style="width:60px"></div>
      </div>
    `;
    container.appendChild(sk);
  }
}

/* ─────────────────────────────────────────
   PROGRESS ANIMATION OBSERVER
   Animates progress bars when cards scroll into view
───────────────────────────────────────── */

function initProgressObserver() {
  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.project-card-progress-fill');
        if (fill && fill.style.width === '0%') {
          fill.style.width = fill.dataset.target + '%';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
}

/* ─────────────────────────────────────────
   WORKSPACE DROPDOWN
───────────────────────────────────────── */

function initWorkspaceBtn() {
  document.getElementById('workspaceBtn')?.addEventListener('click', () => {
    showToast('info', 'Workspace switcher coming soon.');
  });
}

/* ─────────────────────────────────────────
   KEYBOARD NAVIGATION
───────────────────────────────────────── */

function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    // Focus project search with /
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      document.getElementById('projectSearch')?.focus();
    }

    // New project with N (not in input)
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      openModal();
    }
  });
}

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */

function boot() {
  // Load persisted state
  persistLoad();

  // Hydrate projects with persisted favorites
  state.projects = PROJECTS_DATA.map(p => ({
    ...p,
    favorite: state.favorites.has(p.id),
  }));

  // Apply persisted view/sort
  const sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.value = state.sort;

  // Show loading skeletons briefly for realism
  const gridEl = document.getElementById('projectsGrid');
  showSkeletons(gridEl, 4);

  setTimeout(() => {
    // Init everything
    initSidebar();
    initDropdowns();
    initModal();
    initDrawer();
    initCardDelegation();
    initSearch();
    initFilters();
    initSort();
    initViewToggle();
    initTopbarSearch();
    initWorkspaceBtn();
    initKeyboardNav();

    // Render
    renderAll();
    renderStats();

    // Animate progress bars
    setTimeout(initProgressObserver, 100);
  }, 250);
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}