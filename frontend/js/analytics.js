/**
 * TaskFlow Design System — Workspace Analytics Control Script
 * Manages runtime metric updating, date contextualization, and custom chart matrices.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Dataset definitions mapped by cycle parameters
  const analyticsDataStore = {
    7: {
      metrics: { projects: "12", tasks: "148", completed: "112", pending: "36" },
      trends: { tasks: "+14%", completed: "+22%", pending: "-8%" },
      kpis: { completion: 75.6, productivity: 88, performance: 92 },
      labels: { completion: "75.6% of assigned tasks finished", weeklyRange: "Micro log for the current active cycle" },
      linePath: "M0,150 L80,120 L160,70 L240,90 L320,40 L400,60 L480,25",
      areaPath: "M0,150 L80,120 L160,70 L240,90 L320,40 L400,60 L480,25 L480,200 L0,200 Z",
      barChartHeights: ["85%", "62%", "94%", "45%", "78%"],
      barValues: ["85", "62", "94", "45", "78"]
    },
    30: {
      metrics: { projects: "14", tasks: "580", completed: "440", pending: "140" },
      trends: { tasks: "+8%", completed: "+12%", pending: "-3%" },
      kpis: { completion: 75.8, productivity: 84, performance: 89 },
      labels: { completion: "75.8% rolling completion rate achieved", weeklyRange: "Full activity log for trailing 30 days" },
      linePath: "M0,130 L80,100 L160,110 L240,60 L320,80 L400,45 L480,30",
      areaPath: "M0,130 L80,100 L160,110 L240,60 L320,80 L400,45 L480,30 L480,200 L0,200 Z",
      barChartHeights: ["78%", "70%", "88%", "55%", "82%"],
      barValues: ["78", "70", "88", "55", "82"]
    },
    90: {
      metrics: { projects: "19", tasks: "1,840", completed: "1,412", pending: "428" },
      trends: { tasks: "+19%", completed: "+26%", pending: "+4%" },
      kpis: { completion: 76.7, productivity: 86, performance: 91 },
      labels: { completion: "76.7% long-range task closure rate", weeklyRange: "Quarterly aggregate log statement" },
      linePath: "M0,110 L80,95 L160,60 L240,75 L320,35 L400,50 L480,15",
      areaPath: "M0,110 L80,95 L160,60 L240,75 L320,35 L400,50 L480,15 L480,200 L0,200 Z",
      barChartHeights: ["92%", "75%", "91%", "60%", "85%"],
      barValues: ["92", "75", "91", "60", "85"]
    }
  };

  // DOM node references hookups
  const selectNode = document.getElementById('dateRangeSelector');
  const valProjects = document.getElementById('valProjects');
  const valTasks = document.getElementById('valTasks');
  const valCompleted = document.getElementById('valCompleted');
  const valPending = document.getElementById('valPending');
  
  const trendTasks = document.getElementById('trendTasks');
  const trendCompleted = document.getElementById('trendCompleted');
  const trendPending = document.getElementById('trendPending');

  const barCompletion = document.getElementById('barCompletion');
  const barProductivity = document.getElementById('barProductivity');
  const barPerformance = document.getElementById('barPerformance');

  const lblCompletion = document.getElementById('lblCompletion');
  const lblWeeklyReportRange = document.getElementById('lblWeeklyReportRange');

  const svgLinePath = document.getElementById('svgLinePath');
  const svgAreaPath = document.getElementById('svgAreaPath');
  const barPillars = document.querySelectorAll('.bar-pillar');

  // Trigger visual updates to match selector changes
  function renderActiveAnalytics(rangeKey) {
    const data = analyticsDataStore[rangeKey];
    if (!data) return;

    // Apply numerical content variables
    valProjects.innerText = data.metrics.projects;
    valTasks.innerText = data.metrics.tasks;
    valCompleted.innerText = data.metrics.completed;
    valPending.innerText = data.metrics.pending;

    // Apply relative percentage trend values
    trendTasks.innerText = data.trends.tasks;
    trendCompleted.innerText = data.trends.completed;
    trendPending.innerText = data.trends.pending;

    // Adjust linear indicator metrics status weights
    barCompletion.style.width = `${data.kpis.completion}%`;
    barProductivity.style.width = `${data.kpis.productivity}%`;
    barPerformance.style.width = `${data.kpis.performance}%`;

    // Apply localized labels descriptions text strings
    lblCompletion.innerText = data.labels.completion;
    lblWeeklyReportRange.innerText = data.labels.weeklyRange;

    // Vector interpolation morph transitions for trend line maps
    if (svgLinePath && svgAreaPath) {
      svgLinePath.setAttribute('d', data.linePath);
      svgAreaPath.setAttribute('d', data.areaPath);
    }

    // Refresh structural heights for team vertical layout charts
    barPillars.forEach((pillar, index) => {
      if (data.barChartHeights[index]) {
        pillar.style.height = data.barChartHeights[index];
        const tooltip = pillar.querySelector('.bar-value-tooltip');
        if (tooltip) {
          tooltip.innerText = data.barValues[index];
        }
      }
    });
  }

  // Bind change event handlers
  if (selectNode) {
    selectNode.addEventListener('change', (e) => {
      renderActiveAnalytics(e.target.value);
    });
  }

  // Interactive micro state hook: Export feedback loop simulation
  const exportButtons = document.querySelectorAll('.report-download-btn');
  exportButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const initialText = this.innerHTML;
      this.innerHTML = `
        <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--sp-1); animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.1)" stroke-width="2" fill="none"></circle><path d="M4 12a8 8 0 0 1 8-8" fill="none"></path></svg>
        Compiling...
      `;
      this.style.pointerEvents = 'none';

      setTimeout(() => {
        this.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: var(--sp-1);"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Exported
        `;
        setTimeout(() => {
          this.innerHTML = initialText;
          this.style.pointerEvents = 'auto';
        }, 2000);
      }, 1200);
    });
  });

  // Mobile drawer panel layout toggle tracker helper handler
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const appShell = document.getElementById('appShell');
  if (mobileMenuBtn && appShell) {
    mobileMenuBtn.addEventListener('click', () => {
      appShell.classList.toggle('sidebar-open');
    });
  }
});

// Inline asset tracking standard loop animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
document.head.appendChild(styleSheet);