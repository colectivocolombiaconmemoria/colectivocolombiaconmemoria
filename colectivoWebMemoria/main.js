/* ─────────────────────────────────────────────────────
   COLOMBIA CON MEMORIA — main.js
   Navbar scroll · Mobile menu · Testimonial carousel
   Lightbox · Scroll reveal · Gallery loop
───────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Navbar scroll effect ───────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger menu ──────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Testimonial carousel ───────────────────────── */
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('tDots');
  const cards  = Array.from(track.querySelectorAll('.testimonial-card'));
  const VISIBLE = window.innerWidth < 700 ? 1 : window.innerWidth < 900 ? 2 : 3;
  let current = 0;
  let autoInterval;

  // Build dots
  const totalSlides = Math.ceil(cards.length / VISIBLE);
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    const offset = current * (100 / VISIBLE);
    // Shift cards
    const cardWidth = 100 / VISIBLE;
    cards.forEach((card, i) => {
      card.style.transform = `translateX(calc(-${current * 100 * VISIBLE}% - ${current * 24}px))`;
    });
    // Actually translate the track
    track.style.transform = `translateX(calc(-${current * (100 / VISIBLE * VISIBLE)}% - ${current * 24 * VISIBLE}px))`;

    // Simpler approach: update with flex offset
    const gap = 24;
    const cardPercentage = `calc(${100 / VISIBLE}% - ${gap * (VISIBLE - 1) / VISIBLE}px)`;
    cards.forEach((card) => { card.style.flex = `0 0 ${cardPercentage}`; });

    // Translate
    const slideWidth = track.offsetWidth / VISIBLE + gap;
    track.style.transform = `translateX(-${current * slideWidth * VISIBLE / VISIBLE}px)`;

    // Update dots
    dotsEl.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Highlight active card
    cards.forEach((c, i) => {
      const start = current * VISIBLE;
      const end   = start + VISIBLE;
      c.classList.toggle('active', i >= start && i < end);
    });
  }

  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  document.getElementById('tNext').addEventListener('click', () => { nextSlide(); resetAuto(); });
  document.getElementById('tPrev').addEventListener('click', () => { prevSlide(); resetAuto(); });

  function startAuto() { autoInterval = setInterval(nextSlide, 5000); }
  function resetAuto()  { clearInterval(autoInterval); startAuto(); }

  // Init
  track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  track.style.willChange = 'transform';
  goTo(0);
  startAuto();

  /* ── Gallery strip: duplicate items for seamless loop ── */
  const stripInner = document.querySelector('.gallery-strip-inner');
  if (stripInner) {
    const clone = stripInner.innerHTML;
    stripInner.innerHTML += clone; // duplicate for infinite scroll
  }

  /* ── Lightbox ────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbClose  = document.getElementById('lbClose');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  // Attach to cartel cards
  document.querySelectorAll('.cartel-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  // Attach to portfolio cards
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── Scroll reveal ───────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.about-grid, .cartel-card, .portfolio-card, .team-card, .value-item, .contact-grid, .section-header'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Contact form ────────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('sendBtn');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('show');
        form.reset();
        btn.textContent = 'Enviar Mensaje';
        btn.disabled = false;
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ── Active nav link on scroll ───────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => sectionObserver.observe(s));

})();
