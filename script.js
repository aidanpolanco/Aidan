/* =============================================
   AIDAN POLANCO — Portfolio JS
   ============================================= */

/* ── Particle Background ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const CONFIG = {
    count:       80,
    color:       '124, 58, 237',
    maxRadius:   2.2,
    speed:       0.35,
    lineDistance: 130,
    lineOpacity:  0.12,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.r  = Math.random() * CONFIG.maxRadius + 0.5;
    this.a  = Math.random() * 0.6 + 0.1;
  }

  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${p.a})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.lineDistance) {
          const opacity = (1 - dist / CONFIG.lineDistance) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  draw();
})();


/* ── Navbar scroll effect ── */
(function () {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ── Hamburger Menu ── */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });
})();


/* ── Typing Animation ── */
(function () {
  const el    = document.getElementById('typed');
  const words = [
    'Beautiful Websites.',
    'Online Experiences.',
    'Brand Identities.',
    'Web Solutions.',
    'Things People Love.',
  ];

  let wIndex = 0;
  let cIndex = 0;
  let deleting = false;
  const typeSpeed   = 85;
  const deleteSpeed = 45;
  const pauseTime   = 1800;

  function type() {
    const word = words[wIndex];

    if (!deleting) {
      el.textContent = word.slice(0, ++cIndex);
      if (cIndex === word.length) {
        deleting = true;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      el.textContent = word.slice(0, --cIndex);
      if (cIndex === 0) {
        deleting = false;
        wIndex   = (wIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? deleteSpeed : typeSpeed);
  }

  setTimeout(type, 1000);
})();


/* ── Scroll Reveal ── */
(function () {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
})();


/* ── Skill Bar Animation ── */
(function () {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.getAttribute('data-width');
        bar.style.width = target + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach((bar) => observer.observe(bar));
})();


/* ── Animated Counters ── */
(function () {
  const counters = document.querySelectorAll('.stat-num');

  function animateCount(el, target, duration) {
    const start = performance.now();
    const from  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(from + (target - from) * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, target, 1600);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
})();


/* ── Contact Form ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    // Simulate send (replace with real endpoint / EmailJS / Formspree)
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled    = false;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
})();


/* ── Active Nav Link on Scroll ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });

    links.forEach((a) => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--text)';
      }
    });
  }, { passive: true });
})();


/* ── Smooth cursor glow on mouse move ── */
(function () {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
