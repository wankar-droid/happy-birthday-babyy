/* =========================================================
   BIRTHDAY SURPRISE — SCRIPT
   Sections: Config, Ambient FX, Envelope, Music, Navigation,
             Intro, Gallery + Lightbox, Letter, Timeline,
             Finale + Celebration, Replay
   ========================================================= */

/* ============================================================
   CONFIGURATION — edit everything about the surprise here
   ============================================================ */
const birthdayConfig = {
  name: "Aj, My baby",

  // ===== EDIT THE INTRO MESSAGE HERE =====
  introLines: [
    "Today is your special day",
    "it's a day that worth to celebrate",
    "Always be happy and healthy",
    "Happy birthday My Babyy Bujjj."
  ],

  // ===== EDIT THE BIRTHDAY LETTER HERE =====
  letter:
`My dearest Babyy Bujay,

I hope this suprise that i made makes you a little happy.
I know its not that much but i hope this will makes you happy. at least a liittle bit. I lovee youuu.

Sorry for all the mistakes that i made and all the time that i hurt you,but you keep forgiving me and loving me, i will allways be grateful that you still love me.
Thank you for the love, the sweetneess, and every small
moment that we spend togetther.

I hope today makes you the happiest girl in the world
Happy happy birthday babyy. I LOVEEE YOUU SO MUCHHH!!!`,

  finalHeading: "Happy Birthday, Babyy Buj!",

  // ===== EDIT THE FINAL MESSAGE HERE =====
  finalMessage:
`I just wanted to say how grateful I am to have you in my life, even though we fight sometimes over the smallest things, but even tho we fight, i still love youuu so much from the bottom of my heart, i will always love you an will keep loving you forever. I LOVEE YOUU SO MUCHH MY BABYYY, HAPPY HAPPY 19TH BIRTHDAY MY BABYYY`,

  wishes: [
    " Happiness",
    " Beautiful days",
    " No stress, AND",
    " Peace of mind."
  ],

  music: "assets/music.mp3",

  photos: [
    { src: "assets/1.jpg.jpg", caption: "Mini Youu " },
    { src: "assets/2.jpg.jpg", caption: "Your fav pose when u are little hihi" },
    { src: "assets/3.jpg.jpg", caption: "Just beinng silly, so cuteee kulittt" },
    { src: "assets/4.jpg.jpg", caption: "Just you, i felt like you cute here, i like thiss" },
    { src: "assets/5.jpg.jpg", caption: "Your 18th birthdayyy, also one of my fav pic" }
  ],

  // Used for the memory timeline. Reuses the photos above.
  memories: [
    { dateLabel: "Way back when", title: "You are mini genius", desc: "Then u are mini genius, now big genius" },
    { dateLabel: "When you have", title: "Your fav pose", desc: "The kind of pose you want when u are little" },
    { dateLabel: "If there is ice", title: "This is you chewing it", desc: "Your favorite dessert" },
    { dateLabel: "Somewhere in the ", title: "Manila museum", desc: "Proof that some things only get better when you go out HAHAHA" },
    { dateLabel: "Today", title: "Right here, right now", desc: "And now, here, i dont know what to saym you are just so beautiful" }
  ]
};

// fill in the name wherever it's used
birthdayConfig.finalHeading = birthdayConfig.finalHeading.replace("My bujayy", birthdayConfig.name);

/* ============================================================
   SHARED STATE
   ============================================================ */
const state = {
  envelopeOpened: false,
  envelopeActivating: false, // guards against double-activation; lives here
                              // (not in a closure) so replay can reset it
                              // without re-binding new listeners
  currentSectionIndex: 0,
  musicStarted: false,
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

const sectionIds = ["section-intro", "section-gallery", "section-letter", "section-timeline", "section-finale"];

/* ============================================================
   AMBIENT BACKGROUND FX (floating hearts / sparkles)
   ============================================================ */
function initAmbientFx() {
  if (state.reduceMotion) return; // keep it calm for reduced-motion users
  const layer = document.getElementById("ambient-layer");
  const symbols = ["♡", "✦", "✧", "♥"];
  const count = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "floaty";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.bottom = "-5vh";
    el.style.fontSize = 12 + Math.random() * 16 + "px";
    el.style.color = Math.random() > 0.5 ? "#a883d6" : "#f4d9e6";
    const duration = 14 + Math.random() * 16;
    el.style.animationDuration = duration + "s";
    el.style.animationDelay = -(Math.random() * duration) + "s";
    layer.appendChild(el);
  }
}

/* ============================================================
   ENVELOPE INTERACTION
   ============================================================ */
function initEnvelope() {
  // Bound once at startup. Replay must NOT call this again — re-adding
  // listeners on the same button would stack duplicate handlers over
  // repeated replays. Reset lives in state.envelopeActivating instead.
  const envelope = document.getElementById("envelope");
  const instruction = document.getElementById("landing-instruction");

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // stop Space from scrolling the page
      openEnvelope();
    }
  });

  function openEnvelope() {
    if (state.envelopeActivating) return; // guard against double activation
    state.envelopeActivating = true;
    envelope.disabled = true;
    envelope.classList.add("is-opening");
    instruction.textContent = "Openinggg";

    // Prime music playback SYNCHRONOUSLY within this click/keydown handler.
    // Safari/iOS only honor audio.play() as "user-initiated" if it's called
    // in the same call stack as the gesture (or a very close microtask) —
    // calling it later from inside a setTimeout, as the earlier version did,
    // gets silently blocked on those browsers. We start playback at volume 0
    // right now, then fade it in once the envelope animation catches up.
    primeMusic();

    // step 1: seal glows briefly, then the flap opens
    setTimeout(() => {
      envelope.classList.add("is-open");
    }, 350);

    // step 2: fade the primed music in as the letter rises out
    setTimeout(() => {
      fadeInMusic();
    }, 900);

    // step 3: fade/zoom into the main experience
    setTimeout(() => {
      transitionToExperience();
    }, 1900);
  }
}

function transitionToExperience() {
  const landing = document.getElementById("landing-screen");
  const experience = document.getElementById("experience");

  landing.style.transition = "opacity 0.6s ease";
  landing.style.opacity = "0";

  setTimeout(() => {
    landing.classList.remove("is-active");
    experience.classList.add("is-active");
    document.getElementById("progress-indicator").style.display = "flex";
    document.getElementById("music-toggle").classList.add("is-visible");
    state.envelopeOpened = true;
    buildProgressIndicator();
    goToSection(0, { skipAnimation: false });
    playIntroLines();
  }, 550);
}

/* ============================================================
   MUSIC
   ============================================================ */
function initMusic() {
  const audio = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");
  audio.volume = 0; // fade in manually

  // graceful fallback if the music file is missing or fails to load
  audio.addEventListener("error", () => {
    toggle.style.display = "none";
  });

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      toggle.classList.add("is-playing");
      toggle.classList.remove("is-paused");
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Pause music");
    } else {
      audio.pause();
      toggle.classList.remove("is-playing");
      toggle.classList.add("is-paused");
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Play music");
    }
  });
}

// Called synchronously from the envelope's click/keydown handler so the
// browser still considers playback "user-initiated" (see note in
// openEnvelope above). Starts silent — the fade-in happens separately.
function primeMusic() {
  const audio = document.getElementById("bg-music");
  audio.volume = 0;
  audio.play().catch(() => {
    // Blocked or file missing — fadeInMusic() will retry and, if that
    // also fails, the visible toggle still lets the user start it by hand.
  });
}

function fadeInMusic() {
  if (state.musicStarted) return;
  state.musicStarted = true;
  const audio = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");

  const beginFade = () => {
    toggle.classList.add("is-playing");
    toggle.classList.remove("is-paused");
    toggle.setAttribute("aria-pressed", "true");
    toggle.setAttribute("aria-label", "Pause music");
    let vol = 0;
    const target = 0.5;
    const fade = setInterval(() => {
      vol = Math.min(target, vol + 0.05);
      audio.volume = vol;
      if (vol >= target) clearInterval(fade);
    }, 80);
  };

  if (!audio.paused) {
    beginFade();
  } else {
    // priming was blocked earlier (or hadn't finished loading yet) — try
    // once more; if this also fails the toggle stays available manually
    audio.play().then(beginFade).catch(() => {
      toggle.classList.add("is-paused");
    });
  }
}

/* ============================================================
   PROGRESS INDICATOR + SECTION NAVIGATION
   ============================================================ */
function buildProgressIndicator() {
  const nav = document.getElementById("progress-indicator");
  nav.innerHTML = "";
  sectionIds.forEach((id, i) => {
    const dot = document.createElement("span");
    dot.className = "progress-dot" + (i === 0 ? " is-current" : "");
    dot.dataset.index = i;
    nav.appendChild(dot);
  });
}

function updateProgressIndicator(index) {
  document.querySelectorAll(".progress-dot").forEach((dot) => {
    dot.classList.toggle("is-current", Number(dot.dataset.index) === index);
  });
}

function goToSection(index, opts = {}) {
  if (!state.envelopeOpened) return; // can't skip ahead of the envelope
  index = Math.max(0, Math.min(sectionIds.length - 1, index));
  state.currentSectionIndex = index;

  sectionIds.forEach((id, i) => {
    document.getElementById(id).classList.toggle("is-active", i === index);
  });

  updateProgressIndicator(index);
  updateSectionNav(index);

  // trigger section-specific reveal animations the first time they're shown
  if (index === 1) revealGallery();
  if (index === 2) typeLetter();
  if (index === 3) revealTimelineItems();
  if (index === 4) playFinale();
}

function updateSectionNav(index) {
  const nav = document.getElementById("section-nav");
  const back = document.getElementById("nav-back");
  const next = document.getElementById("nav-next");

  // nav is hidden on the intro (has its own CTA) and the finale (has replay)
  if (index === 0 || index === 4) {
    nav.style.display = "none";
    return;
  }
  nav.style.display = "flex";
  back.disabled = false;
  next.disabled = index === sectionIds.length - 1;
}

function initSectionNav() {
  document.getElementById("nav-back").addEventListener("click", () => goToSection(state.currentSectionIndex - 1));
  document.getElementById("nav-next").addEventListener("click", () => goToSection(state.currentSectionIndex + 1));
  document.getElementById("start-surprise-btn").addEventListener("click", () => goToSection(1));
}

/* ============================================================
   SECTION 1 — INTRO
   ============================================================ */
function playIntroLines() {
  const heading = document.getElementById("intro-heading");
  heading.textContent = `Happy Birthday, ${birthdayConfig.name} 💜`;

  const container = document.getElementById("intro-lines");
  container.innerHTML = "";
  const ctaLine = document.getElementById("intro-cta-line");
  const startBtn = document.getElementById("start-surprise-btn");
  ctaLine.classList.remove("is-shown");
  startBtn.classList.remove("is-shown");

  birthdayConfig.introLines.forEach((line, i) => {
    const p = document.createElement("p");
    p.className = "intro-line";
    p.textContent = line;
    container.appendChild(p);
  });

  const lines = container.querySelectorAll(".intro-line");
  lines.forEach((el, i) => {
    setTimeout(() => el.classList.add("is-shown"), 400 + i * 850);
  });

  const afterLines = 400 + lines.length * 850 + 400;
  setTimeout(() => ctaLine.classList.add("is-shown"), afterLines);
  setTimeout(() => {
    startBtn.classList.add("is-shown");
    startBtn.disabled = false; // was disabled to prevent keyboard/screen-reader
                               // users from activating it before it's revealed
  }, afterLines + 500);
}

/* ============================================================
   SECTION 2 — GALLERY / SCRAPBOOK + LIGHTBOX
   ============================================================ */
let galleryBuilt = false;
let galleryRevealed = false;

function buildGallery() {
  const wrap = document.getElementById("scrapbook");
  wrap.innerHTML = "";

  birthdayConfig.photos.forEach((photo, i) => {
    const fig = document.createElement("figure");
    fig.className = "scrap-photo";
    fig.setAttribute("role", "listitem");
    fig.setAttribute("tabindex", "0");
    fig.dataset.index = i;

    const heart = document.createElement("span");
    heart.className = "frame-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "♡";
    fig.appendChild(heart);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || `Memory photo ${i + 1}`;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      // graceful fallback if a photo file is missing
      const fallback = document.createElement("div");
      fallback.className = "photo-fallback";
      fallback.setAttribute("aria-hidden", "true");
      fallback.textContent = "🖼️";
      img.replaceWith(fallback);
    });
    fig.appendChild(img);

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption || "";
    fig.appendChild(caption);

    function openThisPhoto() { openLightbox(photo, i); }
    fig.addEventListener("click", openThisPhoto);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openThisPhoto(); }
    });

    wrap.appendChild(fig);
  });

  galleryBuilt = true;
}

function revealGallery() {
  if (!galleryBuilt) buildGallery();
  if (galleryRevealed) return;
  galleryRevealed = true;

  const items = document.querySelectorAll(".scrap-photo");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("is-shown"), 200 + i * 260);
  });
}

function openLightbox(photo, index) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  img.src = photo.src;
  img.alt = photo.caption || `Memory photo ${index + 1}`;
  caption.textContent = photo.caption || "";
  lightbox.classList.add("is-open");
  document.getElementById("lightbox-close").focus();
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("is-open");
}

function initLightbox() {
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* ============================================================
   SECTION 3 — LETTER (typewriter reveal)
   ============================================================ */
let letterTyped = false;

function typeLetter() {
  if (letterTyped) return;
  letterTyped = true;

  const el = document.getElementById("letter-body");
  const signOff = document.querySelector(".letter-sign");
  const fullText = birthdayConfig.letter;

  if (state.reduceMotion) {
    el.textContent = fullText;
    signOff.classList.add("is-shown");
    return;
  }

  el.textContent = "";
  const caret = document.createElement("span");
  caret.className = "letter-caret";
  el.appendChild(caret);

  let i = 0;
  const speed = 18; // ms per character — brisk, not painfully slow
  function typeNext() {
    if (i < fullText.length) {
      caret.insertAdjacentText("beforebegin", fullText[i]);
      i++;
      setTimeout(typeNext, speed);
    } else {
      caret.remove();
      // reveal the sign-off only once the letter has actually finished
      // typing, instead of it sitting there visible the whole time
      setTimeout(() => signOff.classList.add("is-shown"), 250);
    }
  }
  typeNext();
}

/* ============================================================
   SECTION 4 — MEMORY TIMELINE
   ============================================================ */
let timelineBuilt = false;

function buildTimeline() {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = "";

  birthdayConfig.memories.forEach((memory, i) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.setAttribute("role", "listitem");

    const marker = document.createElement("span");
    marker.className = "timeline-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "♥";

    const content = document.createElement("div");
    content.className = "timeline-content";

    const photo = birthdayConfig.photos[i % birthdayConfig.photos.length];
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = "";
    img.addEventListener("error", () => { img.style.display = "none"; });

    const text = document.createElement("div");
    text.className = "timeline-text";
    text.innerHTML = `
      <p class="tl-date">Memory #${i + 1} · ${memory.dateLabel}</p>
      <h3>${memory.title}</h3>
      <p>${memory.desc}</p>
    `;

    content.appendChild(img);
    content.appendChild(text);
    item.appendChild(marker);
    item.appendChild(content);
    wrap.appendChild(item);
  });

  timelineBuilt = true;
}

function revealTimelineItems() {
  if (!timelineBuilt) buildTimeline();
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("is-shown"), 150 + i * 220);
  });
}

/* ============================================================
   SECTION 5 — FINALE + CELEBRATION
   ============================================================ */
let finalePlayed = false;

function playFinale() {
  if (finalePlayed) return;
  finalePlayed = true;

  document.getElementById("finale-heading").textContent = birthdayConfig.finalHeading;
  document.getElementById("finale-message").textContent = birthdayConfig.finalMessage;

  const wishList = document.getElementById("finale-wishes");
  wishList.innerHTML = "";
  birthdayConfig.wishes.forEach((wish) => {
    const li = document.createElement("li");
    li.className = "finale-wish";
    li.textContent = wish;
    wishList.appendChild(li);
  });

  const pre = document.getElementById("finale-pre");
  const card = document.getElementById("finale-card");
  const wishesLead = document.getElementById("finale-wishes-lead");
  const wishes = document.querySelectorAll(".finale-wish");
  const signoff = document.getElementById("finale-signoff");
  const replay = document.getElementById("replay-btn");

  setTimeout(() => pre.classList.add("is-shown"), 150);
  setTimeout(() => card.classList.add("is-shown"), 800);
  setTimeout(() => wishesLead.classList.add("is-shown"), 1700);
  wishes.forEach((el, i) => setTimeout(() => el.classList.add("is-shown"), 2000 + i * 350));
  setTimeout(() => signoff.classList.add("is-shown"), 2000 + wishes.length * 350 + 300);
  setTimeout(() => {
    replay.classList.add("is-shown");
    replay.disabled = false; // was disabled to prevent premature activation
    launchCelebration();
  }, 2000 + wishes.length * 350 + 900);
}

/* Lightweight celebration: confetti + hearts + sparkles on canvas */
function launchCelebration() {
  const canvas = document.getElementById("celebration-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (state.reduceMotion) return; // skip the animated burst entirely

  const colors = ["#a883d6", "#7a4fb8", "#f4d9e6", "#e8c67a", "#ffffff"];
  const particles = [];
  const count = window.innerWidth < 600 ? 45 : 80;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 4 + Math.random() * 6,
      speedY: 1 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 1.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.6 ? "heart" : "confetti"
    });
  }

  let frame = 0;
  const maxFrames = 420; // roughly 7s at 60fps

  function drawHeart(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    const s = p.size / 2;
    ctx.moveTo(0, s);
    ctx.bezierCurveTo(-s, -s / 2, -s * 2, s, 0, s * 2);
    ctx.bezierCurveTo(s * 2, s, s, -s / 2, 0, s);
    ctx.fill();
    ctx.restore();
  }

  function drawConfetti(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      if (p.shape === "heart") drawHeart(p); else drawConfetti(p);
    });
    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   REPLAY
   ============================================================ */
function initReplay() {
  document.getElementById("replay-btn").addEventListener("click", resetExperience);
}

function resetExperience() {
  // reset music
  const audio = document.getElementById("bg-music");
  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0;
  state.musicStarted = false;
  const toggle = document.getElementById("music-toggle");
  toggle.classList.remove("is-playing", "is-paused", "is-visible");
  toggle.setAttribute("aria-pressed", "false");
  toggle.setAttribute("aria-label", "Play music");

  // reset envelope
  const envelope = document.getElementById("envelope");
  envelope.classList.remove("is-open", "is-opening");
  envelope.disabled = false;
  state.envelopeActivating = false;
  document.getElementById("landing-instruction").textContent = "Tap the envelope to open it";

  // reset section state flags so animations replay from scratch
  galleryBuilt = false;
  galleryRevealed = false;
  letterTyped = false;
  timelineBuilt = false;
  finalePlayed = false;
  state.envelopeOpened = false;
  state.currentSectionIndex = 0;

  // clear dynamic content
  document.getElementById("scrapbook").innerHTML = "";
  document.getElementById("timeline").innerHTML = "";
  document.getElementById("letter-body").textContent = "";
  document.querySelector(".letter-sign").classList.remove("is-shown");
  ["finale-pre", "finale-card", "finale-wishes-lead", "finale-signoff"].forEach((id) => {
    document.getElementById(id).classList.remove("is-shown");
  });
  // interactive reveal-buttons also get disabled again so they can't be
  // triggered (e.g. via keyboard) before their entrance animation replays
  const replayBtn = document.getElementById("replay-btn");
  replayBtn.classList.remove("is-shown");
  replayBtn.disabled = true;
  const startBtn = document.getElementById("start-surprise-btn");
  startBtn.classList.remove("is-shown");
  startBtn.disabled = true;

  const canvas = document.getElementById("celebration-canvas");
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  // reset screens
  sectionIds.forEach((id) => document.getElementById(id).classList.remove("is-active"));
  document.getElementById("experience").classList.remove("is-active");
  document.getElementById("progress-indicator").style.display = "none";
  document.getElementById("section-nav").style.display = "none";

  const landing = document.getElementById("landing-screen");
  landing.style.opacity = "1";
  landing.classList.add("is-active");

  // NOTE: initEnvelope() is intentionally NOT called again here — it was
  // already bound once on page load. Re-binding on every replay used to
  // stack duplicate click/keydown listeners on the same button. Resetting
  // state.envelopeActivating (above) is all that's needed to let the
  // single, original listener run again from scratch.
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initAmbientFx();
  initEnvelope();
  initMusic();
  initSectionNav();
  initLightbox();
  initReplay();

  window.addEventListener("resize", () => {
    const canvas = document.getElementById("celebration-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
