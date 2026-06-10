/**
 * ============================================================================
 * KANBAN.JS — Native Core Engine For TaskFlow Board
 * ============================================================================
 */

// Initial Seed Data Store
let tasks = [
  { id: '1', title: 'Architect application data scheme layouts', assignee: 'Sarah Connor', due: '2026-06-15', priority: 'critical', status: 'todo' },
  { id: '2', title: 'Draft API security policies & access controls', assignee: 'John Connor', due: '2026-06-20', priority: 'high', status: 'todo' },
  { id: '3', title: 'Refactor main layout structural components', assignee: 'Miles Dyson', due: '2026-06-11', priority: 'medium', status: 'inprogress' },
  { id: '4', title: 'Verify user validation edge cases inside login', assignee: 'Sarah Connor', due: '2026-06-09', priority: 'low', status: 'review' },
  { id: '5', title: 'Setup CI/CD deployment configuration pipelines', assignee: 'Miles Dyson', due: '2026-06-05', priority: 'medium', status: 'completed' }
];

// Document Selectors
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const modalTitleText = document.getElementById('modal-title-text');
const taskIdField = document.getElementById('task-id-field');

// Initialize Board View on load
document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
  initDragAndDrop();
  setupEventListeners();
});

// Render cards safely into respective zones
function renderBoard() {
  const columns = {
    todo: document.getElementById('zone-todo'),
    inprogress: document.getElementById('zone-inprogress'),
    review: document.getElementById('zone-review'),
    completed: document.getElementById('zone-completed')
  };

  // Clear previous allocations
  Object.values(columns).forEach(zone => zone.innerHTML = '');

  // Distribute Cards
  tasks.forEach(task => {
    const targetZone = columns[task.status];
    if (targetZone) {
      targetZone.appendChild(createCardElement(task));
    }
  });

  // Keep column count badges live
  updateColumnCounters();
}

// Generate Native DOM Elements for Tasks
function createCardElement(task) {
  const card = document.createElement('div');
  card.className = 'kb-card';
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-id', task.id);

  // Parse Initials for visual avatar representation
  const initials = task.assignee !== 'Unassigned' 
    ? task.assignee.split(' ').map(n => n[0]).join('').toUpperCase() 
    : '?';

  card.innerHTML = `
    <div class="kb-card-header">
      <h3 class="kb-card-title">${escapeHTML(task.title)}</h3>
      <button class="kb-card-edit-btn" onclick="openEditModal('${task.id}')" type="button" aria-label="Edit Task">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
      </button>
    </div>
    <div class="kb-card-footer">
      <div class="kb-card-meta">
        <span class="priority-badge ${task.priority}">
          <span class="dot"></span>${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        ${task.due ? `
          <span class="kb-card-date">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            ${task.due}
          </span>
        ` : ''}
      </div>
      <div class="kb-card-avatar" title="${escapeHTML(task.assignee)}">${initials}</div>
    </div>
  `;
  return card;
}

// Drag and Drop Event Orchestration
function initDragAndDrop() {
  const containers = document.querySelectorAll('.kb-cards-dropzone');
  let draggedCard = null;

  document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('kb-card')) {
      draggedCard = e.target;
      draggedCard.classList.add('dragging');
    }
  });

  document.addEventListener('dragend', () => {
    if (draggedCard) {
      draggedCard.classList.remove('dragging');
      draggedCard = null;
    }
  });

  containers.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault(); // Required to allow landing structural drops
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      if (draggedCard) {
        const taskId = draggedCard.getAttribute('data-id');
        const nextColumnStatus = zone.parentElement.getAttribute('data-status');
        
        // Update item references in dataset
        const taskInstance = tasks.find(t => t.id === taskId);
        if (taskInstance && taskInstance.status !== nextColumnStatus) {
          taskInstance.status = nextColumnStatus;
          zone.appendChild(draggedCard);
          updateColumnCounters();
        }
      }
    });
  });
}

// Live Aggregate Updates for Headers
function updateColumnCounters() {
  const counts = { todo: 0, inprogress: 0, review: 0, completed: 0 };
  tasks.forEach(t => { if(counts[t.status] !== undefined) counts[t.status]++; });
  Object.keys(counts).forEach(statusKey => {
    document.getElementById(`count-${statusKey}`).textContent = counts[statusKey];
  });
}

// Modal Interactivity
function setupEventListeners() {
  document.getElementById('btn-add-task').addEventListener('click', openAddModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveTaskFormData();
  });
}

function openAddModal() {
  modalTitleText.textContent = "Create New Task";
  taskIdField.value = "";
  taskForm.reset();
  modal.classList.remove('hidden');
}

window.openEditModal = function(id) {
  const targetedTask = tasks.find(t => t.id === id);
  if (!targetedTask) return;

  modalTitleText.textContent = "Edit Existing Task";
  taskIdField.value = targetedTask.id;
  document.getElementById('task-title').value = targetedTask.title;
  document.getElementById('task-assignee').value = targetedTask.assignee;
  document.getElementById('task-priority').value = targetedTask.priority;
  document.getElementById('task-due').value = targetedTask.due;
  document.getElementById('task-status').value = targetedTask.status;

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

function saveTaskFormData() {
  const currentId = taskIdField.value;
  const taskPayload = {
    title: document.getElementById('task-title').value,
    assignee: document.getElementById('task-assignee').value,
    priority: document.getElementById('task-priority').value,
    due: document.getElementById('task-due').value,
    status: document.getElementById('task-status').value
  };

  if (currentId) {
    // Handling updates to an existing task
    const targetIdx = tasks.findIndex(t => t.id === currentId);
    if (targetIdx !== -1) {
      tasks[targetIdx] = { id: currentId, ...taskPayload };
    }
  } else {
    // Appending a brand new task entry
    const newId = (Math.max(...tasks.map(t => parseInt(t.id))) + 1).toString();
    tasks.push({ id: newId, ...taskPayload });
  }

  closeModal();
  renderBoard();
}

// Prevention helper against basic text insertion injections
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}