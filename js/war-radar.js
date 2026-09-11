/**
 * War & Geopolitical Crisis Radar
 * Fast-scans live financial headlines for war, missile strikes, military escalation,
 * and energy shocks. Automatically generates instant institutional trade positioning playbooks.
 */

class WarRadar {
  constructor() {
    // High-priority crisis keywords
    this.crisisKeywords = [
      'war', 'iran', 'israel', 'missile', 'strike', 'strikes', 'attack', 'attacked',
      'airstrike', 'explosion', 'strait of hormuz', 'nuclear', 'retaliation', 'military',
      'drone', 'invasion', 'red sea', 'hezbollah', 'houthi', 'pentagon', 'us navy',
      'syria', 'taiwan', 'russia', 'ukraine', 'escalation', 'hostilities', 'declared war'
    ];

    // Energy & Commodity shock keywords
    this.oilKeywords = [
      'crude oil', 'brent', 'wti', 'opec', 'oil facility', 'oil tanker', 'refinery',
      'aramco', 'oil embargo', 'pipeline fire', 'pipeline explosion', 'supply cut'
    ];

    // Central bank emergency & black swan keywords
    this.macroShockKeywords = [
      'emergency cut', 'emergency rate', 'emergency meeting', 'circuit breaker',
      'trading halt', 'bank run', 'bank failure', 'default', 'sec charges'
    ];

    // Custom trader watchlist (loaded from localStorage)
    this.customWatchlist = this.loadCustomWatchlist();
  }

  loadCustomWatchlist() {
    try {
      const saved = localStorage.getItem('trading_radar_custom_keywords');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load custom watchlist', e);
    }
    // Default preset watchlist tailored for geopolitics & key assets
    return ['Iran', 'Israel', 'Strait of Hormuz', 'Oil', 'Gold', 'Fed'];
  }

  saveCustomWatchlist() {
    try {
      localStorage.setItem('trading_radar_custom_keywords', JSON.stringify(this.customWatchlist));
    } catch (e) {
      console.warn('Failed to save custom watchlist', e);
    }
  }

  addCustomKeyword(keyword) {
    const trimmed = keyword.trim();
    if (!trimmed) return false;
    const exists = this.customWatchlist.some(k => k.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      this.customWatchlist.push(trimmed);
      this.saveCustomWatchlist();
      return true;
    }
    return false;
  }

  removeCustomKeyword(keyword) {
    this.customWatchlist = this.customWatchlist.filter(k => k.toLowerCase() !== keyword.toLowerCase());
    this.saveCustomWatchlist();
  }

  /**
   * Scans a headline and returns its threat tier, matched keywords, and trade positioning
   */
  analyzeHeadline(title, summary = '') {
    const text = `${title} ${summary}`.toLowerCase();
    
    // Check Custom User Watchlist
    const matchedCustom = this.customWatchlist.filter(k => 
      new RegExp(`\\b${k.toLowerCase()}\\b`, 'i').test(text)
    );

    // Check Crisis / War
    const matchedCrisis = this.crisisKeywords.filter(k => 
      new RegExp(`\\b${k}\\b`, 'i').test(text)
    );

    // Check Oil & Energy shocks
    const matchedOil = this.oilKeywords.filter(k => 
      new RegExp(`\\b${k}\\b`, 'i').test(text)
    );

    // Check Macro / Emergency Shocks
    const matchedShock = this.macroShockKeywords.filter(k => 
      new RegExp(`\\b${k}\\b`, 'i').test(text)
    );

    let threatLevel = 'NORMAL';
    let playbook = null;

    if (matchedCrisis.length > 0) {
      threatLevel = 'CRISIS';
      playbook = this.getWarTradePlaybook(matchedCrisis, title);
    } else if (matchedOil.length > 0) {
      threatLevel = 'ENERGY_SHOCK';
      playbook = this.getOilTradePlaybook(matchedOil, title);
    } else if (matchedShock.length > 0) {
      threatLevel = 'MACRO_SHOCK';
      playbook = this.getMacroShockPlaybook(matchedShock, title);
    } else if (matchedCustom.length > 0) {
      threatLevel = 'WATCHLIST';
      playbook = this.getWatchlistPlaybook(matchedCustom, title);
    }

    return {
      threatLevel,
      matchedCrisis,
      matchedOil,
      matchedShock,
      matchedCustom,
      playbook,
      isAlertWorthy: threatLevel === 'CRISIS' || threatLevel === 'ENERGY_SHOCK' || threatLevel === 'MACRO_SHOCK'
    };
  }

  /**
   * Generates instant positioning for military/war conflict (US-Iran, Middle East, etc.)
   */
  getWarTradePlaybook(matchedWords, title) {
    return {
      category: '🚨 GEOPOLITICAL / WAR CRISIS',
      badgeClass: 'badge-crisis',
      summary: `Critical geopolitical escalation detected containing: ${matchedWords.slice(0, 4).join(', ').toUpperCase()}.`,
      trades: [
        {
          action: 'BUY / LONG',
          asset: 'GOLD (XAU/USD)',
          urgency: 'HIGH',
          reason: 'Flight-to-safety capital rushes into physical gold; expect aggressive upward spike.'
        },
        {
          action: 'BUY / LONG',
          asset: 'CRUDE OIL (WTI & BRENT)',
          urgency: 'HIGH',
          reason: 'Middle East / Strait of Hormuz supply disruption panic forces immediate risk premium.'
        },
        {
          action: 'BUY / LONG',
          asset: 'US DOLLAR (DXY)',
          urgency: 'MEDIUM-HIGH',
          reason: 'Global liquidity refuge; investors exit emerging markets & risk currencies into USD.'
        },
        {
          action: 'SHORT / SELL',
          asset: 'EQUITIES (S&P 500, NASDAQ)',
          urgency: 'HIGH',
          reason: 'Risk-off liquidation across global stock indices as geopolitical risk surges.'
        },
        {
          action: 'CAUTION / VOLATILITY',
          asset: 'BITCOIN & CRYPTO (BTC)',
          urgency: 'WARNING',
          reason: 'Crypto trades as a risk-asset during initial flash; expect immediate liquidations before any bounce.'
        }
      ],
      rule: '⚠️ Spread & slippage will widen dramatically. Avoid excessive leverage and widen stop-loss boundaries.'
    };
  }

  /**
   * Generates positioning for Oil & Energy shocks
   */
  getOilTradePlaybook(matchedWords, title) {
    return {
      category: '🛢️ ENERGY & OIL SUPPLY SHOCK',
      badgeClass: 'badge-oil',
      summary: `Energy supply disruption / OPEC shock detected: ${matchedWords.join(', ').toUpperCase()}.`,
      trades: [
        {
          action: 'BUY / LONG',
          asset: 'CRUDE OIL (BRENT / WTI)',
          urgency: 'HIGH',
          reason: 'Direct supply deficit pressure spikes barrel price.'
        },
        {
          action: 'BUY / LONG',
          asset: 'USD/CAD (CAD STRENGTH)',
          urgency: 'MEDIUM',
          reason: 'Canadian Dollar benefits as a major net oil exporter.'
        },
        {
          action: 'SHORT / SELL',
          asset: 'AIRLINES & TRANSPORT (JETS)',
          urgency: 'HIGH',
          reason: 'Jet fuel operating margins compress instantly.'
        },
        {
          action: 'SHORT / SELL',
          asset: 'EUR/USD & JPY',
          urgency: 'MEDIUM',
          reason: 'Energy-importing economies face deteriorating terms of trade.'
        }
      ],
      rule: '⚡ Monitor API/EIA inventory numbers and official OPEC emergency announcements.'
    };
  }

  /**
   * Generates positioning for emergency central bank or structural shocks
   */
  getMacroShockPlaybook(matchedWords, title) {
    return {
      category: '⚡ BLACK SWAN / MACRO SHOCK',
      badgeClass: 'badge-shock',
      summary: `High-impact structural shock detected: ${matchedWords.join(', ').toUpperCase()}.`,
      trades: [
        {
          action: 'POSITION SHIFT',
          asset: 'US TREASURY YIELDS',
          urgency: 'HIGH',
          reason: 'Rapid repricing of interest rate expectations.'
        },
        {
          action: 'BUY / LONG',
          asset: 'GOLD (XAU/USD)',
          urgency: 'HIGH',
          reason: 'Monetary system instability and sudden rate cuts drive bullion higher.'
        },
        {
          action: 'VOLATILITY WATCH',
          asset: 'DXY & S&P 500',
          urgency: 'HIGH',
          reason: 'Prepare for violent whipsaws; check official Fed discount window statements.'
        }
      ],
      rule: '🛡️ Reduce lot sizes by 50% until market pricing stabilizes.'
    };
  }

  getWatchlistPlaybook(matchedWords, title) {
    return {
      category: '🎯 CUSTOM WATCHLIST HIT',
      badgeClass: 'badge-watchlist',
      summary: `Headline matched your custom monitored keywords: ${matchedWords.join(', ')}.`,
      trades: [
        {
          action: 'MONITOR',
          asset: matchedWords.join(' / '),
          urgency: 'MEDIUM',
          reason: 'Active keyword alert triggered from your personalized radar watchlist.'
        }
      ],
      rule: 'Review the headline context before entering new orders.'
    };
  }

  /**
   * Formats a headline with glowing highlights over matched keywords
   */
  highlightKeywords(text) {
    let result = text;
    const allKeywords = [
      ...this.crisisKeywords,
      ...this.oilKeywords,
      ...this.macroShockKeywords,
      ...this.customWatchlist
    ];

    // Sort by length descending to match longer multi-word phrases first
    allKeywords.sort((a, b) => b.length - a.length);

    allKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      result = result.replace(regex, `<mark class="kw-highlight">$1</mark>`);
    });

    return result;
  }
}

window.warRadar = new WarRadar();
