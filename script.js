/* ============================================================
   Zero Waste Cambridge — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const header      = document.getElementById('header');
  const hamburger   = document.getElementById('hamburger');
  const nav         = document.getElementById('nav');
  const floatingCta = document.getElementById('floatingCta');
  const backToTop   = document.getElementById('backToTop');
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // ──────────────────────────────────────────────
  // 1. FLOATING CTA & BACK TO TOP helpers
  //    (defined first so handleScroll can use them)
  // ──────────────────────────────────────────────
  const handleFloatingCta = () => {
    floatingCta && floatingCta.classList.toggle('visible', window.scrollY > 400);
  };

  const handleBackToTop = () => {
    backToTop && backToTop.classList.toggle('visible', window.scrollY > 600);
  };

  // ──────────────────────────────────────────────
  // 2. HEADER scroll behaviour
  // ──────────────────────────────────────────────
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    handleFloatingCta();
    handleBackToTop();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // safe now — all helpers defined above


  // ──────────────────────────────────────────────
  // 3. BACK TO TOP click
  // ──────────────────────────────────────────────
  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ──────────────────────────────────────────────
  // 4. MOBILE HAMBURGER MENU
  // ──────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);

  const openMenu = () => {
    hamburger.classList.add('open');
    nav.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    nav.classList.contains('open') ? closeMenu() : openMenu()
  );
  overlay.addEventListener('click', closeMenu);
  nav.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });


  // ──────────────────────────────────────────────
  // 5. SMOOTH SCROLL for anchor links
  // ──────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ──────────────────────────────────────────────
  // 6. SCROLL-REVEAL (animation only — content visible without this)
  // ──────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger cards inside grids
            const grid = entry.target.closest(
              '.services__grid, .testimonials__grid, .gallery__grid, .trust-bar__inner, .before-after__grid'
            );
            if (grid) {
              const siblings = [...grid.querySelectorAll('.reveal:not(.visible)')];
              const idx = siblings.indexOf(entry.target);
              entry.target.style.animationDelay = `${idx * 70}ms`;
            }
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: mark all visible immediately
    reveals.forEach(el => el.classList.add('visible'));
  }


  // ──────────────────────────────────────────────
  // 7. CONTACT FORM
  // ──────────────────────────────────────────────
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        form.style.animation = 'none';
        form.offsetHeight;
        form.style.animation = 'shake 0.4s ease';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector('#email').style.borderColor = '#e53e3e';
        form.querySelector('#email').focus();
        return;
      }

      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1400));
      btn.innerHTML = orig;
      btn.disabled = false;
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    });

    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }


  // ──────────────────────────────────────────────
  // 8. ACTIVE NAV LINK scroll spy
  // ──────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      }),
      { threshold: 0.35 }
    );
    sections.forEach(s => spyObserver.observe(s));
  }


  // Parallax handled natively via CSS background-attachment: fixed

});

/* Inject shake + active nav styles */
const s = document.createElement('style');
s.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }
  .nav__link.active { color: var(--green-light) !important; }
  .header.scrolled .nav__link.active { color: var(--green-dark) !important; background: var(--green-pale); }
`;
document.head.appendChild(s);
