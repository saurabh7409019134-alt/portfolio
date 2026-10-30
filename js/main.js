/**
 * SINGLE FIXED CINEMATIC BACKGROUND PORTFOLIO
 * Foreground Interactions, Atmosphere Controls & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Section spy for active navigation state
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link, .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // 3. Atmosphere Mood Filter Switcher
  // Allows testing and switching between Cinematic (default), Deep Focus, and Pure Scene
  const atmosphereToggle = document.getElementById('atmosphereToggle');
  const atmosphereLabel = document.getElementById('atmosphereLabel');
  const atmospheres = ['cinematic', 'focus', 'clear'];
  let currentAtmoIndex = 0;

  if (atmosphereToggle) {
    atmosphereToggle.addEventListener('click', () => {
      currentAtmoIndex = (currentAtmoIndex + 1) % atmospheres.length;
      const currentMode = atmospheres[currentAtmoIndex];

      document.body.classList.remove('atmosphere-focus', 'atmosphere-clear');

      if (currentMode === 'focus') {
        document.body.classList.add('atmosphere-focus');
        if (atmosphereLabel) atmosphereLabel.textContent = 'Mood: Focus';
        showToast('Atmosphere: Deep Focus (Enhanced contrast)');
      } else if (currentMode === 'clear') {
        document.body.classList.add('atmosphere-clear');
        if (atmosphereLabel) atmosphereLabel.textContent = 'Mood: Pure Scene';
        showToast('Atmosphere: Pure Scene (Vibrant hero exposure)');
      } else {
        if (atmosphereLabel) atmosphereLabel.textContent = 'Mood: Cinematic';
        showToast('Atmosphere: Cinematic Balanced (Default)');
      }
    });
  }

  // 4. One-Click Email Copy with Toast Notification
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'hello@saurabh.design';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // 5. Live Clock in Footer
  const liveClockEl = document.getElementById('liveClock');
  function updateClock() {
    if (!liveClockEl) return;
    const now = new Date();
    // Format in IST / Local
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    try {
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      liveClockEl.textContent = `${timeStr} IST`;
    } catch (e) {
      liveClockEl.textContent = now.toLocaleTimeString();
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 6. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 7. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  const mobileClose = document.getElementById('mobileMenuClose');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  function openMobileMenu() {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 8. Contact Form Placeholder Simulation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message placeholder has been recorded.');
      contactForm.reset();
    });
  }

// 9. WebGL Three.js Particle Effect (Inspired by Sarthak Sharma reference portfolio)
  // Strictly driven by scroll - particles do not move on cursor
  // Full-width wave across both sides of website, text rises from chest to head, hero disappears
  initHeroParticles();

  function initHeroParticles() {
    const canvas = document.getElementById("heroParticleCanvas");
    if (!canvas || typeof THREE === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer = null;
    let scene = null;
    let camera = null;
    let geometry = null;
    let material = null;
    let points = null;
    let animId = 0;
    let isVisible = true;

    let lastTime = performance.now();
    let currentScrollProgress = 0;
    let targetScrollProgress = 0;

    const vertexShader = `
      attribute vec3 aColor;
      attribute float aSeed;
      uniform float uTime;
      uniform float uProgress;
      uniform float uScale;
      uniform float uAspect;
      uniform float uDpr;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // p governs the morph progression from portrait (0) to signal wave (1) purely on scroll
        float p = smoothstep(0.0, 0.70, uProgress);

        // Waveform target layout stretching across BOTH SIDES of the website (no boundaries)
        float spreadX = max(uAspect, 1.2) * 4.6;
        vec3 target = vec3(
          (aSeed - 0.5) * spreadX,
          sin(aSeed * 25.1327) * 0.065 + (floor(position.x * 3.5 + 1.75) - 1.75) * 0.16 + 0.15,
          sin(aSeed * 18.0) * 0.12
        );

        vec3 pos = mix(position, target, p);

        // Organic wave motion purely from time & scroll (never cursor)
        float edge = smoothstep(0.18, 0.5, abs(position.x));
        pos.x += sin(uTime * 0.35 + aSeed * 40.0) * 0.008 * (edge + p * 1.5);
        pos.y += cos(uTime * 0.30 + aSeed * 30.0) * 0.006 * (edge + p * 1.5);
        pos.z += sin(aSeed * 64.0 + uTime * 0.20) * 0.015;

        vec4 mv = modelViewMatrix * vec4(pos * uScale, 1.0);
        gl_Position = projectionMatrix * mv;

        float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
        gl_PointSize = (1.25 + lum * 1.2) * uDpr * clamp(4.6 / -mv.z, 0.6, 2.2);

        // Accent warmth morphing (#e8650f warm orange glow on scroll)
        vec3 accentColor = vec3(0.95, 0.44, 0.12);
        vColor = mix(aColor, accentColor, p * 0.55);

        // Disappear as user scrolls: particles completely vanish by uProgress = 0.75
        float heroFade = 1.0 - smoothstep(0.35, 0.75, uProgress);
        vAlpha = (1.0 - p * 0.25) * heroFade;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        if (vAlpha < 0.01) discard;
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.22, d) * vAlpha;
        if (alpha < 0.015) discard;
        vec3 col = vColor * (1.15 + smoothstep(0.38, 0.0, d) * 0.35);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power"
      });
    } catch (e) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uScale: { value: 1.0 },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uDpr: { value: dpr },
    };

    material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: uniforms
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const isMobile = window.innerWidth < 640;
      const sampleW = isMobile ? 180 : 250;
      const aspect = img.height / img.width;
      const sampleH = Math.round(sampleW * aspect);

      const off = document.createElement("canvas");
      off.width = sampleW;
      off.height = sampleH;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, sampleW, sampleH);
      const data = offCtx.getImageData(0, 0, sampleW, sampleH).data;

      const positions = [];
      const colors = [];
      const seeds = [];
      const scaleFactor = 1.85;

      for (let y = 0; y < sampleH; y++) {
        for (let x = 0; x < sampleW; x++) {
          const idx = (y * sampleW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (a < 35 || lum < 0.035) continue;

          const px = (x / sampleW - 0.5) * scaleFactor;
          const py = (0.5 - y / sampleH) * (sampleH / sampleW) * scaleFactor + 0.65;
          const pz = 0.03 * lum;

          positions.push(px, py, pz);
          colors.push(r / 255, g / 255, b / 255);
          seeds.push(((127 * x + 311 * y) % 997) / 997);
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));

      points = new THREE.Points(geometry, material);
      scene.add(points);

      handleResize();
    };

    img.onerror = () => {
      if (img.src.indexOf("saurabh-cutout.webp") === -1) {
        img.src = "assets/saurabh-cutout.webp";
      }
    };

    img.src = "assets/saurabh-hero.png";

    function handleResize() {
      if (!renderer || !camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (material) {
        material.uniforms.uAspect.value = w / h;
        material.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, 1.75);
        material.uniforms.uScale.value = w < 640 ? 0.88 : 1.0;
      }
    }

    function handleScroll() {
      const track = document.getElementById("heroScrollTrack");
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
      targetScrollProgress = progress;
    }

    function tick(now) {
      animId = requestAnimationFrame(tick);
      if (!isVisible || document.hidden || !renderer || !scene || !camera || !material || !points) {
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Morph progress exclusively driven by page scroll
      currentScrollProgress = THREE.MathUtils.damp(currentScrollProgress, targetScrollProgress, 4.0, delta);

      material.uniforms.uTime.value = now * 0.001;
      material.uniforms.uProgress.value = currentScrollProgress;

      // 1. Text moves up from below chest to head level as page scrolls
      const textWrap = document.getElementById("heroTextWrap");
      if (textWrap) {
        const riseDist = Math.min(window.innerHeight * 0.35, 350);
        const yOffset = -currentScrollProgress * riseDist;
        textWrap.style.transform = `translate3d(-50%, ${yOffset.toFixed(2)}px, 0)`;
      }

      // 2. Person silhouette cutout fades out as text reaches head (disappears by 0.72)
      const silhouette = document.getElementById("heroPortraitSilhouette");
      if (silhouette) {
        const fade = Math.max(0, Math.min(1, (currentScrollProgress - 0.30) / 0.40));
        silhouette.style.opacity = String(((1 - fade) * 0.16).toFixed(3));
      }

      // 3. Side note and scroll cue fade out cleanly
      const sideNote = document.getElementById("heroSideNote");
      const bottomCue = document.getElementById("heroBottomCue");
      const cueFade = Math.max(0, Math.min(1, 1 - currentScrollProgress * 2.2));
      if (sideNote) sideNote.style.opacity = String(cueFade.toFixed(3));
      if (bottomCue) bottomCue.style.opacity = String(cueFade.toFixed(3));

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const heroEl = document.getElementById("hero") || canvas;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.01 });
    observer.observe(heroEl);

    animId = requestAnimationFrame(tick);
    handleResize();
    handleScroll();
  }

  // 10. Razorpay AI Builders Inspired Text Animation (Word Scrub + Slide Reveal + Smooth Fadeout)
  // Paragraphs illuminate word-by-word on scroll (like Razorpay fold-6-manifesto)
  // Titles & cards slide up smoothly and fade out when scrolling past
  // Strictly excludes Hero Section Text, Name, and Footer (Footer is always 100% sharp and unblurred)
  initRazorpayTextAnimation();

  function initRazorpayTextAnimation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A. Word-by-word scroll illumination paragraphs (Razorpay Manifesto style)
    const scrubParagraphs = document.querySelectorAll(
      "main .about-paragraphs p, " +
      "main .purpose-quote, " +
      "main .beyond-statement"
    );

    const scrubData = [];
    scrubParagraphs.forEach((p) => {
      const rawText = p.innerText.trim();
      if (!rawText) return;
      const words = rawText.split(/\s+/);
      p.innerHTML = words.map(w => `<span class=\"rzp-word\">${w}</span>`).join(" ");
      const wordSpans = Array.from(p.querySelectorAll(".rzp-word"));
      scrubData.push({ element: p, words: wordSpans, count: wordSpans.length });
    });

    // B. Section Headings & Content Blocks (Razorpay Slide-Up Reveal + Fadeout)
    const revealTargets = document.querySelectorAll(
      "main section:not(#hero) .section-tag, " +
      "main section:not(#hero) .section-title, " +
      "main section:not(#hero) .section-desc, " +
      "main section:not(#hero) .about-sub-title, " +
      "main section:not(#hero) .skills-banner-wrap, " +
      "main section:not(#hero) .tools-marquee-container, " +
      "main section:not(#hero) .stack-showcase-container, " +
      "main section:not(#hero) .digital-card, " +
      "main section:not(#hero) .sparkos-banner-wrap, " +
      "main section:not(#hero) .public-platform-card, " +
      "main section:not(#hero) .goal-card, " +
      "main section:not(#hero) .beyond-col, " +
      "main section:not(#hero) .cta-banner-wrapper"
    );

    revealTargets.forEach(el => el.classList.add("rzp-reveal-text"));

    let ticking = false;

    function updateElements() {
      const vh = window.innerHeight;

      // 1. Update Word Scrubbing Paragraphs (Razorpay AI Builders Manifesto style)
      scrubData.forEach(({ element, words, count }) => {
        const rect = element.getBoundingClientRect();

        // Off-screen checks
        if (rect.top >= vh) {
          words.forEach(w => w.classList.remove("lit"));
          element.style.opacity = "1";
          return;
        }

        if (rect.bottom <= 0) {
          element.style.opacity = "0";
          return;
        }

        // Progressively illuminate words as paragraph scrolls through the viewport (Razorpay style)
        const startY = vh * 0.88;
        const endY = vh * 0.20;
        const progress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));

        // Smooth exit fadeout as paragraph scrolls out top of viewport
        const exitSpan = vh * 0.15;
        const exitProgress = Math.min(1, Math.max(0, rect.bottom / exitSpan));
        element.style.opacity = exitProgress < 0.98 ? exitProgress.toFixed(3) : "1";

        const litCount = Math.round(progress * count);
        words.forEach((w, idx) => {
          if (idx < litCount) {
            w.classList.add("lit");
          } else {
            w.classList.remove("lit");
          }
        });
      });

      // 2. Update Headings & Content Blocks (Razorpay Slide-Up Reveal + Fadeout)
      revealTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();

        if (rect.top >= vh || rect.bottom <= 0) {
          el.style.opacity = "0";
          return;
        }

        const enterSpan = vh * 0.22;
        const enterProgress = Math.min(1, Math.max(0, (vh - rect.top) / enterSpan));

        const exitSpan = vh * 0.20;
        const exitProgress = Math.min(1, Math.max(0, rect.bottom / exitSpan));

        const factor = Math.min(enterProgress, exitProgress);

        if (factor >= 0.98) {
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0)";
        } else {
          const translateY = (1 - enterProgress) * 16;
          el.style.opacity = Math.max(0, factor).toFixed(3);
          el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateElements);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial pass on load
    updateElements();
  }

  // 11. Mo Rashidi Inspired Destination Cards Stack Swipe Animation & Video Audio Management
  initDestinationCardStack();

  function initDestinationCardStack() {
    const viewport = document.getElementById('cardStackViewport');
    const showcaseContainer = document.querySelector('.stack-showcase-container');
    if (!viewport) return;

    const cards = Array.from(viewport.querySelectorAll('.deck-card'));
    const prevBtn = document.getElementById('deckPrevBtn');
    const nextBtn = document.getElementById('deckNextBtn');
    const dots = Array.from(document.querySelectorAll('.deck-dot'));
    const counter = document.getElementById('deckCounter');

    if (!cards.length) return;

    let activeIndex = 0;
    let isTransitioning = false;
    let isGlobalAudioEnabled = false; // When true, all videos unmute 1Y1 as they become active
    const total = cards.length;

    // 5-Level Stack transforms matching Mo Rashidi Destination Cards layout
    const stackStyles = [
      { y: 0, scale: 1, rot: 0, opacity: 1, z: 10, brightness: 1, pointer: 'auto' },
      { y: -20, scale: 0.94, rot: -3.2, opacity: 0.88, z: 9, brightness: 0.90, pointer: 'none' },
      { y: -38, scale: 0.88, rot: 2.8, opacity: 0.70, z: 8, brightness: 0.78, pointer: 'none' },
      { y: -54, scale: 0.82, rot: -4.2, opacity: 0.50, z: 7, brightness: 0.65, pointer: 'none' },
      { y: -68, scale: 0.76, rot: 5.0, opacity: 0.30, z: 6, brightness: 0.52, pointer: 'none' }
    ];

    function updateSoundButton(card, unmuted) {
      const btn = card.querySelector('.deck-sound-btn');
      if (!btn) return;
      const iconMuted = btn.querySelector('.icon-muted');
      const iconUnmuted = btn.querySelector('.icon-unmuted');
      const text = btn.querySelector('.sound-btn-text');

      if (unmuted) {
        btn.classList.add('is-unmuted');
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'inline';
        if (text) text.textContent = 'Mute';
      } else {
        btn.classList.remove('is-unmuted');
        if (iconMuted) iconMuted.style.display = 'inline';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        if (text) text.textContent = 'Unmute';
      }
    }

    function applyStackStyles(animate = true) {
      cards.forEach((card, i) => {
        const offset = (i - activeIndex + total) % total;
        const style = stackStyles[offset] || stackStyles[stackStyles.length - 1];

        card.style.transition = animate
          ? 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1), filter 0.48s ease'
          : 'none';
        card.style.transform = `translate3d(0, ${style.y}px, 0) scale(${style.scale}) rotate(${style.rot}deg)`;
        card.style.opacity = String(style.opacity);
        card.style.zIndex = String(style.z);
        card.style.filter = `brightness(${style.brightness})`;
        card.style.pointerEvents = style.pointer;
        card.classList.toggle('active-card', offset === 0);

        const video = card.querySelector('video');
        if (video) {
          if (offset === 0) {
            // Front active card: if user unmuted, automatically play with audio 1Y1
            video.muted = !isGlobalAudioEnabled;
            video.play().catch(() => {});
            updateSoundButton(card, isGlobalAudioEnabled);
          } else {
            // Background card: always mute so only active front video plays audio
            video.muted = true;
            updateSoundButton(card, isGlobalAudioEnabled);
          }
        }
      });

      // Update dots & counter
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      if (counter) {
        counter.textContent = `0${activeIndex + 1} / 0${total}`;
      }
    }

    // Audio toggle buttons: 1 click unmutes all videos 1Y1 as they cycle
    cards.forEach((card) => {
      const soundBtn = card.querySelector('.deck-sound-btn');
      if (!soundBtn) return;

      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isGlobalAudioEnabled = !isGlobalAudioEnabled;

        // Apply audio setting to all cards
        cards.forEach((c, idx) => {
          updateSoundButton(c, isGlobalAudioEnabled);
          const v = c.querySelector('video');
          if (v) {
            if (idx === activeIndex) {
              v.muted = !isGlobalAudioEnabled;
              if (isGlobalAudioEnabled) {
                v.play().catch(() => {});
              }
            } else {
              v.muted = true;
            }
          }
        });
      });
    });

    // Next Card Transition (Mo Rashidi Swipe Down effect)
    function nextCard() {
      if (isTransitioning) return;
      isTransitioning = true;

      const topCard = cards[activeIndex];
      topCard.classList.add('swiping-down');

      // Next index
      const nextIdx = (activeIndex + 1) % total;

      // Animate the rest forward immediately with silky smooth bezier
      cards.forEach((card, i) => {
        if (i === activeIndex) return;
        const newOffset = (i - nextIdx + total) % total;
        const style = stackStyles[newOffset] || stackStyles[stackStyles.length - 1];

        card.style.transition = 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.48s cubic-bezier(0.16, 1, 0.3, 1), filter 0.48s ease';
        card.style.transform = `translate3d(0, ${style.y}px, 0) scale(${style.scale}) rotate(${style.rot}deg)`;
        card.style.opacity = String(style.opacity);
        card.style.zIndex = String(style.z);
        card.style.filter = `brightness(${style.brightness})`;
      });

      setTimeout(() => {
        topCard.classList.remove('swiping-down');
        // Mute departing video
        const oldVideo = topCard.querySelector('video');
        if (oldVideo) {
          oldVideo.muted = true;
        }

        activeIndex = nextIdx;
        applyStackStyles(false);
        isTransitioning = false;
      }, 480);
    }

    // Prev Card Transition
    function prevCard() {
      if (isTransitioning) return;
      isTransitioning = true;

      // Mute active video
      const currentVideo = cards[activeIndex].querySelector('video');
      if (currentVideo) {
        currentVideo.muted = true;
      }

      activeIndex = (activeIndex - 1 + total) % total;
      const newTopCard = cards[activeIndex];

      // Prepare new top card below screen
      newTopCard.style.transition = 'none';
      newTopCard.style.transform = 'translate3d(0, 125%, 0) rotate(7deg) scale(0.95)';
      newTopCard.style.opacity = '0';
      newTopCard.style.zIndex = '12';

      requestAnimationFrame(() => {
        applyStackStyles(true);
        setTimeout(() => {
          isTransitioning = false;
        }, 500);
      });
    }

    // Next / Prev button click handlers
    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);

    // Dots direct navigation
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.getAttribute('data-dot'), 10);
        if (targetIdx === activeIndex || isTransitioning) return;
        if (targetIdx > activeIndex) {
          nextCard();
        } else {
          prevCard();
        }
      });
    });

    // Mouse wheel / trackpad scroll auto-switch
    let lastWheelTime = 0;
    const wheelCooldown = 550; // ms debounce for smooth switching

    function handleWheelSwitch(e) {
      if (isTransitioning) return;
      const delta = e.deltaY;
      if (Math.abs(delta) < 25) return;

      const now = Date.now();
      if (now - lastWheelTime < wheelCooldown) return;

      lastWheelTime = now;
      if (delta > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }

    if (showcaseContainer) {
      showcaseContainer.addEventListener('wheel', handleWheelSwitch, { passive: true });
    }

    // Touch & Pointer Drag / Swipe Gesture (Swipe Down to flip card, Swipe Up to go back)
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    viewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.deck-sound-btn')) return;
      isDragging = true;
      startY = e.clientY;
      currentY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging || isTransitioning) return;
      currentY = e.clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        const topCard = cards[activeIndex];
        const rot = Math.min(10, deltaY * 0.06);
        const scale = Math.max(0.94, 1 - deltaY * 0.0003);
        topCard.style.transition = 'none';
        topCard.style.transform = `translate3d(0, ${deltaY}px, 0) rotate(${rot}deg) scale(${scale})`;
      }
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaY = currentY - startY;
      if (deltaY > 70 && !isTransitioning) {
        nextCard();
      } else if (deltaY < -70 && !isTransitioning) {
        prevCard();
      } else {
        applyStackStyles(true);
      }
      startY = 0;
      currentY = 0;
    });

    // Initial Stack Arrangement
    applyStackStyles(false);
  }
});
