/**
 * ============================================================================
 * 🎵 WEB AUDIO API SYNTHESIZER ENGINE
 * ============================================================================
 * Zero external audio files required! 100% self-contained synthesized sounds:
 * - Full "Happy Birthday" orchestral chime melody
 * - Real-time balloon pop sound effects with pitch randomization
 * - Candle blowout whoosh and smoke puff
 * - Sparkle chimes, magical fanfares, and heart chimes
 * - Gentle ambient fairytale music-box loop with play/pause toggle
 * ============================================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
    this.bgmStep = 0;
    this.masterGain = null;
    this.soundEffectsMuted = false;
  }

  // Ensure AudioContext is initialized on first user gesture
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Short bubbly UI tap
  playTap() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Candle puff / blow sound
  playBlowPuff() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  // Realistic cute balloon pop with slight pitch variation
  playBalloonPop() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const now = this.ctx.currentTime;
    const baseFreq = 500 + Math.random() * 250;

    // 1. Resonant body drop
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);

    // 2. High snap click
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(baseFreq * 2.5, now);
    snapOsc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

    snapGain.gain.setValueAtTime(0.2, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    snapOsc.connect(snapGain);
    snapGain.connect(this.masterGain);

    snapOsc.start(now);
    snapOsc.stop(now + 0.06);
  }

  // Magical sparkle chime arpeggio
  playSparkleChime() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const notes = [784, 988, 1175, 1568, 2093]; // G5, B5, D6, G6, C7
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.36);
    });
  }

  // Mystery gift wiggle sound
  playGiftWiggle() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(480, now + 0.08);
    osc.frequency.linearRampToValueAtTime(360, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Joyful gift unbox fanfare
  playGiftFanfare() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const now = this.ctx.currentTime;
    // Triumphant fanfare notes: C5, E5, G5, C6 (held)
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.16, t: 0.24 },
      { f: 1046.50, d: 0.7, t: 0.40 }
    ];

    melody.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + item.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + item.d + 0.05);
    });
  }

  // Sweet cascading heart chime when sending a hug
  playHeartChime() {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) return;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.52);
    });
  }

  // Full "Happy Birthday" melody synthesized via Web Audio API!
  playHappyBirthdayMelody(onComplete) {
    this.init();
    if (!this.ctx || this.soundEffectsMuted) {
      if (onComplete) onComplete();
      return;
    }

    const now = this.ctx.currentTime + 0.1;
    // Standard Happy Birthday notes (in C Major)
    // G4 = 392, A4 = 440, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99
    const notes = [
      // Line 1: Happy birthday to you
      { f: 392.00, d: 0.35, pause: 0.05 },
      { f: 392.00, d: 0.25, pause: 0.05 },
      { f: 440.00, d: 0.55, pause: 0.05 },
      { f: 392.00, d: 0.55, pause: 0.05 },
      { f: 523.25, d: 0.55, pause: 0.05 },
      { f: 493.88, d: 1.10, pause: 0.25 },

      // Line 2: Happy birthday to you
      { f: 392.00, d: 0.35, pause: 0.05 },
      { f: 392.00, d: 0.25, pause: 0.05 },
      { f: 440.00, d: 0.55, pause: 0.05 },
      { f: 392.00, d: 0.55, pause: 0.05 },
      { f: 587.33, d: 0.55, pause: 0.05 },
      { f: 523.25, d: 1.10, pause: 0.25 },

      // Line 3: Happy birthday dear [Niece]
      { f: 392.00, d: 0.35, pause: 0.05 },
      { f: 392.00, d: 0.25, pause: 0.05 },
      { f: 783.99, d: 0.55, pause: 0.05 },
      { f: 659.25, d: 0.55, pause: 0.05 },
      { f: 523.25, d: 0.55, pause: 0.05 },
      { f: 493.88, d: 0.55, pause: 0.05 },
      { f: 440.00, d: 0.95, pause: 0.25 },

      // Line 4: Happy birthday to you!
      { f: 698.46, d: 0.35, pause: 0.05 },
      { f: 698.46, d: 0.25, pause: 0.05 },
      { f: 659.25, d: 0.55, pause: 0.05 },
      { f: 523.25, d: 0.55, pause: 0.05 },
      { f: 587.33, d: 0.55, pause: 0.05 },
      { f: 523.25, d: 1.50, pause: 0.30 }
    ];

    let cursor = now;
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Glockenspiel / Music box character (warm sine + subtle harmonic)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, cursor);

      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(n.f * 2, cursor);

      gain.gain.setValueAtTime(0.24, cursor);
      gain.gain.exponentialRampToValueAtTime(0.001, cursor + n.d);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(cursor);
      subOsc.start(cursor);
      osc.stop(cursor + n.d + 0.05);
      subOsc.stop(cursor + n.d + 0.05);

      cursor += n.d + n.pause;
    });

    const totalDuration = (cursor - now) * 1000;
    if (onComplete) {
      setTimeout(onComplete, totalDuration);
    }
  }

  // Gentle, ambient music-box style lullaby loop
  toggleBackgroundMusic() {
    this.init();
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  startBackgroundMusic() {
    this.init();
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Peaceful celestial loop chords: C - G - Am - F
    const chords = [
      [523.25, 659.25, 783.99], // C major
      [392.00, 493.88, 587.33], // G major
      [440.00, 523.25, 659.25], // A minor
      [349.23, 440.00, 523.25]  // F major
    ];

    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[this.bgmStep % chords.length];

      // Arpeggiate the chord softly
      currentChord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.22;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.07, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + 1.3);
      });

      this.bgmStep++;
      this.bgmTimer = setTimeout(playChordStep, 1400);
    };

    playChordStep();
  }

  stopBackgroundMusic() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

window.soundEngine = new SoundEngine();
