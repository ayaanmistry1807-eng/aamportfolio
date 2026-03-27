/* =============================================
   AYAAN ASIF MISTRY — PORTFOLIO JAVASCRIPT
   ============================================= */

// ============ PARTICLE CANVAS ============
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(255,60,172,', 'rgba(120,75,160,', 'rgba(255,122,24,', 'rgba(43,134,197,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.4 + 0.1;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.drift = (Math.random() - 0.5) * 0.3;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.pulse += this.pulseSpeed;
      const glow = Math.abs(Math.sin(this.pulse));
      this.currentAlpha = this.alpha * (0.5 + glow * 0.5);
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentAlpha + ')';
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grad.addColorStop(0, this.color + (this.currentAlpha * 0.3) + ')');
      grad.addColorStop(1, this.color + '0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // Create particles
  const count = Math.min(window.innerWidth < 600 ? 40 : 80, 80);
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (s > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  lastScroll = s;
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});


// ============ SCROLL ANIMATIONS (Intersection Observer) ============
const observerConfig = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger children if needed
    }
  });
}, observerConfig);

// Observe all animated elements
const animated = document.querySelectorAll(
  '[data-aos], .timeline-item, .exp-card, .project-card, .cert-card, .contact-card, .stat-card'
);
animated.forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.05}s`;
  observer.observe(el);
});

// Score bars animation
const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.score-bar');
      if (bar) {
        bar.style.animationPlayState = 'running';
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.tl-score').forEach(el => scoreObserver.observe(el));


// ============ CERTIFICATE LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');

function openCert(src) {
  lbImg.src = src;
  lbImg.alt = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Clear src after transition
  setTimeout(() => { if (!lightbox.classList.contains('open')) lbImg.src = ''; }, 400);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCert();
});

// Stop propagation on inner image
const lbInner = document.querySelector('.lightbox-inner');
if (lbInner) {
  lbInner.addEventListener('click', (e) => e.stopPropagation());
}

// Make functions global
window.openCert = openCert;
window.closeCert = closeCert;


// ============ SMOOTH ACTIVE NAV LINKS ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? '#fff' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));


// ============ PARALLAX BLOBS ============
let ticking = false;
document.addEventListener('mousemove', (e) => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.5;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
    ticking = false;
  });
});


// ============ PHOTO HOVER TILT ============
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame) {
  photoFrame.addEventListener('mousemove', (e) => {
    const rect = photoFrame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = dy * -8;
    const rotY = dx * 8;
    photoFrame.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}


// ============ TYPING EFFECT FOR HERO ROLE ============
(function initTyping() {
  const el = document.querySelector('.hero-role');
  if (!el) return;
  const texts = [
    'AI-Assisted Full Stack Developer',
    'HTML + CSS + JavaScript Expert',
    'Campus Ambassador @ Mentversity',
    'B.Tech CSE (AI & ML) Student'
  ];
  let textIdx = 0, charIdx = 0, deleting = false;
  const speed = { type: 70, delete: 35, pause: 2200 };

  function type() {
    const current = texts[textIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, speed.pause);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? speed.delete : speed.type);
  }

  // Start after a short delay
  setTimeout(type, 1400);
})();


// ============ STAT COUNTER ANIMATION ============
function animateCounter(el, target, suffix = '') {
  const start = Date.now();
  const duration = 1800;
  const isNum = !isNaN(parseInt(target));
  if (!isNum) return;
  const endVal = parseInt(target);

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(ease * endVal);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = endVal + suffix;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = true;
      const num = entry.target.querySelector('.stat-num');
      if (!num) return;
      const text = num.textContent.trim();
      if (text === '2+') animateCounter(num, 2, '+');
      else if (text === '3+') animateCounter(num, 3, '+');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));


// ============ CURSOR GLOW ============
(function initCursorGlow() {
  if (window.innerWidth < 900) return; // Disable on mobile
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:350px; height:350px;
    border-radius:50%; pointer-events:none; z-index:0;
    background:radial-gradient(circle, rgba(255,60,172,0.04) 0%, transparent 70%);
    transform:translate(-50%,-50%); transition:left 0.15s ease,top 0.15s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();


// ============ STAGGERED HERO ANIMATION ============
(function heroEntrance() {
  const items = document.querySelectorAll(
    '.badge-row, .hero-name, .hero-role, .hero-sub, .hero-btns, .tech-pills, .photo-frame'
  );
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.1 + 0.2}s, transform 0.8s ease ${i * 0.1 + 0.2}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80);
  });
})();


// ============ SECTION REVEAL ON LOAD ============
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});