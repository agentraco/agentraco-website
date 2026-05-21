document.addEventListener('DOMContentLoaded', () => {
  /* ════════════ REVEAL SYSTEM ════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ════════════ MOBILE MENU ════════════ */
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }


  /* ════════════ INDUSTRIES SHOWCASE CAROUSEL ════════════ */
  const showcase = document.getElementById('industriesShowcase');
  const slides = document.querySelectorAll('.showcase-slide');
  const visualWrappers = document.querySelectorAll('.showcase-visual-wrapper');
  const dots = document.querySelectorAll('.showcase-dot');
  const prevBtn = document.getElementById('showcasePrevBtn');
  const nextBtn = document.getElementById('showcaseNextBtn');
  
  let currentSlideIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;
  
  // Helper to dynamically read current active index from the DOM (eliminates stale state)
  function getActiveIndex() {
    const activeSlide = document.querySelector('.showcase-slide.active');
    const idx = Array.from(slides).indexOf(activeSlide);
    return idx === -1 ? 0 : idx;
  }
  
  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Determine wrapped index bounds
    let targetIndex = index;
    if (targetIndex >= slides.length) targetIndex = 0;
    if (targetIndex < 0) targetIndex = slides.length - 1;
    
    const activeSlide = document.querySelector('.showcase-slide.active');
    const targetSlide = slides[targetIndex];
    
    if (activeSlide === targetSlide) return;
    
    // Set exit animation
    if (activeSlide) {
      activeSlide.classList.remove('active');
      activeSlide.classList.add('exiting');
      
      // Clear exit state after animation duration
      setTimeout(() => {
        activeSlide.classList.remove('exiting');
      }, 900);
    }
    
    // Activate target slide
    targetSlide.classList.add('active');
    
    // Update indicator pagination dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });
    
    currentSlideIndex = targetIndex;
  }
  
  // Timer Actions and Hover Logic
  let hoverTimeout = null;
  let isHovered = false;

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      showSlide(getActiveIndex() + 1);
    }, AUTOPLAY_DELAY);
  }
  
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function handleHoverStart() {
    isHovered = true;
    stopAutoplay();
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    // Pause auto-slide for 15 seconds. If still hovered, move to next slide.
    hoverTimeout = setTimeout(() => {
      if (isHovered) {
        showSlide(getActiveIndex() + 1);
        handleHoverStart(); // Restart 15s hover timer
      }
    }, 15000);
  }

  function handleHoverEnd() {
    isHovered = false;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    startAutoplay();
  }
  
  function handleManualInteraction(actionFn) {
    stopAutoplay();
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    actionFn();
    if (isHovered) {
      handleHoverStart();
    } else {
      startAutoplay(); // Reset timer smoothly
    }
  }
  
  // Event Bindings
  if (showcase) {
    // Attach hover listener to visual wrappers (left-side image) to pause auto-slide
    visualWrappers.forEach(wrapper => {
      wrapper.addEventListener('mouseenter', handleHoverStart);
      wrapper.addEventListener('mouseleave', handleHoverEnd);
    });

    // Arrow Triggers
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        handleManualInteraction(() => showSlide(getActiveIndex() - 1));
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        handleManualInteraction(() => showSlide(getActiveIndex() + 1));
      });
    }
    
    // Dot Triggers
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        handleManualInteraction(() => showSlide(index));
      });
    });
    
    // Accessibility: Keyboard Navigation Triggers
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        handleManualInteraction(() => showSlide(getActiveIndex() - 1));
      } else if (e.key === 'ArrowRight') {
        handleManualInteraction(() => showSlide(getActiveIndex() + 1));
      }
    });
    
    // Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    showcase.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    showcase.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      // Ensure horizontal swipe is dominant and exceeds threshold
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) {
          // Swiped left -> Next
          handleManualInteraction(() => showSlide(getActiveIndex() + 1));
        } else {
          // Swiped right -> Previous
          handleManualInteraction(() => showSlide(getActiveIndex() - 1));
        }
      }
    }, { passive: true });
    
    // Initialize Autoplay immediately without load pause
    startAutoplay();
  }

  /* ════════════ SERVICES CIRCULAR WHEEL ════════════ */
  const serviceWheelRoot = document.getElementById('serviceWheel');
  if (serviceWheelRoot) {
    ServiceWheel.init(serviceWheelRoot);
  }

  /* ════════════ TRUST TIMELINE ════════════ */
  const trustSection = document.querySelector('.trust-section');
  const trustProgress = document.getElementById('trustProgress');
  const trustSteps = document.querySelectorAll('.trust-step');
  const timelineLine = document.querySelector('.timeline-line');

  const updateTrustTimeline = () => {
    if (!trustSection || !trustProgress || !timelineLine) return;

    const lineRect = timelineLine.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.5; // Perfect center trigger line

    // Grow progress line precisely down to triggerY
    let progressHeight = Math.max(0, Math.min(lineRect.height, triggerY - lineRect.top));
    trustProgress.style.height = `${progressHeight}px`;

    trustSteps.forEach((step) => {
      const node = step.querySelector('.step-node');
      if (!node) return;

      const nodeRect = node.getBoundingClientRect();
      const nodeCenter = nodeRect.top + nodeRect.height / 2;

      // Circle changes color only when the progress line physically reaches/crosses it
      if (nodeCenter <= triggerY) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', updateTrustTimeline);
  window.addEventListener('resize', updateTrustTimeline);
  updateTrustTimeline();

  /* ════════════ PROBLEM CARDS INTERACTION ════════════ */
  const problemCards = document.querySelectorAll('.p-card-v5');
  problemCards.forEach(card => {
    card.addEventListener('click', () => {
      problemCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

});

/* ════════════ SERVICE WHEEL MODULE ════════════ */
const SERVICES_DATA = [
  {
    meta: '01 — Core',
    title: '24/7 AI Phone Receptionist',
    description: 'Answers every call with your brand voice — day, night, weekends, holidays.',
    accent: 'orange',
    icon: 'phone',
    features: [
      'Answers every call with your brand voice',
      'Day, night, weekends, and holidays',
      'Consistent coverage without staffing gaps'
    ]
  },
  {
    meta: '02 — Core',
    title: 'FAQ Handling',
    description: 'Hours, location, parking, menu, pricing — answered instantly with your facts.',
    accent: 'green',
    icon: 'faq',
    features: [
      'Hours, location, parking, menu, pricing',
      'Answered instantly with your facts',
      'Frees your team from repetitive calls'
    ]
  },
  {
    meta: '03 — Core',
    title: 'Reservations & Appointments',
    description: 'Books, reschedules, and cancels through your existing systems.',
    accent: 'orange',
    icon: 'calendar',
    features: [
      'Books through your existing systems',
      'Reschedules and cancels on request',
      'Keeps your calendar accurate in real time'
    ]
  },
  {
    meta: '04 — Core',
    title: 'Request Capture',
    description: 'Callbacks, catering quotes, and service inquiries logged in structured form.',
    accent: 'green',
    icon: 'capture',
    features: [
      'Callbacks and catering quotes captured',
      'Service inquiries logged in structured form',
      'Nothing lost between the call and your team'
    ]
  },
  {
    meta: '05 — Core',
    title: 'SMS Confirmations',
    description: 'Two-way SMS for confirmations, reminders, and clarifications.',
    accent: 'orange',
    icon: 'sms',
    features: [
      'Two-way SMS for confirmations',
      'Reminders and clarifications sent automatically',
      'Customers and staff stay aligned'
    ]
  },
  {
    meta: '06 — Core',
    title: 'Staff Routing',
    description: 'Important calls and edge cases reach the right person — never get dropped.',
    accent: 'green',
    icon: 'routing',
    features: [
      'Important calls reach the right person',
      'Edge cases escalated immediately',
      'Never get dropped or forgotten'
    ]
  },
  {
    meta: '07 — Core',
    title: 'Call Summaries & Analytics',
    description: 'Every call summarized; trends surfaced so you can act on them.',
    accent: 'orange',
    icon: 'analytics',
    features: [
      'Every call summarized automatically',
      'Trends surfaced so you can act',
      'Visibility into what customers ask most'
    ]
  },
  {
    meta: '08 — Add-on',
    title: 'Review Management',
    description: 'Request, monitor, and respond to reviews where your customers actually look.',
    accent: 'green',
    icon: 'reviews',
    features: [
      'Request reviews where customers look',
      'Monitor feedback across platforms',
      'Respond without missing a beat'
    ]
  },
  {
    meta: '09 — Add-on',
    title: 'Lead Capture & Follow-up',
    description: 'Web forms, callback flows, and nurture sequences in one place.',
    accent: 'orange',
    icon: 'leads',
    features: [
      'Web forms and callback flows unified',
      'Nurture sequences in one place',
      'Follow-up that actually happens'
    ]
  }
];

const SERVICE_ICONS = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
  faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  capture: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  routing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  reviews: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  leads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>'
};

const ServiceWheel = {
  activeIndex: 0,
  orbitRotation: 0,
  isAnimating: false,
  orbitTrack: null,
  centerCard: null,
  dotsNav: null,
  duration: 420,
  orbitCount: 8,

  init(root) {
    this.root = root;
    this.orbitTrack = document.getElementById('swOrbitTrack');
    this.centerCard = document.getElementById('swCenterCard');
    this.dotsNav = document.getElementById('swDots');

    root.querySelector('.sw-arrow--prev')?.addEventListener('click', () => this.go(-1));
    root.querySelector('.sw-arrow--next')?.addEventListener('click', () => this.go(1));

    this.renderDots();
    this.renderOrbit();
    this.renderCenter(false);

    this.dotsNav?.addEventListener('click', (e) => {
      const btn = e.target.closest('.sw-dot');
      if (!btn) return;
      this.select(parseInt(btn.dataset.index, 10));
    });
  },

  go(dir) {
    const next = (this.activeIndex + dir + SERVICES_DATA.length) % SERVICES_DATA.length;
    this.select(next);
  },

  select(index) {
    if (index === this.activeIndex || this.isAnimating) return;
    if (index < 0 || index >= SERVICES_DATA.length) return;

    const slotIndex = (index - this.activeIndex - 1 + SERVICES_DATA.length) % this.orbitCount;
    const step = 360 / this.orbitCount;

    this.isAnimating = true;
    this.orbitRotation -= slotIndex * step;
    this.orbitTrack.style.transform = `rotate(${this.orbitRotation}deg)`;

    window.setTimeout(() => {
      this.activeIndex = index;
      this.orbitRotation = 0;
      this.orbitTrack.style.transition = 'none';
      this.orbitTrack.style.transform = 'rotate(0deg)';
      this.renderOrbit();
      this.renderCenter(true);
      this.updateDots();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.orbitTrack.style.transition = '';
          this.isAnimating = false;
        });
      });
    }, this.duration);
  },

  renderDots() {
    if (!this.dotsNav) return;
    this.dotsNav.innerHTML = SERVICES_DATA.map((_, i) =>
      `<button type="button" class="sw-dot${i === this.activeIndex ? ' is-active' : ''}" data-index="${i}" aria-label="Show service ${i + 1}"></button>`
    ).join('');
  },

  updateDots() {
    this.dotsNav?.querySelectorAll('.sw-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.activeIndex);
    });
  },

  renderOrbit() {
    if (!this.orbitTrack) return;
    const step = 360 / this.orbitCount;
    const fragment = document.createDocumentFragment();

    for (let slot = 0; slot < this.orbitCount; slot++) {
      const serviceIndex = (this.activeIndex + 1 + slot) % SERVICES_DATA.length;
      const service = SERVICES_DATA[serviceIndex];
      const angle = -90 + slot * step;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sw-orbit-card accent-${service.accent}`;
      btn.dataset.index = String(serviceIndex);
      btn.style.setProperty('--angle', `${angle}deg`);
      btn.setAttribute('aria-label', service.title);
      btn.innerHTML = `
        <span class="sw-orbit-num">${serviceIndex + 1}</span>
        <div class="sw-orbit-icon-wrap">${SERVICE_ICONS[service.icon]}</div>
        <h4>${service.title}</h4>
        <p>${service.description}</p>
      `;
      btn.addEventListener('click', () => this.select(serviceIndex));
      fragment.appendChild(btn);
    }

    this.orbitTrack.replaceChildren(fragment);
  },

  renderCenter(animate) {
    if (!this.centerCard) return;
    const service = SERVICES_DATA[this.activeIndex];
    const fixedHtml = `
      <div class="sw-center-inner">
        <span class="sw-center-badge">${this.activeIndex + 1}</span>
        <div class="sw-center-icon">${SERVICE_ICONS[service.icon]}</div>
        <span class="sw-center-meta">${service.meta}</span>
        <h3 class="sw-center-title">${service.title}</h3>
        <p class="sw-center-desc">${service.description}</p>
        <ul class="sw-center-features">
          ${service.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `;

    const applyContent = () => {
      this.centerCard.className = `sw-center-card accent-${service.accent}`;
      this.centerCard.innerHTML = fixedHtml;
    };

    if (!animate) {
      applyContent();
      return;
    }

    const inner = this.centerCard.querySelector('.sw-center-inner');
    if (inner) inner.classList.add('is-fading');

    window.setTimeout(() => {
      applyContent();
      const newInner = this.centerCard.querySelector('.sw-center-inner');
      newInner?.classList.add('is-fading');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => newInner?.classList.remove('is-fading'));
      });
    }, 180);
  }
};

/* ════════════ CONTACT MODAL LOGIC ════════════ */
function openContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  }
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scroll
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactModal();
});
