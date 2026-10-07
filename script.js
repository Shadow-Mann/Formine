/**
 * Happy Birthday, Rosita!
 * Interactive Birthday Experience
 */

(function () {
  'use strict';

  // --- Content Configuration ---
  const LETTER_HTML = `
    <p>Dear Rosita,</p>
    <p>Happy Birthday! 🎂✨</p>
    <p>On your special day, I wanted to take a moment to celebrate how truly wonderful you are. Your laugh brings warmth into any room, your kindness never goes unnoticed, and having you around makes everyday moments feel memorable and bright.</p>
    <p>Thank you for being someone so genuine, inspiring, and full of life. May this new year bring you endless reasons to smile, beautiful adventures, big dreams fulfilled, and all the peace and joy your heart can hold.</p>
    <p class="sign">With love & warmest wishes, <span class="signature-heart">💜</span></p>
  `;

  const REASONS = [
    { icon: '🌸', title: 'Your Kindness', text: 'The natural, effortless way you care for people and make everyone feel valued.' },
    { icon: '✨', title: 'Your Laugh', text: 'Completely contagious and bright enough to turn any difficult day right around.' },
    { icon: '🌿', title: 'Your Strength', text: 'How gracefully you handle life and always remain true to who you are.' },
    { icon: '☀️', title: 'Your Energy', text: 'The positive, vibrant warmth you bring into every conversation and space.' },
    { icon: '💫', title: 'The Comfort', text: 'How natural and effortless it is to talk to you about anything without pretending.' },
    { icon: '💜', title: 'Simply You', text: 'Because in a world full of copies, you are genuinely, wonderfully one of a kind.' }
  ];

  const PHOTO_CAPTION = 'Friends forever & always 🐾💜';
  const GIFT_NOTE = 'Rosita, every moment with you is a gift in itself. Here is a special birthday video just for you ✨';
  const VIDEO_EMBED_URL = 'https://drive.google.com/file/d/1UjnPYfv5KL8cjs1rrig2ptfaoLPbMRCm/preview';

  // --- DOM Elements ---
  const countdownEl = document.getElementById('countdown');
  const cdNumberEl = document.getElementById('cd-number');
  const canvas = document.getElementById('confetti');
  const tuneBtn = document.getElementById('tune');
  const cake = document.getElementById('cake');
  const blowBtn = document.getElementById('blow');
  const relightBtn = document.getElementById('relight');
  const heroTitle = document.getElementById('hero-title');
  const heroSub = document.getElementById('hero-sub');
  const letterSection = document.getElementById('letter-section');
  const letterEl = document.getElementById('letter');
  const reasonsSection = document.getElementById('reasons-section');
  const cardsContainer = document.getElementById('cards');
  const photoSection = document.getElementById('photo-section');
  const photoCaption = document.getElementById('photo-caption');
  const giftSection = document.getElementById('gift-section');
  const giftBtn = document.getElementById('gift');
  const giftNote = document.getElementById('gift-note');
  const videoCard = document.getElementById('video-card');
  const videoFrame = document.getElementById('video-frame');
  const foot = document.getElementById('foot');
  const floatLayer = document.getElementById('float-layer');

  // --- Initialize Static Content ---
  if (letterEl) letterEl.innerHTML = LETTER_HTML;
  if (photoCaption) photoCaption.textContent = PHOTO_CAPTION;

  // Render Reason Cards
  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    REASONS.forEach((reason) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.setAttribute('aria-pressed', 'false');
      card.innerHTML = `
        <div class="card-inner">
          <div class="face front">
            <span class="card-icon">${reason.icon}</span>
            <span>${reason.title}</span>
          </div>
          <div class="face back">
            <p>${reason.text}</p>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        const isFlipped = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
        burstConfetti(12, card.getBoundingClientRect());
      });
      cardsContainer.appendChild(card);
    });
  }

  // --- Confetti Canvas System ---
  let ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let confettiAnimId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const CONFETTI_COLORS = [
    '#7a3fe0', '#9855f0', '#ff9a4d', '#ffd84d', '#5fcfc0', '#ff7eb6', '#ffffff'
  ];

  function burstConfetti(count = 50, rect = null) {
    if (!canvas) return;
    const startX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const startY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        gravity: 0.22,
        alpha: 1,
        life: 0.985
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.vRot;
      p.alpha *= p.life;

      if (p.y > canvas.height + 20 || p.alpha <= 0.02) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (particles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
    }
  }

  // --- Countdown Controller ---
  let countdownVal = 3;
  let countdownTimer = null;

  function endCountdown() {
    if (!countdownEl || countdownEl.classList.contains('done')) return;
    clearInterval(countdownTimer);
    countdownEl.classList.add('done');
    document.body.classList.remove('locked');
    burstConfetti(60);
    initFloatingHearts();
  }

  if (countdownEl) {
    countdownEl.addEventListener('click', endCountdown);
    countdownTimer = setInterval(() => {
      countdownVal--;
      if (countdownVal > 0) {
        if (cdNumberEl) {
          cdNumberEl.textContent = countdownVal;
          cdNumberEl.classList.remove('pop');
          void cdNumberEl.offsetWidth; // Reflow for animation restart
          cdNumberEl.classList.add('pop');
        }
      } else if (countdownVal === 0) {
        if (cdNumberEl) {
          cdNumberEl.textContent = '🎉';
          cdNumberEl.classList.remove('pop');
          void cdNumberEl.offsetWidth;
          cdNumberEl.classList.add('pop');
        }
      } else {
        endCountdown();
      }
    }, 1000);
  }

  // --- Reveal Sections on Scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('seen');
        }
      });
    },
    { threshold: 0.15 }
  );

  function unhideAllScenes() {
    [letterSection, reasonsSection, photoSection, giftSection, foot].forEach((el) => {
      if (el) {
        el.hidden = false;
        observer.observe(el);
      }
    });
  }

  // --- Cake & Candles Action ---
  let candlesBlown = false;

  function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    if (cake) {
      cake.classList.remove('lit');
      cake.classList.add('out');
    }

    if (heroTitle) heroTitle.textContent = 'Happy Birthday, Rosita! 🎂🎉';
    if (heroSub) heroSub.textContent = 'May all your wishes, dreams, and hopes come true today and always ✨';

    if (blowBtn) blowBtn.hidden = true;
    if (relightBtn) relightBtn.hidden = false;

    // Celebration Confetti burst
    burstConfetti(120);
    setTimeout(() => burstConfetti(80), 350);
    setTimeout(() => burstConfetti(60), 700);

    // Unhide the story & gifts
    unhideAllScenes();

    // Smooth scroll down to letter after a moment to enjoy the cake
    setTimeout(() => {
      if (letterSection) {
        letterSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1800);
  }

  function relightCandles() {
    candlesBlown = false;
    if (cake) {
      cake.classList.remove('out');
      cake.classList.add('lit');
    }
    if (heroTitle) heroTitle.textContent = 'Make a wish, Rosita';
    if (heroSub) heroSub.textContent = 'Think of something wonderful, then blow out the candles.';
    if (blowBtn) blowBtn.hidden = false;
    if (relightBtn) relightBtn.hidden = true;
  }

  if (blowBtn) blowBtn.addEventListener('click', blowCandles);
  if (cake) cake.addEventListener('click', () => {
    if (!candlesBlown) blowCandles();
  });
  if (relightBtn) relightBtn.addEventListener('click', relightCandles);

  // --- Gift Box Controller ---
  let giftOpened = false;

  if (giftBtn) {
    giftBtn.addEventListener('click', () => {
      if (!giftOpened) {
        giftOpened = true;
        giftBtn.classList.add('open');
        giftBtn.setAttribute('aria-expanded', 'true');

        burstConfetti(100, giftBtn.getBoundingClientRect());
        setTimeout(() => burstConfetti(70), 300);

        if (giftNote) {
          giftNote.textContent = GIFT_NOTE;
          giftNote.classList.add('show');
        }

        if (videoCard) {
          videoCard.hidden = false;
          if (videoFrame && !videoFrame.src) {
            videoFrame.src = VIDEO_EMBED_URL;
          }
          setTimeout(() => {
            videoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 350);
        }
      }
    });
  }

  // --- Ambient Floating Elements ---
  function initFloatingHearts() {
    if (!floatLayer) return;
    const symbols = ['♡', '✨', '⭐', '🎈'];
    setInterval(() => {
      const span = document.createElement('span');
      span.className = 'float-heart';
      span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      span.style.left = Math.random() * 95 + '%';
      span.style.fontSize = Math.random() * 1.5 + 1.2 + 'rem';
      span.style.animationDuration = Math.random() * 6 + 7 + 's';
      span.style.opacity = Math.random() * 0.4 + 0.2;
      floatLayer.appendChild(span);

      setTimeout(() => {
        span.remove();
      }, 14000);
    }, 1800);
  }

  // --- Sweet Synth Happy Birthday Melody (Web Audio API) ---
  let audioCtx = null;
  let isPlayingTune = false;
  let tuneTimeout = null;

  // Notes and frequencies for Happy Birthday:
  // G4, G4, A4, G4, C5, B4
  // G4, G4, A4, G4, D5, C5
  // G4, G4, G5, E5, C5, B4, A4
  // F5, F5, E5, C5, D5, C5
  const NOTES = {
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99
  };

  const MELODY = [
    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.A4, dur: 0.7, pause: 0.1 },
    { note: NOTES.G4, dur: 0.7, pause: 0.1 },
    { note: NOTES.C5, dur: 0.7, pause: 0.1 },
    { note: NOTES.B4, dur: 1.2, pause: 0.3 },

    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.A4, dur: 0.7, pause: 0.1 },
    { note: NOTES.G4, dur: 0.7, pause: 0.1 },
    { note: NOTES.D5, dur: 0.7, pause: 0.1 },
    { note: NOTES.C5, dur: 1.2, pause: 0.3 },

    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.G4, dur: 0.35, pause: 0.1 },
    { note: NOTES.G5, dur: 0.7, pause: 0.1 },
    { note: NOTES.E5, dur: 0.7, pause: 0.1 },
    { note: NOTES.C5, dur: 0.7, pause: 0.1 },
    { note: NOTES.B4, dur: 0.7, pause: 0.1 },
    { note: NOTES.A4, dur: 1.2, pause: 0.3 },

    { note: NOTES.F5, dur: 0.35, pause: 0.1 },
    { note: NOTES.F5, dur: 0.35, pause: 0.1 },
    { note: NOTES.E5, dur: 0.7, pause: 0.1 },
    { note: NOTES.C5, dur: 0.7, pause: 0.1 },
    { note: NOTES.D5, dur: 0.7, pause: 0.1 },
    { note: NOTES.C5, dur: 1.5, pause: 0.8 }
  ];

  function playTone(freq, duration, startTime) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Use warm sine/triangle blend for music-box feel
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function playBirthdaySong() {
    if (!isPlayingTune || !audioCtx) return;

    let time = audioCtx.currentTime + 0.1;
    let totalLength = 0;

    MELODY.forEach((item) => {
      playTone(item.note, item.dur, time);
      const step = item.dur + item.pause;
      time += step;
      totalLength += step;
    });

    tuneTimeout = setTimeout(() => {
      if (isPlayingTune) {
        playBirthdaySong();
      }
    }, totalLength * 1000);
  }

  function toggleTune() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingTune = !isPlayingTune;

    if (tuneBtn) {
      tuneBtn.setAttribute('aria-pressed', isPlayingTune ? 'true' : 'false');
      tuneBtn.textContent = isPlayingTune ? 'Pause tune ♫' : 'Play a tune ♫';
    }

    if (isPlayingTune) {
      burstConfetti(25);
      playBirthdaySong();
    } else {
      if (tuneTimeout) clearTimeout(tuneTimeout);
    }
  }

  if (tuneBtn) tuneBtn.addEventListener('click', toggleTune);

})();
