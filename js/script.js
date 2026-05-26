/* ============================================
   EVENTIAN - Premium Event Management
   Main JavaScript
   ============================================ */

'use strict';

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hide');
      setTimeout(() => { preloader.style.display = 'none'; }, 800);
    }
  }, 2800);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
});

function animateRing() {
  if (cursorRing) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .glass-card, .service-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorDot) { cursorDot.style.width = '14px'; cursorDot.style.height = '14px'; }
    if (cursorRing) { cursorRing.style.width = '56px'; cursorRing.style.height = '56px'; cursorRing.style.borderColor = 'rgba(212,175,55,0.9)'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursorDot) { cursorDot.style.width = '8px'; cursorDot.style.height = '8px'; }
    if (cursorRing) { cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'rgba(212,175,55,0.6)'; }
  });
});

// ============================================
// SCROLL PROGRESS
// ============================================
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
});

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ============================================
// FLOATING PARTICLES CANVAS
// ============================================
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.6 + 0.1,
    pulse: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += 0.02;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles('hero-canvas');

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateCounter(el, target, duration = 2000) {
  let start = 0, startTime = null;
  const isDecimal = target % 1 !== 0;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal ? (ease * target).toFixed(1) : Math.floor(ease * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl) {
        const target = parseFloat(numEl.getAttribute('data-target'));
        animateCounter(numEl, target);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));

// ============================================
// TESTIMONIALS SLIDER
// ============================================
function initSlider(trackSelector, dotsSelector, prevSelector, nextSelector) {
  const track = document.querySelector(trackSelector);
  if (!track) return;
  const slides = track.querySelectorAll('.testimonial-slide, .swiper-slide');
  const dots = document.querySelector(dotsSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  if (!slides.length) return;

  let current = 0;
  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    if (dots) dots.querySelectorAll('.slider-dot').forEach((d, idx) => d.classList.toggle('active', idx === current));
  }
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  if (dots) {
    dots.querySelectorAll('.slider-dot').forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  }
  // Auto-advance
  setInterval(() => goTo(current + 1), 5000);
}
initSlider('.testimonial-track', '.slider-dots', '.slider-prev', '.slider-next');

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// ============================================
// MUSIC TOGGLE
// ============================================
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

let musicPlaying = false;

if (musicToggle && bgMusic) {

  // Set default volume
  bgMusic.volume = 1.0;

  musicToggle.addEventListener('click', async () => {

    try {

      if (!musicPlaying) {

        await bgMusic.play();
        musicPlaying = true;

        musicToggle.classList.remove('paused');
        musicToggle.style.boxShadow =
          '0 0 25px rgba(212,175,55,0.5)';

      } else {

        bgMusic.pause();
        musicPlaying = false;

        musicToggle.classList.add('paused');
        musicToggle.style.boxShadow = '';

      }

    } catch (err) {
      console.log('Music play blocked:', err);
    }

  });

}

// ============================================
// BOOKING FORM (EmailJS integration)
// ============================================
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = bookingForm.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    // EmailJS integration
    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.send('service_vjh07pm', 'template_9sgih1s', {
          to_email: 'tawhidalhasain2021@gmail.com',
          from_name: data.fullName,
          from_email: data.email,
          phone: data.phone,
          event_type: data.eventType,
          event_date: data.eventDate,
          event_location: data.eventLocation,
          guests: data.guests,
          budget: data.budget,
          special_requirements: data.specialRequirements,
          theme: data.theme,
          catering: data.catering,
          photography: data.photography,
          decoration: data.decoration
        });
      }
      // Show success
      showFormSuccess();
    } catch (err) {
      // Fallback: mailto link
      const subject = encodeURIComponent(`Booking Inquiry - ${data.eventType}`);
      const body = encodeURIComponent(Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n'));
      window.location.href = `mailto:tawhidalhasain2021@gmail.com?subject=${subject}&body=${body}`;
      showFormSuccess();
    }
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}

function showFormSuccess() {
  const form = document.getElementById('booking-form');
  const success = document.getElementById('form-success');
  if (form) form.style.display = 'none';
  if (success) {
    success.style.display = 'block';
    success.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">✨</div>
        <h3>Booking Request Received!</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.8;margin-top:0.5rem">
          Thank you for choosing EVENTIAN. We've received your inquiry and will contact you within 24 hours to discuss your dream event.
        </p>
        <div style="margin-top:2rem">
          <div style="font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold)">— We craft moments that last forever —</div>
        </div>
      </div>
    `;
  }
}

// ============================================
// REVIEW FORM SUBMISSION
// ============================================
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = reviewForm.querySelector('[name="reviewName"]').value;
    const text = reviewForm.querySelector('[name="reviewText"]').value;
    const rating = reviewForm.querySelector('.star-input.active') ? 
      reviewForm.querySelectorAll('.star-input.active').length : 5;
    addReviewCard(name, text, rating);
    reviewForm.reset();
    document.querySelectorAll('.star-input').forEach(s => s.classList.remove('active'));
  });
}
function addReviewCard(name, text, rating) {
  const grid = document.querySelector('.reviews-grid');
  if (!grid) return;
  const card = document.createElement('div');
  card.className = 'glass-card review-card';
  card.style.animation = 'scaleIn 0.4s ease';
  card.innerHTML = `
    <div class="review-header">
      <div class="review-avatar">${name.charAt(0).toUpperCase()}</div>
      <div><div class="review-name">${name}</div><div class="review-event">Just now</div></div>
    </div>
    <div class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
    <div class="review-text">${text}</div>
  `;
  grid.insertBefore(card, grid.firstChild);
}

// Star rating input
document.querySelectorAll('.star-input').forEach((star, i, stars) => {
  star.addEventListener('click', () => {
    stars.forEach((s, j) => s.classList.toggle('active', j <= i));
  });
  star.addEventListener('mouseover', () => {
    stars.forEach((s, j) => s.style.color = j <= i ? 'var(--gold)' : 'var(--text-muted)');
  });
  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.style.color = s.classList.contains('active') ? 'var(--gold)' : 'var(--text-muted)');
  });
});

// ============================================
// GALLERY LIGHTBOX
// ============================================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99000;background:rgba(10,0,16,0.97);display:flex;align-items:center;justify-content:center;cursor:pointer;';
    overlay.innerHTML = `<img src="${img.src}" style="max-width:90vw;max-height:90vh;object-fit:contain;border:1px solid rgba(212,175,55,0.3);" />`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// ============================================
// SERVICE MODAL
// ============================================
const serviceData = {
  wedding: {
    title: 'Full Wedding Management',
    emoji: '💍',
    description: 'We orchestrate every detail of your dream wedding with unparalleled elegance. From the first bloom to the final dance, EVENTIAN ensures your most precious day unfolds like a fairy tale written just for you.',
    features: ['Venue scouting & decoration', 'Bridal arrangement & styling', 'Full catering management', 'Photography & videography', 'Guest management & hospitality', 'Live entertainment & music', 'Floral design & stage setup', 'Honeymoon planning'],
    bg: 'linear-gradient(135deg, rgba(74,0,128,0.5), rgba(120,0,60,0.5))',
    particles: 'petals'
  },
  birthday: {
    title: 'Birthday Celebrations',
    emoji: '🎂',
    description: 'Make every birthday unforgettable. We design vibrant, joyous celebrations tailored to every age and personality, from grand ballroom affairs to intimate garden parties.',
    features: ['Theme design & setup', 'Cake design & catering', 'Entertainment & performers', 'Balloon decorations', 'Photography & video booth', 'Guest invitations', 'Return gifts coordination', 'Surprise arrangements'],
    bg: 'linear-gradient(135deg, rgba(100,0,150,0.5), rgba(60,0,100,0.5))',
    particles: 'confetti'
  },
  concert: {
    title: 'Concert & Live Events',
    emoji: '🎵',
    description: 'We produce electrifying concerts and live performances with world-class production quality. Stage design, sound engineering, lighting — we handle it all with precision and flair.',
    features: ['Stage design & construction', 'Professional sound system', 'Concert lighting & LEDs', 'Artist management', 'Ticketing & crowd control', 'Live streaming setup', 'Security & logistics', 'Post-event wrap-up'],
    bg: 'linear-gradient(135deg, rgba(50,0,100,0.5), rgba(20,0,60,0.5))',
    particles: 'disco'
  },
  destination: {
    title: 'Destination Wedding',
    emoji: '🌴',
    description: 'Imagine exchanging vows against a breathtaking sunset on a pristine beach. Our destination wedding experts transform exotic locations around the world into the backdrop of your love story.',
    features: ['Location scouting worldwide', 'Travel & accommodation', 'Local vendor coordination', 'Legal formalities assistance', 'Beach/garden setup', 'Multi-day event planning', 'Cultural theme integration', 'Return journey coordination'],
    bg: 'linear-gradient(135deg, rgba(20,40,80,0.5), rgba(60,20,100,0.5))',
    particles: 'birds'
  }
};

function openServiceModal(type) {
  const data = serviceData[type];
  if (!data) return;
  const modal = document.getElementById('service-modal');
  const modalBody = document.getElementById('service-modal-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align:center;padding:3rem 2rem 2rem;background:${data.bg};border-radius:4px 4px 0 0;position:relative;overflow:hidden;">
      <div style="font-size:4rem;margin-bottom:1rem;">${data.emoji}</div>
      <h2 style="font-family:var(--font-display);font-size:2rem;letter-spacing:0.12em;background:linear-gradient(135deg,var(--gold-dark),var(--gold),var(--gold-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${data.title}</h2>
      <div style="width:60px;height:1px;background:var(--gold);margin:1rem auto;"></div>
    </div>
    <div style="padding:2.5rem;">
      <p style="font-family:var(--font-accent);font-style:italic;font-size:1.05rem;color:var(--text-secondary);line-height:1.9;margin-bottom:2rem;">${data.description}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:2rem;">
        ${data.features.map(f => `
          <div style="display:flex;align-items:center;gap:0.7rem;font-size:0.83rem;color:var(--text-secondary);">
            <span style="color:var(--gold);font-size:0.6rem;">✦</span>${f}
          </div>
        `).join('')}
      </div>
      <a href="pages/booking.html" class="btn btn-gold" style="display:block;text-align:center;">
        <span>Book This Service</span>
      </a>
    </div>
  `;
  modal.classList.add('open');
}
window.openServiceModal = openServiceModal;

document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target === el) document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  });
});

// ============================================
// PARALLAX EFFECT
// ============================================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
});

// ============================================
// ACTIVE NAV LINK
// ============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href.includes(currentPage) || (currentPage === 'index.html' && href === '#')) {
    a.classList.add('active');
  }
});

// ============================================
// SMOOTH PAGE NAVIGATION
// ============================================
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  if (href.startsWith('http')) return;
});

console.log('%c✨ EVENTIAN — Where Dreams Become Reality ✨', 
  'color:#d4af37;font-family:serif;font-size:14px;padding:8px 0;');