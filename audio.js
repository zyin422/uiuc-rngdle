// UIUC RNGdle - Audio Synthesizer (Zero external dependencies)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTick(pitchOffset = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500 + pitchOffset * 40, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio not permitted or interrupted
    }
  }

  playReelStop(index, isEmpty = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = isEmpty ? 'triangle' : 'sine';
      const baseFreq = isEmpty ? 180 : 320 + index * 35;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(isEmpty ? 0.08 : 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {}
  }

  playBadgeReveal(rarity) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = {
        common: 440,
        uncommon: 523.25,
        rare: 659.25,
        epic: 783.99,
        anomaly: 987.77,
        mythic: 1174.66
      };

      const freq = freqs[rarity] || 440;
      osc.type = (rarity === 'anomaly' || rarity === 'mythic') ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playRarityFanfare(rarity) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = {
        common: [261.63, 329.63],
        uncommon: [329.63, 392.00, 493.88],
        rare: [392.00, 493.88, 587.33],
        epic: [440.00, 554.37, 659.25, 880.00],
        mythic: [587.33, 739.99, 880.00, 1174.66, 1479.98],
        anomaly: [440.00, 622.25, 783.99, 932.33, 1244.51]
      };

      const notes = chords[rarity] || chords.common;
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.065;
        const dur = (rarity === 'mythic' || rarity === 'anomaly') ? 0.6 : 0.35;

        osc.type = (rarity === 'anomaly') ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.02);
      });
    } catch (e) {}
  }
}

window.soundFX = new SoundFX();
