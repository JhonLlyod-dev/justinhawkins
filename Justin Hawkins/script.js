(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     THEME TOGGLE — "Darkness Mode" (dark) / "Stage Lights Mode" (light)
     ========================================================= */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-toggle-label");
  const THEME_KEY = "jh-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      themeLabel.textContent = "Stage Lights Mode";
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      themeLabel.textContent = "Darkness Mode";
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
    } catch (e) { /* storage unavailable, fall through */ }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme);
    try { localStorage.setItem(THEME_KEY, currentTheme); } catch (e) { /* ignore */ }
  });

  /* =========================================================
     MOBILE NAV
     ========================================================= */
  const burger = document.getElementById("nav-burger");
  const mainNav = document.getElementById("main-nav");

  burger.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* =========================================================
     HERO SPOTLIGHT — follows cursor, disabled for reduced motion
     ========================================================= */
  const heroSpotlight = document.getElementById("hero-spotlight");
  if (heroSpotlight && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelector(".hero").addEventListener("pointermove", (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpotlight.style.setProperty("--x", x + "%");
      heroSpotlight.style.setProperty("--y", y + "%");
    });
  }

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */
  const revealTargets = document.querySelectorAll(
    ".section-inner > *, .bio-grid, .timeline-item, .album-card, .project-card, .fact-card, .compare-bar"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================================================
     STICKY HEADER SHADOW ON SCROLL + BACK TO TOP
     ========================================================= */
  const header = document.getElementById("site-header");
  const backToTop = document.getElementById("back-to-top");

  function onScroll() {
    const scrolled = window.scrollY > 40;
    header.style.boxShadow = scrolled ? "0 8px 24px -16px rgba(0,0,0,0.6)" : "none";
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* =========================================================
     FAQ ACCORDION
     ========================================================= */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    const answer = btn.closest(".faq-item").querySelector(".faq-answer");
    answer.style.maxHeight = "0px";

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question").forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          otherBtn.closest(".faq-item").querySelector(".faq-answer").style.maxHeight = "0px";
        }
      });

      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
    });
  });

  /* =========================================================
     SIGNATURE WIDGET — interactive 5-octave vocal range meter
     Synthesises tones client-side via Web Audio (no recordings).
     ========================================================= */
  const rangeTrack = document.getElementById("range-track");

  // Approximate 5-octave span, low chest voice to high falsetto.
  const notes = [
    { name: "E2", freq: 82.41, h: 18 },
    { name: "A2", freq: 110.0, h: 26 },
    { name: "D3", freq: 146.83, h: 34 },
    { name: "G3", freq: 196.0, h: 44 },
    { name: "C4", freq: 261.63, h: 54 },
    { name: "F4", freq: 349.23, h: 64 },
    { name: "A4", freq: 440.0, h: 72 },
    { name: "D5", freq: 587.33, h: 80 },
    { name: "G5", freq: 783.99, h: 88 },
    { name: "C6", freq: 1046.5, h: 96 },
    { name: "E6", freq: 1318.51, h: 100 },
  ];

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function playTone(freq, keyEl) {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);

    keyEl.classList.add("is-playing");
    window.setTimeout(() => keyEl.classList.remove("is-playing"), 700);
  }

  if (rangeTrack) {
    notes.forEach((note) => {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "range-key";
      key.setAttribute("role", "listitem");
      key.setAttribute("aria-label", `Play note ${note.name}`);
      key.innerHTML = `<span class="range-key-bar" style="height:${note.h}%"></span><span class="range-key-label">${note.name}</span>`;
      key.addEventListener("click", () => playTone(note.freq, key));
      rangeTrack.appendChild(key);
    });
  }
})();
