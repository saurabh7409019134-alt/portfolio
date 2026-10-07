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
});
