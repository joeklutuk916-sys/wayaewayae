/* ============================================================
   KONFIGURASI
============================================================ */
const CONFIG = {
  EVENT_DATE: new Date('2026-10-24T19:00:00+07:00'), // <--- SUDAH DIPERBAIKI
  VOLUME: 0.5, 
  FADE_IN_MS: 2000, 
};

/* ============================================================
   UTIL
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const state = {
  isPlaying: false,
  countdownTimer: null,
};

/* ============================================================
   1. GUEST NAME dari URL ?to=Nama
============================================================ */
function setGuestName() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const el = $('#guestName');
  if (!el) return;
  if (to && to.trim() !== '') {
    el.textContent = decodeURIComponent(to.trim().replace(/\+/g, ' '));
  } else {
    el.textContent = 'Sahabat Ngopi';
  }
}

/* ============================================================
   2. LOADING SCREEN
============================================================ */
function initLoader() {
  const loader = $('#loader');

  const finishLoader = () => {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    setTimeout(() => loader.remove(), 900);
    animateHeroTitle();
  };

  setTimeout(finishLoader, 2600);
}

/* ============================================================
   3. HERO TITLE
============================================================ */
function animateHeroTitle() {
  const el = $('#heroTitle');
  if (!el) return;
  const text = el.getAttribute('data-text') || el.textContent;
  el.textContent = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * 0.045}s`;
    el.appendChild(span);
  });
}

/* ============================================================
   4. FLOATING COFFEE BEANS
============================================================ */
function initBeans() {
  const container = $('#beans');
  if (!container) return;
  const emojis = ['☕', '🫘', '🌿', '🍂', '🤎'];
  const count = window.innerWidth < 720 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    const bean = document.createElement('span');
    bean.className = 'bean';
    bean.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    bean.style.left = `${Math.random() * 100}%`;
    bean.style.top = `${Math.random() * 100}%`;
    bean.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
    bean.style.opacity = `${0.15 + Math.random() * 0.3}`;
    bean.style.animationDuration = `${8 + Math.random() * 10}s`;
    bean.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(bean);
  }
}

/* ============================================================
   5. HERO PARALLAX
============================================================ */
function initParallax() {
  const bg = $('#heroBg');
  if (!bg) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        bg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.05)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ============================================================
   6. SCROLL PROGRESS BAR
============================================================ */
function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
      ticking = false;
    });
  }, { passive: true });
}

/* ============================================================
   7. RIPPLE EFFECT
============================================================ */
function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

/* ============================================================
   8. MUSIC PLAYER
============================================================ */
function initMusic() {
  const audio = $('#bgm');
  const btn = $('#musicBtn');
  if (!audio || !btn) return;
  audio.volume = 0;

  audio.addEventListener('error', () => {
    console.error('Gagal memuat kopi.mp3');
    alert('Gagal memuat musik!\n\n1. Pastikan file "kopi.mp3" ada di folder yang sama.\n2. Jika buka lewat File Manager, Chrome memblokir musik. Gunakan Live Server atau Hosting (Netlify).');
  });

  const fadeIn = (target = CONFIG.VOLUME, duration = CONFIG.FADE_IN_MS) => {
    audio.volume = 0;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      audio.volume = p * target;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const play = async () => {
    try {
      await audio.play();
      state.isPlaying = true;
      btn.classList.add('playing');
      fadeIn();
      console.log('✅ Musik berhasil diputar');
    } catch (err) {
      console.error('Musik gagal diputar:', err);
    }
  };

  const pause = () => {
    audio.pause();
    state.isPlaying = false;
    btn.classList.remove('playing');
  };

  btn.addEventListener('click', () => {
    if (state.isPlaying) pause();
    else play();
  });

  window.__playMusic = play;
}

/* ============================================================
   9. OPEN UNDANGAN
============================================================ */
function initOpenButton() {
  const btn = $('#openBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (window.__playMusic) await window.__playMusic();

    if (window.confetti) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#C8A27A', '#6F4E37', '#7A8B5C', '#F5EFE6'],
      });
    }

    const target = $('#details');
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  });
}

/* ============================================================
   10. COUNTDOWN TIMER
============================================================ */
function initCountdown() {
  const els = {
    d: $('#cdDays'),
    h: $('#cdHours'),
    m: $('#cdMins'),
    s: $('#cdSecs'),
  };
  if (!els.d) return;

  const pad = (n) => String(n).padStart(2, '0');
  let prev = { d: '', h: '', m: '', s: '' };

  const update = () => {
    const diff = CONFIG.EVENT_DATE.getTime() - Date.now();
    const clamped = Math.max(0, diff);

    const d = Math.floor(clamped / 86400000);
    const h = Math.floor((clamped % 86400000) / 3600000);
    const m = Math.floor((clamped % 3600000) / 60000);
    const s = Math.floor((clamped % 60000) / 1000);

    const vals = { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };

    ['d', 'h', 'm', 's'].forEach((k) => {
      if (prev[k] !== vals[k]) {
        els[k].textContent = vals[k];
        els[k].classList.remove('flip');
        void els[k].offsetWidth;
        els[k].classList.add('flip');
        prev[k] = vals[k];
      }
    });
  };

  update();
  state.countdownTimer = setInterval(update, 1000);
}

/* ============================================================
   11. TILT EFFECT
============================================================ */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  $$('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* ============================================================
   12. INIT AOS
============================================================ */
function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }
}

/* ============================================================
   BOOTSTRAP
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setGuestName();
  initLoader();
  initBeans();
  initParallax();
  initScrollProgress();
  initRipple();
  initMusic();
  initOpenButton();
  initCountdown();
  initTilt();
  initAOS();

  const audio = $('#bgm');
  if (audio) audio.load();
});