/**
 * Economic Calendar & Macro Data Module
 * Pre-scheduled high-impact market drivers (CPI, FOMC, NFP, PPI, GDP, PMI)
 * with countdown calculations and institutional trading playbooks.
 */

class EconomicCalendar {
  constructor() {
    this.events = this.generateCalendarEvents();
  }

  /**
   * Generates dynamic calendar events anchored to current time
   * so the trader always has live upcoming events with active countdowns.
   */
  generateCalendarEvents() {
    const now = new Date();
    
    // Helper to create date relative to now
    const addHours = (h, m = 0) => {
      const d = new Date(now.getTime() + (h * 60 + m) * 60 * 1000);
      return d.toISOString();
    };

    return [
      {
        id: 'us-cpi-core',
        name: 'US Core CPI (MoM & YoY)',
        currency: 'USD',
        impact: 'HIGH',
        importance: '🚨 TIER 1 MARKET MOVER',
        scheduledTime: addHours(1, 45), // ~1 hr 45 min from now
        forecast: '0.3%',
        previous: '0.2%',
        actual: null,
        description: 'US Consumer Price Index measures the change in prices of goods and services purchased by consumers. Central metric for Federal Reserve rate trajectory.',
        playbook: {
          hotScenario: {
            condition: 'Actual > Forecast (Hot Inflation)',
            dxy: '📈 BULLISH (USD surges on delayed Fed rate cuts)',
            gold: '📉 BEARISH (XAU/USD drops sharply as yields spike)',
            stocks: '📉 BEARISH (S&P 500 & Nasdaq sell off)',
            crypto: '📉 BEARISH (Liquidity contraction hits BTC/ETH)'
          },
          coolScenario: {
            condition: 'Actual < Forecast (Cooling Inflation)',
            dxy: '📉 BEARISH (USD drops as rate cuts get priced in)',
            gold: '📈 BULLISH (Gold rallies aggressively to safety/store of value)',
            stocks: '📈 BULLISH (Equities celebrate lower interest rate environment)',
            crypto: '📈 BULLISH (Risk-on rally across Bitcoin and major altcoins)'
          },
          proTip: 'Watch the initial 60-second spike for fakeouts. Slippage is high on brokerages right at 08:30 AM EST.'
        }
      },
      {
        id: 'us-fomc-rate',
        name: 'FOMC Federal Funds Rate & Statement',
        currency: 'USD',
        impact: 'HIGH',
        importance: '🚨 TIER 1 MARKET MOVER',
        scheduledTime: addHours(5, 30),
        forecast: '5.25%',
        previous: '5.50%',
        actual: null,
        description: 'Federal Reserve interest rate decision. Dictates global dollar liquidity, borrowing costs, and macro asset valuation worldwide.',
        playbook: {
          hotScenario: {
            condition: 'Hawkish Statement / Hold / Higher for Longer',
            dxy: '📈 BULLISH (Massive Dollar rally)',
            gold: '📉 BEARISH (Gold sells off, holding costs rise)',
            stocks: '📉 BEARISH (Tech multiples contract)',
            crypto: '📉 BEARISH (Capital exits risky speculative assets)'
          },
          coolScenario: {
            condition: 'Dovish Rate Cut / Accommodative Guidance',
            dxy: '📉 BEARISH (Dollar index crashes)',
            gold: '📈 BULLISH (Gold breaks out to new highs)',
            stocks: '📈 BULLISH (Massive equity pump across US indices)',
            crypto: '📈 BULLISH (Parabolic breakout potential for BTC)'
          },
          proTip: 'The real move often starts 30 minutes later during Jerome Powell\'s Press Conference Q&A session.'
        }
      },
      {
        id: 'us-nfp',
        name: 'Non-Farm Payrolls (NFP) & Unemployment',
        currency: 'USD',
        impact: 'HIGH',
        importance: '🚨 TIER 1 MARKET MOVER',
        scheduledTime: addHours(12, 15),
        forecast: '165K',
        previous: '142K',
        actual: null,
        description: 'Measures the change in the number of employed people in the US during the previous month, excluding the farming industry.',
        playbook: {
          hotScenario: {
            condition: 'Actual > 185K (Labor Market Remains Overheated)',
            dxy: '📈 BULLISH (USD gains, recession fears fade)',
            gold: '📉 BEARISH (Gold dips on lower urgency for Fed cuts)',
            stocks: '📉 MIXED / BEARISH (Hawkish Fed pressure)',
            crypto: '📉 BEARISH (Yields rise, pressure on crypto)'
          },
          coolScenario: {
            condition: 'Actual < 140K (Labor Market Deteriorating)',
            dxy: '📉 BEARISH (Dollar weakens on accelerated easing bets)',
            gold: '📈 BULLISH (Gold spikes as rate cuts become urgent)',
            stocks: '⚠️ VOLATILE (Recession fears vs cheap money bets)',
            crypto: '📈 BULLISH (Loose monetary policy anticipation)'
          },
          proTip: 'Compare NFP with Average Hourly Earnings (wage growth) — wages often dictate the secondary trend.'
        }
      },
      {
        id: 'us-core-pce',
        name: 'US Core PCE Price Index (YoY)',
        currency: 'USD',
        impact: 'HIGH',
        importance: '🔴 HIGH IMPACT',
        scheduledTime: addHours(22, 0),
        forecast: '2.6%',
        previous: '2.6%',
        actual: null,
        description: 'The Federal Reserve\'s favorite inflation benchmark. Captures consumer spending shifts across all households.',
        playbook: {
          hotScenario: {
            condition: 'Actual > 2.7%',
            dxy: '📈 BULLISH',
            gold: '📉 BEARISH',
            stocks: '📉 BEARISH',
            crypto: '📉 BEARISH'
          },
          coolScenario: {
            condition: 'Actual < 2.6%',
            dxy: '📉 BEARISH',
            gold: '📈 BULLISH',
            stocks: '📈 BULLISH',
            crypto: '📈 BULLISH'
          },
          proTip: 'PCE confirms or contradicts earlier CPI readings.'
        }
      },
      {
        id: 'ecb-interest-rate',
        name: 'ECB Main Refinancing Rate Decision',
        currency: 'EUR',
        impact: 'HIGH',
        importance: '🔴 HIGH IMPACT',
        scheduledTime: addHours(28, 30),
        forecast: '3.65%',
        previous: '3.90%',
        actual: null,
        description: 'European Central Bank benchmark rate decision. Primary driver of EUR/USD, DAX 40, and European government bonds.',
        playbook: {
          hotScenario: {
            condition: 'ECB Pauses or Signals Hawkish Resilience',
            dxy: '📉 BEARISH (EUR/USD jumps higher, suppressing DXY)',
            gold: '📈 NEUTRAL / BULLISH',
            stocks: '📉 European Equities dip',
            crypto: '⚖️ NEUTRAL'
          },
          coolScenario: {
            condition: 'ECB Aggressively Cuts 50bps',
            dxy: '📈 BULLISH (EUR/USD dumps, boosting DXY)',
            gold: '📈 BULLISH (Global easing wave)',
            stocks: '📈 DAX rallies',
            crypto: '📈 Mildly Bullish'
          },
          proTip: 'Watch Christine Lagarde\'s tone regarding European economic growth and industrial contraction.'
        }
      },
      {
        id: 'us-core-ppi',
        name: 'US Core PPI (Producer Price Index)',
        currency: 'USD',
        impact: 'MEDIUM',
        importance: '🟠 MEDIUM IMPACT',
        scheduledTime: addHours(34, 0),
        forecast: '0.2%',
        previous: '0.0%',
        actual: null,
        description: 'Measures wholesale pipeline inflation before it is passed to retail consumers.',
        playbook: {
          hotScenario: {
            condition: 'Actual > Forecast',
            dxy: '📈 BULLISH',
            gold: '📉 BEARISH',
            stocks: '📉 BEARISH',
            crypto: '📉 BEARISH'
          },
          coolScenario: {
            condition: 'Actual < Forecast',
            dxy: '📉 BEARISH',
            gold: '📈 BULLISH',
            stocks: '📈 BULLISH',
            crypto: '📈 BULLISH'
          },
          proTip: 'PPI acts as a leading indicator for next month\'s CPI.'
        }
      }
    ];
  }

  /**
   * Calculates time remaining in milliseconds, formatted string, and alert status
   */
  getEventTimeStatus(scheduledIsoString) {
    const now = Date.now();
    const eventTime = new Date(scheduledIsoString).getTime();
    const diffMs = eventTime - now;

    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const countdownStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    // Alert boundaries
    const isImminent15 = diffMs > 0 && diffMs <= 15 * 60 * 1000;
    const isUrgent5 = diffMs > 0 && diffMs <= 5 * 60 * 1000;
    const isZeroHour = diffMs > -60000 && diffMs <= 0; // within 1 min after release

    return {
      diffMs,
      isPast,
      hours,
      minutes,
      seconds,
      countdownStr,
      isImminent15,
      isUrgent5,
      isZeroHour
    };
  }

  getNextMajorEvent() {
    const upcoming = this.events
      .filter(e => new Date(e.scheduledTime).getTime() > Date.now())
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
    
    return upcoming.length > 0 ? upcoming[0] : this.events[0];
  }
}

window.economicCalendar = new EconomicCalendar();
