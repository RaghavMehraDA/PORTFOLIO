/* ==========================================================================
   PORTFOLIO SCRIPT — script.js
   Interactivity for RAGHAV MEHRA's Portfolio Website
   ========================================================================== */

(function () {
  'use strict';

  // Mark JS enabled for smooth reveal animations
  document.documentElement.classList.add('js');

  /* =====================================================================
     01. PRELOADER — Hide when page loads
     ===================================================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add('hidden');
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 400));
    }
    // Safety fallback timer
    setTimeout(hidePreloader, 2000);
  }

  /* =====================================================================
     02. NAVIGATION — Scrolled bar, active links, mobile toggle
     ===================================================================== */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (nav) {
    const onScrollNav = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active navigation highlight based on visible section
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const isActive = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('active', isActive);
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* =====================================================================
     04. REVEAL ON SCROLL
     ===================================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('inview');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('inview'));
  }

  /* =====================================================================
     05. ANIMATED COUNTERS (About Stats)
     ===================================================================== */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 1600;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => {
      c.textContent = c.getAttribute('data-count');
    });
  }

  /* =====================================================================
     06. ANIMATED SKILL BARS
     ===================================================================== */
  const skills = document.querySelectorAll('.progress');
  if ('IntersectionObserver' in window && skills.length > 0) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const wrapper = entry.target;
          const value = parseInt(wrapper.getAttribute('data-value'), 10);
          const fill = wrapper.querySelector('.progress__fill');
          const pct = wrapper.querySelector('.progress__pct');

          wrapper.classList.add('inview');

          setTimeout(() => {
            if (fill) fill.style.width = value + '%';
            if (pct) {
              pct.style.opacity = '1';
              pct.style.transform = 'translateX(0)';
            }
          }, 100);

          observer.unobserve(wrapper);
        });
      },
      { threshold: 0.3 }
    );
    skills.forEach((s) => skillObserver.observe(s));
  } else {
    skills.forEach((s) => {
      const fill = s.querySelector('.progress__fill');
      const val = s.getAttribute('data-value');
      if (fill) fill.style.width = val + '%';
    });
  }

  /* =====================================================================
     07. DATA DASHBOARD BAR CHART
     ===================================================================== */
  const dashboard = document.querySelector('.dashboard');
  if (dashboard && 'IntersectionObserver' in window) {
    const dashObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dashboard.classList.add('inview');
            observer.unobserve(dashboard);
          }
        });
      },
      { threshold: 0.2 }
    );
    dashObserver.observe(dashboard);
  } else if (dashboard) {
    dashboard.classList.add('inview');
  }

  /* =====================================================================
     08. CONTACT FORM HANDLER
     ===================================================================== */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        status.style.color = '#f87171';
        status.textContent = 'Please fill in your name, email and message.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.style.color = '#f87171';
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      status.style.color = 'var(--accent-3)';
      status.textContent = `Thank you, ${name}! Your message has been sent. I will get back to you within 24 hours.`;
      form.reset();
    });
  }

  /* =====================================================================
     09. FOOTER YEAR
     ===================================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================================
     10. FLOATING BACK TO TOP BUTTON
     ===================================================================== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const onScrollBTT = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('floating', 'visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', onScrollBTT, { passive: true });
  }

  /* =====================================================================
     11. DESKTOP TILT EFFECT ON PROJECT CARDS
     ===================================================================== */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();
