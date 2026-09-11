/**
 * Audio Synthesizer for PulseAlerts
 * Generates soft, pleasant ambient alert tones (2-second duration)
 * using HTML5 Web Audio API pure sine waves. Very gentle and non-intrusive.
 */

class TerminalAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.45; // Soft default volume
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setMuted(muted) {
    this.isMuted = !!muted;
  }

  /**
   * Soft, gentle 2-second ambient tone
   * Uses harmonic pure sine waves with smooth fade-in and natural decay.
   */
  playGentleTone(duration = 2.0) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    // Smooth gentle fade in
    masterGain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.08);
    // Soft sustain & exponential gentle decay over 2 seconds
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // Warm, soothing chord (E5: 659.25Hz and B5: 987.77Hz, pure sine)
    const freqs = [523.25, 659.25, 783.99]; // Gentle C-Major triad (C5, E5, G5)
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine'; // Pure smooth tone, no harsh edges
      osc.frequency.setValueAtTime(freq, now);

      // Slight frequency sweep for an elegant chime sensation
      osc.frequency.linearRampToValueAtTime(freq * 1.005, now + duration);

      oscGain.gain.setValueAtTime(0.35 / freqs.length, now);
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + duration);
    });
  }

  /**
   * War / Crisis Alert: Soft 2-second two-stage ambient pulse
   * Gentle, soft, but distinct so trader notices without loud screeches
   */
  playCrisisSiren(duration = 2.0) {
    this.playGentleTone(duration);
  }

  /**
   * Macro release tone (CPI / FOMC / NFP): Soft 2-second chime
   */
  playMacroAlert() {
    this.playGentleTone(2.0);
  }

  /**
   * Pre-event warning beep: Gentle soft double-pulse (2 seconds total)
   */
  playWarningBeep() {
    this.playGentleTone(2.0);
  }

  /**
   * Subtle radar wire tick for new incoming headlines
   */
  playWireTick() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }
}

window.terminalAudio = new TerminalAudio();
