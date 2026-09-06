/**
 * Kalakar Setu - National Operations & Governance Command Center
 * Client Application Logic with Pure Vibrant Light Theme, Analytics Charts, and Platform Settings
 */

// Global State
const state = {
  theme: 'light',
  activeTab: 'overview',
  timeRange: '30D',
  searchQuery: '',
  charts: {
    gmvChart: null,
    categoryChart: null,
  },
  settings: {
    platformCommissionRate: 5,
    minPayoutThreshold: 500,
    escrowInspectionHours: 48,
    autoDisburseOnDelivery: true,
    aiReplicaRiskThreshold: 80,
    aiPriceVarianceAlertPct: 40,
    indiaPostEnvironment: 'SANDBOX',
    smsGatewayActive: true,
    subAdmins: [
      { name: 'Rajesh Sharma', email: 'rajesh.ops@karagir.gov.in', role: 'SUPER_ADMIN', status: 'ACTIVE' },
      { name: 'Dr. Anita Verma', email: 'anita.kyc@karagir.gov.in', role: 'KYC_AUDITOR', status: 'ACTIVE' },
      { name: 'Sanjay Deshmukh', email: 'sanjay.mod@karagir.gov.in', role: 'CATALOG_MODERATOR', status: 'ACTIVE' },
      { name: 'Vikramaditya Rao', email: 'vikram.escrow@karagir.gov.in', role: 'ESCROW_OFFICER', status: 'ACTIVE' },
    ],
  },
  metrics: {
    totalGmv: 4285000,
    activeArtisans: 12450,
    totalBuyers: 38200,
    verifiedGiCrafts: 48,
    escrowInCustody: 684200,
    escrowReleased48h: 3600800,
    pendingKycCount: 4,
    flaggedListingsCount: 3,
    activeDisputesCount: 2,
    platformCommissionRevenue: 214250,
    aiFraudAlertsBlocked: 142,
  },
  kycApplications: [
    {
      id: 'KYC-2026-881',
      artisanId: 'art_881',
      artisanName: 'Manju Devi',
      phone: '+91 98765 43210',
      craftCategory: 'Madhubani & Mithila Painting (GI-Tagged)',
      village: 'Ranti',
      subDistrict: 'Madhubani',
      district: 'Madhubani',
      state: 'Bihar',
      stateId: 10,
      districtId: 215,
      lgdCode: 'LGD-BR-MDB-042',
      aadhaarLast4: '8834',
      mosjeScheme: 'PM-DAKSH Beneficiary (Verified)',
      verificationStatus: 'PENDING',
      submittedAt: '2026-09-06T14:15:00Z',
      craftExperienceYears: 18,
      sampleImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
      aiAuthenticityConfidence: 96,
      aiNotes: 'Hand-painted mineral pigments verified. Traditional Kohbar motif geometry validated.',
      documentType: 'Aadhaar + MoSJE Artisan Card',
    },
    {
      id: 'KYC-2026-882',
      artisanId: 'art_882',
      artisanName: 'Bhanwar Lal',
      phone: '+91 98221 09876',
      craftCategory: 'Blue Pottery & Glazed Ceramics (GI)',
      village: 'Kot Jewar',
      subDistrict: 'Sanganer',
      district: 'Jaipur',
      state: 'Rajasthan',
      stateId: 8,
      districtId: 112,
      lgdCode: 'LGD-RJ-JPR-108',
      aadhaarLast4: '4190',
      mosjeScheme: 'PMEGP Craft Subsidy Scheme',
      verificationStatus: 'PENDING',
      submittedAt: '2026-09-06T12:30:00Z',
      craftExperienceYears: 24,
      sampleImageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
      aiAuthenticityConfidence: 94,
      aiNotes: 'Quartz stone and Multani mitti base verified. Genuine cobalt blue glaze detected.',
      documentType: 'Aadhaar + Handicraft Artisan Identity Card',
    },
    {
      id: 'KYC-2026-883',
      artisanId: 'art_883',
      artisanName: 'Laxmi Kumbhar',
      phone: '+91 94230 55123',
      craftCategory: 'Terracotta Sculptures & Clay Cookware',
      village: 'Bhadrawati',
      subDistrict: 'Bhadrawati',
      district: 'Chandrapur',
      state: 'Maharashtra',
      stateId: 27,
      districtId: 504,
      lgdCode: 'LGD-MH-CND-033',
      aadhaarLast4: '7721',
      mosjeScheme: 'Mudra Shishu Loan Beneficiary',
      verificationStatus: 'PENDING',
      submittedAt: '2026-09-06T09:45:00Z',
      craftExperienceYears: 12,
      sampleImageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80',
      aiAuthenticityConfidence: 91,
      aiNotes: 'Natural kiln fired clay texture. Wheel thrown characteristics confirmed.',
      documentType: 'Aadhaar + Village Sarpanch Letter',
    },
    {
      id: 'KYC-2026-884',
      artisanId: 'art_884',
      artisanName: 'Hafiz Ansari',
      phone: '+91 97112 33455',
      craftCategory: 'Banarasi Katan Silk Brocade (GI)',
      village: 'Lohta',
      subDistrict: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      stateId: 9,
      districtId: 198,
      lgdCode: 'LGD-UP-VNS-007',
      aadhaarLast4: '1902',
      mosjeScheme: 'National Handloom Development Programme',
      verificationStatus: 'PENDING',
      submittedAt: '2026-09-06T08:10:00Z',
      craftExperienceYears: 30,
      sampleImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      aiAuthenticityConfidence: 98,
      aiNotes: 'Jacquard pit loom weave pattern confirmed. Real zari test passed.',
      documentType: 'Aadhaar + Weaver Card',
    },
  ],
  flaggedListings: [
    {
      id: 'FLAG-901',
      productId: 'prod_901',
      productTitle: 'Handmade Silk Saree with Zari',
      artisanName: 'Suresh Textiles (Suspect Intermediary)',
      listedPrice: 850,
      suggestedFairPrice: 4500,
      riskScore: 88,
      flagReason: 'SUSPECT_MACHINE_PRINTED_REPLICA',
      description: 'AI Vision weave inspection detected synthetic polyester thread density & screen printed motif instead of genuine warp/weft handloom.',
      status: 'PENDING',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      flaggedAt: '2026-09-06T15:20:00Z',
    },
    {
      id: 'FLAG-902',
      productId: 'prod_902',
      productTitle: 'Dhokra Brass Tribal Figurine 8-inch',
      artisanName: 'Urban Decor Reseller Hub',
      listedPrice: 320,
      suggestedFairPrice: 1600,
      riskScore: 92,
      flagReason: 'SUSPECT_FACTORY_DIE_CAST',
      description: 'Lost-wax casting irregularities absent; detected industrial mold parting line. Exploitative underpricing indicating mass-factory origin.',
      status: 'PENDING',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
      flaggedAt: '2026-09-06T13:40:00Z',
    },
    {
      id: 'FLAG-903',
      productId: 'prod_903',
      productTitle: 'Pure Pashmina Handspun Shawl',
      artisanName: 'Kashmir Royal Crafts Co.',
      listedPrice: 1200,
      suggestedFairPrice: 12500,
      riskScore: 95,
      flagReason: 'FALSE_GI_TAG_CLAIM',
      description: 'Price point impossible for 100% Changthangi goat pashmina fiber. Laboratory spectral model flagged synthetic blend.',
      status: 'PENDING',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
      flaggedAt: '2026-09-06T11:15:00Z',
    },
  ],
  escrowTransactions: [
    {
      orderId: 'KS-ORD-77821',
      buyerName: 'Vikram Mehta (Mumbai)',
      artisanName: 'Rameshwar Chitrakar (Raghurajpur, Odisha)',
      amount: 4800,
      commission: 240,
      netArtisanPayout: 4560,
      speedPostTracking: 'EK904812391IN',
      logisticsStatus: 'DELIVERED',
      deliveredAt: '2026-09-05T18:30:00Z',
      escrowState: 'IN_48H_INSPECTION_WINDOW',
      hoursRemaining: 18,
      hasDispute: false,
    },
    {
      orderId: 'KS-ORD-77822',
      buyerName: 'Ananya Roy (Kolkata)',
      artisanName: 'Ganga Ram (Madhubani, Bihar)',
      amount: 3200,
      commission: 160,
      netArtisanPayout: 3040,
      speedPostTracking: 'EK904812392IN',
      logisticsStatus: 'IN_TRANSIT',
      deliveredAt: null,
      escrowState: 'FUNDS_LOCKED_IN_NODAL',
      hoursRemaining: 48,
      hasDispute: false,
    },
    {
      orderId: 'KS-ORD-77819',
      buyerName: 'Pooja Agarwal (Bengaluru)',
      artisanName: 'Shanti Bai (Bastar, Chhattisgarh)',
      amount: 6500,
      commission: 325,
      netArtisanPayout: 6175,
      speedPostTracking: 'EK904812389IN',
      logisticsStatus: 'DELIVERED',
      deliveredAt: '2026-09-04T12:00:00Z',
      escrowState: 'DISPUTE_RAISED',
      hoursRemaining: 0,
      hasDispute: true,
      disputeReason: 'Minor breakage on clay base during transport',
      disputeClaimType: 'PARTIAL_REPAIR_COMPENSATION',
    },
  ],
  craftClusters: [
    { id: 'cl_1', name: 'Mithila / Madhubani', state: 'Bihar', craft: 'Madhubani Painting', artisans: 3420, gmv: '₹14.2 L', lat: 26.35, lng: 86.08 },
    { id: 'cl_2', name: 'Warli Tribe Hub', state: 'Maharashtra', craft: 'Warli Art', artisans: 2180, gmv: '₹9.8 L', lat: 19.87, lng: 72.88 },
    { id: 'cl_3', name: 'Channapatna', state: 'Karnataka', craft: 'Lacquered Wooden Toys', artisans: 1650, gmv: '₹8.4 L', lat: 12.65, lng: 77.20 },
    { id: 'cl_4', name: 'Varanasi Weavers', state: 'Uttar Pradesh', craft: 'Banarasi Brocades', artisans: 4890, gmv: '₹22.6 L', lat: 25.31, lng: 82.97 },
    { id: 'cl_5', name: 'Kutch Weaving & Ajrakh', state: 'Gujarat', craft: 'Ajrakh Block Print', artisans: 1980, gmv: '₹11.1 L', lat: 23.24, lng: 69.66 },
    { id: 'cl_6', name: 'Bastar Dhokra', state: 'Chhattisgarh', craft: 'Bell Metal Craft', artisans: 1420, gmv: '₹6.5 L', lat: 19.07, lng: 82.03 },
    { id: 'cl_7', name: 'Raghurajpur Heritage', state: 'Odisha', craft: 'Pattachitra & Palm Leaf', artisans: 1120, gmv: '₹7.2 L', lat: 19.89, lng: 85.83 },
  ],
  aiModels: [
    { name: 'AI Photo Studio & Background Extractor', version: 'v2.4-lite', latencyMs: 240, accuracyPct: 98.4, status: 'HEALTHY', dailyInferences: 4210 },
    { name: 'Voice-to-Catalog Indic LLM (12 Dialects)', version: 'v3.1-bilingual', latencyMs: 380, accuracyPct: 96.8, status: 'HEALTHY', dailyInferences: 3180 },
    { name: 'Smart Fair-Price Suggester', version: 'v1.9-regression', latencyMs: 95, accuracyPct: 95.2, status: 'HEALTHY', dailyInferences: 5490 },
    { name: 'Craft DNA & GI Verification Vision Model', version: 'v2.0-vit', latencyMs: 510, accuracyPct: 97.1, status: 'HEALTHY', dailyInferences: 2840 },
  ],
  auditLogs: [
    { timestamp: 'Just now', user: 'Admin Rajesh (Ops Lead)', action: 'Approved KYC application for Laxmi Kumbhar (Bhadrawati Terracotta)' },
    { timestamp: '14 min ago', user: 'AI Vision Guard', action: 'Auto-flagged product prod_901 for suspect machine-printed motif' },
    { timestamp: '1 hr ago', user: 'Escrow Engine', action: 'Settled ₹42,800 to 14 artisans following India Post 48h elapsed delivery' },
  ],
};

// Utilities
const formatInr = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(val);

// Theme Engine (Pure Light Vibrant Mode)
function initTheme() {
  applyTheme('light');

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Daylight Theme Active', 'Vibrant light theme is permanently enabled', 'info');
    });
  });
}

function applyTheme(theme) {
  state.theme = 'light';
  localStorage.setItem('ks_admin_theme', 'light');
  const htmlEl = document.documentElement;
  htmlEl.classList.remove('dark');

  // Re-render charts with light theme colors if active
  if (state.charts.gmvChart) {
    updateChartTheme();
  }
}

// Toast Notification System
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    danger: '🚨',
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="text-xl">${icons[type] || '🔔'}</span>
    <div class="flex-1 min-w-0">
      <h5 class="font-bold text-xs uppercase tracking-wider text-slate-900">${title}</h5>
      <p class="text-xs text-slate-600 mt-0.5 leading-snug">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-700 text-sm p-1">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Tab Navigation
function initNavigation() {
  const navButtons = document.querySelectorAll('[data-tab]');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;

  // Update Nav Styling
  document.querySelectorAll('[data-tab]').forEach((b) => {
    const isSelected = b.getAttribute('data-tab') === tabName;
    if (isSelected) {
      b.classList.add('active', 'bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-500/20');
      b.classList.remove('text-slate-600', 'hover:bg-slate-100/80');
    } else {
      b.classList.remove('active', 'bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-500/20');
      b.classList.add('text-slate-600', 'hover:bg-slate-100/80');
    }
  });

  // Toggle View Panels
  document.querySelectorAll('.tab-view').forEach((view) => {
    if (view.id === `view-${tabName}`) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });

  // Render specific view
  renderCurrentView();
}

function renderCurrentView() {
  switch (state.activeTab) {
    case 'overview':
      renderOverview();
      break;
    case 'heatmap':
      renderHeatmap();
      break;
    case 'kyc':
      renderKycQueue();
      break;
    case 'moderation':
      renderModerationQueue();
      break;
    case 'escrow':
      renderEscrowTable();
      break;
    case 'mosje':
      renderMosjeReport();
      break;
    case 'ai-monitor':
      renderAiMonitor();
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

// Render Overview & Charts
function renderOverview() {
  const gmvEl = document.getElementById('metric-gmv');
  if (gmvEl) gmvEl.innerText = formatInr(state.metrics.totalGmv);

  const artEl = document.getElementById('metric-artisans');
  if (artEl) artEl.innerText = formatNumber(state.metrics.activeArtisans);

  const buyEl = document.getElementById('metric-buyers');
  if (buyEl) buyEl.innerText = formatNumber(state.metrics.totalBuyers);

  const escEl = document.getElementById('metric-escrow');
  if (escEl) escEl.innerText = formatInr(state.metrics.escrowInCustody);

  const comEl = document.getElementById('metric-commission');
  if (comEl) comEl.innerText = formatInr(state.metrics.platformCommissionRevenue);

  // Badge counts
  const badgeKyc = document.getElementById('badge-kyc');
  if (badgeKyc) badgeKyc.innerText = state.kycApplications.filter(k => k.verificationStatus === 'PENDING').length;
  const badgeMod = document.getElementById('badge-mod');
  if (badgeMod) badgeMod.innerText = state.flaggedListings.filter(l => l.status === 'PENDING').length;
  const badgeDisputes = document.getElementById('badge-disputes');
  if (badgeDisputes) badgeDisputes.innerText = `₹${(state.metrics.escrowInCustody / 100000).toFixed(1)}L`;

  renderAuditLogs();
  initOverviewCharts();
}

function initOverviewCharts() {
  if (typeof Chart === 'undefined') return;

  const gridColor = 'rgba(0, 0, 0, 0.05)';
  const textColor = '#475569';

  // 1. GMV Growth Trend Chart
  const gmvCtx = document.getElementById('chart-gmv-trend');
  if (gmvCtx) {
    if (state.charts.gmvChart) state.charts.gmvChart.destroy();

    state.charts.gmvChart = new Chart(gmvCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6 (Current)'],
        datasets: [
          {
            label: 'Total GMV (₹ Lakhs)',
            data: [12.4, 18.2, 24.8, 31.5, 37.9, 42.85],
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#4F46E5',
          },
          {
            label: 'Escrow Disbursed (₹ Lakhs)',
            data: [10.1, 15.6, 21.3, 27.2, 32.8, 36.0],
            borderColor: '#059669',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 3.5,
            pointBackgroundColor: '#059669',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }, boxWidth: 14 }
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } }
        }
      }
    });
  }

  // 2. Craft Category Donut Chart
  const catCtx = document.getElementById('chart-categories-donut');
  if (catCtx) {
    if (state.charts.categoryChart) state.charts.categoryChart.destroy();

    state.charts.categoryChart = new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: ['Banarasi & Handloom', 'Mithila & Folk Art', 'Terracotta & Pottery', 'Dhokra & Bell Metal', 'Wooden Toys & Others'],
        datasets: [{
          data: [38, 24, 16, 12, 10],
          backgroundColor: ['#4F46E5', '#EA580C', '#059669', '#D97706', '#7C3AED'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
          }
        },
        cutout: '68%',
      }
    });
  }
}

function updateChartTheme() {
  if (state.charts.gmvChart && state.charts.categoryChart) {
    initOverviewCharts();
  }
}

function renderAuditLogs() {
  const container = document.getElementById('audit-log-container');
  if (!container) return;
  container.innerHTML = state.auditLogs.map(log => `
    <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
      <div class="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1 shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-slate-800 font-medium leading-relaxed">${log.action}</p>
        <p class="text-[11px] text-slate-500 mt-1"><span class="text-indigo-700 font-semibold">${log.user}</span> • ${log.timestamp}</p>
      </div>
    </div>
  `).join('');
}

// Global Search
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    if (state.searchQuery.length > 1) {
      handleGlobalSearch(state.searchQuery);
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });
}

function handleGlobalSearch(query) {
  const matchedKyc = state.kycApplications.filter(k => 
    k.artisanName.toLowerCase().includes(query) || 
    k.id.toLowerCase().includes(query) || 
    k.craftCategory.toLowerCase().includes(query)
  );

  const matchedEscrow = state.escrowTransactions.filter(e =>
    e.orderId.toLowerCase().includes(query) ||
    e.artisanName.toLowerCase().includes(query) ||
    e.speedPostTracking.toLowerCase().includes(query)
  );

  if (matchedKyc.length > 0 && state.activeTab !== 'kyc') {
    switchTab('kyc');
    showToast('Search Match', `Found ${matchedKyc.length} artisan record(s) matching "${query}"`, 'info');
  } else if (matchedEscrow.length > 0 && state.activeTab !== 'escrow') {
    switchTab('escrow');
    showToast('Search Match', `Found ${matchedEscrow.length} escrow order(s) matching "${query}"`, 'info');
  }
}

// Render Heatmap
function renderHeatmap() {
  const listContainer = document.getElementById('cluster-list-container');
  if (!listContainer) return;
  listContainer.innerHTML = state.craftClusters.map(c => `
    <div class="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition cursor-pointer" onclick="selectCluster('${c.id}')">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-slate-900 text-base">${c.name}</h4>
          <p class="text-xs text-indigo-600 font-medium">${c.craft}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">${c.gmv} GMV</span>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
        <span class="font-medium text-slate-600">📍 ${c.state}</span>
        <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">👥 ${formatNumber(c.artisans)} Artisans</span>
      </div>
    </div>
  `).join('');
}

window.selectCluster = function(id) {
  const cluster = state.craftClusters.find(c => c.id === id);
  if (!cluster) return;
  showToast('Cluster Selected', `${cluster.name} (${cluster.state}) • ${cluster.artisans} Artisans`, 'info');
};

// Render KYC Queue
function renderKycQueue() {
  const container = document.getElementById('kyc-table-body');
  if (!container) return;

  const pending = state.kycApplications.filter(k => k.verificationStatus === 'PENDING');
  if (pending.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 bg-white">🎉 No pending artisan KYC verifications in queue!</td></tr>`;
    return;
  }

  container.innerHTML = pending.map(app => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/90 transition text-sm">
      <td class="p-4">
        <div class="flex items-center gap-3">
          <img src="${app.sampleImageUrl}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm" alt="Craft" />
          <div>
            <p class="font-bold text-slate-900">${app.artisanName}</p>
            <p class="text-xs text-slate-500 mono">${app.id} • ${app.phone}</p>
          </div>
        </div>
      </td>
      <td class="p-4">
        <p class="text-sm font-semibold text-slate-800">${app.craftCategory}</p>
        <span class="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          ✨ ${app.aiAuthenticityConfidence}% AI Confidence
        </span>
      </td>
      <td class="p-4">
        <p class="text-sm font-medium text-slate-700">${app.village}, ${app.district}</p>
        <p class="text-xs text-slate-500 font-mono">${app.state} (${app.lgdCode})</p>
      </td>
      <td class="p-4">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          🏛️ ${app.mosjeScheme}
        </span>
      </td>
      <td class="p-4">
        <p class="text-xs text-slate-600 max-w-xs leading-snug">${app.aiNotes}</p>
      </td>
      <td class="p-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button onclick="approveKyc('${app.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm">
            Approve ✓
          </button>
          <button onclick="rejectKyc('${app.id}')" class="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition">
            Reject ✗
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.approveKyc = function(id) {
  const app = state.kycApplications.find(k => k.id === id);
  if (!app) return;
  app.verificationStatus = 'APPROVED';
  state.metrics.activeArtisans += 1;
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Admin (Web Portal)',
    action: `Approved & issued GI Craft badge for ${app.artisanName} (${app.craftCategory})`,
  });
  showToast('Artisan KYC Approved', `${app.artisanName} is now verified with GI Authenticity badge`, 'success');
  renderKycQueue();
  renderOverview();
};

window.rejectKyc = function(id) {
  const reason = prompt('Please specify rejection reason for artisan record:', 'Unclear craft sample photo / LGD address mismatch');
  if (!reason) return;
  const app = state.kycApplications.find(k => k.id === id);
  if (!app) return;
  app.verificationStatus = 'REJECTED';
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Admin (Web Portal)',
    action: `Rejected application ${id} for ${app.artisanName}. Reason: ${reason}`,
  });
  showToast('Application Rejected', `Application ${id} marked rejected`, 'warning');
  renderKycQueue();
  renderOverview();
};

// Render Moderation Queue
function renderModerationQueue() {
  const container = document.getElementById('moderation-cards-container');
  if (!container) return;

  const pending = state.flaggedListings.filter(l => l.status === 'PENDING');
  if (pending.length === 0) {
    container.innerHTML = `<div class="col-span-3 p-12 text-center text-slate-500 bg-white border border-slate-200/80 rounded-2xl shadow-sm">✨ Clean Catalog! Zero flagged listings require review.</div>`;
    return;
  }

  container.innerHTML = pending.map(item => `
    <div class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col">
      <div class="relative h-48 bg-slate-100">
        <img src="${item.imageUrl}" class="w-full h-full object-cover" alt="${item.productTitle}" />
        <div class="absolute top-3 left-3 bg-rose-600/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
          ⚠️ ${item.riskScore}% AI Risk
        </div>
        <div class="absolute top-3 right-3 bg-white/95 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-xs font-mono font-medium shadow-sm">
          ${item.id}
        </div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start gap-2">
            <h4 class="font-bold text-slate-900 text-base leading-snug">${item.productTitle}</h4>
          </div>
          <p class="text-xs text-slate-500 mt-1">Vendor: <span class="text-slate-800 font-semibold">${item.artisanName}</span></p>

          <div class="grid grid-cols-2 gap-2 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <p class="text-slate-500">Listed Price</p>
              <p class="text-rose-600 font-black text-sm">${formatInr(item.listedPrice)}</p>
            </div>
            <div>
              <p class="text-slate-500">Fair Benchmark</p>
              <p class="text-emerald-700 font-black text-sm">${formatInr(item.suggestedFairPrice)}</p>
            </div>
          </div>

          <div class="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200">
            <p class="text-xs font-bold text-rose-800 flex items-center gap-1">
              🚨 ${item.flagReason.replace(/_/g, ' ')}
            </p>
            <p class="text-xs text-slate-700 mt-1 leading-relaxed">${item.description}</p>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <button onclick="approveListing('${item.id}')" class="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200">
            False Alarm (Pass)
          </button>
          <button onclick="takedownListing('${item.id}')" class="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm">
            Takedown & Ban
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

window.approveListing = function(id) {
  const item = state.flaggedListings.find(l => l.id === id);
  if (!item) return;
  item.status = 'APPROVED';
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Moderator',
    action: `Listing approved after manual review: ${item.productTitle}`,
  });
  showToast('Listing Passed', `${item.productTitle} approved for marketplace`, 'info');
  renderModerationQueue();
  renderOverview();
};

window.takedownListing = function(id) {
  const item = state.flaggedListings.find(l => l.id === id);
  if (!item) return;
  item.status = 'TAKEDOWN';
  state.metrics.aiFraudAlertsBlocked += 1;
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Moderator',
    action: `Takedown enforced on ${item.productTitle} (${item.flagReason})`,
  });
  showToast('Takedown Enforced', `${item.productTitle} removed from catalog`, 'danger');
  renderModerationQueue();
  renderOverview();
};

// Render Escrow Table
function renderEscrowTable() {
  const container = document.getElementById('escrow-table-body');
  if (!container) return;

  container.innerHTML = state.escrowTransactions.map(e => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/90 transition text-sm">
      <td class="p-4 font-mono font-bold text-indigo-700">${e.orderId}</td>
      <td class="p-4">
        <p class="font-black text-slate-900">${formatInr(e.amount)}</p>
        <p class="text-xs text-slate-500">Artisan net: <span class="text-emerald-700 font-bold">${formatInr(e.netArtisanPayout)}</span></p>
      </td>
      <td class="p-4">
        <p class="font-bold text-slate-800">${e.artisanName}</p>
        <p class="text-xs text-slate-500">Buyer: ${e.buyerName}</p>
      </td>
      <td class="p-4">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            📮 ${e.speedPostTracking}
          </span>
          <span class="text-xs font-bold ${e.logisticsStatus === 'DELIVERED' ? 'text-emerald-700' : 'text-amber-700'}">
            ● ${e.logisticsStatus}
          </span>
        </div>
      </td>
      <td class="p-4">
        ${e.hasDispute ? `
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            ⚠️ Dispute Active
          </span>
        ` : `
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            ⏳ ${e.hoursRemaining}h to Auto-Release
          </span>
        `}
      </td>
      <td class="p-4 text-right">
        ${e.hasDispute ? `
          <button onclick="adjudicateDispute('${e.orderId}')" class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm">
            Adjudicate Dispute
          </button>
        ` : `
          <button onclick="instantReleaseEscrow('${e.orderId}')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm">
            Release to UPI ⚡
          </button>
        `}
      </td>
    </tr>
  `).join('');
}

window.instantReleaseEscrow = function(orderId) {
  const tr = state.escrowTransactions.find(e => e.orderId === orderId);
  if (!tr) return;
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Escrow Officer',
    action: `Manual immediate escrow release dispatched for ${orderId} (${formatInr(tr.netArtisanPayout)})`,
  });
  showToast('Escrow Disbursed', `₹${tr.netArtisanPayout} released to ${tr.artisanName} via NPCI UPI`, 'success');
  renderOverview();
};

window.adjudicateDispute = function(orderId) {
  const tr = state.escrowTransactions.find(e => e.orderId === orderId);
  if (!tr) return;
  const choice = confirm(`DISPUTE ADJUDICATION PANEL\nOrder: ${orderId}\nReason: ${tr.disputeReason}\n\nClick OK to Issue 50% artisan repair compensation and 50% refund, or Cancel to release 100% to Artisan.`);
  tr.hasDispute = false;
  tr.escrowState = 'SETTLED';
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'Dispute Officer',
    action: `Dispute resolved on ${orderId} via arbitration resolution`,
  });
  showToast('Dispute Adjudicated', `Resolution applied to order ${orderId}`, 'info');
  renderEscrowTable();
  renderOverview();
};

// Render MoSJE Report
function renderMosjeReport() {
  const container = document.getElementById('mosje-data-preview');
  if (!container) return;
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">MoSJE Certified Beneficiaries</p>
        <p class="text-3xl font-black text-slate-900 mt-1">9,420</p>
        <p class="text-xs text-emerald-700 font-semibold mt-2">75.6% of total artisan base</p>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">LGD Villages Connected</p>
        <p class="text-3xl font-black text-indigo-700 mt-1">1,840</p>
        <p class="text-xs text-slate-500 font-medium mt-2">Across 148 artisan districts</p>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Direct Bank UPI Disbursed</p>
        <p class="text-3xl font-black text-emerald-700 mt-1">₹3.82 Cr</p>
        <p class="text-xs text-emerald-700 font-semibold mt-2">100% Zero intermediary leakage</p>
      </div>
    </div>
  `;
}

window.exportMosjeCsv = function() {
  const headers = "Beneficiary_ID,Artisan_Name,Craft_Category,State,District,LGD_Code,Total_GMV_INR,MoSJE_Scheme,Aadhaar_Status\n";
  const rows = state.kycApplications.map(k => `"${k.artisanId}","${k.artisanName}","${k.craftCategory}","${k.state}","${k.district}","${k.lgdCode}",${Math.round(Math.random() * 80000 + 20000)},"${k.mosjeScheme}","VERIFIED_UIDAI"`).join("\n");
  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `MoSJE_National_Artisan_Registry_FY26_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  showToast('Report Exported', 'MoSJE National Registry downloaded as CSV', 'success');
};

// Render AI Monitor
function renderAiMonitor() {
  const container = document.getElementById('ai-models-list');
  if (!container) return;
  container.innerHTML = state.aiModels.map(m => `
    <div class="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-slate-900 text-base">${m.name}</h4>
          <p class="text-xs text-indigo-700 font-mono font-medium mt-0.5">${m.version}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● ${m.status}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-4 pt-3.5 border-t border-slate-100 text-xs">
        <div>
          <p class="text-slate-500 font-medium">Inference Latency</p>
          <p class="text-slate-900 font-mono font-black text-sm mt-0.5">${m.latencyMs} ms</p>
        </div>
        <div>
          <p class="text-slate-500 font-medium">Validation Accuracy</p>
          <p class="text-emerald-700 font-mono font-black text-sm mt-0.5">${m.accuracyPct}%</p>
        </div>
        <div>
          <p class="text-slate-500 font-medium">24h Inferences</p>
          <p class="text-slate-900 font-mono font-black text-sm mt-0.5">${formatNumber(m.dailyInferences)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Settings & Governance Module
function renderSettings() {
  const commissionVal = document.getElementById('setting-commission-val');
  if (commissionVal) commissionVal.innerText = `${state.settings.platformCommissionRate}%`;

  const commissionInput = document.getElementById('setting-commission-input');
  if (commissionInput) commissionInput.value = state.settings.platformCommissionRate;

  const escrowSelect = document.getElementById('setting-escrow-hours');
  if (escrowSelect) escrowSelect.value = state.settings.escrowInspectionHours;

  const aiReplicaVal = document.getElementById('setting-replica-val');
  if (aiReplicaVal) aiReplicaVal.innerText = `${state.settings.aiReplicaRiskThreshold}%`;

  const aiReplicaInput = document.getElementById('setting-replica-input');
  if (aiReplicaInput) aiReplicaInput.value = state.settings.aiReplicaRiskThreshold;

  const adminsContainer = document.getElementById('settings-subadmins-list');
  if (adminsContainer) {
    adminsContainer.innerHTML = state.settings.subAdmins.map(admin => `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div>
          <p class="font-bold text-slate-900 text-sm">${admin.name}</p>
          <p class="text-xs text-slate-500">${admin.email}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            ${admin.role}
          </span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    `).join('');
  }
}

window.updateCommissionRate = function(val) {
  state.settings.platformCommissionRate = Number(val);
  const el = document.getElementById('setting-commission-val');
  if (el) el.innerText = `${val}%`;
  state.metrics.platformCommissionRevenue = Math.round(state.metrics.totalGmv * (Number(val) / 100));
  showToast('Commission Updated', `Platform rate set to ${val}% (Artisan fee remains 0%)`, 'info');
};

window.updateEscrowHours = function(val) {
  state.settings.escrowInspectionHours = Number(val);
  showToast('Escrow Policy Updated', `Delivery inspection window updated to ${val} hours`, 'info');
};

window.updateReplicaSensitivity = function(val) {
  state.settings.aiReplicaRiskThreshold = Number(val);
  const el = document.getElementById('setting-replica-val');
  if (el) el.innerText = `${val}%`;
  showToast('AI Sensitivity Saved', `AI Vision alert trigger set to ${val}% confidence`, 'info');
};

window.seedDemoData = function() {
  state.metrics.totalGmv = 4580000;
  state.metrics.activeArtisans = 12600;
  state.metrics.totalBuyers = 39400;
  state.auditLogs.unshift({
    timestamp: 'Just now',
    user: 'System Admin',
    action: 'Demo dataset synchronized and refreshed for live evaluation',
  });
  showToast('Data Refreshed', 'Fresh demo dataset successfully loaded!', 'success');
  renderOverview();
};

window.exportSystemBackup = function() {
  const backupData = {
    exportDate: new Date().toISOString(),
    version: '2.6.0-PROD',
    platform: 'Kalakar Setu National Command Center',
    settings: state.settings,
    metrics: state.metrics,
    kycApplications: state.kycApplications,
    flaggedListings: state.flaggedListings,
    escrowTransactions: state.escrowTransactions,
    auditLogs: state.auditLogs,
  };
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Kalakar_Setu_System_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  showToast('Backup Exported', 'Full system JSON backup downloaded', 'success');
};

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initGlobalSearch();
  renderCurrentView();

  // Periodic simulated live ticker
  setInterval(() => {
    state.metrics.totalGmv += Math.floor(Math.random() * 250);
    const gmvEl = document.getElementById('metric-gmv');
    if (gmvEl && state.activeTab === 'overview') {
      gmvEl.innerText = formatInr(state.metrics.totalGmv);
    }
  }, 4000);
});

