/**
 * ZEAL GLOBAL — Corporate website scripts
 * Smooth scroll, navbar, mobile menu, scroll reveal, contact form
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contact-form');
  const yearEl = document.getElementById('year');

  // ——— Navbar scroll effect ———
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ——— Mobile menu toggle ———
  function toggleMenu() {
    var isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', function () {
      if (navMenu.classList.contains('active')) toggleMenu();
    });
  }

  // Close menu on link click (smooth scroll then close)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu();
    }
  });

  // ——— Clients strip: pause auto-scroll when user manually scrolls ———
  (function initClientsStripScroll() {
    var strip = document.getElementById('clients-strip');
    var track = strip && strip.querySelector('.clients__track');
    if (!strip || !track) return;
    var pauseTimeout;
    function pauseAnimation() {
      track.style.animationPlayState = 'paused';
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(function () {
        track.style.animationPlayState = '';
      }, 1500);
    }
    strip.addEventListener('scroll', pauseAnimation, { passive: true });
    strip.addEventListener('touchstart', pauseAnimation, { passive: true });
    strip.addEventListener('wheel', pauseAnimation, { passive: true });
  })();

  // ——— Smooth scroll for anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ——— Scroll reveal animation ———
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.section__header, .about__image, .about__content, .service-card, .project-card, .why-us__item, .safety__item, .clients__strip, .stats__item, .careers__box, .contact__info, .contact__form-wrapper'
    );

    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  if ('IntersectionObserver' in window) {
    initReveal();
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ——— Hero: 5 videos in plus layout; center always 22098, others random ———
  (function initHeroVideoPlus() {
    var container = document.getElementById('hero-video-plus');
    if (!container) return;
    var slots = container.querySelectorAll('.hero__video-slot video');
    if (slots.length !== 5) return;
    var centerVideo = '22098-325253535_medium.mp4';
    var otherSources = [
      '129409-744385400_medium.mp4',
      '28024-367196732_medium.mp4',
      '43498-436041844_medium.mp4',
      '85824-590437558_medium.mp4'
    ];
    // Shuffle the 4 for top, left, right, bottom (Fisher–Yates)
    for (var i = otherSources.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = otherSources[i];
      otherSources[i] = otherSources[j];
      otherSources[j] = t;
    }
    // Slots order: top(0), left(1), center(2), right(3), bottom(4)
    slots[0].src = otherSources[0];
    slots[1].src = otherSources[1];
    slots[2].src = centerVideo;
    slots[3].src = otherSources[2];
    slots[4].src = otherSources[3];
    slots.forEach(function (video, index) {
      video.setAttribute('aria-label', 'Telecom video ' + (index + 1));
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.addEventListener('loadeddata', function () {
        video.play().catch(function () {});
      });
      video.addEventListener('canplay', function () {
        video.play().catch(function () {});
      });
      if (video.readyState >= 2) video.play().catch(function () {});
    });
  })();

  // ——— About section: image shuffle slideshow (team-wrok folder) ———
  function initAboutImageShuffle() {
    const container = document.getElementById('about-image-shuffle');
    if (!container) return;
    const images = container.querySelectorAll('img');
    if (images.length === 0) return;

    // Shuffle order: Fisher–Yates
    var order = [];
    for (var i = 0; i < images.length; i++) order.push(i);
    for (var j = order.length - 1; j > 0; j--) {
      var r = Math.floor(Math.random() * (j + 1));
      var t = order[j];
      order[j] = order[r];
      order[r] = t;
    }

    var index = 0;
    images[order[0]].classList.add('is-active');

    setInterval(function () {
      images[order[index]].classList.remove('is-active');
      index = (index + 1) % order.length;
      images[order[index]].classList.add('is-active');
    }, 4000);
  }
  initAboutImageShuffle();

  // ——— Contact form ———
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate submit (replace with actual endpoint or mailto if needed)
      setTimeout(function () {
        btn.textContent = 'Message Sent';
        btn.style.background = '#0d6832';
        contactForm.reset();
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 800);
    });
  }

  // ——— Footer year ———
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ——— Map: show ZEAL GLOBAL location on click (with loading state) ———
  const mapPlaceholder = document.getElementById('map-placeholder');
  const mapEmbed = document.getElementById('map-embed');
  // Exact location: Zeal Global, Plot C-128, Phase-8, Sector 73, SAS Nagar, Punjab 160071
  const mapLat = 30.713147;
  const mapLng = 76.709549;
  const mapSrc = 'https://www.google.com/maps?q=' + mapLat + ',' + mapLng + '&output=embed&z=18';

  function showMap() {
    if (!mapPlaceholder || !mapEmbed) return;
    mapPlaceholder.setAttribute('aria-hidden', 'true');
    mapPlaceholder.classList.add('map-placeholder--hidden');
    mapEmbed.setAttribute('aria-hidden', 'false');
    mapEmbed.classList.add('map-embed--visible');
    mapEmbed.innerHTML = '<div class="map-loading" aria-live="polite">Loading map…</div>';
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', mapSrc);
    iframe.setAttribute('title', 'ZEAL GLOBAL – Plot No. C-128, Phase-8, Industrial Area, Sector 73, SAS Nagar, Punjab 160071');
    iframe.className = 'map-iframe';
    iframe.onload = function () {
      var loading = mapEmbed.querySelector('.map-loading');
      if (loading) loading.remove();
    };
    mapEmbed.appendChild(iframe);
    mapPlaceholder.removeEventListener('click', showMap);
  }

  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', showMap);
  }

  // ——— Animated counter (stats section) ———
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stats__number');
  var statsAnimated = false;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1800;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.floor(easeOut * target);
      el.textContent = current;
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = target;
    }

    window.requestAnimationFrame(step);
  }

  function checkStats() {
    if (!statsSection || statsAnimated) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNumbers.forEach(animateCounter);
    }
  }

  window.addEventListener('scroll', checkStats, { passive: true });
  checkStats();
})();
