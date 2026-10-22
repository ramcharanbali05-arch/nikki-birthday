/**
 * ============================================================================
 * 🎂 MAGICAL BIRTHDAY PORTAL - CORE APPLICATION ENGINE
 * ============================================================================
 * Features:
 * 1. Web Audio API Microphone Blow Detection & Candle Extinguish
 * 2. Multi-Burst Canvas Confetti & Synthesized Happy Birthday Song
 * 3. Interactive Floating Balloon Pop Mini-Game with Compliment Badges
 * 4. Google Gemini API (gemini-2.5-flash) Storyteller + Smart Offline Fallback
 * 5. Web Speech API (SpeechSynthesis) Child-Friendly Read Aloud
 * 6. Polaroid Memory Wall with Interactive Lightbox Zoom
 * 7. 3D Mystery Gift Box with 3-Tap Unwrapping & Floating Heart Hugs
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. CONFIGURATION & URL PARAMETER MERGING
  const CONFIG = window.BIRTHDAY_CONFIG || {
    nieceName: "Nikki",
    age: 9,
    senderTitle: "Mamayya",
    geminiApiKey: "",
    backgroundMusicEnabled: true,
    soundEffectsEnabled: true,
    photos: [
      {
        id: 1,
        url: "assets/images/niece-1.jpg",
        caption: "Our Little Princess 👑",
        date: "Precious Moment 1",
        tag: "Princess"
      },
      {
        id: 2,
        url: "assets/images/niece-2.jpg",
        caption: "The Million-Dollar Smile ✨",
        date: "Precious Moment 2",
        tag: "Sunshine"
      },
      {
        id: 3,
        url: "assets/images/niece-3.jpg",
        caption: "Cutest Explorer 🚀",
        date: "Precious Moment 3",
        tag: "Adventurer"
      },
      {
        id: 4,
        url: "assets/images/niece-4.jpg",
        caption: "Sweetest Memories 💖",
        date: "Precious Moment 4",
        tag: "Treasured"
      },
      {
        id: 5,
        url: "assets/images/niece-5.jpg",
        caption: "Always Bringing Joy 🌟",
        date: "Precious Moment 5",
        tag: "Joy Spreader"
      },
      {
        id: 6,
        url: "assets/images/niece-6.jpg",
        caption: "Super Star in the Making 🎨",
        date: "Precious Moment 6",
        tag: "Creative Star"
      },
      {
        id: 7,
        url: "assets/images/niece-7.jpg",
        caption: "Mischief & Fun 🎈",
        date: "Precious Moment 7",
        tag: "Playtime"
      },
      {
        id: 8,
        url: "assets/images/niece-8.jpg",
        caption: "Happy 9th Birthday! 🎂",
        date: "The Big Day!",
        tag: "Birthday Queen"
      }
    ],
    balloonCompliments: [],
    mamayyaLetter: {}
  };

  // Ensure CONFIG.photos has fallback if empty array was passed
  if (!CONFIG.photos || CONFIG.photos.length === 0) {
    CONFIG.photos = [
      { id: 1, url: "assets/images/niece-1.jpg", caption: "Our Little Princess 👑", date: "Precious Moment 1", tag: "Princess" },
      { id: 2, url: "assets/images/niece-2.jpg", caption: "The Million-Dollar Smile ✨", date: "Precious Moment 2", tag: "Sunshine" },
      { id: 3, url: "assets/images/niece-3.jpg", caption: "Cutest Explorer 🚀", date: "Precious Moment 3", tag: "Adventurer" },
      { id: 4, url: "assets/images/niece-4.jpg", caption: "Sweetest Memories 💖", date: "Precious Moment 4", tag: "Treasured" },
      { id: 5, url: "assets/images/niece-5.jpg", caption: "Always Bringing Joy 🌟", date: "Precious Moment 5", tag: "Joy Spreader" },
      { id: 6, url: "assets/images/niece-6.jpg", caption: "Super Star in the Making 🎨", date: "Precious Moment 6", tag: "Creative Star" },
      { id: 7, url: "assets/images/niece-7.jpg", caption: "Mischief & Fun 🎈", date: "Precious Moment 7", tag: "Playtime" },
      { id: 8, url: "assets/images/niece-8.jpg", caption: "Happy 9th Birthday! 🎂", date: "The Big Day!", tag: "Birthday Queen" }
    ];
  }

  // Support URL query parameters (e.g. ?name=Nikki&age=9&sender=Mamayya)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('name')) CONFIG.nieceName = urlParams.get('name');
  if (urlParams.get('age')) CONFIG.age = parseInt(urlParams.get('age'), 10) || 9;
  if (urlParams.get('sender')) CONFIG.senderTitle = urlParams.get('sender');
  if (urlParams.get('key')) CONFIG.geminiApiKey = urlParams.get('key');

  // Application State
  const state = {
    isCandleBlown: false,
    micStream: null,
    audioCtx: null,
    analyser: null,
    isListeningMic: false,
    blowProgress: 0,
    poppedCount: 0,
    selectedRole: "Magical Princess",
    selectedSidekick: "Baby Dragon",
    selectedPower: "Turning things into Chocolate",
    isGeneratingStory: false,
    isSpeakingStory: false,
    currentSpeechUtterance: null,
    giftTapsLeft: 3,
    isGiftOpened: false,
    activeBalloons: [],
    currentPhotoIndex: 0,
    isGalleryCarouselMode: false
  };

  // DOM Elements
  const elements = {
    stageLock: document.getElementById('stage-lock'),
    stagePortal: document.getElementById('stage-portal'),
    candleFlame: document.getElementById('candle-flame'),
    smokePuff: document.getElementById('smoke-puff-container'),
    btnStartMic: document.getElementById('btn-start-mic'),
    btnTapFlame: document.getElementById('btn-tap-flame'),
    blowMeterContainer: document.getElementById('blow-meter-container'),
    blowProgressBar: document.getElementById('blow-progress-bar'),
    blowStatusText: document.getElementById('blow-status-text'),
    blowPercentText: document.getElementById('blow-percent-text'),
    starsContainer: document.getElementById('stars-container'),
    
    // Music Controls
    btnToggleMusic: document.getElementById('btn-toggle-music'),
    musicIcon: document.getElementById('music-icon'),
    musicLabel: document.getElementById('music-label'),
    eqBars: document.getElementById('eq-bars'),

    // Balloon Mini-Game
    balloonPlayground: document.getElementById('balloon-playground'),
    balloonsStream: document.getElementById('balloons-stream'),
    poppedCount: document.getElementById('popped-count'),
    btnSpawnBalloons: document.getElementById('btn-spawn-balloons'),

    // Story Elements
    roleOptions: document.getElementById('role-options'),
    sidekickOptions: document.getElementById('sidekick-options'),
    powerOptions: document.getElementById('power-options'),
    btnGenerateStory: document.getElementById('btn-generate-story'),
    storyLoading: document.getElementById('story-loading'),
    storyResultCard: document.getElementById('story-result-card'),
    storyTitle: document.getElementById('story-title'),
    storyContent: document.getElementById('story-content'),
    storySourceBadge: document.getElementById('story-source-badge'),
    btnReadStory: document.getElementById('btn-read-story'),
    btnStopTts: document.getElementById('btn-stop-tts'),
    ttsIcon: document.getElementById('tts-icon'),
    ttsLabel: document.getElementById('tts-label'),

    // Polaroid Gallery
    polaroidGrid: document.getElementById('polaroid-grid'),
    polaroidModal: document.getElementById('polaroid-modal'),
    modalImg: document.getElementById('modal-img'),
    modalFallback: document.getElementById('modal-fallback'),
    modalFallbackTitle: document.getElementById('modal-fallback-title'),
    modalFallbackFilename: document.getElementById('modal-fallback-filename'),
    modalCaption: document.getElementById('modal-caption'),
    modalDate: document.getElementById('modal-date'),
    modalCounter: document.getElementById('modal-counter'),
    modalDots: document.getElementById('modal-dots'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnPrevPhoto: document.getElementById('btn-prev-photo'),
    btnNextPhoto: document.getElementById('btn-next-photo'),
    btnGalleryGrid: document.getElementById('btn-gallery-grid'),
    btnGalleryCarousel: document.getElementById('btn-gallery-carousel'),

    // Mystery Gift Box
    giftBoxWrapper: document.getElementById('gift-box-wrapper'),
    giftBoxElem: document.getElementById('gift-box-elem'),
    giftLid: document.getElementById('gift-lid'),
    giftTapBadge: document.getElementById('gift-tap-badge'),
    giftTapsLeft: document.getElementById('gift-taps-left'),
    giftRevealedCard: document.getElementById('gift-revealed-card'),
    letterBadge: document.getElementById('letter-badge'),
    letterTitle: document.getElementById('letter-title'),
    letterParagraphs: document.getElementById('letter-paragraphs'),
    letterSignoff: document.getElementById('letter-signoff'),
    letterSender: document.getElementById('letter-sender'),
    btnSendHug: document.getElementById('btn-send-hug'),

    // Settings Modal
    btnOpenSettings: document.getElementById('btn-open-settings'),
    settingsModal: document.getElementById('settings-modal'),
    btnCloseSettings: document.getElementById('btn-close-settings'),
    btnCancelSettings: document.getElementById('btn-cancel-settings'),
    settingsForm: document.getElementById('settings-form'),
    inputName: document.getElementById('input-name'),
    inputAge: document.getElementById('input-age'),
    inputSender: document.getElementById('input-sender'),
    inputGeminiKey: document.getElementById('input-gemini-key')
  };

  // =========================================================================
  // 1. INITIALIZATION & UI SYNC
  // =========================================================================
  function initApp() {
    updateDynamicTexts();
    renderTwinklingStars();
    renderPolaroidWall();
    renderGiftLetter();
    setupEventListeners();
    setupStoryCategories();
    initMagicalCursor();

    // Check if background music should start after first interaction
    document.body.addEventListener('click', () => {
      window.soundEngine.init();
    }, { once: true });
  }

  // Update all dynamic occurrences of name, age, sender
  function updateDynamicTexts() {
    document.querySelectorAll('.niece-name-insert').forEach(el => {
      el.textContent = CONFIG.nieceName;
    });

    const senderEl = document.getElementById('sender-title-text');
    if (senderEl) senderEl.textContent = CONFIG.senderTitle;

    const footerSender = document.getElementById('footer-sender');
    if (footerSender) footerSender.textContent = CONFIG.senderTitle;

    document.title = `✨ Happy 9th Birthday, ${CONFIG.nieceName}! ✨`;
  }

  // Generate twinkling background stars for lock screen
  function renderTwinklingStars() {
    if (!elements.starsContainer) return;
    elements.starsContainer.innerHTML = '';
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3 + 1.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = (Math.random() * 3 + 2).toFixed(1);
      const delay = (Math.random() * 3).toFixed(1);

      star.className = 'absolute rounded-full bg-white star-twinkle shadow-sm';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      elements.starsContainer.appendChild(star);
    }
  }

  // =========================================================================
  // 2. STAGE 1: WEB AUDIO MICROPHONE BLOW DETECTION & CANDLE EXTINGUISH
  // =========================================================================
  async function startMicrophoneListening() {
    window.soundEngine.init();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone access is not supported on this browser. You can tap the candle flame directly to blow it out!");
      return;
    }

    try {
      elements.btnStartMic.disabled = true;
      elements.btnStartMic.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-yellow-300 text-lg"></i> <span>Listening for blow...</span>`;
      elements.blowStatusText.textContent = "Listening: Blow hard into mic!";

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      state.micStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
      const source = state.audioCtx.createMediaStreamSource(stream);
      
      state.analyser = state.audioCtx.createAnalyser();
      state.analyser.fftSize = 256;
      source.connect(state.analyser);

      state.isListeningMic = true;
      monitorBlowVolume();

    } catch (err) {
      console.warn("Microphone permission denied or unavailable:", err);
      elements.btnStartMic.disabled = false;
      elements.btnStartMic.innerHTML = `<i class="fa-solid fa-microphone-slash text-red-300"></i> <span>Mic Denied (Tap Flame!)</span>`;
      elements.blowStatusText.textContent = "Mic denied. Tap the flame to extinguish!";
      elements.blowProgressBar.style.width = '100%';
      elements.blowProgressBar.className = elements.blowProgressBar.className.replace('from-sky-400', 'from-amber-400');
    }
  }

  // Analyze microphone frequency data to detect air blowing/puffs
  function monitorBlowVolume() {
    if (!state.isListeningMic || state.isCandleBlown) return;

    const dataArray = new Uint8Array(state.analyser.frequencyBinCount);
    state.analyser.getByteFrequencyData(dataArray);

    // Blowing produces heavy low-frequency wind turbulence (bins 1 to 10 approx 40Hz - 350Hz)
    let lowFreqEnergy = 0;
    const lowFreqBins = 10;
    for (let i = 1; i <= lowFreqBins; i++) {
      lowFreqEnergy += dataArray[i];
    }
    const avgLowFreq = lowFreqEnergy / lowFreqBins;

    // Normalizing blow strength to percentage (threshold usually 45-60)
    let blowStrength = 0;
    if (avgLowFreq > 40) {
      blowStrength = Math.min(100, Math.round(((avgLowFreq - 40) / 90) * 100));
    }

    // Smooth filling of the meter
    if (blowStrength > 20) {
      state.blowProgress = Math.min(100, state.blowProgress + 14);
    } else {
      state.blowProgress = Math.max(0, state.blowProgress - 4);
    }

    elements.blowProgressBar.style.width = `${state.blowProgress}%`;
    elements.blowPercentText.textContent = `${state.blowProgress}%`;

    // Trigger blowout when progress bar is filled
    if (state.blowProgress >= 100) {
      blowOutCandle();
      return;
    }

    requestAnimationFrame(monitorBlowVolume);
  }

  // Extinguish candle, play sound, explode confetti, and unlock portal
  function blowOutCandle() {
    if (state.isCandleBlown) return;
    state.isCandleBlown = true;
    state.isListeningMic = false;

    // Stop mic stream
    if (state.micStream) {
      state.micStream.getTracks().forEach(track => track.stop());
      state.micStream = null;
    }
    if (state.audioCtx && state.audioCtx.state !== 'closed') {
      state.audioCtx.close().catch(() => {});
    }

    // Visual flame extinguish & smoke puff
    elements.candleFlame.classList.add('flame-extinguished');
    elements.smokePuff.classList.remove('hidden');

    // Audio effects: puff sound + Happy Birthday song
    window.soundEngine.playBlowPuff();

    // Massive multi-burst confetti celebration
    launchCandleBlowConfetti();

    // Synthesize "Happy Birthday" melody
    window.soundEngine.playHappyBirthdayMelody();

    // After 2.5 seconds of celebration, transition to Unlocked Portal
    setTimeout(() => {
      transitionToPortal();
    }, 2400);
  }

  // Multi-burst canvas confetti explosion
  function launchCandleBlowConfetti() {
    if (typeof confetti !== 'function') return;

    // Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#FFB6C1', '#C084FC', '#FDE047', '#38BDF8']
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FEF08A', '#F472B6', '#A78BFA', '#34D399']
      });
    }, 300);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#38BDF8', '#FBBF24', '#F43F5E', '#818CF8']
      });
    }, 600);

    // Golden stars shower
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['star'],
        colors: ['#FFD700', '#FFA500', '#FFFFFF']
      });
    }, 900);
  }

  // Smooth curtain transition to Unlocked Portal (Stage 2)
  function transitionToPortal() {
    elements.stageLock.style.opacity = '0';
    elements.stageLock.style.pointerEvents = 'none';

    setTimeout(() => {
      elements.stageLock.classList.add('hidden');
      elements.stagePortal.classList.remove('opacity-0', 'pointer-events-none');
      elements.stagePortal.classList.add('opacity-100');

      // Scroll smoothly to top of portal
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Start floating balloons mini-game
      startBalloonSpawning();

      // Launch welcoming confetti
      launchPortalWelcomeConfetti();
    }, 900);
  }

  function launchPortalWelcomeConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.3 },
      colors: ['#FF69B4', '#C084FC', '#38BDF8', '#FDE047', '#4ADE80']
    });
  }

  // =========================================================================
  // 3. STAGE 2: FLOATING BALLOON POP MINI-GAME & COMPLIMENT REVEAL
  // =========================================================================
  const BALLOON_COLORS = [
    { bg: 'from-pink-400 to-rose-500', border: 'border-pink-300', text: '#FF69B4' },
    { bg: 'from-purple-400 to-indigo-500', border: 'border-purple-300', text: '#C084FC' },
    { bg: 'from-sky-400 to-blue-500', border: 'border-sky-300', text: '#38BDF8' },
    { bg: 'from-amber-300 to-yellow-500', border: 'border-amber-200', text: '#F59E0B' },
    { bg: 'from-emerald-300 to-teal-500', border: 'border-emerald-200', text: '#10B981' }
  ];

  function startBalloonSpawning() {
    // Spawn initial cluster of 5 balloons
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnSingleBalloon(), i * 400);
    }
  }

  function spawnSingleBalloon() {
    if (!elements.balloonsStream) return;

    const balloon = document.createElement('div');
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const leftPercent = 8 + Math.random() * 80;
    const duration = 6 + Math.random() * 4; // float duration
    const scale = 0.85 + Math.random() * 0.3;

    balloon.className = 'balloon-item absolute flex flex-col items-center cursor-pointer select-none';
    balloon.style.left = `${leftPercent}%`;
    balloon.style.bottom = '-80px';
    balloon.style.transform = `scale(${scale})`;
    balloon.style.transition = `bottom ${duration}s linear, transform 0.2s ease`;

    // Balloon SVG Graphic with 3D gloss and ribbon string
    balloon.innerHTML = `
      <div class="relative w-16 h-20 sm:w-20 sm:h-24 rounded-full bg-gradient-to-br ${color.bg} shadow-lg border ${color.border} flex items-center justify-center filter drop-shadow-md">
        <!-- Gloss highlight -->
        <div class="absolute top-2 left-2.5 w-4 h-6 rounded-full bg-white/45 rotate-[-25deg] blur-[0.5px]"></div>
        <!-- Center icon -->
        <span class="text-white/95 font-fredoka font-bold text-sm sm:text-base drop-shadow-sm pointer-events-none">
          🎈
        </span>
        <!-- Tie knot -->
        <div class="absolute -bottom-1.5 w-3 h-2 bg-gradient-to-r ${color.bg} rounded-sm shadow-sm"></div>
      </div>
      <!-- Dangling string -->
      <svg width="18" height="40" viewBox="0 0 20 50" class="pointer-events-none opacity-80 -mt-1">
        <path d="M10,0 Q18,15 10,25 T10,50" fill="none" stroke="rgba(120, 80, 150, 0.4)" stroke-width="2" />
      </svg>
    `;

    // Click/tap handler
    balloon.addEventListener('click', (e) => {
      popBalloon(balloon, e.clientX, e.clientY);
    });

    elements.balloonsStream.appendChild(balloon);

    // Trigger float animation
    requestAnimationFrame(() => {
      balloon.style.bottom = '180px';
    });

    // Remove balloon when it reaches top and respawn
    setTimeout(() => {
      if (balloon.parentNode) {
        balloon.remove();
        spawnSingleBalloon();
      }
    }, duration * 1000);
  }

  function popBalloon(balloonElem, clientX, clientY) {
    if (balloonElem.dataset.popped) return;
    balloonElem.dataset.popped = "true";

    // Play synthesized pop sound
    window.soundEngine.playBalloonPop();

    // Trigger pop CSS animation
    balloonElem.classList.add('balloon-popping');

    // Update popped counter
    state.poppedCount++;
    elements.poppedCount.textContent = state.poppedCount;

    // Spawn floating compliment sticker
    const compliments = CONFIG.balloonCompliments || [
      "🌟 Smartest Girl in the World!",
      "💖 Cutest Smile Ever!",
      "🚀 Future Superstar!",
      "✨ Best Niece in the Universe!"
    ];
    const complimentText = compliments[Math.floor(Math.random() * compliments.length)];
    spawnFloatingCompliment(complimentText, clientX, clientY);

    // If popped target age (9 balloons!), play special fanfare!
    if (state.poppedCount === CONFIG.age) {
      window.soundEngine.playSparkleChime();
      launchMilestoneConfetti();
    }

    // Remove popped balloon and respawn a fresh one
    setTimeout(() => {
      balloonElem.remove();
      setTimeout(spawnSingleBalloon, 500);
    }, 350);
  }

  function launchMilestoneConfetti() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FF69B4', '#FEF08A', '#38BDF8', '#C084FC']
    });
  }

  // Floating compliment sticker that floats up and fades gracefully
  function spawnFloatingCompliment(text, x, y) {
    const sticker = document.createElement('div');
    sticker.className = 'floating-compliment px-4 py-2 rounded-2xl glass-card font-fredoka font-bold text-sm sm:text-base text-purple-950 border-2 border-pink-300/80 shadow-2xl flex items-center gap-2';
    sticker.innerHTML = `
      <span class="text-pink-500 text-lg">✨</span>
      <span>${text}</span>
    `;

    // Position near tap
    const posX = x || (window.innerWidth / 2);
    const posY = y || (window.innerHeight / 2);

    sticker.style.left = `${posX}px`;
    sticker.style.top = `${posY}px`;

    document.body.appendChild(sticker);

    setTimeout(() => {
      sticker.remove();
    }, 2800);
  }

  // =========================================================================
  // 4. STAGE 3: AI MAGICAL ADVENTURE STORYTELLER (GEMINI + TTS)
  // =========================================================================
  function setupStoryCategories() {
    const setupGroup = (container, categoryKey) => {
      if (!container) return;
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;

        window.soundEngine.playTap();

        container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (categoryKey === 'role') state.selectedRole = btn.dataset.value;
        if (categoryKey === 'sidekick') state.selectedSidekick = btn.dataset.value;
        if (categoryKey === 'power') state.selectedPower = btn.dataset.value;
      });
    };

    setupGroup(elements.roleOptions, 'role');
    setupGroup(elements.sidekickOptions, 'sidekick');
    setupGroup(elements.powerOptions, 'power');
  }

  // Generate Story: Try Gemini API first, otherwise fallback to procedural generator
  async function generateMagicalStory() {
    if (state.isGeneratingStory) return;
    state.isGeneratingStory = true;

    window.soundEngine.playSparkleChime();

    // Show loading state
    elements.btnGenerateStory.disabled = true;
    elements.storyLoading.classList.remove('hidden');
    elements.storyResultCard.classList.add('opacity-50');

    const role = state.selectedRole;
    const sidekick = state.selectedSidekick;
    const power = state.selectedPower;
    const name = CONFIG.nieceName;
    const sender = CONFIG.senderTitle;

    let storyData = null;

    // 1. If Gemini API key is configured, call gemini-2.5-flash
    if (CONFIG.geminiApiKey && CONFIG.geminiApiKey.trim() !== "") {
      try {
        storyData = await callGeminiApi(name, role, sidekick, power, sender, CONFIG.geminiApiKey.trim());
      } catch (err) {
        console.warn("Gemini API call failed, switching smoothly to offline story engine:", err);
      }
    }

    // 2. Built-in smart Pixar/Disney procedural fallback generator
    if (!storyData) {
      storyData = generateProceduralStory(name, role, sidekick, power, sender);
    }

    // Hide loading & render result
    setTimeout(() => {
      renderStoryResult(storyData);
      elements.storyLoading.classList.add('hidden');
      elements.storyResultCard.classList.remove('opacity-50');
      elements.btnGenerateStory.disabled = false;
      state.isGeneratingStory = false;

      // Small confetti burst on generation
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#C084FC', '#FDE047']
        });
      }
    }, 600);
  }

  // Gemini API caller
  async function callGeminiApi(name, role, sidekick, power, sender, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
Write an exciting, funny, and heartwarming Pixar/Disney-style birthday mini-adventure for a 9-year-old girl named "${name}".
- Her Hero Role: ${role}
- Her Loyal Sidekick: ${sidekick}
- Her Superpower: ${power}

Requirements:
1. Provide an adorable title on the first line starting with "TITLE: ".
2. Write a captivating 5-sentence story filled with whimsy, laughter, wonder, and fun emojis.
3. The 5th and final sentence MUST be an affectionate, proud birthday wish from her ${sender} with a warm hug.
4. Keep the vocabulary playful, child-friendly, and celebratory!
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 350
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini API");

    // Parse title and paragraphs
    const lines = rawText.split('\n').filter(l => l.trim() !== "");
    let title = `The Magical Adventures of ${name}`;
    let paragraphs = [];

    for (let line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('#')) {
        title = line.replace(/^[#\s]+/, '').trim();
      } else {
        paragraphs.push(line.trim());
      }
    }

    return {
      title,
      paragraphs,
      source: "✨ Gemini AI Story"
    };
  }

  // Built-in Pixar/Disney procedural story engine (Works 100% offline!)
  function generateProceduralStory(name, role, sidekick, power, sender) {
    const sidekickNicknames = {
      "Baby Dragon": "Pip the Glitter-Dragon",
      "Talking Puppy": "Barnaby the Whiskered Pup",
      "Flying Unicorn": "Stardust the Celestial Mare",
      "Cheeky Robot": "Beep-Boop the Pocket Dynamo"
    };
    const companion = sidekickNicknames[sidekick] || sidekick;

    const actionPhrases = {
      "Turning things into Chocolate": `turned three giant floating rocks into mouthwatering hot fudge cakes and chocolate waterfalls 🍫`,
      "Flying on Rainbows": `surfed a sparkling double-rainbow directly into the stratosphere, leaving glittering star trails across the sky 🌈`,
      "Ice & Snowflake Magic": `crafted a breathtaking winter wonderland castle made of sparkling crystal ice cream cones ❄️`,
      "Invisibility Cloak": `slipped past the grumpy candy-stealing trolls unseen and retrieved the sacred birthday crown ✨`
    };
    const actionFeat = actionPhrases[power] || `unleashed incredible magical sparkles across the realm ✨`;

    const title = `The Adventures of ${role} ${name} & ${companion}!`;

    const paragraphs = [
      `On the sparkling morning of her 9th birthday, **${name} the ${role}** woke up to find ${companion} doing joyful somersaults across her bedroom carpet! 🌟`,
      `With a cheerful giggle, she zoomed into action and ${actionFeat}!`,
      `Together, ${name} and ${companion} defended the enchanted kingdom from bedtime curfews and spread endless laughter and rainbow sprinkles to everyone! 🏰🎉`,
      `The kingdom cheered in awe, declaring ${name} the bravest, smartest, and most magnificent 9-year-old hero in the whole galaxy! 👑🚀`,
      `💌 "Happy 9th Birthday, my brave little superstar! Keep shining bright, laughing loud, and dreaming big," cheered her proud ${sender} with the warmest birthday hug! ❤️`
    ];

    return {
      title,
      paragraphs,
      source: "✨ Magical Story Engine"
    };
  }

  // Render story into card
  function renderStoryResult(storyData) {
    elements.storyTitle.textContent = storyData.title;
    elements.storySourceBadge.textContent = storyData.source;
    elements.storyContent.innerHTML = storyData.paragraphs.map((p, idx) => {
      // Highlight Mamayya's concluding wish
      if (idx === storyData.paragraphs.length - 1) {
        return `<p class="font-semibold text-pink-700 bg-pink-50/60 p-2.5 rounded-xl border border-pink-200">${p}</p>`;
      }
      return `<p>${p}</p>`;
    }).join('');
  }

  // Web Speech API: Text-to-Speech Read Aloud
  function readStoryAloud() {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this device/browser.");
      return;
    }

    if (state.isSpeakingStory) {
      window.speechSynthesis.cancel();
      stopSpeakingUI();
      return;
    }

    const textToRead = elements.storyContent.innerText;
    if (!textToRead) return;

    window.soundEngine.init();
    window.speechSynthesis.cancel(); // clear previous

    const utterance = new SpeechSynthesisUtterance(textToRead);
    state.currentSpeechUtterance = utterance;

    // Configure playful, warm tone
    utterance.pitch = 1.15; // slightly higher, friendly child-story tone
    utterance.rate = 0.95;  // relaxed storytelling pace

    // Try finding a natural, friendly English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.lang.includes('en') || v.lang.includes('en-US') || v.lang.includes('en-GB')) &&
      (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Zira'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // UI Feedback when speech begins
    utterance.onstart = () => {
      state.isSpeakingStory = true;
      elements.btnReadStory.classList.add('bg-pink-600', 'animate-pulse');
      elements.ttsIcon.className = "fa-solid fa-volume-high text-yellow-300";
      elements.ttsLabel.textContent = "🔊 Reading to You...";
      elements.btnStopTts.classList.remove('hidden');
      elements.storyResultCard.classList.add('ring-4', 'ring-pink-300/60');
    };

    utterance.onend = () => {
      stopSpeakingUI();
    };

    utterance.onerror = () => {
      stopSpeakingUI();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeakingUI() {
    state.isSpeakingStory = false;
    state.currentSpeechUtterance = null;
    elements.btnReadStory.classList.remove('bg-pink-600', 'animate-pulse');
    elements.ttsIcon.className = "fa-solid fa-volume-high text-yellow-300";
    elements.ttsLabel.textContent = "🔊 Read Story to Me!";
    elements.btnStopTts.classList.add('hidden');
    elements.storyResultCard.classList.remove('ring-4', 'ring-pink-300/60');
  }

  // =========================================================================
  // 5. STAGE 4A: POLAROID MEMORY WALL (8 CUSTOM SLOTS) & LIGHTBOX
  // =========================================================================
  const TILT_CLASSES = [
    'rotate-1',
    '-rotate-2',
    'rotate-2',
    '-rotate-1',
    'rotate-1',
    '-rotate-2',
    'rotate-2',
    '-rotate-1'
  ];

  const WASHI_CLASSES = [
    'washi-tape-yellow',
    'washi-tape-pink',
    'washi-tape-mint',
    'washi-tape-lavender',
    'washi-tape-sky',
    'washi-tape-peach',
    'washi-tape-pink',
    'washi-tape-gold'
  ];

  function renderPolaroidWall() {
    if (!elements.polaroidGrid) return;
    elements.polaroidGrid.innerHTML = '';

    const photos = CONFIG.photos || [];
    photos.forEach((photo, idx) => {
      const tilt = TILT_CLASSES[idx % TILT_CLASSES.length];
      const washi = WASHI_CLASSES[idx % WASHI_CLASSES.length];
      const card = document.createElement('div');
      card.className = `polaroid-card rounded-2xl p-2.5 pb-3 sm:p-3.5 sm:pb-4 ${tilt} flex flex-col justify-between group shadow-md hover:shadow-xl transition-all duration-300`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View photo ${idx + 1}: ${photo.caption}`);

      const filename = photo.url.split('/').pop();

      card.innerHTML = `
        <div class="washi-tape ${washi}"></div>
        <div class="polaroid-photo-wrapper relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 shadow-inner group-hover:shadow-md transition-shadow flex items-center justify-center">
          
          <!-- Pastel Camera Placeholder (Neat fallback while loading or if missing) -->
          <div class="photo-fallback pastel-photo-placeholder absolute inset-0 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center mb-1 text-pink-500 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-camera-retro text-base sm:text-xl"></i>
            </div>
            <span class="text-[11px] sm:text-xs font-fredoka font-bold text-purple-900 leading-tight">Photo #${idx + 1}</span>
            <span class="text-[9px] sm:text-[10px] font-medium text-pink-600 font-mono mt-0.5 truncate max-w-[90%]">${filename}</span>
          </div>

          <!-- Real Image with graceful fallback: object-cover object-top prevents cropping faces -->
          <img src="${photo.url}" alt="${photo.caption}" class="photo-img absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 opacity-0" loading="lazy">

          <!-- Hover Overlay with Magnifying Glass -->
          <div class="absolute inset-0 bg-pink-500/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-pink-600 flex items-center justify-center shadow-lg text-xs sm:text-sm font-bold transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <i class="fa-solid fa-magnifying-glass-plus"></i>
            </span>
          </div>
        </div>

        <div class="mt-2.5 text-center">
          <p class="font-handwriting text-lg sm:text-xl md:text-2xl text-purple-950 font-bold leading-tight line-clamp-2">
            ${photo.caption}
          </p>
          <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] uppercase tracking-wider">
            ${photo.tag || photo.date || `Memory #${idx + 1}`}
          </span>
        </div>
      `;

      // Handle image load and error gracefully
      const img = card.querySelector('.photo-img');
      const fallback = card.querySelector('.photo-fallback');

      img.onload = () => {
        img.classList.remove('opacity-0');
        fallback.style.display = 'none';
      };

      img.onerror = () => {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      };

      // Open Lightbox on click / Enter
      const triggerOpen = () => openPolaroidLightbox(idx);
      card.addEventListener('click', triggerOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });

      elements.polaroidGrid.appendChild(card);
    });
  }

  // Open Full-Screen Lightbox Modal
  function openPolaroidLightbox(photoIdx) {
    const photos = CONFIG.photos || [];
    if (!photos.length) return;

    state.currentPhotoIndex = (photoIdx >= 0 && photoIdx < photos.length) ? photoIdx : 0;

    window.soundEngine.playSparkleChime();
    launchLightboxSparkles();
    updateModalContent();

    elements.polaroidModal.classList.remove('hidden');
    elements.polaroidModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  // Update Lightbox Modal Content
  function updateModalContent() {
    const photos = CONFIG.photos || [];
    const photo = photos[state.currentPhotoIndex];
    if (!photo) return;

    const filename = photo.url.split('/').pop();

    if (elements.modalCounter) {
      elements.modalCounter.innerHTML = `<i class="fa-solid fa-sparkles text-amber-500"></i> Photo ${state.currentPhotoIndex + 1} of ${photos.length}`;
    }

    if (elements.modalCaption) {
      elements.modalCaption.textContent = photo.caption;
    }

    if (elements.modalDate) {
      elements.modalDate.textContent = photo.tag || photo.date || `Memory #${state.currentPhotoIndex + 1}`;
    }

    if (elements.modalFallbackTitle) {
      elements.modalFallbackTitle.textContent = `Photo Slot #${state.currentPhotoIndex + 1}`;
    }

    if (elements.modalFallbackFilename) {
      elements.modalFallbackFilename.textContent = filename;
    }

    // Reset image and fallback state
    elements.modalImg.classList.add('opacity-0');
    if (elements.modalFallback) {
      elements.modalFallback.classList.remove('hidden');
      elements.modalFallback.classList.add('flex');
    }

    // Assign image source
    elements.modalImg.onload = () => {
      elements.modalImg.style.display = 'block';
      elements.modalImg.classList.remove('opacity-0', 'hidden');
      if (elements.modalFallback) {
        elements.modalFallback.classList.add('hidden');
        elements.modalFallback.classList.remove('flex');
      }
    };

    elements.modalImg.onerror = () => {
      elements.modalImg.style.display = 'none';
      elements.modalImg.classList.add('hidden');
      if (elements.modalFallback) {
        elements.modalFallback.classList.remove('hidden');
        elements.modalFallback.classList.add('flex');
      }
    };

    elements.modalImg.src = photo.url;
    elements.modalImg.alt = photo.caption;

    renderModalDots();
  }

  // Navigate to Next Photo
  function nextPhoto() {
    const photos = CONFIG.photos || [];
    if (!photos.length) return;
    state.currentPhotoIndex = (state.currentPhotoIndex + 1) % photos.length;
    window.soundEngine.playTap();
    triggerMiniSparkle();
    updateModalContent();
  }

  // Navigate to Previous Photo
  function prevPhoto() {
    const photos = CONFIG.photos || [];
    if (!photos.length) return;
    state.currentPhotoIndex = (state.currentPhotoIndex - 1 + photos.length) % photos.length;
    window.soundEngine.playTap();
    triggerMiniSparkle();
    updateModalContent();
  }

  // Close Lightbox Modal
  function closePolaroidLightbox() {
    elements.polaroidModal.classList.add('hidden');
    elements.polaroidModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  // Sparkle/Confetti burst around modal frame
  function launchLightboxSparkles() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: 0.35, y: 0.5 },
      colors: ['#FF69B4', '#C084FC', '#FDE047', '#38BDF8', '#FFFFFF'],
      shapes: ['star', 'circle'],
      ticks: 100
    });

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: 0.65, y: 0.5 },
      colors: ['#FF69B4', '#C084FC', '#FDE047', '#38BDF8', '#FFFFFF'],
      shapes: ['star', 'circle'],
      ticks: 100
    });
  }

  function triggerMiniSparkle() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#FDE047', '#FF69B4', '#C084FC'],
      ticks: 60
    });
  }

  // Render clickable dots for each photo inside lightbox
  function renderModalDots() {
    if (!elements.modalDots) return;
    const photos = CONFIG.photos || [];
    elements.modalDots.innerHTML = '';
    photos.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
        idx === state.currentPhotoIndex
          ? 'bg-pink-500 scale-125 ring-2 ring-pink-300'
          : 'bg-purple-200 hover:bg-purple-300'
      }`;
      dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        state.currentPhotoIndex = idx;
        window.soundEngine.playTap();
        triggerMiniSparkle();
        updateModalContent();
      });
      elements.modalDots.appendChild(dot);
    });
  }

  // =========================================================================
  // 6. STAGE 4B: MAMAYYA'S MYSTERY GIFT BOX & FLOATING HUGS
  // =========================================================================
  function renderGiftLetter() {
    const letter = CONFIG.mamayyaLetter || {};
    if (elements.letterBadge && letter.badge) elements.letterBadge.textContent = letter.badge;
    if (elements.letterTitle && letter.title) elements.letterTitle.textContent = letter.title;

    if (elements.letterParagraphs && letter.paragraphs) {
      elements.letterParagraphs.innerHTML = letter.paragraphs.map(p => `
        <p>${p.replace(/\[NIECE_NAME\]/g, CONFIG.nieceName).replace(/Nikki/g, CONFIG.nieceName)}</p>
      `).join('');
    }

    if (elements.letterSignoff && letter.signOff) elements.letterSignoff.textContent = letter.signOff;
    if (elements.letterSender && letter.senderName) elements.letterSender.textContent = letter.senderName;
  }

  // Handle tap on gift box
  function handleGiftBoxTap() {
    if (state.isGiftOpened) return;

    state.giftTapsLeft--;
    elements.giftTapsLeft.textContent = state.giftTapsLeft;

    // Trigger box wiggle animation & sound
    elements.giftBoxElem.classList.remove('gift-box-wiggle');
    void elements.giftBoxElem.offsetWidth; // trigger reflow
    elements.giftBoxElem.classList.add('gift-box-wiggle');

    window.soundEngine.playGiftWiggle();

    // Sparkles on tap
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#FDE047', '#FF69B4', '#C084FC']
      });
    }

    if (state.giftTapsLeft === 2) {
      elements.giftTapBadge.innerHTML = `<i class="fa-solid fa-sparkles text-yellow-300"></i> <span>Almost there! Tap 2 more times!</span>`;
    } else if (state.giftTapsLeft === 1) {
      elements.giftTapBadge.innerHTML = `<i class="fa-solid fa-wand-magic text-yellow-300"></i> <span>Just 1 MORE TAP!</span>`;
      elements.giftTapBadge.classList.add('animate-ping');
      setTimeout(() => elements.giftTapBadge.classList.remove('animate-ping'), 600);
    } else if (state.giftTapsLeft <= 0) {
      openGiftBoxSurprise();
    }
  }

  // Open mystery gift box with lid fly-off, golden confetti, and fanfare
  function openGiftBoxSurprise() {
    state.isGiftOpened = true;

    // Lid fly-off animation
    elements.giftLid.classList.add('gift-lid-open');
    elements.giftTapBadge.classList.add('hidden');

    // Audio fanfare
    window.soundEngine.playGiftFanfare();

    // Golden & rainbow confetti shower
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#C084FC', '#38BDF8']
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          shapes: ['star', 'circle'],
          spread: 140,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFF', '#F43F5E']
        });
      }, 400);
    }

    // Reveal personal letter card
    setTimeout(() => {
      elements.giftBoxWrapper.classList.add('hidden');
      elements.giftRevealedCard.classList.remove('hidden');
      elements.giftRevealedCard.classList.add('animate-in', 'fade-in', 'zoom-in-95', 'duration-500');

      // Scroll smoothly to reveal letter
      elements.giftRevealedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  }

  // "Send a Hug to Mamayya" Floating Hearts Explosion
  function sendHugToMamayya() {
    window.soundEngine.playHeartChime();

    // Spawn 40 floating pastel hearts across the screen
    const heartEmojis = ['💖', '💕', '🥰', '🤗', '✨', '🌸', '💝', '⭐'];
    const totalHearts = 40;

    for (let i = 0; i < totalHearts; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        const startX = Math.random() * window.innerWidth;
        const driftX = (Math.random() * 200 - 100) + 'px';
        const rot = (Math.random() * 60 - 30) + 'deg';
        const size = Math.random() * 1.5 + 1.2;

        heart.className = 'floating-heart text-2xl select-none';
        heart.textContent = emoji;
        heart.style.left = `${startX}px`;
        heart.style.bottom = '20px';
        heart.style.setProperty('--rand-x', driftX);
        heart.style.setProperty('--rand-rot', rot);
        heart.style.fontSize = `${size}rem`;

        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 3300);
      }, i * 50);
    }

    // Visual button feedback
    elements.btnSendHug.innerHTML = `<span>❤️ Hug Delivered to Mamayya!</span>`;
    elements.btnSendHug.classList.add('bg-green-500');

    setTimeout(() => {
      elements.btnSendHug.innerHTML = `<span class="text-xl animate-bounce">🤗</span> <span>Send Another Hug!</span>`;
      elements.btnSendHug.classList.remove('bg-green-500');
    }, 3000);
  }

  // =========================================================================
  // 7. EVENT LISTENERS & MODAL MANAGEMENT
  // =========================================================================
  function setupEventListeners() {
    // Stage 1 Candle Blow controls
    elements.btnStartMic.addEventListener('click', startMicrophoneListening);
    elements.btnTapFlame.addEventListener('click', blowOutCandle);
    elements.candleFlame.addEventListener('click', blowOutCandle);

    // BGM toggle
    elements.btnToggleMusic.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleBackgroundMusic();
      if (isPlaying) {
        elements.musicLabel.textContent = "Music: On";
        elements.musicIcon.className = "fa-solid fa-music text-pink-500";
        elements.eqBars.classList.remove('hidden');
      } else {
        elements.musicLabel.textContent = "Music: Off";
        elements.musicIcon.className = "fa-solid fa-volume-xmark text-gray-400";
        elements.eqBars.classList.add('hidden');
      }
    });

    // Spawn more balloons button
    elements.btnSpawnBalloons.addEventListener('click', () => {
      window.soundEngine.playTap();
      for (let i = 0; i < 4; i++) {
        setTimeout(spawnSingleBalloon, i * 200);
      }
    });

    // Story Generation & TTS
    elements.btnGenerateStory.addEventListener('click', generateMagicalStory);
    elements.btnReadStory.addEventListener('click', readStoryAloud);
    elements.btnStopTts.addEventListener('click', () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stopSpeakingUI();
    });

    // Polaroid Lightbox Navigation & Close
    if (elements.btnCloseModal) {
      elements.btnCloseModal.addEventListener('click', closePolaroidLightbox);
    }

    if (elements.polaroidModal) {
      elements.polaroidModal.addEventListener('click', (e) => {
        if (e.target === elements.polaroidModal) closePolaroidLightbox();
      });
    }

    if (elements.btnNextPhoto) {
      elements.btnNextPhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        nextPhoto();
      });
    }

    if (elements.btnPrevPhoto) {
      elements.btnPrevPhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        prevPhoto();
      });
    }

    // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', (e) => {
      if (elements.polaroidModal && !elements.polaroidModal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextPhoto();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevPhoto();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closePolaroidLightbox();
        }
      }
    });

    // Touch swipe navigation for mobile screens on lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    if (elements.polaroidModal) {
      elements.polaroidModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      elements.polaroidModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (diff > 45) {
          prevPhoto();
        } else if (diff < -45) {
          nextPhoto();
        }
      }, { passive: true });
    }

    // Mobile Gallery Layout Switcher (2-Col Grid vs Swipe Carousel)
    if (elements.btnGalleryGrid && elements.btnGalleryCarousel) {
      elements.btnGalleryGrid.addEventListener('click', () => {
        state.isGalleryCarouselMode = false;
        elements.polaroidGrid.classList.remove('polaroid-carousel-mode');
        elements.btnGalleryGrid.classList.add('bg-purple-600', 'text-white');
        elements.btnGalleryGrid.classList.remove('bg-purple-50', 'text-purple-700');
        elements.btnGalleryCarousel.classList.remove('bg-purple-600', 'text-white');
        elements.btnGalleryCarousel.classList.add('bg-purple-50', 'text-purple-700');
      });

      elements.btnGalleryCarousel.addEventListener('click', () => {
        state.isGalleryCarouselMode = true;
        elements.polaroidGrid.classList.add('polaroid-carousel-mode');
        elements.btnGalleryCarousel.classList.add('bg-purple-600', 'text-white');
        elements.btnGalleryCarousel.classList.remove('bg-purple-50', 'text-purple-700');
        elements.btnGalleryGrid.classList.remove('bg-purple-600', 'text-white');
        elements.btnGalleryGrid.classList.add('bg-purple-50', 'text-purple-700');
      });
    }

    // Gift Box Interaction
    elements.giftBoxWrapper.addEventListener('click', handleGiftBoxTap);
    elements.btnSendHug.addEventListener('click', sendHugToMamayya);

    // Quick Settings Modal
    elements.btnOpenSettings.addEventListener('click', openSettingsModal);
    elements.btnCloseSettings.addEventListener('click', closeSettingsModal);
    elements.btnCancelSettings.addEventListener('click', closeSettingsModal);
    elements.settingsForm.addEventListener('submit', handleSettingsSubmit);
  }

  function openSettingsModal() {
    window.soundEngine.playTap();
    elements.inputName.value = CONFIG.nieceName;
    elements.inputAge.value = CONFIG.age;
    elements.inputSender.value = CONFIG.senderTitle;
    elements.inputGeminiKey.value = CONFIG.geminiApiKey || '';

    elements.settingsModal.classList.remove('hidden');
    elements.settingsModal.classList.add('flex');
  }

  function closeSettingsModal() {
    elements.settingsModal.classList.add('hidden');
    elements.settingsModal.classList.remove('flex');
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    const newName = elements.inputName.value.trim();
    const newAge = parseInt(elements.inputAge.value, 10);
    const newSender = elements.inputSender.value.trim();
    const newKey = elements.inputGeminiKey.value.trim();

    if (newName) CONFIG.nieceName = newName;
    if (newAge) CONFIG.age = newAge;
    if (newSender) CONFIG.senderTitle = newSender;
    CONFIG.geminiApiKey = newKey;

    updateDynamicTexts();
    renderGiftLetter();
    closeSettingsModal();

    window.soundEngine.playSparkleChime();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  }

  // =========================================================================
  // 8. CUSTOM FAIRY-WAND CURSOR, SPARKLE DUST TRAIL & TAP BURSTS
  // =========================================================================
  function initMagicalCursor() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = ('ontouchstart' in window) && !window.matchMedia('(pointer: fine)').matches;

    // 1. Create Floating Glowing Follower Ring for Mouse Users
    let follower = document.getElementById('magic-cursor-follower');
    if (!follower && !isTouchOnly) {
      follower = document.createElement('div');
      follower.id = 'magic-cursor-follower';
      document.body.appendChild(follower);
    }

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;
    let activeTrailCount = 0;
    const MAX_TRAIL_PARTICLES = 36;
    let lastTrailX = 0;
    let lastTrailY = 0;
    let lastTrailTime = 0;

    // Smooth inertia render loop for follower
    function renderFollower() {
      if (follower && isVisible) {
        followerX += (mouseX - followerX) * 0.22;
        followerY += (mouseY - followerY) * 0.22;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }
      requestAnimationFrame(renderFollower);
    }
    if (follower) {
      requestAnimationFrame(renderFollower);
    }

    // 2. Track Mouse Movement & Spawn Fairy Dust Sparkle Trail
    const trailSymbols = ['✨', '⭐', '🌟', '💖', '💫', '🌸'];
    const trailColors = ['#FF69B4', '#FBBF24', '#C084FC', '#38BDF8', '#34D399', '#FB7185'];

    function spawnTrailSparkle(x, y) {
      if (prefersReducedMotion || activeTrailCount >= MAX_TRAIL_PARTICLES) return;

      activeTrailCount++;
      const p = document.createElement('div');
      const isDot = Math.random() > 0.5;

      if (isDot) {
        p.className = 'fairy-trail-particle trail-dot';
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];
        p.style.backgroundColor = color;
        p.style.color = color;
      } else {
        p.className = 'fairy-trail-particle';
        p.textContent = trailSymbols[Math.floor(Math.random() * trailSymbols.length)];
        p.style.fontSize = `${11 + Math.floor(Math.random() * 8)}px`;
      }

      // Small jitter around cursor tip
      p.style.left = `${x + (Math.random() * 12 - 6)}px`;
      p.style.top = `${y + (Math.random() * 12 - 6)}px`;

      const driftX = (Math.random() - 0.5) * 28;
      const driftY = Math.random() * 22 + 16;
      const rot = (Math.random() - 0.5) * 360;

      p.style.setProperty('--drift-x', `${driftX}px`);
      p.style.setProperty('--drift-y', `${driftY}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(p);

      const cleanup = () => {
        if (p.parentNode) {
          p.remove();
          activeTrailCount = Math.max(0, activeTrailCount - 1);
        }
      };

      p.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, 700);
    }

    // Mousemove handler for desktop
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (follower) {
        if (!isVisible) {
          isVisible = true;
          follower.style.opacity = '1';
        }
      }

      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastTrailX, e.clientY - lastTrailY);

      if (dist > 14 && (now - lastTrailTime) > 32) {
        spawnTrailSparkle(e.clientX, e.clientY);
        lastTrailX = e.clientX;
        lastTrailY = e.clientY;
        lastTrailTime = now;
      }
    }, { passive: true });

    // Handle mouse leaving / entering window
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      if (follower) follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (follower) {
        isVisible = true;
        follower.style.opacity = '1';
      }
    });

    // 3. Hover state for clickable elements: enlarge and golden/pink glow
    const clickableSelector = 'button, a, input, select, textarea, [role="button"], .polaroid-card, .balloon-item, .glass-pill, .shimmer-btn, [tabindex="0"]';
    
    document.addEventListener('mouseover', (e) => {
      if (follower && e.target.closest && e.target.closest(clickableSelector)) {
        follower.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (follower && e.target.closest && e.target.closest(clickableSelector)) {
        follower.classList.remove('cursor-hover');
      }
    });

    // 4. Touch & Click Radial Burst (Mobile + Desktop)
    const burstSymbols = ['✨', '⭐', '💖', '🌟', '🎉', '🌸', '💫'];
    const burstColors = ['#FF69B4', '#FBBF24', '#A855F7', '#38BDF8', '#34D399', '#FB7185', '#F59E0B'];

    function createTapBurst(x, y) {
      if (prefersReducedMotion) return;

      // Expanding tactile ripple ring
      const ripple = document.createElement('div');
      ripple.className = 'magic-touch-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      // 6-8 radial burst particles exploding outward
      const particleCount = 7;
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        const isDot = Math.random() > 0.45;
        const color = burstColors[i % burstColors.length];
        const angle = (i / particleCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const dist = 32 + Math.random() * 38;
        const bx = Math.cos(angle) * dist;
        const by = Math.sin(angle) * dist + (Math.random() * 8 - 4);
        const rot = (Math.random() - 0.5) * 360;

        if (isDot) {
          p.className = 'magic-burst-particle burst-dot';
          p.style.backgroundColor = color;
          p.style.color = color;
        } else {
          p.className = 'magic-burst-particle';
          p.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
          p.style.fontSize = `${12 + Math.floor(Math.random() * 8)}px`;
        }

        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--burst-x', `${bx}px`);
        p.style.setProperty('--burst-y', `${by}px`);
        p.style.setProperty('--burst-rot', `${rot}deg`);

        document.body.appendChild(p);

        const cleanup = () => { if (p.parentNode) p.remove(); };
        p.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 650);
      }
    }

    // Universal Pointerdown listener for both click and mobile touch
    window.addEventListener('pointerdown', (e) => {
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      if (e.clientX === 0 && e.clientY === 0) return;

      createTapBurst(e.clientX, e.clientY);
    }, { passive: true });

    // Hide follower immediately if touch interaction begins
    window.addEventListener('touchstart', () => {
      if (follower) {
        follower.style.display = 'none';
        isVisible = false;
      }
    }, { passive: true, once: true });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
