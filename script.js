/* ================================================================
   AIDAN POLANCO — script.js
   ================================================================ */

'use strict';

/* ── Preloader ────────────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('preloader');
  const fill   = document.getElementById('loaderFill');
  const count  = document.getElementById('loaderCount');

  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);

      fill.style.width  = '100%';
      count.textContent = '100';

      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('is-loading');
        // Trigger hero animations
        initHeroName();
      }, 500);

      setTimeout(() => loader.remove(), 1500);
    } else {
      fill.style.width  = pct + '%';
      count.textContent = Math.floor(pct);
    }
  }, 55);
})();


/* ── Custom Cursor ────────────────────────────────────────────── */
(function () {
  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');

  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring lags behind with lerp
  function lerpRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  }
  lerpRing();

  // Hover expansion
  const hoverEls = 'a, button, .btn, .tilt-card, .sk-tags span, .tl-chips span, .nav-link';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('c-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('c-hover');
  });
})();


/* ── Scroll Progress ──────────────────────────────────────────── */
(function () {
  const bar = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();


/* ── Navbar ───────────────────────────────────────────────────── */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const list   = document.getElementById('navList');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    const s    = burger.querySelectorAll('span');
    if (open) {
      s[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      s[1].style.opacity   = '0';
      s[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      s[0].style.transform = s[1].style.opacity = s[2].style.transform = '';
      s[1].style.opacity = '1';
    }
  });

  list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      list.classList.remove('open');
      const s = burger.querySelectorAll('span');
      s[0].style.transform = s[2].style.transform = '';
      s[1].style.opacity = '1';
    });
  });
})();


/* ── Hero Name — Character Split ──────────────────────────────── */
function initHeroName() {
  const el   = document.getElementById('heroName');
  const text = el.textContent.trim();
  el.innerHTML = '';

  let i = 0;
  for (const ch of text) {
    if (ch === ' ') {
      const sp = document.createElement('span');
      sp.className = 'char space';
      sp.style.setProperty('--i', i);
      sp.innerHTML = '&nbsp;';
      el.appendChild(sp);
    } else {
      const sp = document.createElement('span');
      sp.className = 'char';
      sp.style.setProperty('--i', i);
      sp.textContent = ch;
      el.appendChild(sp);
    }
    i++;
  }
}


/* ── Magnetic Buttons ─────────────────────────────────────────── */
(function () {
  function applyMag(el) {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform    = `translate(${dx}px, ${dy}px)`;
      el.style.transition   = 'transform 0.15s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  }

  document.querySelectorAll('.btn-mag').forEach(applyMag);
})();


/* ── Card Tilt ────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s';
    });
  });
})();


/* ── Scroll Reveal ────────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ── Animated Counters ────────────────────────────────────────── */
(function () {
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el, target, dur) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOutCubic(t) * target);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target, 10);
        animateCount(e.target, target, 1800);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => io.observe(el));
})();


/* ── Active Nav Link ──────────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.removeAttribute('style'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--text)';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ── Contact Form ─────────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  const ok   = document.getElementById('formOk');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML  = 'Sending…';
    btn.disabled   = true;

    // Swap in your real endpoint (Formspree, EmailJS, etc.)
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      form.reset();
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 5000);
    }, 1200);
  });
})();


/* ── Parallax Blobs on Mouse ──────────────────────────────────── */
(function () {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length) return;

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    blobs.forEach((b, i) => {
      const depth = (i + 1) * 10;
      b.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  }, { passive: true });
})();


/* ── Skill Tag Stagger ────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.sk-tags').forEach(wrap => {
    const tags = wrap.querySelectorAll('span');
    tags.forEach((t, i) => {
      t.style.opacity   = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = `opacity 0.35s ease ${i * 40}ms, transform 0.35s ease ${i * 40}ms`;
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tags.forEach(t => {
            t.style.opacity   = '1';
            t.style.transform = 'translateY(0)';
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    io.observe(wrap);
  });
})();


/* ── Ambient Mouse Glow ───────────────────────────────────────── */
(function () {
  const glow = Object.assign(document.createElement('div'), {});
  glow.style.cssText = [
    'position:fixed', 'width:600px', 'height:600px',
    'border-radius:50%',
    'background:radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)',
    'pointer-events:none',
    'transform:translate(-50%,-50%)',
    'z-index:0',
    'transition:left 0.2s ease,top 0.2s ease',
  ].join(';');
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
