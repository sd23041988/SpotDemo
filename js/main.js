/* ============================================================
   JAIN University – Spot Counselling 2026
   main.js  |  Shared scripts – XSS-safe, no eval, CSP-friendly
   ============================================================ */

(function () {
  'use strict';

  /* ── Sanitiser: strip HTML from any user-visible strings ── */
  function sanitise(str) {
    if (typeof str !== 'string') return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ── Navbar hamburger ── */
  const hamburger = document.getElementById('navHamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      const open = navMobile.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    // close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        navMobile.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = btn.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-q').forEach(function (q) {
        q.classList.remove('open');
        const ans = q.nextElementSibling;
        if (ans && ans.classList.contains('faq-a')) ans.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        const ans = btn.nextElementSibling;
        if (ans && ans.classList.contains('faq-a')) ans.classList.add('open');
      }
    });
  });

  /* ── Scroll-reveal (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Back-to-top ── */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('show', window.scrollY > 400);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── WhatsApp widget ── */
  const waBtn    = document.getElementById('waBtn');
  const waBubble = document.getElementById('waBubble');
  const waClose  = document.getElementById('waClose');

  if (waBtn) {
    // Show bubble after 4 seconds
    setTimeout(function () {
      if (waBubble) waBubble.classList.add('show');
    }, 4000);

    waBtn.addEventListener('click', function () {
      const num  = '917337618222';
      const msg  = encodeURIComponent('Hi! I saw the Spot Counselling 2026 event. I would like to know more about admissions at JAIN University.');
      window.open('https://wa.me/' + num + '?text=' + msg, '_blank', 'noopener,noreferrer');
    });
  }
  if (waClose) {
    waClose.addEventListener('click', function (e) {
      e.stopPropagation();
      waBubble.classList.remove('show');
    });
  }

  /* ── Cookie banner ── */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  if (cookieBanner) {
    try {
      if (!localStorage.getItem('ju_cookie_ok')) {
        setTimeout(function () { cookieBanner.classList.add('show'); }, 2000);
      }
    } catch (e) { /* private mode */ }
    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () {
        try { localStorage.setItem('ju_cookie_ok', '1'); } catch (e) {}
        cookieBanner.classList.remove('show');
      });
    }
  }

  /* ── Schedule table filters ── */
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('#scheduleTable tbody tr').forEach(function (row) {
          const state = (row.dataset.state || '').toLowerCase();
          const month = (row.dataset.month || '').toLowerCase();
          if (f === 'all' || state === f.toLowerCase() || month === f.toLowerCase()) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Course tabs ── */
  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        document.querySelectorAll('.courses-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        const panel = document.getElementById('panel-' + btn.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── Smooth anchor nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        if (navMobile) navMobile.classList.remove('open');
      }
    });
  });

  /* ── Active nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAs.length) {
    window.addEventListener('scroll', function () {
      let current = '';
      sections.forEach(function (sec) {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
      });
      navAs.forEach(function (a) {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--brand-orange)' : '';
      });
    });
  }

})();
