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


  /* ════════════ INDUSTRY RAIL ════════════ */
  const rail = document.getElementById('industriesRail');
  const cards = document.querySelectorAll('.industry-card');
  const dots = document.querySelectorAll('.rail-dot');
  const prevBtn = document.getElementById('railPrev');
  const nextBtn = document.getElementById('railNext');

  let currentRailIndex = 0;
  let isDragging = false;
  let startX, scrollLeft;

  const updateRailActive = () => {
    if (!rail) return;
    const scrollPos = rail.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 24;
    const activeIdx = Math.round(scrollPos / cardWidth);
    
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === activeIdx);
    });

    const dotIdx = Math.floor(activeIdx / 2);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === dotIdx);
    });
  };

  // Click to focus
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const cardWidth = card.offsetWidth + 24;
      rail.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    });
  });

  if (rail) {
    rail.addEventListener('scroll', updateRailActive);
    
    // Drag to scroll
    rail.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    });
    rail.addEventListener('mouseleave', () => isDragging = false);
    rail.addEventListener('mouseup', () => isDragging = false);
    rail.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 2;
      rail.scrollLeft = scrollLeft - walk;
    });

    // Auto scroll
    let autoScrollInterval = setInterval(() => {
      if (isDragging) return;
      currentRailIndex = (currentRailIndex + 1) % cards.length;
      const cardWidth = cards[0].offsetWidth + 24;
      rail.scrollTo({ left: currentRailIndex * cardWidth, behavior: 'smooth' });
    }, 5000);

    rail.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));

    nextBtn?.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 24;
      rail.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
    prevBtn?.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 24;
      rail.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  /* ════════════ SERVICES CARD INTERACTION (v8 Editorial) ════════════ */
  const v8Cards = document.querySelectorAll('.v8-card');
  if (v8Cards.length > 0) {
    v8Cards.forEach(card => {
      card.addEventListener('click', () => {
        v8Cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }

  /* ════════════ TRUST TIMELINE ════════════ */
  const trustSection = document.querySelector('.trust-section');
  const trustProgress = document.getElementById('trustProgress');
  const trustSteps = document.querySelectorAll('.trust-step');

  window.addEventListener('scroll', () => {
    if (!trustSection) return;
    
    const rect = trustSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const scrolled = Math.max(0, Math.min(1, (window.innerHeight / 2 - rect.top) / sectionHeight));
    
    if (trustProgress) {
      trustProgress.style.height = `${scrolled * 100}%`;
    }

    trustSteps.forEach((step, i) => {
      const stepRect = step.getBoundingClientRect();
      const stepPoint = window.innerHeight / 2 + 100;
      
      if (stepRect.top < stepPoint) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  });

  /* ════════════ PROBLEM CARDS INTERACTION ════════════ */
  const problemCards = document.querySelectorAll('.p-card-v5');
  problemCards.forEach(card => {
    card.addEventListener('click', () => {
      problemCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Optional: Set first card active by default
  if (problemCards.length > 0) problemCards[0].classList.add('active');
});

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
