/**
 * TaskFlow Project Calendar Module
 * Handles Month, Week, Day view switches and mock/live database states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Calendar Initialization Context ---
  let currentDate = new Date(2026, 5, 10); // Standardized to match active core project timelines (June 10, 2026)
  let activeView = 'month';
  
  // Seed Records Matrix (Deadlines, Meetings, Milestones)
  let events = [
    { id: '1', title: 'Platform v3 Alpha Launch', type: 'milestone', project: 'Platform v3', date: '2026-06-03', time: '09:00', description: 'Major build delivery checkpoint for infrastructure validation.' },
    { id: '2', title: 'Sprint Review & Sync', type: 'meeting', project: 'Platform v3', date: '2026-06-10', time: '10:00', description: 'Bi-weekly core architecture and engineering review.' },
    { id: '3', title: 'Patch Core Push Handlers', type: 'deadline', project: 'Mobile App', date: '2026-06-10', time: '15:30', description: 'Resolve transport socket termination errors observed in staging.' },
    { id: '4', title: 'OAuth Scopes Architecture Sync', type: 'meeting', project: 'API Gateway', date: '2026-06-11', time: '14:00', description: 'Review security vectors for upstream microservice parameters.' },
    { id: '5', title: 'Prod DB Schema Consolidation', type: 'deadline', project: 'Platform v3', date: '2026-06-15', time: '21:00', description: 'Execute zero-downtime data migration on production clusters.' },
    { id: '6', title: 'Mobile Navigation Design Freeze', type: 'milestone', project: 'Mobile App', date: '2026-06-19', time: '11:00', description: 'Final sign-off on layouts and asset pipelines.' },
    { id: '7', title: 'Beta Testing Kickoff Group', type: 'meeting', project: 'Mobile App', date: '2026-06-24', time: '13:00', description: 'Onboard external framework integration engineers.' }
  ];

  // DOM Elements Target References
  const calendarLabel = document.getElementById('calendarLabel');
  const calendarViewBody = document.getElementById('calendarViewBody');
  const upcomingEventsList = document.getElementById('upcomingEventsList');
  
  // Navigation & View Toggles
  document.getElementById('btnToday').addEventListener('click', () => { currentDate = new Date(2026, 5, 10); renderAll(); });
  document.getElementById('btnPrev').addEventListener('click', () => { adjustDate(-1); });
  document.getElementById('btnNext').addEventListener('click', () => { adjustDate(1); });
  
  const viewToggles = [
    { el: document.getElementById('toggleMonth'), view: 'month' },
    { el: document.getElementById('toggleWeek'), view: 'week' },
    { el: document.getElementById('toggleDay'), view: 'day' }
  ];
  
  viewToggles.forEach(toggle => {
    toggle.el.addEventListener('click', () => {
      viewToggles.forEach(t => t.el.classList.remove('active'));
      toggle.el.classList.add('active');
      activeView = toggle.view;
      renderAll();
    });
  });

  // Filter Event Watchers
  const filterDeadline = document.getElementById('filterDeadline');
  const filterMeeting = document.getElementById('filterMeeting');
  const filterMilestone = document.getElementById('filterMilestone');
  [filterDeadline, filterMeeting, filterMilestone].forEach(box => box.addEventListener('change', renderAll));

  // Modal Control Interactivity
  const createModal = document.getElementById('createEventModal');
  const createBackdrop = document.getElementById('createModalBackdrop');
  const detailModal = document.getElementById('eventDetailModal');
  const detailBackdrop = document.getElementById('detailModalBackdrop');
  let selectedEventId = null;

  document.getElementById('createEventBtnTop').addEventListener('click', () => openCreateModal());
  document.getElementById('createEventBtnSidebar').addEventListener('click', () => openCreateModal());
  document.getElementById('closeCreateModal').addEventListener('click', closeModals);
  document.getElementById('btnCancelCreate').addEventListener('click', closeModals);
  document.getElementById('closeDetailModal').addEventListener('click', closeModals);
  document.getElementById('btnCloseDetail').addEventListener('click', closeModals);
  
  document.getElementById('createEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newEvent = {
      id: String(Date.now()),
      title: document.getElementById('eventTitle').value,
      type: document.getElementById('eventType').value,
      project: document.getElementById('eventProject').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value || '12:00',
      description: document.getElementById('eventDescription').value || 'No additional notes provided.'
    };
    events.push(newEvent);
    closeModals();
    renderAll();
  });

  document.getElementById('btnDeleteEvent').addEventListener('click', () => {
    if (selectedEventId) {
      events = events.filter(ev => ev.id !== selectedEventId);
      closeModals();
      renderAll();
    }
  });

  // --- Core Layout Engine Routers ---
  function adjustDate(direction) {
    if (activeView === 'month') currentDate.setMonth(currentDate.getMonth() + direction);
    else if (activeView === 'week') currentDate.setDate(currentDate.getDate() + (direction * 7));
    else if (activeView === 'day') currentDate.setDate(currentDate.getDate() + direction);
    renderAll();
  }

  function getFilteredEvents() {
    return events.filter(ev => {
      if (ev.type === 'deadline' && !filterDeadline.checked) return false;
      if (ev.type === 'meeting' && !filterMeeting.checked) return false;
      if (ev.type === 'milestone' && !filterMilestone.checked) return false;
      return true;
    });
  }

  function renderAll() {
    calendarViewBody.innerHTML = '';
    const activeFiltered = getFilteredEvents();
    
    if (activeView === 'month') renderMonthView(activeFiltered);
    else if (activeView === 'week') renderWeekView(activeFiltered);
    else if (activeView === 'day') renderDayView(activeFiltered);
    
    renderUpcomingPanel(activeFiltered);
  }

  // --- View Generators ---
  function renderMonthView(filtered) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    calendarLabel.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const container = document.createElement('div');
    container.className = 'month-view-container';
    
    // Day Headers
    let headerHtml = `<div class="month-grid-header">`;
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => headerHtml += `<div>${d}</div>`);
    headerHtml += `</div>`;
    container.innerHTML = headerHtml;
    
    const gridBody = document.createElement('div');
    gridBody.className = 'month-grid-body';
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    // Trailing cells from previous month
    for (let i = firstDayIndex; i > 0; i--) {
      const dayNum = prevTotalDays - i + 1;
      const cellDateStr = formatIsoDate(year, month - 1, dayNum);
      gridBody.appendChild(createMonthCell(dayNum, true, cellDateStr, filtered));
    }
    
    // Active month cells
    for (let day = 1; day <= totalDays; day++) {
      const cellDateStr = formatIsoDate(year, month, day);
      gridBody.appendChild(createMonthCell(day, false, cellDateStr, filtered));
    }
    
    // Append grid layout to component canvas
    container.appendChild(gridBody);
    calendarViewBody.appendChild(container);
  }

  function createMonthCell(dayNum, isOutside, dateStr, filtered) {
    const cell = document.createElement('div');
    cell.className = `calendar-cell ${isOutside ? 'outside' : ''}`;
    
    const sysTodayStr = new Date(2026, 5, 10).toISOString().split('T')[0];
    if (dateStr === sysTodayStr) cell.classList.add('today');
    
    cell.innerHTML = `<div class="cell-header"><span class="cell-day-num">${dayNum}</span></div>`;
    
    const pillsWrap = document.createElement('div');
    pillsWrap.className = 'calendar-event-pills';
    
    filtered.filter(e => e.date === dateStr).forEach(ev => {
      const pill = document.createElement('div');
      pill.className = `event-pill ${ev.type}`;
      pill.textContent = `${ev.time} ${ev.title}`;
      pill.addEventListener('click', (e) => { e.stopPropagation(); openDetailModal(ev.id); });
      pillsWrap.appendChild(pill);
    });
    
    cell.appendChild(pillsWrap);
    cell.addEventListener('click', () => openCreateModal(dateStr));
    return cell;
  }

  function renderWeekView(filtered) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    calendarLabel.textContent = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    const container = document.createElement('div');
    container.className = 'timeline-grid-container';
    
    let headerHtml = `<div class="timeline-header" style="grid-template-columns: 60px repeat(7, 1fr);"><div></div>`;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      headerHtml += `<div>${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>`;
    }
    headerHtml += `</div>`;
    container.innerHTML = headerHtml;

    const bodyLayout = document.createElement('div');
    bodyLayout.className = 'timeline-body';
    bodyLayout.style.gridTemplateColumns = '60px 1fr';
    
    // Hours Label Column
    const hoursCol = document.createElement('div');
    hoursCol.className = 'timeline-hours-column';
    for (let h = 0; h < 24; h++) {
      const slot = document.createElement('div');
      slot.className = 'timeline-hour-slot';
      slot.textContent = h === 0 ? '12 AM' : h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`;
      hoursCol.appendChild(slot);
    }
    bodyLayout.appendChild(hoursCol);

    // Columns Wrapper Canvas
    const columnsWrapper = document.createElement('div');
    columnsWrapper.className = 'timeline-columns-wrapper';
    columnsWrapper.style.gridTemplateColumns = 'repeat(7, 1fr)';
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dayStr = d.toISOString().split('T')[0];
      
      const col = document.createElement('div');
      col.className = 'timeline-day-column';
      col.addEventListener('click', () => openCreateModal(dayStr));
      
      filtered.filter(e => e.date === dayStr).forEach(ev => {
        col.appendChild(createTimelineCard(ev));
      });
      columnsWrapper.appendChild(col);
    }
    
    bodyLayout.appendChild(columnsWrapper);
    container.appendChild(bodyLayout);
    calendarViewBody.appendChild(container);
  }

  function renderDayView(filtered) {
    calendarLabel.textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const targetDayStr = currentDate.toISOString().split('T')[0];

    const container = document.createElement('div');
    container.className = 'timeline-grid-container';
    
    container.innerHTML = `<div class="timeline-header" style="grid-template-columns: 60px 1fr;"><div></div><div>Schedule Tasks</div></div>`;
    
    const bodyLayout = document.createElement('div');
    bodyLayout.className = 'timeline-body';
    bodyLayout.style.gridTemplateColumns = '60px 1fr';
    
    const hoursCol = document.createElement('div');
    hoursCol.className = 'timeline-hours-column';
    for (let h = 0; h < 24; h++) {
      const slot = document.createElement('div');
      slot.className = 'timeline-hour-slot';
      slot.textContent = h === 0 ? '12 AM' : h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`;
      hoursCol.appendChild(slot);
    }
    bodyLayout.appendChild(hoursCol);

    const col = document.createElement('div');
    col.className = 'timeline-day-column';
    col.addEventListener('click', () => openCreateModal(targetDayStr));
    
    filtered.filter(e => e.date === targetDayStr).forEach(ev => {
      col.appendChild(createTimelineCard(ev));
    });
    
    bodyLayout.appendChild(col);
    container.appendChild(bodyLayout);
    calendarViewBody.appendChild(container);
  }

  function createTimelineCard(ev) {
    const card = document.createElement('div');
    card.className = `timeline-event-card ${ev.type}`;
    
    const [hrs, mins] = ev.time.split(':').map(Number);
    const topPosition = (hrs * 50) + ((mins / 60) * 50);
    
    card.style.top = `${topPosition}px`;
    card.style.height = '46px'; // Default timeline event duration box height
    
    card.innerHTML = `
      <span class="card-time">${ev.time}</span>
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${ev.title}</span>
    `;
    
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailModal(ev.id);
    });
    return card;
  }

  // --- Side Panels Dashboard Engine ---
  function renderUpcomingPanel(filtered) {
    upcomingEventsList.innerHTML = '';
    const referenceLine = new Date(2026, 5, 10).toISOString().split('T')[0];
    
    // Chronological tracking list compilation
    const upcoming = filtered
      .filter(e => e.date >= referenceLine)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
      
    if (upcoming.length === 0) {
      upcomingEventsList.innerHTML = `<div style="font-size:0.8125rem; color:var(--text-muted); text-align:center; padding:var(--sp-4) 0;">No active items ahead.</div>`;
      return;
    }
    
    upcoming.slice(0, 5).forEach(ev => {
      const item = document.createElement('div');
      item.className = `upcoming-item ${ev.type}`;
      
      const formattedDate = new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      item.innerHTML = `
        <div class="upcoming-title">${ev.title}</div>
        <div class="upcoming-meta"><span>${formattedDate} · ${ev.time}</span> <span style="opacity:0.75; font-weight:600;">${ev.project}</span></div>
      `;
      item.addEventListener('click', () => openDetailModal(ev.id));
      upcomingEventsList.appendChild(item);
    });
  }

  // --- Utility Helper Functions ---
  function formatIsoDate(y, m, d) {
    const dateObj = new Date(y, m, d);
    const yr = dateObj.getFullYear();
    const mn = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dy = String(dateObj.getDate()).padStart(2, '0');
    return `${yr}-${mn}-${dy}`;
  }

  function openCreateModal(dateStr = '') {
    createModal.style.display = 'block';
    createBackdrop.style.display = 'block';
    document.getElementById('eventDate').value = dateStr || new Date(2026, 5, 10).toISOString().split('T')[0];
  }

  function openDetailModal(id) {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    
    selectedEventId = id;
    detailModal.style.display = 'block';
    detailBackdrop.style.display = 'block';
    
    const badge = document.getElementById('detailTypeBadge');
    badge.className = `detail-type-badge ${ev.type}`;
    badge.textContent = ev.type === 'deadline' ? 'Task Deadline' : ev.type === 'meeting' ? 'Meeting' : 'Project Milestone';
    
    document.getElementById('detailTitle').textContent = ev.title;
    
    const dateLong = new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('detailDateTime').textContent = `${dateLong} at ${ev.time}`;
    document.getElementById('detailProject').innerHTML = `<span class="project-dot-indicator" style="background:${ev.project === 'Platform v3' ? '#2563EB' : ev.project === 'Mobile App' ? '#7C3AED' : '#0891B2'}"></span> ${ev.project}`;
    document.getElementById('detailDescription').textContent = ev.description;
  }

  function closeModals() {
    createModal.style.display = 'none';
    createBackdrop.style.display = 'none';
    detailModal.style.display = 'none';
    detailBackdrop.style.display = 'none';
    document.getElementById('createEventForm').reset();
    selectedEventId = null;
  }
  
  // Render entry sequence pipeline on mount
  renderAll();
});