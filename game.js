(() => {
  'use strict';

  /* ============================================================
     PRISM · 棱镜逆流 · 第七夜
     A small neon ritual about returning bullets to their senders.
     七夜守灯 / 主角：阿镜 A-JING
     ============================================================ */

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  const TAU = Math.PI * 2;

  const dom = {
    hud: document.getElementById('hud'),
    menu: document.getElementById('menu'),
    pause: document.getElementById('pause'),
    gameover: document.getElementById('gameover'),
    waveNum: document.getElementById('waveNum'),
    scoreNum: document.getElementById('scoreNum'),
    bestNum: document.getElementById('bestNum'),
    menuBest: document.getElementById('menuBest'),
    hpPips: document.getElementById('hpPips'),
    comboWrap: document.getElementById('comboWrap'),
    comboNum: document.getElementById('comboNum'),
    comboBar: document.getElementById('comboBar'),
    bossBar: document.getElementById('bossBar'),
    bossFill: document.getElementById('bossFill'),
    bossHpText: document.getElementById('bossHpText'),
    announce: document.getElementById('announce'),
    announceKicker: document.getElementById('announceKicker'),
    announceTitle: document.getElementById('announceTitle'),
    announceSub: document.getElementById('announceSub'),
    hint: document.getElementById('hint'),
    novaReady: document.getElementById('novaReady'),
    novaHint: document.getElementById('novaHint'),
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    quitBtn: document.getElementById('quitBtn'),
    menuBtn: document.getElementById('menuBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    soundBtn: document.getElementById('soundBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    menuFsBtn: document.getElementById('menuFsBtn'),
    menuFsLabel: document.getElementById('menuFsLabel'),
    touchPulse: document.getElementById('touchPulse'),
    touchNova: document.getElementById('touchNova'),
    touchStick: document.getElementById('touchStick'),
    touchKnob: document.getElementById('touchKnob'),
    touchAimStick: document.getElementById('touchAimStick'),
    touchAimKnob: document.getElementById('touchAimKnob'),
    finalScore: document.getElementById('finalScore'),
    finalWave: document.getElementById('finalWave'),
    finalDeflects: document.getElementById('finalDeflects'),
    finalCombo: document.getElementById('finalCombo'),
    finalBest: document.getElementById('finalBest'),
    newRecord: document.getElementById('newRecord'),
    nightTotal: document.getElementById('nightTotal'),
    legend: document.getElementById('legend'),
    legendBtn: document.getElementById('legendBtn'),
    menuNight: document.getElementById('menuNight'),
    coreSignal: document.getElementById('coreSignal'),
    gameoverDesc: document.getElementById('gameoverDesc'),
    finalNight: document.getElementById('finalNight'),
    prologue: document.getElementById('prologue'),
    prologueNext: document.getElementById('prologueNext'),
    prologueSkip: document.getElementById('prologueSkip'),
    prologueNextLabel: document.getElementById('prologueNextLabel'),
    character: document.getElementById('character'),
    characterClose: document.getElementById('characterClose'),
    lore: document.getElementById('lore'),
    loreClose: document.getElementById('loreClose'),
    loreFromCodex: document.getElementById('loreFromCodex'),
    loreToPlay: document.getElementById('loreToPlay'),
    endlessBtn: document.getElementById('endlessBtn'),
    codexBtn: document.getElementById('codexBtn'),
    loreBtn: document.getElementById('loreBtn'),
    heroCardBtn: document.getElementById('heroCardBtn'),
    ending: document.getElementById('ending'),
    endingScore: document.getElementById('endingScore'),
    endingNights: document.getElementById('endingNights'),
    endingDeflects: document.getElementById('endingDeflects'),
    endingCombo: document.getElementById('endingCombo'),
    endingEndless: document.getElementById('endingEndless'),
    endingRestart: document.getElementById('endingRestart'),
    endingMenu: document.getElementById('endingMenu'),
  };

  const COLORS = {
    cyan: '109,247,255',
    white: '238,254,255',
    magenta: '255,88,216',
    violet: '141,123,255',
    amber: '255,196,107',
    red: '255,86,106',
    rose: '255,124,150',
    repair: '111,255,174',
  };

  const META = {
    wisp:     { r: 13.5, hp: 1, speed: 132, orbit: 0.24, pref: 252, score: 90,  color: 'red' },
    prism:    { r: 20, hp: 2, speed: 92,  orbit: -0.11, pref: 330, score: 150, color: 'magenta' },
    splitter: { r: 18, hp: 2, speed: 108, orbit: 0.17, pref: 232, score: 180, color: 'violet' },
    lancer:   { r: 21, hp: 3, speed: 86,  orbit: 0.075, pref: 318, score: 230, color: 'amber' },
    ember:    { r: 11, hp: 1, speed: 208, orbit: 0.9, pref: 118, score: 120, color: 'red' },
    warden:   { r: 50, hp: 30, speed: 70,  orbit: 0, pref: 0, score: 1800, color: 'magenta' },
  };

  const STORY_TOTAL = 7;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeOutQuint = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 5);
  const angleDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
  const normalAngle = (a) => {
    let v = a % TAU;
    if (v < 0) v += TAU;
    return v;
  };
  const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');
  const pad6 = (n) => String(Math.max(0, Math.floor(n))).padStart(6, '0');

  let W = 1;
  let H = 1;
  let DPR = 1;
  let S = 1;
  let CX = 0;
  let CY = 0;
  let gameTime = 0;
  let menuT = 0;
  let state = 'menu';
  let lastTs = 0;
  let best = loadBest();

  let run = null;
  let core = { x: 0, y: 0, vx: 0, vy: 0, r: 15 };
  let shield = { angle: -Math.PI / 2, target: -Math.PI / 2, radius: 104, half: 0.52 };

  let enemies = [];
  let bullets = [];
  let particles = [];
  let beams = [];
  let shards = [];
  let pulses = [];
  let floaters = [];

  let shake = 0;
  let whiteFlash = 0;
  let redFlash = 0;
  let healFlash = 0;

  const input = {
    mx: 0,
    my: 0,
    pointerSeen: false,
    keys: new Set(),
    aimMode: 'pointer',
    keyboardAngle: -Math.PI / 2,
    touchAimAngle: -Math.PI / 2,
  };

  const touchMove = {
    active: false,
    id: null,
    x: 0,
    y: 0,
  };

  const touchAim = {
    active: false,
    id: null,
    x: 0,
    y: 0,
  };

  const hudCache = {
    score: -1,
    wave: -1,
    hp: -1,
    mult: -1,
    ready: null,
    boss: null,
    best: -1,
  };

  let announceTimer = 0;
  let hintTimer = 0;
  let hintTimeout = null;
  let announceTimeout = null;

  let bgCanvas = null;
  let stars = [];
  let motes = [];
  let menuOrbs = [];
  let freezeScene = false;
  let debugInvincible = false;

  const GLOW = {};
  const MAX_PARTICLES = 620;

  /* ============================================================
     AUDIO — tiny generative synth, no external assets
     ============================================================ */

  const audio = {
    ctx: null,
    master: null,
    musicGain: null,
    reverbSend: null,
    noiseBuf: null,
    muted: false,
    nextBeat: 0,
    beatIndex: 0,
    lastShoot: 0,

    init() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;

      try {
        const ac = new AC();
        this.ctx = ac;

        const master = ac.createGain();
        master.gain.value = 0.72;
        const comp = ac.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.knee.value = 18;
        comp.ratio.value = 5;
        comp.attack.value = 0.004;
        comp.release.value = 0.22;
        master.connect(comp);
        comp.connect(ac.destination);
        this.master = master;

        this.musicGain = ac.createGain();
        this.musicGain.gain.value = 0.55;
        this.musicGain.connect(master);

        const reverb = ac.createConvolver();
        const impulseLen = Math.floor(ac.sampleRate * 1.8);
        const impulse = ac.createBuffer(2, impulseLen, ac.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch);
          for (let i = 0; i < impulseLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 3.2);
          }
        }
        reverb.buffer = impulse;

        const send = ac.createGain();
        send.gain.value = 0.34;
        const wet = ac.createGain();
        wet.gain.value = 0.34;
        send.connect(reverb);
        reverb.connect(wet);
        wet.connect(master);
        this.reverbSend = send;

        const noiseLen = Math.floor(ac.sampleRate * 1.5);
        const noise = ac.createBuffer(1, noiseLen, ac.sampleRate);
        const nd = noise.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) nd[i] = Math.random() * 2 - 1;
        this.noiseBuf = noise;

        this.startDrone();
        this.nextBeat = ac.currentTime + 0.15;
      } catch (err) {
        console.warn('Audio unavailable:', err);
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },

    startDrone() {
      const ac = this.ctx;
      if (!ac) return;
      const t = ac.currentTime;
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 340;
      filter.Q.value = 0.7;
      filter.connect(this.musicGain);

      const freqs = [55, 82.4069];
      freqs.forEach((f, i) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.detune.value = i === 0 ? -5 : 6;
        g.gain.value = i === 0 ? 0.026 : 0.014;
        osc.connect(g);
        g.connect(filter);
        osc.start(t);

        const lfo = ac.createOscillator();
        const lfoGain = ac.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = i === 0 ? 0.055 : 0.083;
        lfoGain.gain.value = i === 0 ? 0.008 : 0.005;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start(t);
      });
    },

    connect(node, pan, reverbAmount) {
      const ac = this.ctx;
      if (!ac) return;
      let out = node;
      if (pan && ac.createStereoPanner) {
        const p = ac.createStereoPanner();
        p.pan.value = clamp(pan, -1, 1);
        node.connect(p);
        out = p;
      }
      out.connect(this.master);
      if (reverbAmount > 0 && this.reverbSend) {
        const send = ac.createGain();
        send.gain.value = reverbAmount;
        out.connect(send);
        send.connect(this.reverbSend);
      }
    },

    tone(freq, dur, opts = {}) {
      if (!this.ctx || this.muted) return;
      const ac = this.ctx;
      const t = ac.currentTime + (opts.delay || 0);
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const type = opts.type || 'sine';
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freq), t);
      if (opts.slide) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slide), t + dur);
      }

      const vol = opts.vol == null ? 0.05 : opts.vol;
      const attack = opts.attack == null ? 0.004 : opts.attack;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      let node = osc;
      if (opts.filter) {
        const filter = ac.createBiquadFilter();
        filter.type = opts.filter;
        filter.frequency.value = opts.filterFreq || 1200;
        node.connect(filter);
        node = filter;
      }
      node.connect(g);
      this.connect(g, opts.pan || 0, opts.reverb == null ? 0.12 : opts.reverb);

      osc.start(t);
      osc.stop(t + dur + 0.04);
    },

    noise(dur, opts = {}) {
      if (!this.ctx || this.muted || !this.noiseBuf) return;
      const ac = this.ctx;
      const t = ac.currentTime + (opts.delay || 0);
      const src = ac.createBufferSource();
      src.buffer = this.noiseBuf;
      src.loop = true;
      const filter = ac.createBiquadFilter();
      filter.type = opts.filter || 'bandpass';
      filter.frequency.setValueAtTime(opts.freq || 1200, t);
      if (opts.slide) {
        filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.slide), t + dur);
      }
      filter.Q.value = opts.q == null ? 0.8 : opts.q;

      const g = ac.createGain();
      const vol = opts.vol == null ? 0.035 : opts.vol;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + (opts.attack || 0.006));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      src.connect(filter);
      filter.connect(g);
      this.connect(g, opts.pan || 0, opts.reverb == null ? 0.16 : opts.reverb);
      src.start(t);
      src.stop(t + dur + 0.04);
    },

    deflect(combo, pan) {
      const p = 640 + Math.min(combo, 20) * 42;
      this.tone(p, 0.075, { type: 'triangle', slide: p * 1.65, vol: 0.038, pan, reverb: 0.12 });
      this.tone(p * 2, 0.045, { type: 'sine', slide: p * 2.6, vol: 0.018, pan, reverb: 0.1 });
      this.noise(0.05, { filter: 'highpass', freq: 3600, vol: 0.012, pan, reverb: 0.06 });
    },

    enemyHit(pan) {
      this.tone(170, 0.07, { type: 'square', slide: 110, vol: 0.018, pan, reverb: 0.05 });
    },

    kill(pan) {
      this.noise(0.26, { filter: 'lowpass', freq: 1100, slide: 180, vol: 0.05, pan, reverb: 0.18 });
      this.tone(150, 0.25, { type: 'sawtooth', slide: 46, vol: 0.028, pan, reverb: 0.12 });
    },

    shoot(pan) {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (now - this.lastShoot < 0.055) return;
      this.lastShoot = now;
      this.tone(390, 0.055, { type: 'sawtooth', slide: 190, vol: 0.006, pan, reverb: 0.04 });
    },

    pulse() {
      this.tone(170, 0.32, { type: 'sine', slide: 960, vol: 0.07, reverb: 0.28 });
      this.noise(0.24, { filter: 'bandpass', freq: 420, slide: 2600, q: 2.2, vol: 0.03, reverb: 0.2 });
    },

    block() {
      this.tone(1250, 0.18, { type: 'triangle', slide: 620, vol: 0.05, reverb: 0.3 });
      this.noise(0.14, { filter: 'highpass', freq: 2200, vol: 0.03, reverb: 0.2 });
    },

    hurt() {
      this.tone(120, 0.42, { type: 'sawtooth', slide: 38, vol: 0.1, reverb: 0.24 });
      this.noise(0.34, { filter: 'lowpass', freq: 900, slide: 120, vol: 0.08, reverb: 0.2 });
    },

    nova() {
      [220, 277.18, 329.63, 440, 554.37].forEach((f, i) => {
        this.tone(f, 1.15, { type: 'triangle', slide: f * 2, vol: 0.032, delay: i * 0.035, reverb: 0.55 });
      });
      this.tone(85, 0.9, { type: 'sine', slide: 240, vol: 0.075, reverb: 0.4 });
      this.noise(0.7, { filter: 'bandpass', freq: 500, slide: 5000, q: 1.2, vol: 0.03, reverb: 0.5 });
    },

    waveClear() {
      [329.63, 415.3, 493.88, 659.25].forEach((f, i) => {
        this.tone(f, 0.75, { type: 'sine', vol: 0.034, delay: i * 0.08, reverb: 0.55 });
      });
    },

    waveStart(boss) {
      if (boss) {
        this.tone(62, 1.3, { type: 'sawtooth', slide: 39, vol: 0.055, reverb: 0.5 });
        this.noise(1.0, { filter: 'lowpass', freq: 300, slide: 80, vol: 0.04, reverb: 0.5 });
      } else {
        this.tone(196, 0.42, { type: 'triangle', slide: 294, vol: 0.035, reverb: 0.4 });
      }
    },

    boss() {
      this.tone(48, 1.5, { type: 'sawtooth', slide: 33, vol: 0.07, reverb: 0.6 });
      this.noise(1.2, { filter: 'bandpass', freq: 160, slide: 900, q: 1.2, vol: 0.05, reverb: 0.5 });
    },

    chime() {
      this.tone(880, 0.25, { type: 'sine', slide: 1320, vol: 0.03, reverb: 0.4 });
      this.tone(1320, 0.4, { type: 'sine', slide: 1760, vol: 0.018, reverb: 0.5 });
    },

    heal() {
      this.tone(523.25, 0.5, { type: 'sine', slide: 783.99, vol: 0.04, reverb: 0.55 });
      this.tone(659.25, 0.62, { type: 'triangle', slide: 987.77, vol: 0.026, delay: 0.06, reverb: 0.55 });
      this.tone(1046.5, 0.42, { type: 'sine', vol: 0.014, delay: 0.12, reverb: 0.5 });
    },

    start() {
      [130.81, 196, 261.63, 392].forEach((f, i) => {
        this.tone(f, 0.9, { type: 'triangle', vol: 0.032, delay: i * 0.06, reverb: 0.4 });
      });
    },

    gameover() {
      [220, 174.61, 146.83, 110].forEach((f, i) => {
        this.tone(f, 1.1, { type: 'sine', slide: f * 0.72, vol: 0.052, delay: i * 0.13, reverb: 0.5 });
      });
      this.noise(1.2, { filter: 'lowpass', freq: 700, slide: 90, vol: 0.05, reverb: 0.3 });
    },

    toggleMute() {
      this.muted = !this.muted;
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.muted ? 0.0001 : 0.72, this.ctx.currentTime, 0.03);
      }
      if (!this.muted) this.nextBeat = this.ctx ? this.ctx.currentTime + 0.05 : 0;
      return this.muted;
    },

    updateMusic(intensity) {
      if (!this.ctx || this.muted) return;
      const ac = this.ctx;
      const now = ac.currentTime;
      if (this.nextBeat < now - 0.55) this.nextBeat = now + 0.05;
      const beat = 0.272;

      while (this.nextBeat < now + 0.24) {
        const b = this.beatIndex++;
        const when = this.nextBeat;
        if (b % 8 === 0) this.kick(when);
        if (b % 4 === 2) this.hat(when);
        if (b % 2 === 0) {
          const pattern = [0, 2, 4, 2, 5, 3, 1, 4, 2, 6, 4, 3];
          const scale = [220, 246.94, 277.18, 329.63, 392, 440, 523.25];
          let idx = pattern[(b / 2) % pattern.length | 0];
          if (Math.random() < 0.18) idx = (idx + 1) % scale.length;
          this.pluck(scale[idx], when, intensity);
        }
        if (intensity > 1.6 && b % 8 === 4) {
          this.pluck(659.25, when + 0.09, intensity * 0.7);
        }
        this.nextBeat += beat;
      }
    },

    pluck(freq, when, intensity = 1) {
      const ac = this.ctx;
      if (!ac) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const filter = ac.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 1600 + intensity * 300;
      filter.Q.value = 1.6;

      const vol = (0.008 + intensity * 0.0055) * (Math.random() < 0.16 ? 0.55 : 1);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(vol, when + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.72);

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.musicGain);
      if (this.reverbSend) {
        const send = ac.createGain();
        send.gain.value = 0.18;
        g.connect(send);
        send.connect(this.reverbSend);
      }
      osc.start(when);
      osc.stop(when + 0.8);
    },

    kick(when) {
      const ac = this.ctx;
      if (!ac) return;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(105, when);
      osc.frequency.exponentialRampToValueAtTime(42, when + 0.16);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(0.07, when + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.28);
      osc.connect(g);
      g.connect(this.musicGain);
      osc.start(when);
      osc.stop(when + 0.32);
    },

    hat(when) {
      const ac = this.ctx;
      if (!ac || !this.noiseBuf) return;
      const src = ac.createBufferSource();
      src.buffer = this.noiseBuf;
      const filter = ac.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7400;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(0.007, when + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.055);
      src.connect(filter);
      filter.connect(g);
      g.connect(this.musicGain);
      src.start(when);
      src.stop(when + 0.07);
    },
  };

  /* ============================================================
     SETUP / BACKDROP
     ============================================================ */

  const SAVE_KEY = 'prism7.progress.v1';

  function readProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return {
        best: Math.max(0, Math.floor(Number(raw.best) || 0)),
        night: Math.max(0, Math.floor(Number(raw.night) || 0)),
        cleared: !!raw.cleared,
      };
    } catch (_) {
      return { best: 0, night: 0, cleared: false };
    }
  }

  function writeProgress(next) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    } catch (_) {
      /* private mode / file protocol edge cases */
    }
  }

  function loadBest() {
    return readProgress().best;
  }

  function saveBest(value) {
    const next = readProgress();
    next.best = Math.max(0, Math.floor(value));
    writeProgress(next);
  }

  function recordNight(night) {
    if (!night) return;
    const next = readProgress();
    const safe = Math.min(STORY_TOTAL, Math.max(0, Math.floor(night)));
    if (safe > next.night) {
      next.night = safe;
      writeProgress(next);
    }
  }

  function markCleared() {
    const next = readProgress();
    next.cleared = true;
    next.night = STORY_TOTAL;
    writeProgress(next);
  }

  function makeGlowSprite(rgb) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(0.14, `rgba(${rgb},0.78)`);
    grad.addColorStop(0.38, `rgba(${rgb},0.26)`);
    grad.addColorStop(0.7, `rgba(${rgb},0.06)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return c;
  }

  function buildGlow() {
    Object.keys(COLORS).forEach((key) => {
      GLOW[key] = makeGlowSprite(COLORS[key]);
    });
  }

  function drawGlow(key, x, y, radius, alpha) {
    const sprite = GLOW[key] || GLOW.cyan;
    if (!sprite || radius <= 0 || alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha * ctx.globalAlpha, 0, 1);
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function buildBackdrop() {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.floor(W));
    c.height = Math.max(1, Math.floor(H));
    const g = c.getContext('2d');

    const base = g.createLinearGradient(0, 0, W * 0.3, H);
    base.addColorStop(0, '#03050c');
    base.addColorStop(0.48, '#040912');
    base.addColorStop(1, '#020308');
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);

    g.globalCompositeOperation = 'screen';

    const b1 = g.createRadialGradient(W * 0.5, H * 0.48, 0, W * 0.5, H * 0.48, Math.max(W, H) * 0.7);
    b1.addColorStop(0, 'rgba(17, 76, 103, 0.25)');
    b1.addColorStop(0.38, 'rgba(9, 35, 58, 0.14)');
    b1.addColorStop(1, 'rgba(2, 4, 10, 0)');
    g.fillStyle = b1;
    g.fillRect(0, 0, W, H);

    const b2 = g.createRadialGradient(W * 0.79, H * 0.2, 0, W * 0.79, H * 0.2, Math.max(W, H) * 0.42);
    b2.addColorStop(0, 'rgba(102, 51, 140, 0.11)');
    b2.addColorStop(1, 'rgba(10, 5, 20, 0)');
    g.fillStyle = b2;
    g.fillRect(0, 0, W, H);

    const b3 = g.createRadialGradient(W * 0.15, H * 0.8, 0, W * 0.15, H * 0.8, Math.max(W, H) * 0.38);
    b3.addColorStop(0, 'rgba(24, 100, 105, 0.08)');
    b3.addColorStop(1, 'rgba(2, 8, 14, 0)');
    g.fillStyle = b3;
    g.fillRect(0, 0, W, H);

    g.globalCompositeOperation = 'source-over';

    const noise = document.createElement('canvas');
    noise.width = 128;
    noise.height = 128;
    const ng = noise.getContext('2d');
    const data = ng.createImageData(128, 128);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = Math.random() * 255;
      data.data[i] = v;
      data.data[i + 1] = v;
      data.data[i + 2] = v;
      data.data[i + 3] = Math.random() * 18;
    }
    ng.putImageData(data, 0, 0);
    g.globalAlpha = 0.62;
    g.fillStyle = g.createPattern(noise, 'repeat');
    g.fillRect(0, 0, W, H);
    g.globalAlpha = 1;

    bgCanvas = c;
  }

  function makeStars() {
    stars = [];
    motes = [];
    const n = Math.round(clamp((W * H) / 7600, 90, 280));
    for (let i = 0; i < n; i++) {
      stars.push({
        x: rand(0, W),
        y: rand(0, H),
        z: rand(0.25, 1),
        r: rand(0.35, 1.5),
        phase: rand(0, TAU),
        speed: rand(0.45, 1.8),
        warm: Math.random() < 0.09,
      });
    }
    const m = Math.round(clamp((W * H) / 46000, 14, 44));
    for (let i = 0; i < m; i++) {
      motes.push({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-5, 5),
        vy: rand(-8, -1),
        r: rand(0.4, 1.4),
        phase: rand(0, TAU),
        speed: rand(0.1, 0.4),
      });
    }
  }

  function makeMenuOrbs() {
    menuOrbs = [];
    const count = 17;
    for (let i = 0; i < count; i++) {
      menuOrbs.push({
        angle: rand(0, TAU),
        radius: rand(165, 390) * S,
        speed: rand(0.025, 0.12) * (Math.random() < 0.5 ? -1 : 1),
        size: rand(0.8, 2.6) * S,
        color: ['cyan', 'magenta', 'violet', 'white'][randInt(0, 3)],
        alpha: rand(0.18, 0.65),
        phase: rand(0, TAU),
      });
    }
  }

  function resize() {
    W = Math.max(320, window.innerWidth);
    H = Math.max(320, window.innerHeight);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    S = clamp(Math.min(W, H) / 640, 0.72, 1.55);
    CX = W / 2;
    CY = H / 2;
    core.r = 15 * S;
    shield.radius = 104 * S;
    shield.half = state === 'playing' && run && run.novaTime > 0 ? Math.PI : 0.52;

    if (!run || state === 'menu') {
      core.x = CX;
      core.y = CY;
    } else {
      const maxR = coreMoveRadius();
      const dx = core.x - CX;
      const dy = core.y - CY;
      const d = Math.hypot(dx, dy);
      if (d > maxR) {
        core.x = CX + (dx / d) * maxR;
        core.y = CY + (dy / d) * maxR;
      }
    }

    if (!input.pointerSeen) {
      input.mx = CX;
      input.my = CY - 180 * S;
    }

    buildBackdrop();
    makeStars();
    makeMenuOrbs();
  }

  function coreMoveRadius() {
    return Math.min(W, H) * 0.145;
  }

  function primaryTouch() {
    return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  }

  /* ============================================================
     RUN STATE
     ============================================================ */

  function resetWorld() {
    enemies = [];
    bullets = [];
    particles = [];
    beams = [];
    shards = [];
    pulses = [];
    floaters = [];
    shake = 0;
    whiteFlash = 0;
    redFlash = 0;
    healFlash = 0;
  }

  function startRun(mode = 'story') {
    audio.init();
    audio.resume();
    audio.start();

    resetWorld();
    core.x = CX;
    core.y = CY;
    core.vx = 0;
    core.vy = 0;
    shield.angle = -Math.PI / 2;
    shield.target = -Math.PI / 2;
    shield.half = 0.52;

    run = {
      mode: mode === 'endless' ? 'endless' : 'story',
      hp: 5,
      maxHp: 5,
      score: 0,
      wave: 0,
      combo: 0,
      comboTimer: 0,
      maxCombo: 0,
      energy: 0,
      invuln: 0,
      pulseCd: 0,
      novaTime: 0,
      novaTick: 0,
      playTime: 0,
      wavePhase: 'active',
      waveClearTimer: 0,
      spawnQueue: [],
      boss: null,
      deflects: 0,
      kills: 0,
      deathTimer: 0,
      energyHint: false,
      deflectHint: false,
      repairHint: false,
      killsSinceRepair: 0,
      startedAt: performance.now(),
    };

    state = 'playing';
    document.body.classList.add('is-playing');
    hideModals();
    dom.menu.hidden = true;
    dom.pause.hidden = true;
    dom.gameover.hidden = true;
    dom.ending.hidden = true;
    dom.hud.hidden = false;
    dom.bossBar.hidden = true;
    dom.newRecord.hidden = true;
    dom.announce.classList.remove('show');
    dom.hint.classList.remove('show');
    if (announceTimeout) clearTimeout(announceTimeout);
    if (hintTimeout) clearTimeout(hintTimeout);

    hudCache.score = -1;
    hudCache.wave = -1;
    hudCache.hp = -1;
    hudCache.mult = -1;
    hudCache.ready = null;
    hudCache.boss = null;
    hudCache.best = -1;

    renderPips();
    updateHUD();

    if (!input.pointerSeen) {
      input.mx = CX;
      input.my = CY - 180 * S;
    }
    input.keys.clear();
    resetTouchMove();
    resetTouchAim();
    input.aimMode = primaryTouch() ? 'touch' : 'pointer';
    input.keyboardAngle = -Math.PI / 2;
    input.touchAimAngle = -Math.PI / 2;

    if (dom.nightTotal) dom.nightTotal.textContent = run.mode === 'story' ? '/07' : '∞';
    setLegendVisible(true, 12000);
    beginWave(1);
    if (dom.novaHint) dom.novaHint.textContent = primaryTouch() ? '点按 ✦' : '右键 / E';
    setHint(primaryTouch() ? '左摇杆移动 · 右摇杆控制盾向 · 右侧按钮放技能' : '鼠标/←→ 旋转 · WASD 移动 · 左键/Space 脉冲 · 右键/E 新星', 5200);
  }

  function beginWave(n) {
    if (!run) return;
    run.wave = n;
    run.wavePhase = 'active';
    run.waveClearTimer = 0;
    run.spawnQueue = [];

    const bossWave = run.mode === 'story' ? (n === 5 || n >= STORY_TOTAL) : n % 5 === 0;
    const at = run.playTime + (n === 1 ? 1.35 : 1.05);
    let cursor = at;
    const queue = [];

    if (bossWave) {
      queue.push({ at: at + 1.25, type: 'warden' });
      const minions = 1 + Math.floor(n / 5);
      const pool = wavePool(n);
      for (let i = 0; i < minions; i++) {
        queue.push({
          at: at + 2.5 + i * 1.15,
          type: i === 0 ? 'wisp' : pool[randInt(0, pool.length - 1)],
        });
      }
    } else {
      const count = Math.min(2 + n * 2, 16);
      const pool = wavePool(n);
      const interval = Math.max(0.46, 1.24 - n * 0.042);
      for (let i = 0; i < count; i++) {
        let type = pool[randInt(0, pool.length - 1)];
        if (n === 1) type = 'wisp';
        if (n === 2 && i === 0) type = 'prism';
        if (n === 3 && i === 0) type = 'splitter';
        if (n === 4 && i === 0) type = 'lancer';
        if (n >= 6 && i === 0) type = 'ember';
        queue.push({ at: cursor, type });
        cursor += interval * rand(0.82, 1.14);
      }
    }

    queue.sort((a, b) => a.at - b.at);
    run.spawnQueue = queue;

    announceNight(n, bossWave);

    audio.waveStart(bossWave);
  }

  function wavePool(n) {
    const pool = ['wisp', 'wisp', 'wisp', 'prism'];
    if (n >= 3) pool.push('splitter');
    if (n >= 4) pool.push('lancer');
    if (n >= 6) pool.push('ember');
    if (n >= 7) pool.push('prism');
    return pool;
  }

  function completeWave() {
    if (!run || run.wavePhase !== 'active') return;
    run.wavePhase = 'clear';
    run.waveClearTimer = 2.65;

    const bonus = 300 + run.wave * 150;
    run.score += bonus;
    const gained = Math.min(100, run.energy + 16);
    run.energy = gained;

    for (const b of bullets) {
      if (!b.friendly && !b.dead) {
        b.dead = true;
        burst(b.x, b.y, 'amber', 3, 90, 0.32, 1.2);
      }
    }
    beams.length = 0;

    const healed = healCore(1);
    const finalNight = run.mode === 'story' && run.wave >= STORY_TOTAL;
    recordNight(run.wave);
    showAnnounce(
      finalNight ? '第七夜 · 守住了' : run.mode === 'story' ? `第 ${pad2(run.wave)} 夜 · 过去了` : 'NIGHT CLEAR',
      `+${bonus}  ·  ${healed > 0 ? `星核 +${healed}` : '能量 +12'}`,
      finalNight ? 'DAWN // 灯还亮着' : 'SYSTEM // SYNCHRONIZED',
      finalNight ? 2400 : 1650
    );
    audio.waveClear();
    updateHUD();
  }

  function healCore(amount) {
    if (!run || state !== 'playing') return 0;
    const healed = Math.min(amount, run.maxHp - run.hp);

    if (healed > 0) {
      run.hp += healed;
      renderPips();
      dom.hpPips.classList.remove('healing');
      void dom.hpPips.offsetWidth;
      dom.hpPips.classList.add('healing');
      setTimeout(() => dom.hpPips.classList.remove('healing'), 700);

      healFlash = Math.max(healFlash, 0.62);
      burst(core.x, core.y, 'repair', 22, 300, 0.7, 2.1);
      pulses.push({
        x: core.x,
        y: core.y,
        t: 0,
        dur: 0.55,
        max: 150 * S,
        color: 'repair',
        width: 3.4,
      });
      floaters.push({
        x: core.x,
        y: core.y - 62 * S,
        text: `+${healed} 星核`,
        life: 1.05,
        maxLife: 1.05,
        color: 'repair',
      });
    }

    const overflow = amount - healed;
    if (overflow > 0) {
      run.energy = Math.min(100, run.energy + overflow * 12);
    }

    if (healed > 0 || overflow > 0) updateHUD();
    return healed;
  }

  function startDying() {
    if (!run || state !== 'playing') return;
    state = 'dying';
    run.deathTimer = 1.45;
    run.combo = 0;
    addShake(34);
    whiteFlash = 0.82;
    redFlash = 1;
    burst(core.x, core.y, 'white', 55, 520, 1.1, 3.4);
    burst(core.x, core.y, 'cyan', 44, 360, 0.9, 2.2);
    burst(core.x, core.y, 'magenta', 38, 440, 0.85, 2.6);
    for (const b of bullets) {
      if (!b.friendly) b.dead = true;
    }
    if (run.boss) dom.bossBar.hidden = true;
    document.body.classList.remove('is-playing');
    resetTouchMove();
    resetTouchAim();
    dom.novaReady.classList.remove('on');
    setLegendVisible(false);
    audio.gameover();
  }

  function showGameOver() {
    if (!run) return;
    state = 'dead';
    const isNew = run.score > best;
    if (isNew) {
      best = Math.floor(run.score);
      saveBest(best);
    }

    dom.finalScore.textContent = pad6(run.score);
    dom.finalWave.textContent = pad2(run.wave);
    dom.finalDeflects.textContent = String(run.deflects);
    dom.finalCombo.textContent = String(run.maxCombo);
    dom.finalBest.textContent = pad6(best);
    recordNight(run.wave);
    syncMenuProgress();
    setLegendVisible(false);
    if (dom.gameoverDesc) {
      dom.gameoverDesc.textContent = run.mode === 'story'
        ? `第 ${pad2(run.wave)} 夜，阿镜碎了。灯芯把她的碎片收进灯里，等在下一夜。`
        : '余辉仍在回响。下一次，让更多子弹找到归途。';
    }
    dom.newRecord.hidden = !isNew;
    dom.gameover.hidden = false;
    dom.hud.hidden = true;
    dom.bossBar.hidden = true;
    dom.novaReady.classList.remove('on');
    dom.announce.classList.remove('show');
    dom.hint.classList.remove('show');
    if (announceTimeout) clearTimeout(announceTimeout);
    if (hintTimeout) clearTimeout(hintTimeout);
    if (dom.menuBest) dom.menuBest.textContent = pad6(best);
    updateHUD();
  }

  function backToMenu() {
    state = 'menu';
    run = null;
    resetWorld();
    hideModals();
    setLegendVisible(false);
    document.body.classList.remove('is-playing');
    dom.menu.hidden = false;
    dom.ending.hidden = true;
    dom.hud.hidden = true;
    dom.pause.hidden = true;
    dom.gameover.hidden = true;
    dom.bossBar.hidden = true;
    dom.novaReady.classList.remove('on');
    dom.announce.classList.remove('show');
    dom.hint.classList.remove('show');
    if (announceTimeout) clearTimeout(announceTimeout);
    if (hintTimeout) clearTimeout(hintTimeout);
    core.x = CX;
    core.y = CY;
    core.vx = 0;
    core.vy = 0;
    shield.angle = -Math.PI / 2;
    shield.target = -Math.PI / 2;
    shield.half = 0.52;
    input.keys.clear();
    resetTouchMove();
    resetTouchAim();
    input.aimMode = 'pointer';
    input.keyboardAngle = -Math.PI / 2;
    input.touchAimAngle = -Math.PI / 2;
    input.pointerSeen = false;
    input.mx = CX;
    input.my = CY - 180 * S;
    menuT = 0;
    makeMenuOrbs();
    if (dom.menuBest) dom.menuBest.textContent = pad6(best);
    syncMenuProgress();
  }

  function togglePause(force) {
    if (state !== 'playing' && state !== 'paused') return;
    const shouldPause = force == null ? state === 'playing' : force;
    if (shouldPause && state === 'playing') {
      state = 'paused';
      dom.pause.hidden = false;
      document.body.classList.remove('is-playing');
      input.keys.clear();
      resetTouchMove();
      resetTouchAim();
      dom.novaReady.classList.remove('on');
    } else if (!shouldPause && state === 'paused') {
      state = 'playing';
      dom.pause.hidden = true;
      document.body.classList.add('is-playing');
      lastTs = performance.now();
    }
  }

  /* ============================================================
     PLAYER / INPUT
     ============================================================ */

  function updateCore(dt) {
    if (!run) return;
    let ix = 0;
    let iy = 0;
    if (input.keys.has('a')) ix -= 1;
    if (input.keys.has('d')) ix += 1;
    if (input.keys.has('w')) iy -= 1;
    if (input.keys.has('s')) iy += 1;
    ix += touchMove.x;
    iy += touchMove.y;

    if (ix || iy) {
      const len = Math.hypot(ix, iy);
      if (len > 1) {
        ix /= len;
        iy /= len;
      }
      const accel = 1460 * S;
      core.vx += ix * accel * dt;
      core.vy += iy * accel * dt;
    }

    const drag = Math.exp(-7.5 * dt);
    core.vx *= drag;
    core.vy *= drag;

    const maxSpeed = 255 * S;
    const sp = Math.hypot(core.vx, core.vy);
    if (sp > maxSpeed) {
      core.vx = (core.vx / sp) * maxSpeed;
      core.vy = (core.vy / sp) * maxSpeed;
    }

    core.x += core.vx * dt;
    core.y += core.vy * dt;

    const maxR = coreMoveRadius();
    const dx = core.x - CX;
    const dy = core.y - CY;
    const d = Math.hypot(dx, dy);
    if (d > maxR) {
      const nx = dx / d;
      const ny = dy / d;
      core.x = CX + nx * maxR;
      core.y = CY + ny * maxR;
      const dot = core.vx * nx + core.vy * ny;
      if (dot > 0) {
        core.vx -= nx * dot * 1.25;
        core.vy -= ny * dot * 1.25;
      }
    }
  }

  function updateShield(dt) {
    if (!run) return;
    if (input.aimMode === 'keyboard') {
      const left = input.keys.has('arrowleft') || input.keys.has('j');
      const right = input.keys.has('arrowright') || input.keys.has('l');
      if (left || right) {
        const direction = (right ? 1 : 0) - (left ? 1 : 0);
        input.keyboardAngle = normalAngle(input.keyboardAngle + direction * 3.8 * dt);
      }
      shield.target = input.keyboardAngle;
    } else if (input.aimMode === 'touch') {
      shield.target = input.touchAimAngle;
    } else {
      const dx = input.mx - core.x;
      const dy = input.my - core.y;
      if (Math.hypot(dx, dy) > 16 * S) {
        shield.target = Math.atan2(dy, dx);
        input.keyboardAngle = shield.target;
      }
    }
    const follow = 1 - Math.exp(-17 * dt);
    shield.angle += angleDiff(shield.target, shield.angle) * follow;
    shield.angle = normalAngle(shield.angle);
    shield.half = run.novaTime > 0 ? Math.PI : 0.52;
  }

  function doPulse() {
    if (!run || state !== 'playing' || run.pulseCd > 0 || run.novaTime > 0) return;
    run.pulseCd = 1.55;
    const maxR = 278 * S;
    const cx = core.x;
    const cy = core.y;

    pulses.push({
      x: cx,
      y: cy,
      t: 0,
      dur: 0.42,
      max: maxR,
      color: 'cyan',
      width: 4.2,
    });
    pulses.push({
      x: cx,
      y: cy,
      t: 0.03,
      dur: 0.55,
      max: maxR * 0.78,
      color: 'white',
      width: 1.6,
    });

    let converted = 0;
    for (const b of bullets) {
      if (b.dead || b.friendly) continue;
      if (dist(b.x, b.y, cx, cy) <= maxR) {
        reflectBullet(b, b.x, b.y, true);
        converted++;
      }
    }

    for (const e of enemies) {
      if (e.dead) continue;
      const d = dist(e.x, e.y, cx, cy);
      if (d <= 155 * S) {
        damageEnemy(e, 1, e.x, e.y, 'pulse');
        const a = Math.atan2(e.y - cy, e.x - cx);
        if (e.type !== 'warden') {
          e.vx += Math.cos(a) * 160 * S;
          e.vy += Math.sin(a) * 160 * S;
        }
      }
    }

    burst(cx, cy, 'cyan', 22, 360, 0.6, 2.2);
    addShake(7);
    audio.pulse();
    if (converted > 0) {
      run.energy = Math.min(100, run.energy + Math.min(4, converted * 0.6));
    }
  }

  function doNova() {
    if (!run || state !== 'playing' || run.energy < 100 || run.novaTime > 0) return;
    run.energy = 0;
    run.novaTime = 2.65;
    run.novaTick = 0.72;
    run.energyHint = true;
    whiteFlash = 1;
    addShake(20);
    audio.nova();
    novaWave(true);
    setHint('棱镜新星 · 时间正在逆流', 2000);
    updateHUD();
  }

  function novaWave(initial) {
    if (!run) return;
    const maxR = (initial ? 385 : 350) * S;
    pulses.push({
      x: core.x,
      y: core.y,
      t: 0,
      dur: initial ? 0.78 : 0.52,
      max: maxR,
      color: initial ? 'white' : 'magenta',
      width: initial ? 7 : 3,
    });
    pulses.push({
      x: core.x,
      y: core.y,
      t: 0.04,
      dur: initial ? 0.9 : 0.6,
      max: maxR * 0.9,
      color: 'cyan',
      width: 2,
    });

    for (const b of bullets) {
      if (b.dead || b.friendly) continue;
      if (dist(b.x, b.y, core.x, core.y) <= maxR) {
        reflectBullet(b, b.x, b.y, true);
      }
    }

    for (const e of enemies) {
      if (e.dead) continue;
      if (dist(e.x, e.y, core.x, core.y) <= maxR * 0.88) {
        damageEnemy(e, 1, e.x, e.y, 'nova');
      }
    }

    burst(core.x, core.y, initial ? 'white' : 'cyan', initial ? 42 : 18, initial ? 520 : 300, 0.8, 2.8);
    addShake(initial ? 18 : 5);
  }

  function addShake(v) {
    shake = Math.min(34, shake + v);
  }

  /* ============================================================
     WAVES / SPAWNING
     ============================================================ */

  function updateWave(dt) {
    if (!run) return;
    if (run.wavePhase === 'active') {
      while (run.spawnQueue.length && run.spawnQueue[0].at <= run.playTime) {
        const item = run.spawnQueue.shift();
        spawnEnemy(item.type);
      }

      if (run.spawnQueue.length === 0 && !enemies.some((e) => !e.dead)) {
        completeWave();
      }
    } else if (run.wavePhase === 'clear') {
      run.waveClearTimer -= dt;
      if (run.waveClearTimer <= 0) {
        if (run.mode === 'story' && run.wave >= STORY_TOTAL) {
          showEnding();
        } else {
          beginWave(run.wave + 1);
        }
      }
    }
  }

  function spawnEnemy(type) {
    if (!run) return;
    if (type === 'warden') {
      spawnBoss();
      if (run.boss && run.mode === 'story' && run.wave >= STORY_TOTAL) {
        run.boss.maxHp = Math.round(run.boss.maxHp * 1.7);
        run.boss.hp = run.boss.maxHp;
        run.boss.name = '终夜守卫';
      }
      return;
    }

    const pad = 74 * S;
    const side = randInt(0, 3);
    let x;
    let y;
    if (side === 0) {
      x = rand(0, W);
      y = -pad;
    } else if (side === 1) {
      x = W + pad;
      y = rand(0, H);
    } else if (side === 2) {
      x = rand(0, W);
      y = H + pad;
    } else {
      x = -pad;
      y = rand(0, H);
    }

    enemies.push(makeEnemy(type, x, y));
  }

  function makeEnemy(type, x, y) {
    const m = META[type];
    const wave = run ? run.wave : 1;
    const hpBonus = type === 'ember' ? 0 : Math.floor(Math.max(0, wave - 1) / 6);
    const hp = m.hp + hpBonus;
    const speedScale = 1 + Math.min(0.3, Math.max(0, wave - 1) * 0.018);

    return {
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      r: m.r * S,
      hp,
      maxHp: hp,
      speed: m.speed * S * speedScale,
      preferred: (m.pref + rand(-18, 18)) * S,
      orbitAngle: Math.atan2(y - CY, x - CX),
      orbitSpeed: m.orbit * rand(0.72, 1.28),
      t: rand(0, 10),
      renderAngle: 0,
      fireCd: rand(0.8, 1.9),
      burstCd: rand(2.8, 4.4),
      chargeT: 0,
      chargeMax: 0,
      shieldCd: 0,
      flash: 0,
      spawn: 0,
      seed: rand(0, TAU),
      dead: false,
      entering: false,
      isBoss: false,
      score: m.score,
      color: m.color,
    };
  }

  function spawnBoss() {
    const e = makeEnemy('warden', CX, -130 * S);
    e.isBoss = true;
    e.hp = 15 + run.wave * 3;
    e.maxHp = e.hp;
    e.r = 50 * S;
    const vertical = H < 560 ? H * 0.12 : H * 0.2;
    e.targetY = CY - Math.min(vertical, 235 * S);
    e.entering = true;
    e.fireCd = 2.5;
    e.burstCd = 4.2;
    e.spin = 0;
    run.boss = e;
    enemies.push(e);
    dom.bossBar.hidden = false;
    dom.bossFill.style.transform = 'scaleX(1)';
    dom.bossHpText.textContent = '100%';
    showAnnounce('WARDEN // 守卫者', '它来取回星核', 'THREAT DETECTED', 2200);
    addShake(16);
    audio.boss();
  }

  /* ============================================================
     ENEMY UPDATE
     ============================================================ */

  function updateEnemies(dt) {
    for (const e of enemies) {
      if (e.dead) continue;
      e.t += dt;
      e.spawn = Math.min(1, e.spawn + dt * 3.2);
      e.flash = Math.max(0, e.flash - dt * 5.5);
      e.shieldCd = Math.max(0, e.shieldCd - dt);

      if (e.isBoss) {
        updateBoss(e, dt);
      } else {
        updateRegularEnemy(e, dt);
      }

      if (e.dead) continue;
      checkEnemyCollisions(e);
    }
  }

  function steerEnemy(e, tx, ty, dt) {
    const dx = tx - e.x;
    const dy = ty - e.y;
    const d = Math.hypot(dx, dy);
    if (d < 1) return;
    const desiredSpeed = Math.min(e.speed, d * 2.4);
    const desiredX = (dx / d) * desiredSpeed;
    const desiredY = (dy / d) * desiredSpeed;
    const k = 1 - Math.exp(-3.0 * dt);
    e.vx += (desiredX - e.vx) * k;
    e.vy += (desiredY - e.vy) * k;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.renderAngle = Math.atan2(e.vy, e.vx);
  }

  function updateRegularEnemy(e, dt) {
    if (e.type === 'ember') {
      steerEnemy(e, core.x, core.y, dt);
      e.renderAngle = Math.atan2(core.y - e.y, core.x - e.x);
    } else {
      e.orbitAngle += e.orbitSpeed * dt;
      const wobble = Math.sin(e.t * 0.8 + e.seed) * 26 * S;
      const radius = Math.max(70 * S, e.preferred + wobble);
      const tx = CX + Math.cos(e.orbitAngle) * radius;
      const ty = CY + Math.sin(e.orbitAngle) * radius;
      steerEnemy(e, tx, ty, dt);
      e.renderAngle = Math.atan2(core.y - e.y, core.x - e.x);
    }

    if (e.spawn < 0.85 || state !== 'playing') return;

    if (e.type === 'lancer') {
      if (e.chargeT > 0) {
        e.chargeT -= dt;
        if (e.chargeT <= 0) {
          fireBeam(e);
          e.fireCd = rand(4.4, 5.5);
        }
      } else {
        e.fireCd -= dt;
        if (e.fireCd <= 0) {
          e.chargeT = 1.05;
          e.chargeMax = 1.05;
          e.chargeAim = Math.atan2(core.y - e.y, core.x - e.x);
        }
      }
      return;
    }

    if (e.type === 'ember') return;

    e.fireCd -= dt;
    if (e.fireCd <= 0) {
      if (e.type === 'wisp') {
        fireAimed(e, 1, 0, 194);
        e.fireCd = rand(1.75, 2.7);
      } else if (e.type === 'prism') {
        fireAimed(e, 3, 0.17, 178);
        e.fireCd = rand(2.6, 3.4);
      } else if (e.type === 'splitter') {
        fireAimed(e, 1, 0, 136, { split: 0.62, r: 6.2 * S });
        e.fireCd = rand(2.9, 3.7);
      }
    }
  }

  function updateBoss(e, dt) {
    if (e.spawn < 1) return;

    if (e.entering) {
      e.y = lerp(e.y, e.targetY, 1 - Math.exp(-2.2 * dt));
      if (Math.abs(e.y - e.targetY) < 3 * S) {
        e.entering = false;
      }
      e.renderAngle = Math.sin(e.t * 0.4) * 0.25;
      return;
    }

    const targetY = e.targetY + Math.sin(e.t * 0.9) * 14 * S;
    const targetX = CX + Math.sin(e.t * 0.48) * Math.min(W * 0.23, 310 * S);
    e.x = lerp(e.x, targetX, 1 - Math.exp(-1.7 * dt));
    e.y = lerp(e.y, targetY, 1 - Math.exp(-1.7 * dt));
    e.spin += dt * 0.6;
    e.renderAngle = Math.sin(e.t * 0.35) * 0.18;

    if (state !== 'playing') return;
    const rage = e.hp / e.maxHp < 0.5;

    e.fireCd -= dt;
    if (e.fireCd <= 0) {
      fireAimed(e, rage ? 9 : 7, 0.52, 172);
      e.fireCd = rage ? 1.4 : 2.05;
    }

    e.burstCd -= dt;
    if (e.burstCd <= 0) {
      const count = rage ? 22 : 16;
      const base = e.t * 0.6;
      for (let i = 0; i < count; i++) {
        fireEnemyBullet(e, base + (i / count) * TAU, 128, { r: 4.6 * S });
      }
      addShake(5);
      e.burstCd = rage ? 3.1 : 4.3;
    }

    if (rage && Math.random() < dt * 0.35) {
      spawnEnemy('wisp');
    }
  }

  function checkEnemyCollisions(e) {
    if (!run || e.dead) return;

    const dx = e.x - core.x;
    const dy = e.y - core.y;
    const d = Math.hypot(dx, dy) || 0.0001;
    const nx = dx / d;
    const ny = dy / d;

    if (d < e.r + core.r + 3 * S) {
      if (e.type === 'ember') {
        damagePlayer();
        killEnemy(e, false);
        return;
      }
      damagePlayer();
      e.x += nx * 38 * S;
      e.y += ny * 38 * S;
      e.vx += nx * 110 * S;
      e.vy += ny * 110 * S;
      return;
    }

    if (e.entering || e.spawn < 0.5) return;
    if (e.shieldCd > 0) return;

    const angle = Math.atan2(dy, dx);
    const withinArc = Math.abs(angleDiff(angle, shield.angle)) <= (run.novaTime > 0 ? Math.PI : shield.half) + 0.08;
    if (withinArc && Math.abs(d - shield.radius) < e.r + 16 * S) {
      damageEnemy(e, 1, e.x + nx * e.r * 0.4, e.y + ny * e.r * 0.4, 'shield');
      e.shieldCd = e.isBoss ? 0.9 : 0.55;
      if (!e.isBoss) {
        e.x += nx * 20 * S;
        e.y += ny * 20 * S;
        e.vx += nx * 100 * S;
        e.vy += ny * 100 * S;
      }
      if (!e.dead) {
        run.energy = Math.min(100, run.energy + 2);
        addShake(2.2);
        burst(e.x, e.y, 'cyan', 6, 190, 0.38, 1.5);
        audio.block();
      }
    }
  }

  function fireAimed(e, count, spread, speed, opts = {}) {
    const base = Math.atan2(core.y - e.y, core.x - e.x);
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spread;
      fireEnemyBullet(e, base + offset, speed, opts);
    }
  }

  function fireEnemyBullet(e, angle, speed, opts = {}) {
    if (!run) return;
    const scale = 1 + Math.min(0.22, Math.max(0, run.wave - 1) * 0.012);
    const r = opts.r || 4.6 * S;
    const muzzle = e.r * 0.82;
    const sp = speed * S * scale;
    bullets.push({
      x: e.x + Math.cos(angle) * muzzle,
      y: e.y + Math.sin(angle) * muzzle,
      vx: Math.cos(angle) * sp,
      vy: Math.sin(angle) * sp,
      r,
      friendly: false,
      homing: false,
      life: 9,
      maxLife: 9,
      split: opts.split || 0,
      color: e.color,
      dead: false,
      seed: rand(0, TAU),
    });
    burst(
      e.x + Math.cos(angle) * (muzzle + 4 * S),
      e.y + Math.sin(angle) * (muzzle + 4 * S),
      e.color,
      2,
      90,
      0.25,
      1.1
    );
    audio.shoot((e.x / W) * 2 - 1);
  }

  function fireBeam(e) {
    if (!run || state !== 'playing') return;
    const angle = Math.atan2(core.y - e.y, core.x - e.x);
    const fromCore = Math.atan2(e.y - core.y, e.x - core.x);
    const blocked = Math.abs(angleDiff(fromCore, shield.angle)) <= (run.novaTime > 0 ? Math.PI : shield.half) + 0.04;
    const beamLen = Math.hypot(W, H) * 1.5;
    const sx = e.x;
    const sy = e.y;
    let ex = e.x + Math.cos(angle) * beamLen;
    let ey = e.y + Math.sin(angle) * beamLen;
    let impactX = ex;
    let impactY = ey;

    if (blocked) {
      const towardEnemy = Math.atan2(e.y - core.y, e.x - core.x);
      impactX = core.x + Math.cos(towardEnemy) * shield.radius;
      impactY = core.y + Math.sin(towardEnemy) * shield.radius;
      ex = impactX;
      ey = impactY;
      run.energy = Math.min(100, run.energy + 16);
      run.score += Math.round(70 * comboMult());
      burst(impactX, impactY, 'cyan', 25, 390, 0.55, 2.4);
      addShake(9);
      audio.block();
    } else {
      damagePlayer();
      addShake(11);
    }

    beams.push({
      x1: sx,
      y1: sy,
      x2: ex,
      y2: ey,
      impactX,
      impactY,
      blocked,
      life: 0.42,
      maxLife: 0.42,
      width: 5 * S,
    });
  }

  function nearestEnemy(x, y) {
    let bestE = null;
    let bestD = Infinity;
    for (const e of enemies) {
      if (e.dead || e.spawn < 0.18) continue;
      const d = dist(x, y, e.x, e.y);
      if (d < bestD) {
        bestD = d;
        bestE = e;
      }
    }
    return bestE;
  }

  function damageEnemy(e, amount, x, y, source) {
    if (!e || e.dead) return;
    e.hp -= amount;
    e.flash = 1;
    burst(x, y, e.color, 5, 150, 0.4, 1.5);
    addShake(1.2);
    audio.enemyHit((x / W) * 2 - 1);

    if (e.hp <= 0) {
      killEnemy(e, source === 'shield');
    } else if (e.isBoss) {
      updateBossBar();
    }
  }

  function killEnemy(e, viaShield) {
    if (!e || e.dead) return;
    e.dead = true;
    if (!run) return;

    run.kills++;
    run.combo++;
    run.comboTimer = 2.75;
    run.maxCombo = Math.max(run.maxCombo, run.combo);

    const pts = Math.round(e.score * comboMult());
    run.score += pts;
    run.energy = Math.min(100, run.energy + (e.isBoss ? 32 : 5));

    floaters.push({
      x: e.x,
      y: e.y - e.r,
      text: `+${pts}`,
      life: 0.85,
      maxLife: 0.85,
      color: e.isBoss ? 'amber' : 'cyan',
    });

    burst(e.x, e.y, e.color, e.isBoss ? 70 : 26, e.isBoss ? 540 : 300, e.isBoss ? 1.25 : 0.7, e.isBoss ? 3.4 : 2.0);
    burst(e.x, e.y, 'white', e.isBoss ? 30 : 9, e.isBoss ? 420 : 210, 0.55, 1.5);
    pulses.push({
      x: e.x,
      y: e.y,
      t: 0,
      dur: e.isBoss ? 0.9 : 0.42,
      max: (e.isBoss ? 430 : 110) * S,
      color: e.isBoss ? 'white' : e.color,
      width: e.isBoss ? 6 : 1.4,
    });
    addShake(e.isBoss ? 26 : 4.5);
    audio.kill((e.x / W) * 2 - 1);
    run.killsSinceRepair = (run.killsSinceRepair || 0) + 1;

    if (e.isBoss) {
      const healed = healCore(2);
      run.killsSinceRepair = 0;
      run.boss = null;
      dom.bossBar.hidden = true;
      whiteFlash = Math.max(whiteFlash, 0.42);
      for (let i = 0; i < 4; i++) {
        spawnShard(e.x + rand(-40, 40) * S, e.y + rand(-28, 28) * S, 'energy');
      }
      for (const b of bullets) {
        if (!b.friendly && !b.dead) {
          b.dead = true;
          burst(b.x, b.y, 'amber', 5, 120, 0.4, 1.2);
        }
      }
      showAnnounce(
        'WARDEN DOWN',
        healed > 0 ? `星核 +${healed} · 守卫者已沉默` : '能量 +24 · 守卫者已沉默',
        'THREAT NEUTRALIZED',
        1900
      );
    } else {
      let repairDropped = false;
      const pity = run.hp <= 1 ? 9 : 16;
      const repairChance = run.hp <= 1 ? 0.14 : 0.07;
      if (run.killsSinceRepair >= pity || Math.random() < repairChance) {
        spawnShard(e.x, e.y, 'repair');
        run.killsSinceRepair = 0;
        repairDropped = true;
      }
      if (!repairDropped && Math.random() < (viaShield ? 0.24 : 0.17)) {
        spawnShard(e.x, e.y, 'energy');
      }
    }

    if (!run.deflectHint && run.deflects >= 3) {
      run.deflectHint = true;
      setHint('漂亮的归还 · 被弹开的子弹会自动追猎敌人', 2800);
    }
  }

  function spawnShard(x, y, kind = 'energy') {
    const a = rand(0, TAU);
    const repair = kind === 'repair';
    shards.push({
      x,
      y,
      vx: Math.cos(a) * rand(24, 90) * S,
      vy: Math.sin(a) * rand(24, 90) * S,
      r: (repair ? 5.4 : 4.2) * S,
      life: repair ? 16 : 11,
      angle: rand(0, TAU),
      phase: rand(0, TAU),
      kind,
    });
    if (repair && run && !run.repairHint) {
      run.repairHint = true;
      setHint('绿色修复碎片 · 受伤时恢复 1 点，满血时转化为能量', 3600);
    }
  }

  /* ============================================================
     BULLETS
     ============================================================ */

  function updateBullets(dt) {
    for (const b of bullets) {
      if (b.dead) continue;
      b.life -= dt;
      if (b.life <= 0) {
        b.dead = true;
        continue;
      }

      if (b.split > 0) {
        b.split -= dt;
        if (b.split <= 0) {
          splitBullet(b);
          b.dead = true;
          continue;
        }
      }

      if (b.friendly && b.homing) {
        const target = nearestEnemy(b.x, b.y);
        if (target) {
          const desired = Math.atan2(target.y - b.y, target.x - b.x);
          const current = Math.atan2(b.vy, b.vx);
          const speed = Math.hypot(b.vx, b.vy);
          const diff = angleDiff(desired, current);
          const turn = 4.2 * dt;
          const next = current + clamp(diff, -turn, turn);
          b.vx = Math.cos(next) * speed;
          b.vy = Math.sin(next) * speed;
        }
      }

      const speed = Math.hypot(b.vx, b.vy);
      const steps = Math.max(1, Math.min(7, Math.ceil((speed * dt) / (8 * S))));
      const stepX = (b.vx * dt) / steps;
      const stepY = (b.vy * dt) / steps;
      b.px = b.x;
      b.py = b.y;

      for (let s = 0; s < steps; s++) {
        b.x += stepX;
        b.y += stepY;

        if (!b.friendly) {
          if (hitsShield(b)) {
            reflectBullet(b, b.x, b.y, false);
            break;
          }
          if (dist(b.x, b.y, core.x, core.y) < core.r + b.r * 0.82) {
            b.dead = true;
            burst(b.x, b.y, 'red', 12, 240, 0.5, 1.8);
            damagePlayer();
            break;
          }
        } else {
          const hit = bulletHitsEnemy(b);
          if (hit) {
            damageEnemy(hit, 1, b.x, b.y, 'bullet');
            burst(b.x, b.y, 'cyan', 5, 150, 0.38, 1.3);
            b.dead = true;
            break;
          }
        }
      }

      if (b.dead) continue;

      const margin = 190 * S;
      if (b.x < -margin || b.x > W + margin || b.y < -margin || b.y > H + margin) {
        b.dead = true;
      }
    }

    bullets = bullets.filter((b) => !b.dead);
  }

  function hitsShield(b) {
    if (!run) return false;
    const dx = b.x - core.x;
    const dy = b.y - core.y;
    const d = Math.hypot(dx, dy);
    const half = run.novaTime > 0 ? Math.PI : shield.half;
    if (d < shield.radius - 18 * S || d > shield.radius + 18 * S) return false;
    if (Math.abs(angleDiff(Math.atan2(dy, dx), shield.angle)) > half + 0.06) return false;
    const incoming = b.vx * dx + b.vy * dy < 0;
    return incoming || run.novaTime > 0;
  }

  function reflectBullet(b, px, py, aimAtEnemy) {
    if (!run || b.friendly) return;
    const dx = px - core.x;
    const dy = py - core.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = dx / d;
    const ny = dy / d;
    let speed = Math.hypot(b.vx, b.vy);
    speed = clamp(speed * 1.32 + 28 * S, 225 * S, 920 * S);

    if (aimAtEnemy) {
      const target = nearestEnemy(px, py);
      if (target) {
        const a = Math.atan2(target.y - py, target.x - px);
        b.vx = Math.cos(a) * speed;
        b.vy = Math.sin(a) * speed;
      } else {
        b.vx = nx * speed;
        b.vy = ny * speed;
      }
    } else {
      const dot = b.vx * nx + b.vy * ny;
      b.vx -= 2 * dot * nx;
      b.vy -= 2 * dot * ny;
      if (b.vx * nx + b.vy * ny < 26 * S) {
        b.vx += nx * speed * 0.75;
        b.vy += ny * speed * 0.75;
      }
      const outSpeed = Math.hypot(b.vx, b.vy) || speed;
      b.vx = (b.vx / outSpeed) * speed;
      b.vy = (b.vy / outSpeed) * speed;
    }

    b.friendly = true;
    b.homing = true;
    b.life = 4.4;
    b.r = Math.max(b.r, 4.8 * S);
    b.split = 0;
    b.x = core.x + nx * (shield.radius + 15 * S);
    b.y = core.y + ny * (shield.radius + 15 * S);
    b.color = 'cyan';

    run.combo++;
    run.comboTimer = 2.75;
    run.maxCombo = Math.max(run.maxCombo, run.combo);
    run.deflects++;
    run.energy = Math.min(100, run.energy + 3.6);
    const pts = Math.round(9 * comboMult());
    run.score += pts;

    burst(px, py, 'cyan', 7, 210, 0.42, 1.6);
    burst(px, py, 'white', 2, 120, 0.3, 1.1);
    addShake(2.2);
    audio.deflect(run.combo, (px / W) * 2 - 1);

    if (!run.deflectHint && run.deflects >= 3) {
      run.deflectHint = true;
      setHint('漂亮的归还 · 被弹开的子弹会自动追猎敌人', 2800);
    }
  }

  function splitBullet(b) {
    const base = Math.atan2(b.vy, b.vx);
    const speed = Math.hypot(b.vx, b.vy) * 0.92;
    for (let i = -1; i <= 1; i++) {
      const a = base + i * 0.34;
      bullets.push({
        x: b.x,
        y: b.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: 3.2 * S,
        friendly: false,
        homing: false,
        life: 7,
        maxLife: 7,
        split: 0,
        color: 'violet',
        dead: false,
        seed: rand(0, TAU),
      });
    }
    burst(b.x, b.y, 'violet', 8, 150, 0.4, 1.5);
    audio.tone(230, 0.12, { type: 'triangle', slide: 380, vol: 0.018, reverb: 0.1 });
  }

  function bulletHitsEnemy(b) {
    for (const e of enemies) {
      if (e.dead || e.spawn < 0.35) continue;
      if (dist(b.x, b.y, e.x, e.y) < e.r + b.r) return e;
    }
    return null;
  }

  /* ============================================================
     HAZARDS / PICKUPS
     ============================================================ */

  function updateShards(dt) {
    for (const s of shards) {
      s.life -= dt;
      s.angle += dt * (s.kind === 'repair' ? 3.4 : 2.4);
      const dx = core.x - s.x;
      const dy = core.y - s.y;
      const d = Math.hypot(dx, dy);
      const magnet = (s.kind === 'repair' ? 440 : 235) * S;
      if (d < magnet) {
        const pull = 1 - Math.exp(-4.2 * dt);
        s.vx += (dx / (d || 1)) * 520 * S * pull;
        s.vy += (dy / (d || 1)) * 520 * S * pull;
      }
      const drag = Math.exp(-1.7 * dt);
      s.vx *= drag;
      s.vy *= drag;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (d < core.r + 12 * S) {
        s.life = 0;
        if (run) {
          if (s.kind === 'repair') {
            const healed = healCore(1);
            if (healed === 0) run.energy = Math.min(100, run.energy + 8);
            run.score += 50;
            burst(s.x, s.y, 'repair', 16, 240, 0.55, 1.8);
            audio.heal();
          } else {
            run.energy = Math.min(100, run.energy + 13);
            run.score += 35;
            burst(s.x, s.y, 'amber', 9, 180, 0.45, 1.5);
            audio.chime();
          }
        }
      }
      if (s.life <= 0) {
        burst(s.x, s.y, s.kind === 'repair' ? 'repair' : 'amber', 4, 80, 0.25, 1.0);
      }
    }
    shards = shards.filter((s) => s.life > 0);
  }

  function updateBeams(dt) {
    for (const b of beams) {
      b.life -= dt;
    }
    beams = beams.filter((b) => b.life > 0);
  }

  function damagePlayer() {
    if (!run || state !== 'playing' || run.invuln > 0 || debugInvincible) return;
    run.hp--;
    run.invuln = 1.75;
    run.combo = 0;
    run.comboTimer = 0;
    addShake(23);
    redFlash = 1;
    whiteFlash = Math.max(whiteFlash, 0.28);

    burst(core.x, core.y, 'red', 34, 420, 0.8, 2.6);
    burst(core.x, core.y, 'white', 14, 260, 0.5, 1.8);
    pulses.push({
      x: core.x,
      y: core.y,
      t: 0,
      dur: 0.55,
      max: 205 * S,
      color: 'red',
      width: 4,
    });

    for (const b of bullets) {
      if (!b.friendly && !b.dead && dist(b.x, b.y, core.x, core.y) < 190 * S) {
        b.dead = true;
        burst(b.x, b.y, 'amber', 3, 90, 0.3, 1.3);
      }
    }
    for (const e of enemies) {
      if (!e.dead && !e.isBoss) {
        const a = Math.atan2(e.y - core.y, e.x - core.x);
        e.vx += Math.cos(a) * 85 * S;
        e.vy += Math.sin(a) * 85 * S;
      }
    }

    audio.hurt();
    renderPips();
    updateHUD();

    if (run.hp <= 0) {
      startDying();
    } else {
      setHint('星核受损 · 用脉冲清空近身弹幕', 2600);
    }
  }

  /* ============================================================
     PARTICLES / TEXT
     ============================================================ */

  function burst(x, y, color, count, speed, life, size) {
    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) break;
      const a = rand(0, TAU);
      const sp = rand(0.16, 1) * speed * S;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.45, 1) * life,
        maxLife: life,
        size: rand(0.6, 1.5) * size * S,
        color,
        drag: rand(2.5, 6.5),
        kind: Math.random() < 0.3 ? 'line' : 'dot',
      });
    }
  }

  function updateParticles(dt) {
    for (const p of particles) {
      p.life -= dt;
      if (p.life <= 0) continue;
      const drag = Math.exp(-p.drag * dt);
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    particles = particles.filter((p) => p.life > 0);
  }

  function updatePulses(dt) {
    for (const p of pulses) {
      p.t += dt;
    }
    pulses = pulses.filter((p) => p.t < p.dur);
  }

  function updateFloaters(dt) {
    for (const f of floaters) {
      f.life -= dt;
      f.y -= 26 * dt;
    }
    floaters = floaters.filter((f) => f.life > 0);
  }

  function tickEffects(dt) {
    shake *= Math.exp(-5.3 * dt);
    if (shake < 0.05) shake = 0;
    whiteFlash *= Math.exp(-6.5 * dt);
    if (whiteFlash < 0.003) whiteFlash = 0;
    redFlash *= Math.exp(-3.4 * dt);
    if (redFlash < 0.003) redFlash = 0;
    healFlash *= Math.exp(-3.8 * dt);
    if (healFlash < 0.003) healFlash = 0;
  }

  /* ============================================================
     UPDATE
     ============================================================ */

  function update(dt) {
    if (freezeScene) return;
    gameTime += dt;
    tickEffects(dt);

    if (state === 'menu') {
      menuT += dt;
      updateMenu(dt);
      updateParticles(dt);
      updatePulses(dt);
      return;
    }

    if (state === 'paused') return;

    if (state === 'dead') {
      updateParticles(dt * 0.6);
      updatePulses(dt * 0.7);
      updateFloaters(dt);
      return;
    }

    if (state === 'dying') {
      if (run) run.deathTimer -= dt;
      updateParticles(dt * 0.55);
      updatePulses(dt * 0.8);
      updateFloaters(dt);
      updateBeams(dt * 0.4);
      if (run && run.deathTimer <= 0) showGameOver();
      return;
    }

    if (!run || state !== 'playing') return;

    if (run.novaTime > 0) {
      run.novaTime -= dt;
      run.novaTick -= dt;
      if (run.novaTime <= 0) {
        run.novaTime = 0;
        whiteFlash = Math.max(whiteFlash, 0.16);
      } else if (run.novaTick <= 0) {
        run.novaTick = 0.82;
        novaWave(false);
      }
    }

    const slow = run.novaTime > 0 ? 0.28 : 1;
    const gdt = dt * slow;
    run.playTime += gdt;

    updateCore(gdt);
    updateShield(gdt);
    updateWave(gdt);
    updateEnemies(gdt);
    updateBullets(gdt);
    updateShards(gdt);
    updateBeams(gdt);
    updatePulses(gdt);
    updateParticles(gdt);
    updateFloaters(gdt);

    if (run.invuln > 0) run.invuln -= gdt;
    if (run.pulseCd > 0) run.pulseCd -= gdt;

    if (run.combo > 0) {
      run.comboTimer -= gdt;
      if (run.comboTimer <= 0) {
        run.combo = 0;
        run.comboTimer = 0;
      }
    }

    // Remove dead enemies only after collisions/bullets have had their say.
    enemies = enemies.filter((e) => !e.dead);

    if (run && run.boss && run.boss.dead) run.boss = null;

    updateHUD();
  }

  function updateMenu(dt) {
    shield.target = -Math.PI / 2 + Math.sin(menuT * 0.37) * 0.92;
    shield.angle += angleDiff(shield.target, shield.angle) * (1 - Math.exp(-2.0 * dt));
    shield.angle = normalAngle(shield.angle);
    shield.half = 0.52;

    for (const o of menuOrbs) {
      o.angle = normalAngle(o.angle + o.speed * dt);
    }

    if (Math.random() < dt * 4.5) {
      const a = rand(0, TAU);
      const r = rand(130, 390) * S;
      particles.push({
        x: CX + Math.cos(a) * r,
        y: CY + Math.sin(a) * r,
        vx: rand(-8, 8) * S,
        vy: rand(-12, 2) * S,
        life: rand(1.2, 3.2),
        maxLife: 3.2,
        size: rand(0.5, 1.6) * S,
        color: ['cyan', 'violet', 'magenta', 'amber'][randInt(0, 3)],
        drag: rand(0.2, 1.4),
        kind: 'dot',
      });
    }
  }

  /* ============================================================
     UI HELPERS
     ============================================================ */

  function comboMult() {
    if (!run) return 1;
    return 1 + Math.min(7, Math.floor(run.combo / 4) * 0.5);
  }

  function renderPips() {
    if (!run) return;
    let html = '';
    for (let i = 0; i < run.maxHp; i++) {
      const cls = i < run.hp ? 'full' : 'lost';
      html += `<i class="${cls}"></i>`;
    }
    dom.hpPips.innerHTML = html;
    dom.hpPips.setAttribute('aria-label', `星核完整度 ${run.hp} / ${run.maxHp}`);
  }

  function updateBossBar() {
    if (!run || !run.boss || run.boss.dead) {
      dom.bossBar.hidden = true;
      return;
    }
    const pct = clamp(run.boss.hp / run.boss.maxHp, 0, 1);
    dom.bossBar.hidden = false;
    dom.bossFill.style.transform = `scaleX(${pct.toFixed(3)})`;
    dom.bossHpText.textContent = `${Math.ceil(pct * 100)}%`;
  }

  function updateHUD() {
    if (!run) return;

    if (hudCache.wave !== run.wave) {
      hudCache.wave = run.wave;
      dom.waveNum.textContent = pad2(run.wave);
    }
    if (hudCache.score !== run.score) {
      hudCache.score = run.score;
      dom.scoreNum.textContent = pad6(run.score);
    }
    if (hudCache.hp !== run.hp) {
      hudCache.hp = run.hp;
      renderPips();
    }
    if (hudCache.best !== best) {
      hudCache.best = best;
      dom.bestNum.textContent = pad6(best);
      if (dom.menuBest) dom.menuBest.textContent = pad6(best);
    }

    const m = comboMult();
    if (hudCache.mult !== m) {
      hudCache.mult = m;
      dom.comboNum.textContent = `×${m.toFixed(1)}`;
    }
    dom.comboWrap.classList.toggle('hot', run.combo > 0);
    const comboFill = clamp(run.comboTimer / 2.75, 0, 1);
    dom.comboBar.style.transform = `scaleX(${comboFill.toFixed(3)})`;

    const ready = run.energy >= 100 && run.novaTime <= 0 && state === 'playing';
    if (hudCache.ready !== ready) {
      hudCache.ready = ready;
      dom.novaReady.classList.toggle('on', ready);
      if (dom.touchNova) dom.touchNova.classList.toggle('ready', ready);
    }

    const boss = run.boss && !run.boss.dead ? run.boss : null;
    if (boss) {
      updateBossBar();
      hudCache.boss = boss;
    } else if (hudCache.boss) {
      hudCache.boss = null;
      dom.bossBar.hidden = true;
    }

    if (run.energy >= 100 && !run.energyHint && run.novaTime <= 0 && state === 'playing') {
      run.energyHint = true;
      setHint('棱镜新星就绪 · 右键 / E 让时间逆流', 3400);
    }
  }

  function showAnnounce(title, sub, kicker, duration = 1800) {
    dom.announceKicker.textContent = kicker || 'SYSTEM // WAVE';
    dom.announceTitle.textContent = title;
    dom.announceSub.textContent = sub || '';
    dom.announce.classList.remove('show');
    void dom.announce.offsetWidth;
    dom.announce.classList.add('show');
    announceTimer = performance.now();
    if (announceTimeout) clearTimeout(announceTimeout);
    announceTimeout = setTimeout(() => {
      dom.announce.classList.remove('show');
    }, duration);
  }

  function setHint(text, duration = 2600) {
    dom.hint.textContent = text;
    dom.hint.classList.remove('show');
    void dom.hint.offsetWidth;
    dom.hint.classList.add('show');
    hintTimer = performance.now();
    if (hintTimeout) clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      dom.hint.classList.remove('show');
    }, duration);
  }

  function toggleSound() {
    audio.init();
    const muted = audio.toggleMute();
    dom.soundBtn.classList.toggle('muted', muted);
    dom.soundBtn.setAttribute('aria-pressed', String(!muted));
    dom.soundBtn.textContent = muted ? 'MUTE' : 'SND';
  }

  function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        const request = document.documentElement.requestFullscreen?.();
        if (request && request.catch) request.catch(() => {});
      } else {
        const exit = document.exitFullscreen?.();
        if (exit && exit.catch) exit.catch(() => {});
      }
    } catch (_) {
      /* not critical */
    }
  }

  /* ============================================================
     RENDERING — WORLD
     ============================================================ */

  function render() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawBackdrop();

    if (state === 'menu') {
      drawMenuScene();
    } else {
      drawGameScene();
    }

    drawScreenEffects();
  }

  function drawBackdrop() {
    if (bgCanvas) {
      ctx.drawImage(bgCanvas, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, W, H);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const px = (core.x - CX) * 0.018;
    const py = (core.y - CY) * 0.018;
    for (const s of stars) {
      const tw = 0.42 + 0.58 * (0.5 + 0.5 * Math.sin(gameTime * s.speed + s.phase));
      const x = s.x + px * s.z;
      const y = s.y + py * s.z;
      ctx.globalAlpha = 0.16 + tw * 0.55 * s.z;
      ctx.fillStyle = s.warm ? 'rgba(255,216,180,0.85)' : 'rgba(176,238,255,0.9)';
      ctx.beginPath();
      ctx.arc(x, y, s.r * s.z, 0, TAU);
      ctx.fill();
    }

    for (const m of motes) {
      ctx.globalAlpha = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(gameTime * m.speed + m.phase));
      drawGlow('cyan', m.x, m.y, 7 * m.r * S, 0.22);
    }
    ctx.restore();

    drawArena();
  }

  function drawArena() {
    const t = gameTime;
    const minSide = Math.min(W, H);
    const baseR = minSide * 0.42;

    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = 'lighter';

    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, minSide * 0.56);
    coreGlow.addColorStop(0, 'rgba(40, 142, 178, 0.11)');
    coreGlow.addColorStop(0.38, 'rgba(22, 74, 108, 0.055)');
    coreGlow.addColorStop(1, 'rgba(4, 10, 18, 0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, minSide * 0.56, 0, TAU);
    ctx.fill();

    // faint concentric orbital rings
    for (let i = 0; i < 4; i++) {
      const r = baseR * (0.42 + i * 0.24);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.setLineDash(i === 0 ? [] : [2 * S, 15 * S]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = i === 0 ? 'rgba(98,226,244,0.12)' : 'rgba(84,180,205,0.09)';
      ctx.stroke();
    }

    // radial grid
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU + t * 0.005;
      const inner = minSide * 0.19;
      const outer = baseR * 1.08;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
      ctx.strokeStyle = i % 6 === 0 ? 'rgba(98,226,244,0.09)' : 'rgba(70,145,170,0.05)';
      ctx.stroke();
    }

    // compass ticks
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * TAU - t * 0.012;
      const long = i % 12 === 0;
      const len = (long ? 13 : 5) * S;
      const r0 = baseR * 1.07;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * (r0 + len), Math.sin(a) * (r0 + len));
      ctx.strokeStyle = long ? 'rgba(109,247,255,0.32)' : 'rgba(109,247,255,0.12)';
      ctx.lineWidth = long ? 1.4 : 0.8;
      ctx.stroke();
    }

    // slow rotating dashed halo
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.92, t * 0.03, t * 0.03 + Math.PI * 1.4);
    ctx.setLineDash([3 * S, 20 * S]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(141,123,255,0.15)';
    ctx.stroke();
    ctx.setLineDash([]);

    // movement limits, almost invisible
    ctx.beginPath();
    ctx.arc(0, 0, coreMoveRadius(), 0, TAU);
    ctx.lineWidth = 1;
    ctx.setLineDash([1 * S, 9 * S]);
    ctx.strokeStyle = 'rgba(109,247,255,0.12)';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  function drawMenuScene() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const o of menuOrbs) {
      const x = CX + Math.cos(o.angle) * o.radius;
      const y = CY + Math.sin(o.angle) * o.radius;
      const trail = 0.12 + 0.05 * Math.sin(gameTime + o.phase);
      ctx.beginPath();
      ctx.arc(CX, CY, o.radius, o.angle - trail, o.angle);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${COLORS[o.color]},0.14)`;
      ctx.stroke();
      drawGlow(o.color, x, y, 12 * o.size + 4, o.alpha * 0.45);
      ctx.fillStyle = `rgba(${COLORS[o.color]},${o.alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, o.size, 0, TAU);
      ctx.fill();
    }

    drawPulses();
    drawShield();
    drawCore();
    drawParticles();
    ctx.restore();
  }

  function drawGameScene() {
    const sx = shake ? rand(-shake, shake) : 0;
    const sy = shake ? rand(-shake, shake) : 0;

    ctx.save();
    ctx.translate(sx, sy);

    drawShards();
    drawBeams();
    drawEnemies();
    drawBullets();
    drawPulses();
    drawShield();
    drawCore();
    drawParticles();
    drawFloaters();

    ctx.restore();

    if (state === 'playing') drawReticle();
  }

  /* ============================================================
     RENDERING — PLAYER
     ============================================================ */

  /* 阿镜 —— 竖立的棱镜身躯、两点青色眼睛、两条不听话的光带。
     所有坐标都相对于 (0,0)，由调用方 translate 到星核位置。 */
  function drawAjing(t, r, energy, ready) {
    const by = r * 1.72;
    const bx = r * 0.98;
    const speed = Math.hypot(core.vx || 0, core.vy || 0);
    const charge = clamp(speed / 260, 0, 1);

    // ---- 两条光带（前辈留下的）----
    // 静止时像两条围巾垂在肩后；移动时被风扯向反方向。
    const leanX = clamp(-(core.vx || 0) * 0.055, -r * 1.6, r * 1.6);
    const leanY = clamp(-(core.vy || 0) * 0.055, -r * 1.6, r * 1.6);

    const ribbons = [
      { side: -1, spread: 1.0, hue: '109,247,255', alpha: 0.52, phase: 0 },
      { side: 1, spread: 0.86, hue: '255,155,232', alpha: 0.44, phase: 1.9 },
    ];

    for (const rb of ribbons) {
      const sway = Math.sin(t * 1.7 + rb.phase);
      const sx = rb.side * bx * 0.68;
      const sy = -by * 0.02;
      const tipX = rb.side * bx * (4.0 + 0.32 * sway) * rb.spread + leanX * 1.5;
      const tipY = by * (1.42 + 0.14 * Math.sin(t * 2.2 + rb.phase)) + leanY * 1.5;
      const c1x = rb.side * bx * (1.9 + 0.16 * sway) + leanX * 0.55;
      const c1y = -by * 0.5 + leanY * 0.45;
      const c2x = rb.side * bx * (3.4 + 0.36 * sway) + leanX * 1.15;
      const c2y = by * (0.66 + 0.14 * sway) + leanY * 1.05;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, tipX, tipY);
      ctx.strokeStyle = `rgba(${rb.hue},${rb.alpha * (0.72 + 0.28 * Math.sin(t * 2.6 + rb.phase))})`;
      ctx.lineWidth = Math.max(2, r * 0.19 + charge * r * 0.06);
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, tipX, tipY);
      ctx.strokeStyle = `rgba(240,255,255,${rb.alpha * 0.5})`;
      ctx.lineWidth = Math.max(0.5, r * 0.045);
      ctx.stroke();

      // 光带尖端的一点火花
      const spark = 1 + 0.35 * Math.sin(t * 5 + rb.phase);
      drawGlow(rb.side < 0 ? 'cyan' : 'magenta', tipX, tipY, r * 0.5 * spark, 0.3);
      ctx.beginPath();
      ctx.arc(tipX, tipY, Math.max(0.8, r * 0.07) * spark, 0, TAU);
      ctx.fillStyle = `rgba(255,255,255,${0.7 * rb.alpha})`;
      ctx.fill();
    }

    // ---- 棱镜身躯 ----
    ctx.beginPath();
    ctx.moveTo(0, -by);
    ctx.lineTo(bx, -by * 0.16);
    ctx.lineTo(bx * 0.84, by * 0.64);
    ctx.lineTo(0, by);
    ctx.lineTo(-bx * 0.84, by * 0.64);
    ctx.lineTo(-bx, -by * 0.16);
    ctx.closePath();

    const body = ctx.createLinearGradient(0, -by, 0, by);
    body.addColorStop(0, 'rgba(232,255,255,0.96)');
    body.addColorStop(0.22, 'rgba(150,245,255,0.9)');
    body.addColorStop(0.52, 'rgba(70,208,232,0.78)');
    body.addColorStop(0.8, 'rgba(22,96,124,0.66)');
    body.addColorStop(1, 'rgba(8,32,46,0.62)');
    ctx.fillStyle = body;
    ctx.fill();
    ctx.strokeStyle = `rgba(225,255,255,${0.72 + (ready ? 0.2 : 0)})`;
    ctx.lineWidth = Math.max(1, r * 0.075);
    ctx.stroke();

    // 内部棱线
    ctx.beginPath();
    ctx.moveTo(0, -by);
    ctx.lineTo(0, by);
    ctx.moveTo(-bx, -by * 0.16);
    ctx.lineTo(0, by * 0.34);
    ctx.lineTo(bx, -by * 0.16);
    ctx.strokeStyle = 'rgba(214,255,255,0.24)';
    ctx.lineWidth = Math.max(0.5, r * 0.03);
    ctx.stroke();

    // ---- 胸口的光核与九点星火 ----
    const coreY = by * 0.34;
    drawGlow('magenta', 0, coreY, r * 1.1, 0.34);
    ctx.beginPath();
    ctx.arc(0, coreY, Math.max(1.2, r * 0.17), 0, TAU);
    ctx.fillStyle = 'rgba(255,246,253,0.95)';
    ctx.fill();

    const sparkR = r * 0.5;
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i / 9) * TAU;
      const rr = sparkR * (0.72 + 0.28 * Math.sin(t * 1.7 + i));
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rr, coreY + Math.sin(a) * rr * 0.86, Math.max(0.4, r * 0.035), 0, TAU);
      ctx.fillStyle = `rgba(255,217,247,${0.35 + 0.3 * Math.abs(Math.sin(t * 1.3 + i))})`;
      ctx.fill();
    }

    // ---- 两点眼睛 ----
    const eyeY = -by * 0.3;
    const eyeDX = r * 0.34;
    const blink = Math.sin(t * 0.9) > 0.985 ? 0.15 : 1;
    for (const side of [-1, 1]) {
      drawGlow('cyan', side * eyeDX, eyeY, r * 0.8, 0.42);
      ctx.beginPath();
      ctx.ellipse(
        side * eyeDX,
        eyeY,
        Math.max(1.5, r * 0.15),
        Math.max(2.4, r * 0.33) * blink,
        0,
        0,
        TAU
      );
      ctx.fillStyle = 'rgba(248,255,255,0.99)';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(side * eyeDX, eyeY, Math.max(0.5, r * 0.05), Math.max(0.9, r * 0.13) * blink, 0, 0, TAU);
      ctx.fillStyle = 'rgba(8,40,56,0.78)';
      ctx.fill();
    }

    // 顶部高光
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -by * 0.9);
    ctx.lineTo(-r * 0.06, -by * 0.34);
    ctx.lineTo(-r * 0.24, -by * 0.04);
    ctx.lineTo(-r * 0.46, -by * 0.6);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${0.1 + 0.04 * Math.sin(t * 2)})`;
    ctx.fill();
  }
  function drawCore() {
    if (!run && state !== 'menu') return;

    let alpha = 1;
    if (state === 'dying' && run) {
      alpha = clamp(run.deathTimer / 1.45, 0, 1);
    } else if (state === 'dead') {
      alpha = 0.18;
    } else if (run && run.invuln > 0) {
      alpha = 0.48 + 0.52 * (Math.sin(gameTime * 34) > 0 ? 1 : 0.2);
    }

    const t = gameTime;
    const r = core.r;
    const energy = run ? run.energy : 48;
    const ready = run && run.energy >= 100;

    ctx.save();
    ctx.translate(core.x, core.y);
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'lighter';

    drawGlow('cyan', 0, 0, 122 * S, 0.26 + (ready ? 0.07 : 0));
    drawGlow('violet', 0, 0, 78 * S, 0.16);

    // pulse halo
    ctx.beginPath();
    ctx.arc(0, 0, r + 16 * S + Math.sin(t * 2.3) * 2.5 * S, 0, TAU);
    ctx.strokeStyle = `rgba(109,247,255,${0.12 + 0.04 * Math.sin(t * 2)})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // rotating prism triangles（围着她转的碎面）
    ctx.save();
    ctx.rotate(t * 0.26);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const rot = (i / 3) * TAU;
      for (let k = 0; k < 3; k++) {
        const a = rot + (k / 3) * TAU;
        const rr = r * 1.5;
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(160,250,255,${0.2 - i * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 阿镜：竖立的棱镜身躯 + 两点眼睛 + 两条光带
    drawAjing(t, r, energy, ready);

    // core ring
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.55, t * 0.7, t * 0.7 + Math.PI * 1.2);
    ctx.strokeStyle = 'rgba(109,247,255,0.55)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';

    // energy ring
    if (run) drawEnergyRing(energy, ready, t);
    else drawMenuEnergyRing(t);

    // health shards / decorative shards
    const hp = run ? run.hp : 5;
    const maxHp = run ? run.maxHp : 5;
    for (let i = 0; i < maxHp; i++) {
      const a = -Math.PI / 2 + (i / maxHp) * TAU + t * 0.12;
      const rr = 58 * S;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -3.2 * S);
      ctx.lineTo(2.4 * S, 0);
      ctx.lineTo(0, 3.2 * S);
      ctx.lineTo(-2.4 * S, 0);
      ctx.closePath();
      if (i < hp) {
        ctx.fillStyle = run ? 'rgba(109,247,255,0.8)' : 'rgba(109,247,255,0.35)';
        ctx.fill();
        drawGlow('cyan', 0, 0, 12 * S, 0.18);
      } else {
        ctx.strokeStyle = 'rgba(255,86,106,0.32)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (run && run.invuln > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 28 * S, 0, TAU);
      ctx.strokeStyle = `rgba(255,86,106,${0.18 + 0.16 * Math.sin(gameTime * 18)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawEnergyRing(energy, ready, t) {
    const r = 39 * S;
    const segments = 30;
    const progress = clamp(energy / 100, 0, 1);
    const filled = Math.round(progress * segments);

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * TAU;
      const r0 = r;
      const r1 = r + (i % 5 === 0 ? 8 : 5) * S;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineWidth = i % 5 === 0 ? 1.7 : 1.1;
      if (i < filled) {
        const hot = ready ? 0.75 + 0.25 * Math.sin(t * 8 + i) : 0.55;
        ctx.strokeStyle = `rgba(109,247,255,${hot})`;
      } else {
        ctx.strokeStyle = 'rgba(109,247,255,0.12)';
      }
      ctx.stroke();
    }
    if (ready) {
      ctx.beginPath();
      ctx.arc(0, 0, r + 5 * S, 0, TAU);
      ctx.strokeStyle = `rgba(255,88,216,${0.18 + 0.12 * Math.sin(t * 6)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMenuEnergyRing(t) {
    const r = 39 * S;
    const segments = 30;
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * TAU;
      const on = i < 13 + Math.sin(t * 0.9) * 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(
        Math.cos(a) * (r + (i % 5 === 0 ? 8 : 5) * S),
        Math.sin(a) * (r + (i % 5 === 0 ? 8 : 5) * S)
      );
      ctx.strokeStyle = on ? 'rgba(109,247,255,0.35)' : 'rgba(109,247,255,0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawShield() {
    if (!run && state !== 'menu') return;
    const t = gameTime;
    const nova = run && run.novaTime > 0;
    const half = nova ? Math.PI : shield.half;
    const R = shield.radius;
    let alpha = 1;
    if (state === 'dying' && run) alpha = clamp(run.deathTimer / 1.45, 0, 1);
    if (state === 'dead') alpha = 0.15;

    ctx.save();
    ctx.translate(core.x, core.y);
    ctx.rotate(shield.angle);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = alpha;

    // sector haze
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R - 2 * S, -half, half);
    ctx.closePath();
    ctx.fillStyle = 'rgba(109,247,255,0.022)';
    ctx.fill();

    // rotational ghost trail
    const drift = clamp(angleDiff(shield.target, shield.angle) * 0.2, -0.34, 0.34);
    if (Math.abs(drift) > 0.008) {
      ctx.beginPath();
      ctx.arc(0, 0, R - 1.5 * S, -half + drift, half + drift);
      ctx.lineWidth = 3.2 * S;
      ctx.strokeStyle = 'rgba(109,247,255,0.12)';
      ctx.stroke();
    }

    // wide aura
    ctx.beginPath();
    ctx.arc(0, 0, R, -half, half);
    ctx.lineWidth = 26 * S;
    ctx.strokeStyle = 'rgba(109,247,255,0.035)';
    ctx.stroke();

    // trailing ghost
    ctx.beginPath();
    ctx.arc(0, 0, R - 3 * S, -half - 0.18, half - 0.18);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(141,123,255,0.12)';
    ctx.stroke();

    const segments = Math.max(24, Math.round((half / Math.PI) * 48));
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < segments; i++) {
        const a0 = -half + (i / segments) * half * 2;
        const a1 = -half + ((i + 1.05) / segments) * half * 2;
        const hue = 184 + (i / Math.max(1, segments - 1)) * 126;
        const light = 67 + Math.sin(t * 3.2 + i * 0.4) * 5;
        const strong = 0.66 + 0.22 * Math.sin(t * 2.4 + i * 0.25);
        ctx.beginPath();
        ctx.arc(0, 0, pass === 0 ? R : R - 1.5 * S, a0, a1);
        ctx.lineWidth = pass === 0 ? 9.5 * S : 2.2 * S;
        ctx.strokeStyle = `hsla(${hue}, 100%, ${light}%, ${pass === 0 ? 0.13 : strong})`;
        ctx.stroke();
      }
    }

    // bright inner filament
    ctx.beginPath();
    ctx.arc(0, 0, R - 9 * S, -half + 0.03, half - 0.03);
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = `rgba(236,255,255,${0.44 + 0.18 * Math.sin(t * 4)})`;
    ctx.stroke();

    // end caps
    for (const side of [-1, 1]) {
      const a = side * half;
      const x = Math.cos(a) * R;
      const y = Math.sin(a) * R;
      drawGlow('cyan', x, y, 25 * S, 0.55);
      ctx.beginPath();
      ctx.arc(x, y, 3.2 * S, 0, TAU);
      ctx.fillStyle = '#e8ffff';
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(5 * S, 0);
      ctx.lineTo(0, 4 * S);
      ctx.lineTo(0, -4 * S);
      ctx.closePath();
      ctx.fillStyle = 'rgba(160,255,255,0.75)';
      ctx.fill();
      ctx.restore();
    }

    // little runes along the arc
    for (let i = 1; i < 5; i++) {
      const a = -half + (i / 5) * half * 2;
      const x = Math.cos(a) * (R + 12 * S);
      const y = Math.sin(a) * (R + 12 * S);
      ctx.beginPath();
      ctx.arc(x, y, 1.2 * S, 0, TAU);
      ctx.fillStyle = `rgba(190,250,255,${0.24 + 0.16 * Math.sin(t * 3 + i)})`;
      ctx.fill();
    }

    if (nova) {
      ctx.globalAlpha = alpha * (0.35 + 0.2 * Math.sin(t * 9));
      ctx.beginPath();
      ctx.arc(0, 0, R + 14 * S, t * 2.4, t * 2.4 + Math.PI * 1.47);
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawReticle() {
    const r = 7 * S;
    let rx = input.mx;
    let ry = input.my;
    if (input.aimMode === 'keyboard' || input.aimMode === 'touch') {
      const distance = Math.min(Math.max(W, H) * 0.27, 250 * S);
      rx = core.x + Math.cos(shield.target) * distance;
      ry = core.y + Math.sin(shield.target) * distance;
    }
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(gameTime * 0.8);
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0.2, 1.2);
    ctx.arc(0, 0, r, 1.77, 2.77);
    ctx.strokeStyle = 'rgba(109,247,255,0.38)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 1.4 * S, 0, TAU);
    ctx.fillStyle = 'rgba(220,255,255,0.5)';
    ctx.fill();
    ctx.restore();
  }

  /* ============================================================
     RENDERING — ENEMIES
     ============================================================ */

  function drawEnemies() {
    for (const e of enemies) {
      if (e.dead) continue;
      if (e.isBoss) drawBoss(e);
      else drawEnemy(e);
    }
  }

  function drawEnemy(e) {
    const spawn = clamp(e.spawn, 0, 1);
    const alpha = spawn;
    const scale = 0.35 + 0.65 * easeOutCubic(spawn);
    const color = COLORS[e.color] || COLORS.red;

    // telegraphs
    if (e.type !== 'ember' && e.type !== 'lancer' && e.fireCd < 0.38) {
      const a = clamp(1 - e.fireCd / 0.38, 0, 1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(core.x, core.y);
      ctx.setLineDash([3 * S, 8 * S]);
      ctx.strokeStyle = `rgba(${color},${0.06 + a * 0.12})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    }

    if (e.type === 'lancer' && e.chargeT > 0) {
      const a = 1 - e.chargeT / (e.chargeMax || 1.05);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(core.x, core.y);
      ctx.strokeStyle = `rgba(255,86,106,${0.08 + a * 0.3})`;
      ctx.lineWidth = 0.7 + a * 1.7;
      ctx.setLineDash([7 * S, 7 * S]);
      ctx.stroke();
      ctx.setLineDash([]);
      drawGlow('red', e.x + Math.cos(e.chargeAim) * e.r, e.y + Math.sin(e.chargeAim) * e.r, (8 + a * 17) * S, 0.3 + a * 0.5);
      ctx.restore();
    }

    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'lighter';

    drawGlow(e.color, 0, 0, e.r * 5.6, 0.32);

    ctx.save();
    if (e.type === 'wisp' || e.type === 'lancer') ctx.rotate(e.renderAngle);
    else ctx.rotate(e.t * (e.type === 'prism' ? 0.45 : 0.8) + e.seed);
    ctx.globalCompositeOperation = 'source-over';

    const r = e.r;
    ctx.beginPath();
    if (e.type === 'wisp') {
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(-r * 0.9, r * 0.82);
      ctx.lineTo(-r * 0.38, 0);
      ctx.lineTo(-r * 0.9, -r * 0.82);
      ctx.closePath();
    } else if (e.type === 'prism') {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    } else if (e.type === 'splitter') {
      ctx.moveTo(r * 1.1, 0);
      ctx.lineTo(0, r * 0.9);
      ctx.lineTo(-r * 1.1, 0);
      ctx.lineTo(0, -r * 0.9);
      ctx.closePath();
    } else if (e.type === 'lancer') {
      ctx.moveTo(r * 1.5, 0);
      ctx.lineTo(0, r * 0.62);
      ctx.lineTo(-r * 0.8, 0);
      ctx.lineTo(0, -r * 0.62);
      ctx.closePath();
    } else {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        const rr = i % 2 === 0 ? r : r * 0.52;
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    ctx.fillStyle = 'rgba(10,7,17,0.85)';
    ctx.fill();
    ctx.strokeStyle = `rgba(${color},0.9)`;
    ctx.lineWidth = 1.6 * S;
    ctx.stroke();

    // inner light
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.22, 0, TAU);
    ctx.fillStyle = `rgba(${color},0.9)`;
    ctx.fill();
    drawGlow(e.color, 0, 0, r * 1.4, 0.52);

    // plating line
    ctx.beginPath();
    if (e.type === 'prism') {
      ctx.arc(0, 0, r * 0.55, 0, TAU);
    } else if (e.type === 'splitter') {
      ctx.moveTo(-r * 0.45, 0);
      ctx.lineTo(r * 0.45, 0);
      ctx.moveTo(0, -r * 0.42);
      ctx.lineTo(0, r * 0.42);
    } else {
      ctx.moveTo(-r * 0.45, 0);
      ctx.lineTo(r * 0.55, 0);
    }
    ctx.strokeStyle = `rgba(${color},0.38)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (e.flash > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha * e.flash * 0.9;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    // health collar
    if (e.maxHp > 1) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(0, 0, e.r + 6 * S, -Math.PI / 2, -Math.PI / 2 + TAU * (e.hp / e.maxHp));
      ctx.strokeStyle = `rgba(${color},0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // spawn portal
    if (e.spawn < 1) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(0, 0, e.r * (2.2 - e.spawn * 1.2), 0, TAU);
      ctx.strokeStyle = `rgba(${color},${(1 - e.spawn) * 0.35})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawBoss(e) {
    const alpha = clamp(e.spawn, 0, 1);
    const scale = 0.55 + 0.45 * easeOutCubic(alpha);
    const color = COLORS.magenta;
    const t = e.t;

    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'lighter';

    drawGlow('magenta', 0, 0, e.r * 5.5, 0.32);
    drawGlow('violet', 0, 0, e.r * 3.2, 0.3);

    ctx.save();
    ctx.rotate(e.spin || 0);
    for (let ring = 0; ring < 3; ring++) {
      const rr = e.r * (1.1 + ring * 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, rr, t * (0.2 + ring * 0.1) * (ring % 2 ? -1 : 1), t * (0.2 + ring * 0.1) + Math.PI * (0.8 + ring * 0.2));
      ctx.strokeStyle = `rgba(${ring === 1 ? COLORS.violet : color},${0.36 - ring * 0.07})`;
      ctx.lineWidth = (2.2 - ring * 0.4) * S;
      ctx.setLineDash([3 * S, 9 * S]);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // orbiting sentinel shards
    for (let i = 0; i < 6; i++) {
      const a = t * 0.7 + (i / 6) * TAU;
      const rr = e.r * 1.72;
      ctx.save();
      ctx.translate(Math.cos(a) * rr, Math.sin(a) * rr);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -5 * S);
      ctx.lineTo(3 * S, 0);
      ctx.lineTo(0, 5 * S);
      ctx.lineTo(-3 * S, 0);
      ctx.closePath();
      ctx.fillStyle = i % 2 ? 'rgba(255,88,216,0.55)' : 'rgba(141,123,255,0.55)';
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.rotate((e.renderAngle || 0) + t * 0.15);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      const rr = i % 2 === 0 ? e.r : e.r * 0.72;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(13,6,20,0.92)';
    ctx.fill();
    ctx.strokeStyle = `rgba(${color},0.9)`;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.62, 0, TAU);
    ctx.strokeStyle = `rgba(${COLORS.violet},0.42)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // eye
    ctx.beginPath();
    ctx.ellipse(0, 0, e.r * 0.42, e.r * 0.22, 0, 0, TAU);
    ctx.fillStyle = 'rgba(255,88,216,0.9)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, e.r * 0.1, 0, TAU);
    ctx.fillStyle = '#fff';
    ctx.fill();
    drawGlow('magenta', 0, 0, e.r * 2, 0.6);
    ctx.restore();

    if (e.flash > 0) {
      ctx.globalAlpha = alpha * e.flash * 0.8;
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(0, 0, e.r, 0, TAU);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }

    ctx.restore();
  }

  /* ============================================================
     RENDERING — BULLETS / EFFECTS
     ============================================================ */

  function drawBullets() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const b of bullets) {
      if (b.dead) continue;
      const friendly = b.friendly;
      const color = friendly ? COLORS.cyan : (COLORS[b.color] || COLORS.red);
      const speed = Math.hypot(b.vx, b.vy) || 1;
      const trail = clamp(speed * 0.048, 8 * S, 40 * S);
      const ux = b.vx / speed;
      const uy = b.vy / speed;
      const x2 = b.x - ux * trail;
      const y2 = b.y - uy * trail;
      const angle = Math.atan2(b.vy, b.vx);
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);

      drawGlow(friendly ? 'cyan' : b.color, b.x, b.y, b.r * (friendly ? 7.5 : 6), friendly ? 0.58 : 0.48);

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(b.x, b.y);
      ctx.lineCap = 'round';
      ctx.lineWidth = b.r * (friendly ? 1.3 : 1.1);
      ctx.strokeStyle = friendly
        ? `rgba(${COLORS.cyan},0.5)`
        : `rgba(${color},0.42)`;
      ctx.stroke();

      // projectile shell
      ctx.beginPath();
      ctx.moveTo(b.x + ca * b.r * 2.5, b.y + sa * b.r * 2.5);
      ctx.lineTo(b.x - sa * b.r * 1.15 - ca * b.r * 1.05, b.y + ca * b.r * 1.15 - sa * b.r * 1.05);
      ctx.lineTo(b.x + sa * b.r * 1.15 - ca * b.r * 1.05, b.y - ca * b.r * 1.15 - sa * b.r * 1.05);
      ctx.closePath();
      ctx.strokeStyle = `rgba(${color},${friendly ? 0.8 : 0.62})`;
      ctx.lineWidth = 0.9 * S;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 0.66, 0, TAU);
      ctx.fillStyle = friendly ? '#eaffff' : '#fff0ea';
      ctx.fill();

      if (!friendly && b.split > 0) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.7, gameTime * 3, gameTime * 3 + Math.PI * 1.4);
        ctx.strokeStyle = `rgba(${COLORS.violet},0.55)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawShards() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const s of shards) {
      const repair = s.kind === 'repair';
      const pulse = 0.55 + 0.45 * Math.sin(gameTime * (repair ? 5.5 : 4) + s.phase);
      const color = repair ? 'repair' : 'amber';

      if (repair) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.r * 1.5);
        ctx.lineTo(s.x, s.y - s.r * 4.6);
        ctx.strokeStyle = `rgba(${COLORS.repair},${0.12 + pulse * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (2.2 + pulse * 0.35), 0, TAU);
        ctx.strokeStyle = `rgba(${COLORS.repair},${0.1 + pulse * 0.12})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      drawGlow(color, s.x, s.y, (repair ? 23 : 18) * S * pulse, repair ? 0.58 : 0.45);
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.beginPath();
      ctx.moveTo(0, -s.r * 1.2);
      ctx.lineTo(s.r * 0.8, 0);
      ctx.lineTo(0, s.r * 1.2);
      ctx.lineTo(-s.r * 0.8, 0);
      ctx.closePath();
      ctx.fillStyle = repair ? 'rgba(140,255,193,0.96)' : 'rgba(255,224,160,0.92)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (repair) {
        ctx.beginPath();
        ctx.moveTo(0, -s.r * 0.62);
        ctx.lineTo(0, s.r * 0.62);
        ctx.moveTo(-s.r * 0.5, 0);
        ctx.lineTo(s.r * 0.5, 0);
        ctx.strokeStyle = 'rgba(8,38,26,0.92)';
        ctx.lineWidth = 1.5 * S;
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawBeams() {
    if (!beams.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const b of beams) {
      const a = clamp(b.life / b.maxLife, 0, 1);
      const flicker = 0.85 + 0.15 * Math.sin(gameTime * 40);
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.lineCap = 'round';
      ctx.lineWidth = b.width * 4.8;
      ctx.strokeStyle = `rgba(255,86,106,${a * 0.06 * flicker})`;
      ctx.stroke();
      ctx.lineWidth = b.width * 1.8;
      ctx.strokeStyle = `rgba(255,120,130,${a * 0.22})`;
      ctx.stroke();
      ctx.lineWidth = Math.max(1, b.width * 0.34);
      ctx.strokeStyle = `rgba(255,240,235,${a * 0.9})`;
      ctx.stroke();

      drawGlow('red', b.impactX, b.impactY, 36 * S * a, 0.42);
      if (b.blocked) drawGlow('cyan', b.impactX, b.impactY, 26 * S * a, 0.5);
    }
    ctx.restore();
  }

  function drawPulses() {
    if (!pulses.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of pulses) {
      const progress = clamp(p.t / p.dur, 0, 1);
      const r = easeOutQuint(progress) * p.max;
      const alpha = Math.pow(1 - progress, 2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.strokeStyle = `rgba(${COLORS[p.color] || COLORS.cyan},${alpha * 0.72})`;
      ctx.lineWidth = Math.max(0.7, p.width * (1 - progress) * S);
      ctx.stroke();

      if (progress < 0.65) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, r - 8 * S), 0, TAU);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawParticles() {
    if (!particles.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      const a = clamp(p.life / p.maxLife, 0, 1);
      if (p.kind === 'line') {
        const speed = Math.hypot(p.vx, p.vy) || 1;
        const len = Math.min(18 * S, speed * 0.035);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - (p.vx / speed) * len, p.y - (p.vy / speed) * len);
        ctx.strokeStyle = `rgba(${COLORS[p.color] || COLORS.white},${a * 0.85})`;
        ctx.lineWidth = p.size * 0.8;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${COLORS[p.color] || COLORS.white},${a * 0.82})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, p.size * (0.4 + a * 0.6)), 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawFloaters() {
    if (!floaters.length) return;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${10 * S}px "Cascadia Code", Consolas, monospace`;
    for (const f of floaters) {
      const a = clamp(f.life / f.maxLife, 0, 1);
      ctx.fillStyle = `rgba(${COLORS[f.color] || COLORS.white},${a * 0.75})`;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.restore();
  }

  function drawScreenEffects() {
    if (run && run.novaTime > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(gameTime * 9);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.max(W, H) * 0.65);
      grad.addColorStop(0, `rgba(80,210,255,${0.045 + pulse * 0.025})`);
      grad.addColorStop(0.65, 'rgba(70,110,255,0.018)');
      grad.addColorStop(1, 'rgba(25,30,80,0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    if (redFlash > 0.004) {
      const g = ctx.createRadialGradient(CX, CY, Math.min(W, H) * 0.1, CX, CY, Math.max(W, H) * 0.68);
      g.addColorStop(0, 'rgba(255,30,60,0)');
      g.addColorStop(0.62, `rgba(255,30,60,${redFlash * 0.08})`);
      g.addColorStop(1, `rgba(255,30,60,${redFlash * 0.46})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    if (healFlash > 0.004) {
      const g = ctx.createRadialGradient(CX, CY, Math.min(W, H) * 0.08, CX, CY, Math.max(W, H) * 0.62);
      g.addColorStop(0, `rgba(111,255,174,${healFlash * 0.1})`);
      g.addColorStop(0.55, `rgba(60,220,150,${healFlash * 0.035})`);
      g.addColorStop(1, `rgba(30,120,90,${healFlash * 0.12})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    if (run && run.hp === 1 && state === 'playing') {
      const p = 0.5 + 0.5 * Math.sin(gameTime * 3.2);
      const g = ctx.createRadialGradient(CX, CY, Math.min(W, H) * 0.22, CX, CY, Math.max(W, H) * 0.7);
      g.addColorStop(0, 'rgba(255,30,60,0)');
      g.addColorStop(1, `rgba(255,30,60,${0.04 + p * 0.07})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    if (whiteFlash > 0.004) {
      ctx.fillStyle = `rgba(235,253,255,${whiteFlash * 0.34})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ============================================================
     EVENTS / INIT
     ============================================================ */

  function resetTouchMove() {
    touchMove.active = false;
    touchMove.id = null;
    touchMove.x = 0;
    touchMove.y = 0;
    if (dom.touchKnob) dom.touchKnob.style.transform = 'translate(0px, 0px)';
  }

  function resetTouchAim() {
    touchAim.active = false;
    touchAim.id = null;
    touchAim.x = 0;
    touchAim.y = 0;
    if (dom.touchAimKnob) dom.touchAimKnob.style.transform = 'translate(0px, 0px)';
  }

  function updateTouchMove(e) {
    if (!dom.touchStick) return;
    const rect = dom.touchStick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = rect.width * 0.32;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    touchMove.x = dx / max;
    touchMove.y = dy / max;
    if (dom.touchKnob) dom.touchKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function updateTouchAim(e) {
    if (!dom.touchAimStick) return;
    const rect = dom.touchAimStick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = rect.width * 0.32;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    touchAim.x = dx / max;
    touchAim.y = dy / max;
    if (dom.touchAimKnob) dom.touchAimKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    if (d > max * 0.18) {
      input.aimMode = 'touch';
      input.touchAimAngle = Math.atan2(dy, dx);
    }
  }

  function bindEvents() {
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 120));

    /* 标题页的「开始第七夜」由 bindStoryUI() 接管（先进序章） */
    dom.restartBtn.addEventListener('click', () => {
      if (state === 'dead') startRun(run ? run.mode : 'story');
    });
    dom.resumeBtn.addEventListener('click', () => togglePause(false));
    dom.quitBtn.addEventListener('click', backToMenu);
    dom.menuBtn.addEventListener('click', backToMenu);
    dom.pauseBtn.addEventListener('click', () => togglePause());
    dom.soundBtn.addEventListener('click', toggleSound);
    dom.fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (dom.menuFsBtn) dom.menuFsBtn.addEventListener('click', toggleFullscreen);
    dom.touchPulse.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      doPulse();
    });
    dom.touchNova.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      doNova();
    });

    if (dom.touchStick) {
      dom.touchStick.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchMove.active = true;
        touchMove.id = e.pointerId;
        try {
          dom.touchStick.setPointerCapture?.(e.pointerId);
        } catch (_) {
          /* Some WebViews do not support pointer capture. */
        }
        updateTouchMove(e);
      });
      dom.touchStick.addEventListener('pointermove', (e) => {
        if (!touchMove.active || touchMove.id !== e.pointerId) return;
        e.preventDefault();
        updateTouchMove(e);
      });
      const endStick = (e) => {
        if (touchMove.id != null && touchMove.id !== e.pointerId) return;
        resetTouchMove();
      };
      dom.touchStick.addEventListener('pointerup', endStick);
      dom.touchStick.addEventListener('pointercancel', endStick);
      dom.touchStick.addEventListener('lostpointercapture', endStick);
    }

    if (dom.touchAimStick) {
      dom.touchAimStick.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchAim.active = true;
        touchAim.id = e.pointerId;
        input.aimMode = 'touch';
        try {
          dom.touchAimStick.setPointerCapture?.(e.pointerId);
        } catch (_) {
          /* Some WebViews do not support pointer capture. */
        }
        updateTouchAim(e);
      });
      dom.touchAimStick.addEventListener('pointermove', (e) => {
        if (!touchAim.active || touchAim.id !== e.pointerId) return;
        e.preventDefault();
        updateTouchAim(e);
      });
      const endAimStick = (e) => {
        if (touchAim.id != null && touchAim.id !== e.pointerId) return;
        resetTouchAim();
      };
      dom.touchAimStick.addEventListener('pointerup', endAimStick);
      dom.touchAimStick.addEventListener('pointercancel', endAimStick);
      dom.touchAimStick.addEventListener('lostpointercapture', endAimStick);
    }

    window.addEventListener('pointermove', (e) => {
      if (touchMove.active && e.pointerId === touchMove.id) {
        updateTouchMove(e);
        return;
      }
      if (touchAim.active && e.pointerId === touchAim.id) {
        updateTouchAim(e);
        return;
      }
      if (e.target && e.target.closest && e.target.closest('.touch-stick, .touch-controls')) return;
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      input.mx = e.clientX;
      input.my = e.clientY;
      input.pointerSeen = true;
      input.aimMode = 'pointer';
    }, { passive: true });

    canvas.addEventListener('pointerdown', (e) => {
      if (state !== 'playing') return;
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      input.mx = e.clientX;
      input.my = e.clientY;
      input.pointerSeen = true;
      input.aimMode = 'pointer';
      if (e.pointerType === 'mouse') {
        if (e.button === 0) doPulse();
        else if (e.button === 2) doNova();
      }
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();

      if (document.body.classList.contains('modal-open')) return;

      if (eatKey(e)) e.preventDefault();

      if (key === 'm') {
        toggleSound();
        return;
      }
      if (key === 'f') {
        toggleFullscreen();
        return;
      }

      if (key === 'escape') {
        if (state === 'playing' || state === 'paused') {
          togglePause();
        } else if (state === 'dead' || state === 'ending') {
          backToMenu();
        }
        return;
      }
      if (key === 'p' && (state === 'playing' || state === 'paused')) {
        togglePause();
        return;
      }

      if (state === 'menu' && (key === 'enter' || key === ' ')) {
        if (readProgress().cleared) beginStory();
        else showPrologue();
        return;
      }
      if (state === 'dead' && key === 'enter') {
        startRun(run ? run.mode : 'story');
        return;
      }
      if (state === 'ending' && key === 'enter') {
        beginEndless();
        return;
      }
      if (state !== 'playing') return;

      if (key === ' ' || key === 'q') {
        doPulse();
        return;
      }
      if (key === 'e') {
        doNova();
        return;
      }

      if (['arrowleft', 'arrowright', 'j', 'l'].includes(key)) {
        if (input.aimMode !== 'keyboard') {
          input.aimMode = 'keyboard';
          input.keyboardAngle = shield.angle;
          shield.target = shield.angle;
        }
        input.keys.add(key);
        return;
      }

      if (['w', 'a', 's', 'd'].includes(key)) {
        input.keys.add(key);
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      input.keys.delete(key);
      if (key === ' ') e.preventDefault();
    });

    window.addEventListener('blur', () => {
      if (state === 'playing') togglePause(true);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state === 'playing') togglePause(true);
    });

    document.addEventListener('fullscreenchange', () => {
      const active = !!document.fullscreenElement;
      dom.fullscreenBtn.classList.toggle('active', active);
      dom.fullscreenBtn.setAttribute('aria-pressed', String(active));
      dom.fullscreenBtn.setAttribute('aria-label', active ? '退出全屏' : '切换全屏');
      if (dom.menuFsBtn) {
        dom.menuFsBtn.classList.toggle('active', active);
        dom.menuFsBtn.setAttribute('aria-pressed', String(active));
        dom.menuFsBtn.setAttribute('aria-label', active ? '退出全屏' : '切换全屏');
      }
      if (dom.menuFsLabel) dom.menuFsLabel.textContent = active ? '退出' : '全屏';
    });

    if (!document.documentElement.requestFullscreen) {
      dom.fullscreenBtn.hidden = true;
      if (dom.menuFsBtn) dom.menuFsBtn.hidden = true;
    }

    bindStoryUI();
  }

  function eatKey(e) {
    return e.key === ' ' || e.key.startsWith('Arrow') || e.key === 'Enter';
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000;
    lastTs = ts;
    dt = clamp(dt, 0, 0.05);

    update(dt);
    render();

    const intensity = state === 'playing'
      ? (run && run.boss ? 2.0 : 1.2)
      : (state === 'paused' ? 0.45 : 0.7);
    audio.updateMusic(intensity);

    requestAnimationFrame(frame);
  }

  function setupDebugScene(name) {
    if (!run) return;
    resetWorld();
    run.spawnQueue = [];
    run.wavePhase = 'active';
    run.score = 28450;
    run.wave = 6;
    run.combo = 21;
    run.comboTimer = 2.1;
    run.maxCombo = 31;
    run.energy = 82;
    run.hp = 2;
    run.deflects = 41;
    run.kills = 28;
    shield.angle = -0.63;
    shield.target = -0.63;

    dom.announce.classList.remove('show');
    dom.hint.classList.remove('show');
    if (announceTimeout) clearTimeout(announceTimeout);
    if (hintTimeout) clearTimeout(hintTimeout);

    if (name === 'dead') {
      run.score = 96320;
      run.wave = 11;
      run.deflects = 173;
      run.maxCombo = 48;
      run.kills = 79;
      run.hp = 0;
      showGameOver();
      freezeScene = true;
      return;
    }

    if (name === 'pause') {
      state = 'paused';
      dom.pause.hidden = false;
      document.body.classList.remove('is-playing');
      dom.announce.classList.remove('show');
      dom.hint.classList.remove('show');
      freezeScene = true;
      return;
    }

    const addEnemy = (type, x, y, spawnAngle) => {
      const e = makeEnemy(type, x, y);
      e.spawn = 1;
      e.fireCd = 1.3;
      if (spawnAngle != null) e.renderAngle = spawnAngle;
      enemies.push(e);
      return e;
    };

    const fire = (x, y, angle, speed, friendly, color, split) => {
      const sp = speed * S;
      bullets.push({
        x,
        y,
        vx: Math.cos(angle) * sp,
        vy: Math.sin(angle) * sp,
        r: (split ? 5.4 : 4.2) * S,
        friendly: !!friendly,
        homing: !!friendly,
        life: 6,
        maxLife: 6,
        split: split || 0,
        color: color || (friendly ? 'cyan' : 'red'),
        dead: false,
        seed: rand(0, TAU),
      });
    };

    if (name === 'heal') {
      run.hp = 2;
      run.energy = 42;
      addEnemy('wisp', CX + 330 * S, CY - 210 * S, 0.6);
      addEnemy('prism', CX - 350 * S, CY + 150 * S, -0.2);
      for (let i = 0; i < 5; i++) {
        const a = -1.1 + i * 0.2;
        fire(CX + Math.cos(a) * 300 * S, CY + Math.sin(a) * 300 * S, a + Math.PI, 130, false, 'red');
      }
      healCore(1);
    } else if (name === 'repair') {
      run.hp = 2;
      run.energy = 34;
      addEnemy('wisp', CX + 315 * S, CY - 220 * S, 0.7);
      addEnemy('prism', CX - 360 * S, CY - 130 * S, -0.3);
      addEnemy('splitter', CX + 380 * S, CY + 170 * S, 0.2);
      for (let i = 0; i < 5; i++) {
        const a = -0.9 + i * 0.22;
        fire(CX + Math.cos(a) * 320 * S, CY + Math.sin(a) * 320 * S, a + Math.PI + 0.1, 140, false, 'red');
      }
      spawnShard(CX + 170 * S, CY - 105 * S, 'repair');
      spawnShard(CX - 185 * S, CY + 80 * S, 'repair');
      spawnShard(CX + 240 * S, CY + 60 * S, 'energy');
    } else if (name === 'boss') {
      run.wave = 5;
      run.score = 19600;
      run.combo = 14;
      run.comboTimer = 1.8;
      run.energy = 100;
      spawnBoss();
      const b = run.boss;
      if (b) {
        b.spawn = 1;
        b.entering = false;
        b.y = b.targetY;
        b.x = CX;
        b.hp = Math.ceil(b.maxHp * 0.62);
      }
      addEnemy('wisp', CX - 430 * S, CY - 245 * S, 0.2);
      addEnemy('prism', CX + 455 * S, CY - 190 * S, -0.3);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + 0.1;
        fire(CX + Math.cos(a) * 300 * S, CY + Math.sin(a) * 300 * S, a + Math.PI, 148, false, 'magenta');
      }
      for (let i = 0; i < 3; i++) {
        const a = 0.9 + i * 0.28;
        fire(CX + Math.cos(a) * 420 * S, CY + Math.sin(a) * 420 * S, a + Math.PI, 300, true, 'cyan');
      }
      burst(CX - 80 * S, CY - 160 * S, 'magenta', 30, 340, 0.7, 2.2);
      dom.bossBar.hidden = false;
      updateBossBar();
    } else if (name === 'nova') {
      run.wave = 8;
      run.score = 63280;
      run.combo = 36;
      run.comboTimer = 2.5;
      run.energy = 100;
      addEnemy('wisp', CX + 330 * S, CY - 230 * S, 0.7);
      addEnemy('prism', CX - 380 * S, CY - 160 * S, -0.4);
      addEnemy('splitter', CX + 390 * S, CY + 180 * S, 0.2);
      addEnemy('lancer', CX - 330 * S, CY + 235 * S, -0.2);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        fire(CX + Math.cos(a) * 330 * S, CY + Math.sin(a) * 330 * S, a + Math.PI, 150, false, 'red');
      }
      doNova();
      freezeScene = true;
    } else {
      addEnemy('wisp', CX + 300 * S, CY - 205 * S, 0.8);
      addEnemy('wisp', CX - 345 * S, CY - 145 * S, 2.3);
      addEnemy('prism', CX + 425 * S, CY + 135 * S, 0.3);
      addEnemy('splitter', CX - 295 * S, CY + 245 * S, -0.2);
      addEnemy('lancer', CX + 260 * S, CY + 300 * S, -0.8);

      for (let i = 0; i < 7; i++) {
        const a = -0.82 + i * 0.17;
        fire(CX + Math.cos(a) * 310 * S, CY + Math.sin(a) * 310 * S, a + Math.PI + 0.15, 145, false, 'red');
      }
      for (let i = 0; i < 4; i++) {
        const a = 1.7 + i * 0.22;
        fire(CX + Math.cos(a) * 350 * S, CY + Math.sin(a) * 350 * S, a + Math.PI - 0.1, 280, true, 'cyan');
      }
      burst(CX + 120 * S, CY - 70 * S, 'cyan', 22, 300, 0.65, 1.9);
      burst(CX - 180 * S, CY + 120 * S, 'magenta', 14, 240, 0.5, 1.6);

      const sh = { x: CX + 175 * S, y: CY + 90 * S, vx: 0, vy: 0, r: 4.2 * S, life: 9, angle: 1, phase: 0 };
      shards.push(sh);
    }

    renderPips();
    updateHUD();
    freezeScene = true;
  }

  function runSelfTest() {
    const results = { errors: [] };
    const onError = (event) => {
      results.errors.push(String(event.error && event.error.stack || event.message || 'unknown error'));
    };
    window.addEventListener('error', onError);
    const step = 1 / 60;

    const aimAtThreat = () => {
      let threat = null;
      let threatD = Infinity;
      for (const b of bullets) {
        if (b.dead || b.friendly) continue;
        const d = dist(b.x, b.y, core.x, core.y);
        if (d < threatD) {
          threatD = d;
          threat = b;
        }
      }
      if (threat) {
        input.mx = threat.x;
        input.my = threat.y;
        input.pointerSeen = true;
      } else {
        input.mx = core.x;
        input.my = core.y - 180 * S;
      }
    };

    const quietArena = () => {
      if (!run) return;
      run.wavePhase = 'clear';
      run.waveClearTimer = 999;
      run.spawnQueue = [];
      enemies = [];
      bullets = [];
      beams = [];
      run.boss = null;
      dom.bossBar.hidden = true;
    };

    try {
      audio.muted = true;
      debugInvincible = true;
      startRun();
      let maxWave = 0;
      let bossSeen = false;
      let novaUsed = 0;
      let pulseUsed = 0;
      for (let i = 0; i < 180 * 60; i++) {
        aimAtThreat();
        if (run.energy >= 100 && run.novaTime <= 0) {
          doNova();
          novaUsed++;
        }
        const close = bullets.some((b) => !b.friendly && dist(b.x, b.y, core.x, core.y) < 190 * S);
        if (close && run.pulseCd <= 0) {
          doPulse();
          pulseUsed++;
        }
        update(step);
        maxWave = Math.max(maxWave, run ? run.wave : 0);
        if (run && run.boss) bossSeen = true;
        if (!run) break;
      }
      results.flow = {
        state,
        wave: run ? run.wave : 0,
        maxWave,
        bossSeen,
        hp: run ? run.hp : 0,
        score: run ? Math.floor(run.score) : 0,
        deflects: run ? run.deflects : 0,
        kills: run ? run.kills : 0,
        novaUsed,
        pulseUsed,
        enemies: enemies.filter((e) => !e.dead).length,
      };

      startRun();
      debugInvincible = true;
      quietArena();
      shield.angle = 0;
      shield.target = 0;
      run.deflects = 0;
      input.mx = core.x + 300 * S;
      input.my = core.y;
      bullets.push({
        x: core.x + 300 * S,
        y: core.y,
        vx: -220 * S,
        vy: 0,
        r: 4 * S,
        friendly: false,
        homing: false,
        life: 8,
        maxLife: 8,
        split: 0,
        color: 'red',
        dead: false,
        seed: 0,
      });
      let reflectedSeen = false;
      for (let i = 0; i < 100; i++) {
        update(step);
        if (bullets.some((b) => b.friendly)) reflectedSeen = true;
      }
      results.reflection = {
        deflects: run.deflects,
        friendlySeen: reflectedSeen,
        energy: Math.round(run.energy),
        combo: run.combo,
      };

      startRun();
      debugInvincible = true;
      quietArena();
      input.aimMode = 'keyboard';
      input.keyboardAngle = 0;
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      for (let i = 0; i < 30; i++) update(step);
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight', bubbles: true }));
      results.keyboardAim = {
        target: Number(shield.target.toFixed(2)),
        coreX: Math.round(core.x),
        mode: input.aimMode,
      };

      startRun();
      debugInvincible = true;
      quietArena();
      input.aimMode = 'touch';
      input.touchAimAngle = -1.2;
      for (let i = 0; i < 20; i++) update(step);
      results.touchAim = {
        target: Number(shield.target.toFixed(2)),
        mode: input.aimMode,
      };

      startRun();
      debugInvincible = true;
      quietArena();
      document.body.classList.add('force-touch');
      const aimRect = dom.touchAimStick.getBoundingClientRect();
      const aimCx = aimRect.left + aimRect.width / 2;
      const aimCy = aimRect.top + aimRect.height / 2;
      dom.touchAimStick.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 77,
        pointerType: 'touch',
        clientX: aimCx,
        clientY: aimCy - aimRect.width * 0.28,
        bubbles: true,
        cancelable: true,
      }));
      window.dispatchEvent(new PointerEvent('pointermove', {
        pointerId: 77,
        pointerType: 'touch',
        clientX: aimCx + aimRect.width * 0.28,
        clientY: aimCy,
        bubbles: true,
        cancelable: true,
      }));
      results.touchJoystick = {
        visibleWidth: Math.round(aimRect.width),
        mode: input.aimMode,
        angle: Number(input.touchAimAngle.toFixed(2)),
        active: touchAim.active,
      };
      dom.touchAimStick.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 77,
        pointerType: 'touch',
        clientX: aimCx,
        clientY: aimCy,
        bubbles: true,
      }));
      document.body.classList.remove('force-touch');

      startRun();
      debugInvincible = true;
      quietArena();
      run.energy = 100;
      doNova();
      const novaStarted = run.novaTime > 0 && run.energy === 0;
      for (let i = 0; i < 190; i++) update(step);
      results.nova = {
        started: novaStarted,
        remaining: Number(run.novaTime.toFixed(2)),
        energy: Math.round(run.energy),
        state,
      };

      startRun();
      debugInvincible = true;
      quietArena();
      run.hp = 2;
      run.energy = 20;
      const healedAmount = healCore(1);
      const hpAfterHeal = run.hp;
      run.hp = run.maxHp;
      healCore(2);
      results.heal = {
        healedAmount,
        hpAfterHeal,
        maxHp: run.maxHp,
        overflowEnergy: Math.round(run.energy),
      };

      startRun();
      debugInvincible = true;
      quietArena();
      run.hp = 2;
      spawnShard(core.x + 120 * S, core.y, 'repair');
      for (let i = 0; i < 90; i++) update(step);
      results.repairPickup = {
        hp: run.hp,
        score: Math.floor(run.score),
        shardsLeft: shards.length,
      };

      startRun();
      debugInvincible = false;
      quietArena();
      run.hp = 2;
      renderPips();
      damagePlayer();
      const hp1 = run.hp;
      damagePlayer();
      const hp2 = run.hp;
      for (let i = 0; i < 120; i++) update(step);
      damagePlayer();
      const hp3 = run.hp;
      const dying = state === 'dying';
      for (let i = 0; i < 130; i++) update(step);
      results.damage = {
        maxHp: run.maxHp,
        firstHit: hp1,
        invulnerableHit: hp2,
        thirdHit: hp3,
        dying,
        finalState: state,
        overlay: !dom.gameover.hidden,
      };
    } catch (err) {
      results.errors.push(String(err && err.stack || err));
    }

    try {
      startRun('story');
      debugInvincible = true;
      quietArena();
      run.wave = STORY_TOTAL;
      run.score = 52000;
      run.wavePhase = 'clear';
      run.waveClearTimer = 0.05;
      for (let i = 0; i < 12; i++) update(step);
      results.finale = {
        state,
        overlay: !dom.ending.hidden,
        cleared: readProgress().cleared,
        night: readProgress().night,
      };
      backToMenu();
      results.finale.afterMenu = state;
    } catch (err) {
      results.errors.push(String((err && err.stack) || err));
    }

    try {
      window.removeEventListener('error', onError);
      const show = new URLSearchParams(location.search).has('showtest');
      const pre = document.createElement('pre');
      pre.id = 'selftest-results';
      pre.textContent = JSON.stringify(results, null, 2);
      pre.style.cssText = show
        ? 'position:fixed;inset:0;z-index:9999;margin:0;padding:24px;background:#03050c;color:#b8feff;font:13px/1.42 Consolas,monospace;white-space:pre-wrap;overflow:hidden;'
        : 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(pre);
      if (show) {
        dom.menu.hidden = true;
        dom.hud.hidden = true;
        dom.gameover.hidden = true;
        dom.pause.hidden = true;
        freezeScene = true;
      } else {
        backToMenu();
        freezeScene = true;
      }
    } catch (_) {
      /* noop */
    }
  }

  /* ============================================================
     SEVENTH NIGHT — STORY, CODEX, ENDING, LEGEND
     ============================================================ */

  const NIGHT_INFO = [
    { title: '灯油见底', sub: '黑潮很轻，像有人伸手试探灯的温度。' },
    { title: '黑潮试探', sub: '子弹开始学会看着你转弯。' },
    { title: '碎裂者', sub: '一颗子弹裂成三颗，像被摔碎的星星。' },
    { title: '长矛', sub: '它们在蓄力。盾面会疼。' },
    { title: '守卫者', sub: '第一次真正的围城。' },
    { title: '余烬如雨', sub: '碎火贴着灯壁烧，快得来不及眨眼。' },
    { title: '最后的归还', sub: '终夜守卫走了进来。把最后的光还给它。' },
  ];

  const MODAL_IDS = ['prologue', 'character', 'lore'];
  let openModalId = null;
  let prologueIndex = 0;
  let legendPeekTimer = null;

  function nightTitle(n) {
    const info = NIGHT_INFO[clamp(n, 1, STORY_TOTAL) - 1];
    return info ? info.title : '';
  }

  function nightLabel(n) {
    if (!n) return '—';
    return `第 ${pad2(n)} 夜`;
  }

  function announceNight(n, bossWave) {
    const info = NIGHT_INFO[clamp(n, 1, STORY_TOTAL) - 1] || { title: `第 ${pad2(n)} 夜`, sub: '' };
    if (!run || run.mode !== 'story') {
      showAnnounce(
        bossWave ? 'WARDEN' : `NIGHT ${pad2(n)}`,
        bossWave ? '守卫者正在接近' : '保持棱镜在弹道上',
        bossWave ? 'THREAT // WARDEN' : 'SYSTEM // NIGHT',
        1750
      );
      return;
    }
    showAnnounce(
      info.title,
      info.sub,
      n >= STORY_TOTAL ? `第 ${pad2(n)} 夜 // 最后的一夜` : `第 ${pad2(n)} 夜 // NIGHTFALL`,
      n >= STORY_TOTAL ? 2800 : 2400
    );
    if (n >= STORY_TOTAL) {
      addShake(7);
      whiteFlash = Math.max(whiteFlash, 0.18);
    }
  }

  /* ---------------- modals ---------------- */

  function modalEls() {
    return MODAL_IDS.map((id) => dom[id]).filter(Boolean);
  }

  function openModal(id) {
    const el = dom[id];
    if (!el) return;
    hideModals();
    el.hidden = false;
    openModalId = id;
    document.body.classList.add('modal-open');
    if (state === 'playing') togglePause(true);
    const focusable = el.querySelector('button, a');
    if (focusable && focusable.focus) focusable.focus({ preventScroll: true });
  }

  function hideModals() {
    for (const el of modalEls()) el.hidden = true;
    openModalId = null;
    document.body.classList.remove('modal-open');
  }

  function closeModals() {
    const wasOpen = openModalId;
    hideModals();
    if (wasOpen === 'prologue' && state === 'menu') {
      /* returning from prologue lands back on the title screen */
      if (dom.startBtn) dom.startBtn.focus({ preventScroll: true });
    }
  }

  /* ---------------- prologue ---------------- */

  function showPrologue() {
    openModal('prologue');
    prologueIndex = 0;
    renderPrologue();
  }

  function renderPrologue() {
    if (!dom.prologue) return;
    const steps = dom.prologue.querySelectorAll('.story-step');
    const dots = dom.prologue.querySelectorAll('.story-dots i');
    steps.forEach((step, i) => step.classList.toggle('on', i === prologueIndex));
    dots.forEach((dot, i) => dot.classList.toggle('on', i <= prologueIndex));
    if (dom.prologueNextLabel) {
      dom.prologueNextLabel.textContent = prologueIndex >= steps.length - 1 ? '开始守夜' : '继续';
    }
  }

  function stepPrologue(dir) {
    const steps = dom.prologue ? dom.prologue.querySelectorAll('.story-step') : [];
    const next = prologueIndex + dir;
    if (next < 0) return;
    if (next >= steps.length) {
      beginStory();
      return;
    }
    prologueIndex = next;
    if (audio.ui) audio.ui();
    renderPrologue();
  }

  function beginStory() {
    hideModals();
    if (state === 'menu' || state === 'dead' || state === 'ending') startRun('story');
  }

  function beginEndless() {
    hideModals();
    if (state === 'menu' || state === 'dead' || state === 'ending') startRun('endless');
  }

  /* ---------------- codex / lore ---------------- */

  function showCharacter() {
    if (state === 'playing') togglePause(true);
    openModal('character');
  }

  function showLore() {
    if (state === 'playing') togglePause(true);
    openModal('lore');
  }

  /* ---------------- ending ---------------- */

  function showEnding() {
    if (!run) return;
    state = 'ending';
    run.wavePhase = 'idle';
    run.wave = STORY_TOTAL;
    markCleared();
    recordNight(STORY_TOTAL);
    if (run.score > best) {
      best = Math.floor(run.score);
      saveBest(best);
    }
    if (dom.endingScore) dom.endingScore.textContent = pad6(run.score);
    if (dom.endingNights) dom.endingNights.textContent = pad2(STORY_TOTAL);
    if (dom.endingDeflects) dom.endingDeflects.textContent = String(run.deflects);
    if (dom.endingCombo) dom.endingCombo.textContent = String(run.maxCombo);
    dom.hud.hidden = true;
    dom.bossBar.hidden = true;
    dom.gameover.hidden = true;
    dom.novaReady.classList.remove('on');
    dom.announce.classList.remove('show');
    dom.hint.classList.remove('show');
    setLegendVisible(false);
    document.body.classList.remove('is-playing');
    if (dom.ending) dom.ending.hidden = false;
    resetTouchMove();
    resetTouchAim();
    whiteFlash = 1;
    addShake(14);
    burst(core.x, core.y, 'cyan', 60, 420, 1.2, 3);
    burst(core.x, core.y, 'magenta', 40, 320, 1, 2.4);
    burst(core.x, core.y, 'white', 30, 240, 1.4, 2);
    syncMenuProgress();
    audio.waveClear();
  }

  /* ---------------- legend ---------------- */

  function legendItems() {
    if (primaryTouch() || document.body.classList.contains('force-touch')) {
      return [
        ['左摇杆', '移动星核'],
        ['右摇杆', '旋转盾向'],
        ['◉ 脉冲', '震开身边的光'],
        ['✦ 新星', '能量满时减速全场'],
      ];
    }
    return [
      ['鼠标 / ← →', '旋转盾向'],
      ['WASD', '移动星核'],
      ['左键 / Space', '脉冲'],
      ['右键 / E', '棱镜新星'],
      ['H', '收起提示'],
    ];
  }

  function setLegendVisible(on, autoHideMs) {
    if (!dom.legend) return;
    if (on) {
      const html = legendItems()
        .map(([k, v]) => `<span><b>${k}</b>${v}</span>`)
        .join('');
      dom.legend.innerHTML = html;
      dom.legend.hidden = false;
      dom.legend.classList.add('show');
      if (dom.legendBtn) dom.legendBtn.setAttribute('aria-pressed', 'true');
      if (legendPeekTimer) clearTimeout(legendPeekTimer);
      if (autoHideMs) {
        legendPeekTimer = setTimeout(() => setLegendVisible(false), autoHideMs);
      }
    } else {
      dom.legend.classList.remove('show');
      dom.legend.hidden = true;
      if (dom.legendBtn) dom.legendBtn.setAttribute('aria-pressed', 'false');
      if (legendPeekTimer) clearTimeout(legendPeekTimer);
      legendPeekTimer = null;
    }
  }

  function toggleLegend() {
    if (!dom.legend) return;
    setLegendVisible(dom.legend.hidden, dom.legend.hidden ? 9000 : 0);
  }

  /* ---------------- menu progress ---------------- */

  function syncMenuProgress() {
    const p = readProgress();
    if (dom.menuBest) dom.menuBest.textContent = pad6(p.best);
    if (dom.bestNum) dom.bestNum.textContent = pad6(p.best);
    if (dom.menuNight) dom.menuNight.textContent = p.cleared ? '第七夜 · 已通' : nightLabel(p.night);
    if (dom.coreSignal) dom.coreSignal.textContent = p.cleared ? 'ETERNAL' : p.night > 0 ? `NIGHT ${pad2(p.night)}` : 'STABLE';
    if (dom.finalNight) dom.finalNight.textContent = p.cleared ? '第七夜 · 已通' : nightLabel(p.night);
  }

  /* ---------------- bindings ---------------- */

  function bindStoryUI() {
    if (dom.prologueNext) {
      dom.prologueNext.addEventListener('click', () => stepPrologue(1));
    }
    if (dom.prologueSkip) {
      dom.prologueSkip.addEventListener('click', beginStory);
    }
    if (dom.startBtn) {
      dom.startBtn.addEventListener('click', () => {
        if (state !== 'menu') return;
        if (readProgress().cleared) {
          beginStory();
        } else {
          showPrologue();
        }
      });
    }
    if (dom.endlessBtn) dom.endlessBtn.addEventListener('click', beginEndless);
    if (dom.codexBtn) dom.codexBtn.addEventListener('click', showCharacter);
    if (dom.loreBtn) dom.loreBtn.addEventListener('click', showLore);
    if (dom.heroCardBtn) dom.heroCardBtn.addEventListener('click', showCharacter);
    if (dom.characterClose) dom.characterClose.addEventListener('click', closeModals);
    if (dom.loreClose) dom.loreClose.addEventListener('click', closeModals);
    if (dom.loreFromCodex) {
      dom.loreFromCodex.addEventListener('click', () => {
        showLore();
      });
    }
    if (dom.loreToPlay) {
      dom.loreToPlay.addEventListener('click', (e) => {
        e.preventDefault();
        hideModals();
        if (readProgress().cleared) beginStory();
        else showPrologue();
      });
    }
    if (dom.endingEndless) dom.endingEndless.addEventListener('click', beginEndless);
    if (dom.endingRestart) dom.endingRestart.addEventListener('click', beginStory);
    if (dom.endingMenu) dom.endingMenu.addEventListener('click', backToMenu);
    if (dom.legendBtn) dom.legendBtn.addEventListener('click', toggleLegend);

    for (const id of MODAL_IDS) {
      const el = dom[id];
      if (!el) continue;
      el.addEventListener('pointerdown', (e) => {
        if (e.target === el) closeModals();
      });
    }

    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (openModalId === 'prologue') {
        if (key === 'Enter' || key === ' ' || key === 'ArrowRight') {
          e.preventDefault();
          stepPrologue(1);
          return;
        }
        if (key === 'ArrowLeft') {
          e.preventDefault();
          stepPrologue(-1);
          return;
        }
        if (key === 'Escape') {
          e.preventDefault();
          beginStory();
          return;
        }
      }
      if (openModalId && key === 'Escape') {
        e.preventDefault();
        closeModals();
        syncMenuProgress();
        return;
      }
      if (key === 'h' || key === 'H') {
        if (state === 'playing') toggleLegend();
      }
    });
  }
  function init() {
    if (new URLSearchParams(location.search).has('touchdemo')) {
      document.body.classList.add('force-touch');
    }
    buildGlow();
    resize();
    if (dom.menuBest) dom.menuBest.textContent = pad6(best);
    if (dom.bestNum) dom.bestNum.textContent = pad6(best);
    syncMenuProgress();
    if (primaryTouch()) {
      document.querySelectorAll('.btn-key').forEach((el) => {
        el.textContent = 'TAP';
      });
    }
    core.x = CX;
    core.y = CY;
    input.mx = CX;
    input.my = CY - 180 * S;
    renderPips();
    bindEvents();
    makeMenuOrbs();

    if (new URLSearchParams(location.search).has('debug')) {
      window.__PRISM_DEBUG__ = {
        start: startRun,
        startStory: () => startRun('story'),
        startEndless: () => startRun('endless'),
        ending: showEnding,
        prologue: showPrologue,
        progress: readProgress,
        pulse: doPulse,
        nova: doNova,
        damage: damagePlayer,
        spawn: spawnEnemy,
        killAll: () => {
          for (const e of [...enemies]) killEnemy(e, false);
        },
        setEnergy: (value) => {
          if (run) run.energy = clamp(value, 0, 100);
        },
        snapshot: () => ({
          state,
          mode: run ? run.mode : null,
          wave: run ? run.wave : 0,
          hp: run ? run.hp : 0,
          score: run ? Math.floor(run.score) : 0,
          energy: run ? Math.round(run.energy) : 0,
          combo: run ? run.combo : 0,
          deflects: run ? run.deflects : 0,
          enemies: enemies.filter((e) => !e.dead).length,
          bullets: bullets.filter((b) => !b.dead).length,
          boss: !!(run && run.boss && !run.boss.dead),
          nova: !!(run && run.novaTime > 0),
          bossHp: run && run.boss ? Math.max(0, run.boss.hp) : 0,
        }),
      };
    }

    const params = new URLSearchParams(location.search);
    if (params.has('selftest')) {
      runSelfTest();
    } else {
      if (params.has('pose')) {
        startRun('story');
        run.spawnQueue = [];
        run.wavePhase = 'idle';
        enemies = [];
        bullets = [];
        beams = [];
        run.energy = 100;
        freezeScene = true;
      }
      if (params.has('clean')) {
        dom.hud.hidden = true;
        dom.announce.classList.remove('show');
        dom.hint.classList.remove('show');
        setLegendVisible(false);
      }
      if (params.has('prologue')) showPrologue();
      if (params.has('codex')) showCharacter();
      if (params.has('lore')) showLore();
      if (params.has('ending')) {
        startRun('story');
        run.wave = STORY_TOTAL;
        run.score = 86420;
        run.deflects = 214;
        run.maxCombo = 52;
        showEnding();
        freezeScene = true;
      }
      if (params.has('autostart')) {
        setTimeout(() => {
          if (state === 'menu') startRun(params.get('mode') === 'endless' ? 'endless' : 'story');
        }, 250);
      }

      if (params.has('scene')) {
        startRun();
        setupDebugScene(params.get('scene'));
      }

      if (params.has('playtest')) {
        startRun();
        debugInvincible = true;
        for (let i = 0; i < 32 * 60; i++) {
          let threat = null;
          let threatD = Infinity;
          for (const b of bullets) {
            if (b.dead || b.friendly) continue;
            const d = dist(b.x, b.y, core.x, core.y);
            if (d < threatD) {
              threatD = d;
              threat = b;
            }
          }
          if (threat) {
            input.mx = threat.x;
            input.my = threat.y;
          } else {
            input.mx = core.x;
            input.my = core.y - 180 * S;
          }
          update(1 / 60);
        }
        debugInvincible = false;
        dom.announce.classList.remove('show');
        dom.hint.classList.remove('show');
        if (announceTimeout) clearTimeout(announceTimeout);
        if (hintTimeout) clearTimeout(hintTimeout);
        shield.angle = -0.7;
        shield.target = -0.7;
        input.mx = core.x + Math.cos(-0.7) * 240;
        input.my = core.y + Math.sin(-0.7) * 240;
        freezeScene = true;
      }

      if (params.has('touchdemo')) document.body.classList.add('force-touch');
    }
    requestAnimationFrame(frame);
  }

  init();
})();
