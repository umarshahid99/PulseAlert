/**
 * Main Application Coordinator
 * Handles UI interactions, live countdown loops, crisis popups, and user preferences.
 */

document.addEventListener('DOMContentLoaded', () => {
  const audio = window.terminalAudio;
  const radar = window.warRadar;
  const calendar = window.economicCalendar;
  const notif = window.terminalNotifications;
  const wire = window.newsWire;

  // DOM Elements
  const elUtcClock = document.getElementById('utc-clock');
  const elLocalClock = document.getElementById('local-clock');
  const elTickerTrack = document.getElementById('ticker-track');
  const elWireContainer = document.getElementById('wire-list');
  const elCalendarContainer = document.getElementById('calendar-list');
  const elNextEventCountdown = document.getElementById('next-event-countdown');
  const elNextEventTitle = document.getElementById('next-event-title');
  const elWatchlistTags = document.getElementById('watchlist-tags');
  const elNewKeywordInput = document.getElementById('new-keyword-input');
  const btnAddKeyword = document.getElementById('btn-add-keyword');
  const btnMute = document.getElementById('btn-mute');
  const volumeSlider = document.getElementById('volume-slider');
  const btnEnableNotif = document.getElementById('btn-enable-notif');
  const notifStatusBadge = document.getElementById('notif-status-badge');
  const searchInput = document.getElementById('wire-search');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Crisis Modal Elements
  const crisisModal = document.getElementById('crisis-modal');
  const crisisModalTitle = document.getElementById('crisis-modal-title');
  const crisisModalSummary = document.getElementById('crisis-modal-summary');
  const crisisModalTrades = document.getElementById('crisis-modal-trades');
  const crisisModalRule = document.getElementById('crisis-modal-rule');
  const btnCloseCrisisModal = document.getElementById('btn-close-crisis');

  // Active filter
  let currentCategoryFilter = 'ALL';
  let currentSearchQuery = '';

  // 1. Initialize Clocks
  function updateClocks() {
    const now = new Date();
    elUtcClock.textContent = now.toUTCString().slice(17, 25) + ' UTC';
    elLocalClock.textContent = now.toLocaleTimeString([], { hour12: false }) + ' LOCAL';
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // 2. Initialize Notifications UI
  function updateNotifUI() {
    if (notif.hasPermission()) {
      notifStatusBadge.textContent = '🟢 ALERTS ACTIVE';
      notifStatusBadge.className = 'status-badge active';
      btnEnableNotif.style.display = 'none';
    } else {
      notifStatusBadge.textContent = '⚪ ALERTS PAUSED';
      notifStatusBadge.className = 'status-badge paused';
      btnEnableNotif.style.display = 'inline-flex';
    }
  }
  updateNotifUI();

  btnEnableNotif.addEventListener('click', async () => {
    // Also unlock Web Audio context on user gesture
    audio.getAudioContext();
    const granted = await notif.requestPermission();
    updateNotifUI();
    if (granted) {
      notif.notify('🚨 Radar Alerts Activated', {
        body: 'You will now receive desktop notifications for War & CPI flash news.'
      }, 'CHIME');
    }
  });

  // 3. Audio Controls
  btnMute.addEventListener('click', () => {
    audio.getAudioContext();
    audio.setMuted(!audio.isMuted);
    btnMute.textContent = audio.isMuted ? '🔇 UNMUTE' : '🔊 MUTE';
    btnMute.classList.toggle('muted', audio.isMuted);
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.setVolume(parseFloat(e.target.value));
  });

  document.getElementById('btn-test-sound')?.addEventListener('click', () => {
    audio.getAudioContext();
    audio.playMacroAlert();
  });

  // 4. Render Custom Watchlist
  function renderWatchlist() {
    elWatchlistTags.innerHTML = '';
    radar.customWatchlist.forEach(kw => {
      const tag = document.createElement('span');
      tag.className = 'keyword-tag';
      tag.innerHTML = `
        <span class="kw-text">${kw}</span>
        <button class="btn-remove-kw" data-kw="${kw}" title="Remove keyword">×</button>
      `;
      elWatchlistTags.appendChild(tag);
    });

    // Add remove listeners
    elWatchlistTags.querySelectorAll('.btn-remove-kw').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const kw = e.currentTarget.getAttribute('data-kw');
        radar.removeCustomKeyword(kw);
        renderWatchlist();
      });
    });
  }

  btnAddKeyword.addEventListener('click', () => {
    const kw = elNewKeywordInput.value.trim();
    if (kw) {
      radar.addCustomKeyword(kw);
      elNewKeywordInput.value = '';
      renderWatchlist();
    }
  });

  elNewKeywordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnAddKeyword.click();
  });

  renderWatchlist();

  // 5. Render Ticker
  function updateTicker() {
    const headlines = wire.newsItems.slice(0, 10);
    const html = headlines.map(item => {
      const isCrisis = item.threatData?.threatLevel === 'CRISIS';
      const icon = isCrisis ? '🚨 [WAR FLASH]' : '⚡';
      return `<span class="ticker-item ${isCrisis ? 'crisis-flash' : ''}">${icon} ${item.title} &nbsp;&nbsp;•&nbsp;&nbsp;</span>`;
    }).join('');
    elTickerTrack.innerHTML = html + html; // duplicate for smooth continuous loop
  }

  // 6. Render News Wire
  function renderWire() {
    let filtered = wire.newsItems;

    if (currentCategoryFilter === 'WAR') {
      filtered = filtered.filter(item => item.threatData?.threatLevel === 'CRISIS' || item.category === 'GEOPOLITICS');
    } else if (currentCategoryFilter === 'MACRO') {
      filtered = filtered.filter(item => item.category === 'MACRO' || item.category === 'CENTRAL BANK');
    } else if (currentCategoryFilter === 'COMMODITIES') {
      filtered = filtered.filter(item => item.category === 'COMMODITIES' || item.threatData?.threatLevel === 'ENERGY_SHOCK');
    } else if (currentCategoryFilter === 'CRYPTO') {
      filtered = filtered.filter(item => item.category === 'CRYPTO');
    }

    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || 
        (item.summary && item.summary.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      elWireContainer.innerHTML = `<div class="empty-wire">No headlines matching "${currentSearchQuery || currentCategoryFilter}"</div>`;
      return;
    }

    elWireContainer.innerHTML = filtered.map(item => {
      const threat = item.threatData || { threatLevel: 'NORMAL' };
      const isCrisis = threat.threatLevel === 'CRISIS';
      const isOil = threat.threatLevel === 'ENERGY_SHOCK';
      const isWatchlist = threat.threatLevel === 'WATCHLIST';

      let cardClass = 'wire-card';
      let threatBadge = '';

      if (isCrisis) {
        cardClass += ' wire-crisis';
        threatBadge = `<span class="badge badge-crisis">🚨 WAR / CRISIS RADAR</span>`;
      } else if (isOil) {
        cardClass += ' wire-oil';
        threatBadge = `<span class="badge badge-oil">🛢️ OIL SHOCK</span>`;
      } else if (isWatchlist) {
        cardClass += ' wire-watchlist';
        threatBadge = `<span class="badge badge-watchlist">🎯 WATCHLIST MATCH</span>`;
      }

      const highlightedTitle = radar.highlightKeywords(item.title);
      const timeAgo = formatTimeAgo(new Date(item.timestamp));

      // Quick trade button if playbook exists
      let actionBtn = '';
      if (threat.playbook) {
        actionBtn = `<button class="btn-view-trade" data-id="${item.id}">⚡ VIEW TRADE POSITION</button>`;
      }

      return `
        <div class="${cardClass}" id="item-${item.id}">
          <div class="wire-header">
            <span class="wire-source">${item.source}</span>
            <span class="wire-time">${timeAgo}</span>
            ${threatBadge}
          </div>
          <div class="wire-title">${highlightedTitle}</div>
          ${item.summary ? `<div class="wire-summary">${item.summary}</div>` : ''}
          ${actionBtn ? `<div class="wire-actions">${actionBtn}</div>` : ''}
        </div>
      `;
    }).join('');

    // Attach click handlers to "VIEW TRADE POSITION" buttons
    elWireContainer.querySelectorAll('.btn-view-trade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = wire.newsItems.find(x => x.id === id);
        if (item && item.threatData?.playbook) {
          showCrisisModal(item.title, item.threatData.playbook);
        }
      });
    });
  }

  // 7. Render Economic Calendar & Countdown
  function renderCalendar() {
    const events = calendar.events;
    const nextEvent = calendar.getNextMajorEvent();

    if (nextEvent) {
      const status = calendar.getEventTimeStatus(nextEvent.scheduledTime);
      elNextEventTitle.textContent = nextEvent.name;
      elNextEventCountdown.textContent = status.countdownStr;
      if (status.isUrgent5) {
        elNextEventCountdown.classList.add('urgent-pulse');
      } else {
        elNextEventCountdown.classList.remove('urgent-pulse');
      }
    }

    elCalendarContainer.innerHTML = events.map(ev => {
      const timeStatus = calendar.getEventTimeStatus(ev.scheduledTime);
      const localTimeStr = new Date(ev.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Check alert boundaries
      if (timeStatus.isZeroHour) {
        notif.alertMacroEvent(ev, 'RELEASE');
      } else if (timeStatus.isUrgent5) {
        notif.alertMacroEvent(ev, '5M');
      } else if (timeStatus.isImminent15) {
        notif.alertMacroEvent(ev, '15M');
      }

      let impactBadge = `<span class="badge-macro high">🔴 ${ev.impact}</span>`;
      if (ev.impact === 'MEDIUM') impactBadge = `<span class="badge-macro med">🟠 ${ev.impact}</span>`;

      return `
        <div class="calendar-card ${timeStatus.isUrgent5 ? 'card-urgent' : ''}" data-ev-id="${ev.id}">
          <div class="cal-top">
            <span class="cal-currency">${ev.currency}</span>
            <span class="cal-name">${ev.name}</span>
            ${impactBadge}
          </div>
          <div class="cal-metrics">
            <div class="metric-box">
              <span class="m-label">Forecast</span>
              <span class="m-val">${ev.forecast}</span>
            </div>
            <div class="metric-box">
              <span class="m-label">Previous</span>
              <span class="m-val">${ev.previous}</span>
            </div>
            <div class="metric-box countdown-box">
              <span class="m-label">Countdown</span>
              <span class="m-val cd-text">${timeStatus.countdownStr}</span>
            </div>
          </div>
          <div class="cal-time-bar">
            <span>Scheduled: <strong>${localTimeStr}</strong></span>
            <button class="btn-toggle-playbook" data-target="pb-${ev.id}">📖 TRADING PLAYBOOK ▼</button>
          </div>
          <div class="cal-playbook" id="pb-${ev.id}">
            <div class="pb-scenario pb-hot">
              <strong>${ev.playbook.hotScenario.condition}:</strong>
              <ul>
                <li>DXY: ${ev.playbook.hotScenario.dxy}</li>
                <li>Gold: ${ev.playbook.hotScenario.gold}</li>
                <li>Stocks: ${ev.playbook.hotScenario.stocks}</li>
                <li>Crypto: ${ev.playbook.hotScenario.crypto}</li>
              </ul>
            </div>
            <div class="pb-scenario pb-cool">
              <strong>${ev.playbook.coolScenario.condition}:</strong>
              <ul>
                <li>DXY: ${ev.playbook.coolScenario.dxy}</li>
                <li>Gold: ${ev.playbook.coolScenario.gold}</li>
                <li>Stocks: ${ev.playbook.coolScenario.stocks}</li>
                <li>Crypto: ${ev.playbook.coolScenario.crypto}</li>
              </ul>
            </div>
            <div class="pb-tip">💡 <em>${ev.playbook.proTip}</em></div>
          </div>
        </div>
      `;
    }).join('');

    // Accordion toggle for playbooks
    elCalendarContainer.querySelectorAll('.btn-toggle-playbook').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.toggle('open');
          e.currentTarget.textContent = targetEl.classList.contains('open') ? '📖 HIDE PLAYBOOK ▲' : '📖 TRADING PLAYBOOK ▼';
        }
      });
    });
  }

  // 8. Crisis Modal Handler
  function showCrisisModal(title, playbook) {
    crisisModalTitle.textContent = title;
    crisisModalSummary.textContent = playbook.summary;
    crisisModalRule.textContent = playbook.rule;

    crisisModalTrades.innerHTML = playbook.trades.map(t => `
      <div class="trade-row ${t.action.includes('BUY') ? 'trade-buy' : (t.action.includes('SHORT') ? 'trade-short' : 'trade-warn')}">
        <div class="trade-action-badge">${t.action}</div>
        <div class="trade-asset">${t.asset}</div>
        <div class="trade-reason">${t.reason}</div>
      </div>
    `).join('');

    crisisModal.classList.add('visible');
  }

  btnCloseCrisisModal.addEventListener('click', () => {
    crisisModal.classList.remove('visible');
  });

  crisisModal.addEventListener('click', (e) => {
    if (e.target === crisisModal) {
      crisisModal.classList.remove('visible');
    }
  });

  // 9. Simulation Controls (For Instant Testing by User)
  document.getElementById('btn-sim-war')?.addEventListener('click', () => {
    audio.getAudioContext();
    const item = wire.simulateWarEscalation();
    if (item && item.threatData?.playbook) {
      showCrisisModal(item.title, item.threatData.playbook);
    }
  });

  document.getElementById('btn-sim-cpi')?.addEventListener('click', () => {
    audio.getAudioContext();
    const item = wire.simulateCPIFlash();
    audio.playMacroAlert();
  });

  document.getElementById('btn-sim-oil')?.addEventListener('click', () => {
    audio.getAudioContext();
    const item = wire.simulateOilShock();
    if (item && item.threatData?.playbook) {
      showCrisisModal(item.title, item.threatData.playbook);
    }
  });

  // 10. Wire Subscription
  wire.subscribe((newItem, threatData) => {
    updateTicker();
    renderWire();
    if (threatData?.threatLevel === 'CRISIS' && threatData.playbook) {
      showCrisisModal(newItem.title, threatData.playbook);
    }
  });

  // 11. Search & Filter Listeners
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    renderWire();
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCategoryFilter = e.currentTarget.getAttribute('data-filter');
      renderWire();
    });
  });

  // Time helper
  function formatTimeAgo(date) {
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  }

  // Initial renders
  updateTicker();
  renderWire();
  renderCalendar();

  // Active timers
  setInterval(() => {
    renderCalendar();
  }, 1000);

  // Background news polling start
  wire.startLiveFeed();
});
