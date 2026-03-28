/* ================================================
   AGRASENI HOSPITAL — Apple Theme JavaScript
   ================================================ */

// ---- PAGE LOAD ANIMATION ----
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => {
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity  = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- REVEAL ON SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 60, 300));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1800) {
  const isDecimal = target % 1 !== 0;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      if (!isNaN(target)) animateCounter(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ---- DOCTOR FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const docCards = document.querySelectorAll('.doc-portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    docCards.forEach(card => {
      const category = card.dataset.category || '';
      const show = filter === 'all' || category.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger reveal for newly visible cards
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- DOCTOR IMAGE FALLBACKS ----
document.querySelectorAll('.dpc-avatar-wrap img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const fallback = img.nextElementSibling;
    if (fallback && fallback.classList.contains('dpc-fallback')) {
      fallback.style.zIndex = '2';
    }
  });

  // If already broken on load (cached 404 etc)
  if (img.complete && img.naturalHeight === 0) {
    img.style.display = 'none';
    const fallback = img.nextElementSibling;
    if (fallback && fallback.classList.contains('dpc-fallback')) {
      fallback.style.zIndex = '2';
    }
  }
});

// ---- GALLERY LIGHTBOX ----
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img   = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay span');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;cursor:zoom-out;padding:24px;animation:fadeIn 0.2s ease;`;

    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);

    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90vw;max-height:80vh;border-radius:16px;object-fit:contain;box-shadow:0 40px 100px rgba(0,0,0,0.8);';

    const caption = document.createElement('div');
    caption.textContent = label ? label.textContent : '';
    caption.style.cssText = 'font-size:15px;color:rgba(255,255,255,0.6);font-family:inherit;';

    const close = document.createElement('div');
    close.textContent = '✕';
    close.style.cssText = 'position:fixed;top:24px;right:24px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.1);border-radius:50%;font-size:16px;cursor:pointer;color:#fff;border:1px solid rgba(255,255,255,0.2);';

    overlay.appendChild(bigImg);
    overlay.appendChild(caption);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeOverlay = () => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', keyHandler);
    };
    const keyHandler = e => { if (e.key === 'Escape') closeOverlay(); };

    overlay.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', keyHandler);
  });
});

console.log('%c Agraseni Hospital\n%c Apple-themed design with doctor portfolios', 'color:#0a84ff;font-size:18px;font-weight:bold;', 'color:#636366;font-size:12px;');
