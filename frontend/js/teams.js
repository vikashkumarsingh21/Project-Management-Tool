/**
 * TaskFlow — Teams & Members Hub Controller logic
 */

// Initial Dataset Architecture
let teamsData = [
  { id: "team-1", name: "Engineering Platform", lead: "Alex Dawson", desc: "Core cloud architecture infrastructure pipelines and operational development stacks.", projectsCount: 4, membersCount: 6, group: "tech", color: "#2563EB" },
  { id: "team-2", name: "Product & UI/UX Design", lead: "Sarah Jenkins", desc: "User research workflows, interactive design system definitions, and mock cycles.", projectsCount: 3, membersCount: 4, group: "creative", color: "#7C3AED" },
  { id: "team-3", name: "Growth Marketing", lead: "Jamie Lee", desc: "Conversion funnels optimizations, SEO analytics dashboards, and campaign telemetry.", projectsCount: 2, membersCount: 3, group: "creative", color: "#EC4899" },
  { id: "team-4", name: "Security Architecture", lead: "Maya Lin", desc: "Threat vectors isolation paradigms, encryption frameworks, compliance audits.", projectsCount: 1, membersCount: 5, group: "tech", color: "#0891B2" }
];

let membersData = [
  { id: "mem-1", name: "Alex Dawson", email: "alex@acmecorp.io", role: "Engineering Director", teamId: "team-1", status: "Active", initials: "AD", color: "#10B981" },
  { id: "mem-2", name: "Sarah Jenkins", email: "sarah.j@acmecorp.io", role: "Product Manager", teamId: "team-2", status: "Active", initials: "SJ", color: "#3B82F6" },
  { id: "mem-3", name: "Jamie Lee", email: "jamie@acmecorp.io", role: "Growth Specialist", teamId: "team-3", status: "Active", initials: "JL", color: "#6366F1" },
  { id: "mem-4", name: "Maya Lin", email: "maya@acmecorp.io", role: "SecOps Principal", teamId: "team-4", status: "Active", initials: "ML", color: "#F59E0B" },
  { id: "mem-5", name: "David Miller", email: "david.m@acmecorp.io", role: "Frontend Specialist", teamId: "team-1", status: "Active", initials: "DM", color: "#EC4899" },
  { id: "mem-6", name: "Clara Oswald", email: "clara@acmecorp.io", role: "UI/UX Researcher", teamId: "team-2", status: "Invited", initials: "CO", color: "#8B5CF6" },
  { id: "mem-7", name: "Jonathan Archer", email: "j.archer@acmecorp.io", role: "DevOps Engineer", teamId: "team-1", status: "Active", initials: "JA", color: "#EF4444" }
];

// Contextual Environment Tracking States
let activeViewTab = "teamsSection"; // or membersSection
let currentTeamFilter = "all";
let currentMemberFilter = "all";
let currentSearchTerm = "";
let currentSortCriteria = "alphabetic";

document.addEventListener("DOMContentLoaded", () => {
  initShellBehaviors();
  initTabTriggers();
  initFilterTriggers();
  initFormSwatches();
  
  // Render Initial View State Data
  renderAppModule();
});

// Sync Shell UI Behaviors (Sidebar and Dropdown Management)
function initShellBehaviors() {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const sidebar = document.getElementById("sidebar");
  const appShell = document.getElementById("appShell");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      if (appShell) appShell.classList.toggle("sidebar-collapsed");
    });
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.add("mobile-open");
      sidebarOverlay.classList.add("visible");
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open");
      sidebarOverlay.classList.remove("visible");
    });
  }

  // Topbar dropdown menus toggle logic
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === "none" ? "block" : "none";
      if (profileDropdown) profileDropdown.style.display = "none";
    });
  }
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === "none" ? "block" : "none";
      if (notifDropdown) notifDropdown.style.display = "none";
    });
  }
  document.addEventListener("click", () => {
    if (notifDropdown) notifDropdown.style.display = "none";
    if (profileDropdown) profileDropdown.style.display = "none";
  });

  // Wire Up Module Buttons
  document.getElementById("openCreateTeamBtn").addEventListener("click", () => openTeamModal());
  document.getElementById("openInviteBtn").addEventListener("click", () => openInviteModal());
}

// Asana Style Section Tabs Switcher
function initTabTriggers() {
  const tabs = document.querySelectorAll(".teams-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      activeViewTab = tab.getAttribute("data-target");
      
      const searchInput = document.getElementById("moduleSearchInput");
      const teamFilters = document.getElementById("teamFilterGroup");
      const memberFilters = document.getElementById("memberFilterGroup");
      
      if (activeViewTab === "teamsSection") {
        document.getElementById("teamsSection").style.display = "block";
        document.getElementById("membersSection").style.display = "none";
        teamFilters.style.display = "flex";
        memberFilters.style.display = "none";
        searchInput.placeholder = "Search teams...";
      } else {
        document.getElementById("teamsSection").style.display = "none";
        document.getElementById("membersSection").style.display = "block";
        teamFilters.style.display = "none";
        memberFilters.style.display = "flex";
        searchInput.placeholder = "Search members via text matching...";
      }
      renderAppModule();
    });
  });
}

// Global Filter Change Watcher Listeners
function initFilterTriggers() {
  // Input search parameters event listener
  document.getElementById("moduleSearchInput").addEventListener("input", (e) => {
    currentSearchTerm = e.target.value.trim().toLowerCase();
    renderAppModule();
  });

  // Select box sort trigger logic
  document.getElementById("moduleSortSelect").addEventListener("change", (e) => {
    currentSortCriteria = e.target.value;
    renderAppModule();
  });

  // Filter Group Pill Toggles
  const processGroupPills = (containerId, stateSetter) => {
    const pills = document.querySelectorAll(`#${containerId} .filter-btn`);
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(`#${containerId} .filter-btn`).forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        stateSetter(pill.getAttribute("data-filter"));
        renderAppModule();
      });
    });
  };

  processGroupPills("teamFilterGroup", (val) => currentTeamFilter = val);
  processGroupPills("memberFilterGroup", (val) => currentMemberFilter = val);
}

// Configures color swatch choices inside Create Team Modal forms
function initFormSwatches() {
  const swatches = document.querySelectorAll("#teamColorSwatches .color-swatch");
  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      swatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
    });
  });
}

// Master execution pipeline wrapper
function renderAppModule() {
  calculateStructuralCounters();
  populateDropdownSelections();
  
  if (activeViewTab === "teamsSection") {
    renderTeamsGrid();
  } else {
    renderMembersList();
  }
}

// Aggregate numerical computations
function calculateStructuralCounters() {
  document.getElementById("statTotalTeams").textContent = teamsData.length;
  document.getElementById("statActiveMembers").textContent = membersData.filter(m => m.status === "Active").length;
  document.getElementById("statPendingInvites").textContent = membersData.filter(m => m.status === "Invited").length;
}

// Synchronizes active hub labels with selector configurations dynamically
function populateDropdownSelections() {
  const selectorElement = document.getElementById("memberTeam");
  if (!selectorElement) return;
  
  selectorElement.innerHTML = teamsData.map(team => {
    return `<option value="${team.id}">${team.name}</option>`;
  }).join("");
}

// Render dynamic data grid for teams view tab section
function renderTeamsGrid() {
  const container = document.getElementById("teamsGrid");
  const emptyState = document.getElementById("teamsEmptyState");
  
  // Filter Dataset Pipeline
  let filteredTeams = teamsData.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(currentSearchTerm) || team.desc.toLowerCase().includes(currentSearchTerm);
    const matchesFilter = currentTeamFilter === "all" || team.group === currentTeamFilter;
    return matchesSearch && matchesFilter;
  });

  // Sort Pipeline
  if (currentSortCriteria === "alphabetic") {
    filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSortCriteria === "size") {
    filteredTeams.sort((a, b) => b.membersCount - a.membersCount);
  }

  // Evaluate empty visibility state flags
  if (filteredTeams.length === 0) {
    container.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  container.innerHTML = filteredTeams.map(team => {
    return `
      <div class="project-card">
        <div class="team-card-header-actions">
          <div style="display: flex; align-items: center;">
            <span class="team-indicator-dot" style="background: ${team.color || '#3B82F6'}"></span>
            <h3 class="project-card-title" style="margin:0">${team.name}</h3>
          </div>
          <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size:11.5px" onclick="openTeamModal('${team.id}')">Edit</button>
        </div>
        <p class="project-card-desc" style="min-height:36px; margin: 8px 0">${team.desc}</p>
        <div class="team-lead-badge-row">
          Lead: <span class="team-lead-bold">${team.lead}</span>
        </div>
        <div class="team-card-meta-row">
          <div class="team-card-meta-item">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 13c0-2 2.5-3 6-3s6 1 6 3"/></svg>
            <span>${team.membersCount} Members</span>
          </div>
          <div class="team-card-meta-item">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M6 2v12M10 2v12"/></svg>
            <span>${team.projectsCount} Projects</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%; margin-top:14px; text-align:center; justify-content:center" onclick="viewTeamMembersFilter('${team.id}')">View Team Directory →</button>
      </div>
    `;
  }).join("");
}

// Render responsive table framework directory listings data rows
function renderMembersList() {
  const tbody = document.getElementById("membersTableBody");
  const emptyState = document.getElementById("teamsEmptyState");

  let filteredMembers = membersData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(currentSearchTerm) || member.email.toLowerCase().includes(currentSearchTerm) || member.role.toLowerCase().includes(currentSearchTerm);
    const matchesFilter = currentMemberFilter === "all" || member.status === currentMemberFilter;
    return matchesSearch && matchesFilter;
  });

  if (currentSortCriteria === "alphabetic") {
    filteredMembers.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filteredMembers.length === 0) {
    tbody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  tbody.innerHTML = filteredMembers.map(member => {
    const matchingTeam = teamsData.find(t => t.id === member.teamId);
    const teamLabel = matchingTeam ? matchingTeam.name : "Unassigned Hub";
    const statusClass = member.status.toLowerCase();

    return `
      <tr>
        <td>
          <div class="profile-cell-identity">
            <div class="member-avatar-badge" style="background: ${member.color || '#6B7280'}">${member.initials}</div>
            <span class="profile-cell-name">${member.name}</span>
          </div>
        </td>
        <td style="color: var(--text-muted)">${member.email}</td>
        <td>font-medium ${member.role}</td>
        <td>
          <span style="display:inline-flex; align-items:center; font-size:12.5px">
            <span class="team-indicator-dot" style="background:${matchingTeam ? matchingTeam.color : '#9CA3AF'}"></span>
            ${teamLabel}
          </span>
        </td>
        <td>
          <span class="status-pill ${statusClass}">${member.status}</span>
        </td>
        <td style="text-align: right;">
          <button class="action-icon-btn" title="Remove Member Access" onclick="removeMember('${member.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Contextual action wrapper to switch views and isolate dynamic scopes
function viewTeamMembersFilter(teamId) {
  currentSearchTerm = "";
  document.getElementById("moduleSearchInput").value = "";
  
  // Pivot UI Layout Tab Focus
  document.getElementById("tabMembers").click();
  
  // Isolate table rendering scopes directly
  const tbody = document.getElementById("membersTableBody");
  const specificMembers = membersData.filter(m => m.teamId === teamId);
  
  document.getElementById("memberFilterGroup").style.display = "flex";
  
  if (specificMembers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted)">No specialized profiles registered here yet.</td></tr>`;
    return;
  }

  // Fallthrough directly into localized list renders override parameters loop
  currentSortCriteria = "alphabetic";
  membersData = membersData.filter(m => m.teamId === teamId).concat(membersData.filter(m => m.teamId !== teamId));
  renderMembersList();
  
  showToast("Filtering workspace members allocation lists.");
}

// Open Form Modals Logic Controller Context
function openTeamModal(teamId = null) {
  const modal = document.getElementById("teamModal");
  const title = document.getElementById("teamModalTitle");
  const form = document.getElementById("teamForm");
  
  modal.style.display = "flex";
  
  if (teamId) {
    title.textContent = "Edit team configurations";
    const team = teamsData.find(t => t.id === teamId);
    document.getElementById("editTeamId").value = team.id;
    document.getElementById("teamName").value = team.name;
    document.getElementById("teamLead").value = team.lead;
    document.getElementById("teamDesc").value = team.desc;
    document.getElementById("teamProjectsCount").value = team.projectsCount;
    
    // Highlight configured active color profiles
    document.querySelectorAll("#teamColorSwatches .color-swatch").forEach(swatch => {
      if (swatch.getAttribute("data-color") === team.color) {
        swatch.classList.add("active");
      } else {
        swatch.classList.remove("active");
      }
    });
  } else {
    title.textContent = "Create operational team container";
    form.reset();
    document.getElementById("editTeamId").value = "";
  }
}

function openInviteModal() {
  document.getElementById("inviteForm").reset();
  document.getElementById("inviteModal").style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Form Handlers Submission Targets Processing
function handleTeamSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("editTeamId").value;
  const name = document.getElementById("teamName").value.trim();
  const lead = document.getElementById("teamLead").value.trim();
  const desc = document.getElementById("teamDesc").value.trim();
  const projectsCount = parseInt(document.getElementById("teamProjectsCount").value) || 0;
  const activeColor = document.querySelector("#teamColorSwatches .color-swatch.active").getAttribute("data-color");

  if (id) {
    // Edit flow
    teamsData = teamsData.map(t => {
      if (t.id === id) {
        return { ...t, name, lead, desc, projectsCount, color: activeColor };
      }
      return t;
    });
    showToast(`Updated team metadata for "${name}" successfully.`);
  } else {
    // Structural compilation initialization flow
    const newId = `team-${Date.now()}`;
    teamsData.push({
      id: newId,
      name,
      lead,
      desc,
      projectsCount,
      membersCount: 0,
      group: "tech",
      color: activeColor
    });
    showToast(`Successfully registered new team "${name}" inside hub.`);
  }

  closeModal("teamModal");
  renderAppModule();
}

function handleInviteSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("memberName").value.trim();
  const email = document.getElementById("memberEmail").value.trim();
  const role = document.getElementById("memberRole").value.trim();
  const teamId = document.getElementById("memberTeam").value;

  const nameParts = name.split(" ");
  const initials = nameParts.length > 1 ? nameParts[0][0] + nameParts[1][0] : nameParts[0][0];

  const colors = ["#2563EB", "#7C3AED", "#EC4899", "#0891B2", "#22C55E"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  membersData.push({
    id: `mem-${Date.now()}`,
    name,
    email,
    role,
    teamId,
    status: "Invited",
    initials: initials.toUpperCase(),
    color: randomColor
  });

  // Dynamically increment targeted team counts structures
  teamsData = teamsData.map(team => {
    if (team.id === teamId) {
      return { ...team, membersCount: team.membersCount + 1 };
    }
    return team;
  });

  showToast(`Corporate access token invitation dispatched to ${email}.`);
  closeModal("inviteModal");
  renderAppModule();
}

// Delete action flow
function removeMember(memberId) {
  const member = membersData.find(m => m.id === memberId);
  if (!member) return;

  if (confirm(`Revoke organizational workspace clearance vectors for ${member.name}?`)) {
    // Safely decrement aggregate maps values counter
    teamsData = teamsData.map(team => {
      if (team.id === member.teamId) {
        return { ...team, membersCount: Math.max(0, team.membersCount - 1) };
      }
      return team;
    });

    membersData = membersData.filter(m => m.id !== memberId);
    showToast("Profile credentials unlinked successfully.");
    renderAppModule();
  }
}

// Enterprise SaaS Dynamic Toast Creator helper logic
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.cssText = `
    background: #0F172A;
    color: #ffffff;
    padding: 12px 16px;
    border-radius: 6px;
    margin-top: 8px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.25s ease forwards;
  `;
  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#22C55E" stroke-width="2"><path d="M3 8.5l3.5 3.5L13 4.5"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.2s ease forwards";
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}