/**
 * TaskFlow — Enterprise Chat System Logic Controller
 */

// Active Selection State Focus Tracker
let currentActiveRoomId = "chan-1"; 

// Data Models Structuring Vault
let channelsData = [
  { id: "chan-1", name: "general", count: 18, purpose: "Company-wide text updates, announcements, and key project milestone sharing." },
  { id: "chan-2", name: "engineering", count: 12, purpose: "Technical discussion about core system architecture pipelines and engineering infrastructure." },
  { id: "chan-3", name: "product-design", count: 6, purpose: "User experience exploration, wireframe review sessions, and TaskFlow design system tokens sync." },
  { id: "chan-4", name: "marketing-growth", count: 8, purpose: "Conversion telemetry monitoring, search optimization metrics, and ad campaign planning." }
];

let dmsData = [
  { id: "dm-1", name: "Sarah Jenkins", role: "Product Manager", status: "online", initials: "SJ", bg: "#7C3AED", unread: 1 },
  { id: "dm-2", name: "Jamie Lee", role: "Growth Engineer", status: "online", initials: "JL", bg: "#EC4899", unread: 0 },
  { id: "dm-3", name: "Maya Lin", role: "SecOps Lead", status: "offline", initials: "ML", bg: "#0891B2", unread: 0 },
  { id: "dm-4", name: "David Miller", role: "Frontend Dev", status: "online", initials: "DM", bg: "#10B981", unread: 0 }
];

let teamsData = [
  { id: "team-1", name: "Core Architecture Stack Group" },
  { id: "team-2", name: "Growth Optimization Squad" },
  { id: "team-3", name: "Design System Tokens Guild" }
];

// Message logs historical vault map indexed by active roomId
let messagesHistoryVault = {
  "chan-1": [
    { type: "system", text: "Alex Dawson initialized the #general secure enterprise chat workspace." },
    { type: "received", author: "Sarah Jenkins", initials: "SJ", bg: "#7C3AED", timestamp: "11:05 AM", text: "Hey team! Welcome to the unified communication panel container. The response layout speed feels incredible." },
    { type: "received", author: "Jamie Lee", initials: "JL", bg: "#EC4899", timestamp: "11:12 AM", text: "Agreed. Having Slack flexibility with Microsoft Teams high-density structural grids fits perfectly here." },
    { type: "sent", author: "Alex Dawson", initials: "AD", bg: "#2563EB", timestamp: "11:20 AM", text: "Thanks everyone! I have configured full history query parameters, expressive emojis, and typing simulations." }
  ],
  "chan-2": [
    { type: "system", text: "System Log: Core engineering pipeline hooks established." },
    { type: "received", author: "David Miller", initials: "DM", bg: "#10B981", timestamp: "Yesterday", text: "Did anyone push the final typography variables adjustment into the production styling branch?" },
    { type: "received", author: "Maya Lin", initials: "ML", bg: "#0891B2", timestamp: "Yesterday", text: "Yes David, security telemetry cleared the code reviews and the build is active." }
  ],
  "chan-3": [
    { type: "received", author: "Sarah Jenkins", initials: "SJ", bg: "#7C3AED", timestamp: "2 days ago", text: "Please match the font-weight attributes on sidebar labels with the standard design tokens sheet." }
  ],
  "chan-4": [],
  "dm-1": [
    { type: "received", author: "Sarah Jenkins", initials: "SJ", bg: "#7C3AED", timestamp: "10:44 AM", text: "Hey Alex, let me know when you have 5 minutes to review the new project data sheets." }
  ],
  "dm-2": [],
  "dm-3": [
    { type: "system", text: "Maya Lin is currently offline. Transmitted payloads will remain queued." }
  ],
  "dm-4": []
};

// Expressive random responses array for live simulation loops
const autoReplyVault = [
  "That sounds excellent! Let's schedule a review sync for this tomorrow morning. 🚀",
  "Acknowledged. Pushing these layout configuration parameters live to staging now.",
  "Awesome! Thanks for clarifying that context for the workspace folder. 👍",
  "Let me investigate the error logs and loop back in a brief moment.",
  "Brilliant work! TaskFlow is scaling up exceptionally fast. 🎉"
];

const expressionsArray = ["🚀", "👍", "🎉", "🔥", "💯", "✨", "🙌", "✅"];

document.addEventListener("DOMContentLoaded", () => {
  initShellFrameControls();
  initSidebarListGenerators();
  initMessageStreamRenderer();
  initFunctionalEventWatchers();
});

// Sync Shell UI Collapsible Behaviors
function initShellFrameControls() {
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
}

// Map Data Arrays out to specific view containers
function initSidebarListGenerators() {
  const chanContainer = document.getElementById("channelsListContainer");
  const dmsContainer = document.getElementById("dmsListContainer");
  const teamsContainer = document.getElementById("teamsListContainer");

  // Generate Channels Rows
  chanContainer.innerHTML = channelsData.map(c => `
    <div class="chat-sidebar-item ${c.id === currentActiveRoomId ? 'is-active' : ''}" data-room-id="${c.id}">
      <div class="chat-item-left-block">
        <span style="color: var(--text-muted); font-weight: 500;">#</span>
        <span>${c.name}</span>
      </div>
    </div>
  `).join("");

  // Generate DMs Rows with Online Status indicators
  dmsContainer.innerHTML = dmsData.map(d => `
    <div class="chat-sidebar-item ${d.id === currentActiveRoomId ? 'is-active' : ''}" data-room-id="${d.id}">
      <div class="chat-item-left-block">
        <span class="status-indicator-dot ${d.status}"></span>
        <span>${d.name}</span>
      </div>
      ${d.unread > 0 ? `<span class="chat-item-badge">${d.unread}</span>` : ''}
    </div>
  `).join("");

  // Generate Team Rows
  teamsContainer.innerHTML = teamsData.map(t => `
    <div class="chat-sidebar-item" data-room-id="${t.id}" style="pointer-events: none; opacity: 0.85;">
      <div class="chat-item-left-block">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--text-muted);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span style="font-size: 13px;">${t.name}</span>
      </div>
    </div>
  `).join("");

  // Wire selection triggers
  document.querySelectorAll(".chat-sidebar-item[data-room-id]").forEach(item => {
    item.addEventListener("click", () => {
      currentActiveRoomId = item.getAttribute("data-room-id");
      
      // Clear specific unread state counts if targeted
      const selectedDm = dmsData.find(d => d.id === currentActiveRoomId);
      if (selectedDm) selectedDm.unread = 0;

      initSidebarListGenerators();
      initMessageStreamRenderer();
    });
  });
}

// Renders the messages for the active workspace view tab
function initMessageStreamRenderer(filterPhrase = "") {
  const container = document.getElementById("chatMessagesContainer");
  const headerTitle = document.getElementById("activeChatTitle");
  const headerBadge = document.getElementById("activeMemberBadge");
  const headerPurpose = document.getElementById("activeChatPurpose");
  const currentInputField = document.getElementById("chatMainInputField");

  // Sync Header Context labels
  const channelMatch = channelsData.find(c => c.id === currentActiveRoomId);
  const dmMatch = dmsData.find(d => d.id === currentActiveRoomId);

  if (channelMatch) {
    headerTitle.textContent = `# ${channelMatch.name}`;
    headerBadge.style.display = "inline-block";
    headerBadge.textContent = `${channelMatch.count} members`;
    headerPurpose.textContent = channelMatch.purpose;
    currentInputField.placeholder = `Message #${channelMatch.name}...`;
  } else if (dmMatch) {
    headerTitle.textContent = dmMatch.name;
    headerBadge.style.display = "inline-block";
    headerBadge.textContent = dmMatch.role;
    headerPurpose.textContent = `Direct secure communication link context established with status: ${dmMatch.status}.`;
    currentInputField.placeholder = `Message ${dmMatch.name}...`;
  }

  // Extract room log array reference
  let logArray = messagesHistoryVault[currentActiveRoomId] || [];

  // Filter content timeline if user typed a keyword search sequence
  if (filterPhrase.trim() !== "") {
    const query = filterPhrase.toLowerCase();
    logArray = logArray.filter(m => m.text && m.text.toLowerCase().includes(query));
  }

  if (logArray.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: var(--sp-12) 0; font-family: 'Inter', sans-serif; font-size: 13px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px; opacity:0.6;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <div>No historical records discovered matching criteria template.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = logArray.map(m => {
    if (m.type === "system") {
      return `
        <div class="message-row-wrapper is-system">
          <div class="msg-system-bubble">${m.text}</div>
        </div>
      `;
    }

    const initials = m.initials || "??";
    const bg = m.bg || "#6B7280";
    const rowClass = m.type === "sent" ? "is-sent" : "is-received";

    return `
      <div class="message-row-wrapper ${rowClass}">
        <div class="msg-avatar-frame" style="background: ${bg};">${initials}</div>
        <div class="msg-body-content">
          <div class="msg-metadata-line">
            <span class="msg-author-name">${m.author}</span>
            <span class="msg-timestamp">${m.timestamp}</span>
          </div>
          <div class="msg-bubble-text">${m.text}</div>
        </div>
      </div>
    `;
  }).join("");

  // Enforce immediate downward scrolling focus
  container.scrollTop = container.scrollHeight;
}

// Sets event listeners for user input, search filters, and tool actions
function initFunctionalEventWatchers() {
  const msgForm = document.getElementById("chatFormAction");
  const inputField = document.getElementById("chatMainInputField");
  const sidebarFilterField = document.getElementById("sidebarSearchField");
  const elementHistoryFilter = document.getElementById("chatHistorySearchInput");
  const channelCreatorBtn = document.getElementById("btnCreateChannel");

  // Handle Form Actions Submissions Pipeline
  msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const messageString = inputField.value.trim();
    if (!messageString) return;

    // Package sent message log model instance
    const newMsgInstance = {
      type: "sent",
      author: "Alex Dawson",
      initials: "AD",
      bg: "#2563EB",
      timestamp: formatRealTimeClock(),
      text: messageString
    };

    if (!messagesHistoryVault[currentActiveRoomId]) {
      messagesHistoryVault[currentActiveRoomId] = [];
    }

    messagesHistoryVault[currentActiveRoomId].push(newMsgInstance);
    inputField.value = "";
    initMessageStreamRenderer();

    // Trigger standard reply sequence after a short delay
    queueSimulatedIncomingColleagueReply();
  });

  // Sidebar Filter Input Watcher Loop
  sidebarFilterField.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    const listItems = document.querySelectorAll(".chat-sidebar-item");

    listItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(val)) {
        item.style.setProperty("display", "flex", "important");
      } else {
        item.style.setProperty("display", "none", "important");
      }
    });
  });

  // Timeline History Query Context Filtering
  elementHistoryFilter.addEventListener("input", (e) => {
    initMessageStreamRenderer(e.target.value);
  });

  // Create Channel Button Trigger Event Prompt
  channelCreatorBtn.addEventListener("click", () => {
    const promptValue = prompt("Specify brand new chat channel namespace identifier:");
    if (!promptValue || promptValue.trim() === "") return;

    const formattedCleanName = promptValue.toLowerCase().replace(/\s+/g, "-");
    const generatedId = `chan-${Date.now()}`;

    channelsData.push({
      id: generatedId,
      name: formattedCleanName,
      count: 1,
      purpose: "Newly instantiated structural workspace channel framework placeholder context."
    });

    messagesHistoryVault[generatedId] = [
      { type: "system", text: `Channel workspace containers updated. Channel #${formattedCleanName} initialized.` }
    ];

    currentActiveRoomId = generatedId;
    initSidebarListGenerators();
    initMessageStreamRenderer();
    triggerChatToastNotification(`Successfully created channel #${formattedCleanName}.`);
  });

  // Expressive Buttons Injection Mapping
  document.getElementById("chatEmojiButton").addEventListener("click", () => {
    const randomExpression = expressionsArray[Math.floor(Math.random() * expressionsArray.length)];
    inputField.value += ` ${randomExpression}`;
    inputField.focus();
  });

  document.getElementById("chatAttachButton").addEventListener("click", () => {
    triggerChatToastNotification("Simulated storage attachment pipeline opened successfully.");
  });
}

// Bouncing Typing Indicator UI Handler Loop
function queueSimulatedIncomingColleagueReply() {
  const typingIndicator = document.getElementById("chatTypingIndicator");
  const typingText = document.getElementById("chatTypingText");

  // Determine standard reply identity profile targets
  let respondentName = "Sarah Jenkins";
  let respondentInitials = "SJ";
  let respondentColor = "#7C3AED";

  const currentDm = dmsData.find(d => d.id === currentActiveRoomId);
  if (currentDm) {
    respondentName = currentDm.name;
    respondentInitials = currentDm.initials;
    respondentColor = currentDm.bg;
  } else {
    // Pick standard channel participant options randomly
    const randomSeedIndex = Math.floor(Math.random() * dmsData.length);
    respondentName = dmsData[randomSeedIndex].name;
    respondentInitials = dmsData[randomSeedIndex].initials;
    respondentColor = dmsData[randomSeedIndex].bg;
  }

  // Delay phase 1: display typing bar
  setTimeout(() => {
    typingText.textContent = `${respondentName} is typing...`;
    typingIndicator.style.display = "flex";
    
    const stream = document.getElementById("chatMessagesContainer");
    stream.scrollTop = stream.scrollHeight;

    // Delay phase 2: append message payload and collapse indicator
    setTimeout(() => {
      typingIndicator.style.display = "none";

      const randomReplyString = autoReplyVault[Math.floor(Math.random() * autoReplyVault.length)];
      const responseNode = {
        type: "received",
        author: respondentName,
        initials: respondentInitials,
        bg: respondentColor,
        timestamp: formatRealTimeClock(),
        text: randomReplyString
      };

      if (!messagesHistoryVault[currentActiveRoomId]) {
        messagesHistoryVault[currentActiveRoomId] = [];
      }
      messagesHistoryVault[currentActiveRoomId].push(responseNode);
      initMessageStreamRenderer();
    }, 1200);

  }, 600);
}

// Formats a clean 12-hour timestamp string
function formatRealTimeClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

// Utility notification popups injector
function triggerChatToastNotification(msg) {
  const container = document.getElementById("chatToastHolder");
  if (!container) return;

  const node = document.createElement("div");
  node.style.cssText = `
    background: #1E293B;
    color: #FFFFFF;
    padding: 10px 14px;
    border-radius: 6px;
    margin-top: var(--sp-2);
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideUpFade 0.2s ease forwards;
  `;
  node.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#38BDF8" stroke-width="2"><circle cx="8" cy="8" r="7"></circle><path d="M8 5v4M8 11h.01"/></svg>
    <span>${msg}</span>
  `;

  container.appendChild(node);
  setTimeout(() => {
    node.remove();
  }, 3000);
}