/**
 * Desktop Notifications & Background Monitoring Engine for PulseAlerts
 * Delivers native Windows desktop notifications even when minimized or in background tabs.
 */

class TerminalNotifications {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.audioEngine = window.terminalAudio;
    this.triggeredAlerts = new Set(); // Prevent duplicate alerts
  }

  async requestPermission() {
    if (!this.isSupported) {
      alert('Your browser does not support desktop notifications.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return false;
    }
  }

  hasPermission() {
    return this.isSupported && this.permission === 'granted';
  }

  /**
   * Fires a native notification with soft audio tone
   */
  notify(title, options = {}, alertSound = 'GENTLE') {
    // Play the soft 2-second alert tone
    if (this.audioEngine) {
      if (alertSound === 'TICK') {
        this.audioEngine.playWireTick();
      } else {
        this.audioEngine.playGentleTone(2.0);
      }
    }

    // Native Desktop Notification
    if (this.hasPermission()) {
      try {
        const notif = new Notification(title, {
          icon: 'https://cdn-icons-png.flaticon.com/512/2953/2953363.png',
          badge: 'https://cdn-icons-png.flaticon.com/512/2953/2953363.png',
          requireInteraction: options.requireInteraction || false,
          silent: true, // Audio handled by our soft Web Audio synthesizer
          ...options
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  }

  /**
   * High-priority alert for War / Geopolitical Crisis
   */
  alertCrisis(title, threatData) {
    const notifTitle = `PulseAlerts // 🚨 WAR FLASH: ${threatData.matchedCrisis.slice(0, 3).join(', ').toUpperCase()}`;
    const notifBody = `${title}\n\nTRADE POSITION:\n🟢 BUY GOLD (XAU/USD) & CRUDE OIL\n🔴 SHORT S&P500 & EQUITIES`;

    this.notify(notifTitle, {
      body: notifBody,
      tag: 'crisis-alert',
      requireInteraction: true
    }, 'GENTLE');
  }

  /**
   * Pre-scheduled Macro Event Alert (CPI, FOMC, NFP)
   */
  alertMacroEvent(event, stage) {
    const key = `${event.id}_${stage}`;
    if (this.triggeredAlerts.has(key)) return;
    this.triggeredAlerts.add(key);

    let title = '';
    let body = '';

    if (stage === '15M') {
      title = `PulseAlerts // ⏰ 15 MIN WARNING: ${event.name}`;
      body = `High impact release at ${new Date(event.scheduledTime).toLocaleTimeString()}.\nPrevious: ${event.previous} | Forecast: ${event.forecast}\nPrepare trading terminals!`;
    } else if (stage === '5M') {
      title = `PulseAlerts // 🚨 5 MIN URGENT WARNING: ${event.name}`;
      body = `High market volatility expected in 5 minutes! Close unhedged scalps or set wide stops.`;
    } else if (stage === 'RELEASE') {
      title = `PulseAlerts // 🔥 RELEASED NOW: ${event.name}!`;
      body = `Forecast: ${event.forecast} | Previous: ${event.previous}\nCheck live actual numbers and volatility spikes!`;
    }

    this.notify(title, {
      body: body,
      tag: `macro-${event.id}`,
      requireInteraction: true
    }, 'GENTLE');
  }

  /**
   * Custom Watchlist Alert
   */
  alertWatchlist(keyword, headline) {
    this.notify(`PulseAlerts // 🎯 WATCHLIST HIT: [${keyword.toUpperCase()}]`, {
      body: headline,
      tag: `watch-${keyword}`,
      requireInteraction: false
    }, 'GENTLE');
  }
}

window.terminalNotifications = new TerminalNotifications();
