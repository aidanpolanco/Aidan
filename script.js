'use strict';

/* ── Preloader ────────────────────────────────────────────────── */
(function () {
  const el   = document.getElementById('preloader');
  const fill = document.getElementById('plFill');
  const num  = document.getElementById('plNum');
  let pct = 0;

  const t = setInterval(() => {
    pct += Math.random() * 16 + 3;
    if (pct >= 100) {
      pct = 100;
      clearInterval(t);
      fill.style.width = '100%';
      num.textContent  = '100';
      setTimeout(() => {
        el.classList.add('out');
        document.body.classList.remove('is-loading');
        splitHeroName();
      }, 420);
      setTimeout(() => el.remove(), 1400);
    } else {
      fill.style.width = pct + '%';
      num.textContent  = Math.floor(pct);
    }
  }, 52);
})();


/* ── Custom Cursor ────────────────────────────────────────────── */
(function () {
  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');

  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.remove(); ring.remove();
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => { el.style.cursor = ''; });
    return;
  }

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  const hoverSel = 'a,button,.btn,.tilt-card,.sk-tags span,.tl-chips span,.pc-tags span';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('c-expand');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('c-expand');
  });
})();


/* ── Cursor Sparkle Trail ─────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    .sparkle {
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: sparkFade .7s ease forwards;
    }
    @keyframes sparkFade {
      0%   { opacity: .9; transform: translate(-50%,-50%) scale(1); }
      100% { opacity: 0;  transform: translate(-50%,-50%) scale(0) translateY(-14px); }
    }
  `;
  document.head.appendChild(style);

  const colors = ['#a5b4fc', '#22d3ee', '#818cf8', '#67e8f9'];
  let last = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 55) return;
    last = now;

    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = Math.random() * 5 + 3;
    s.style.cssText = `
      left:${e.clientX}px;top:${e.clientY}px;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }, { passive: true });
})();


/* ── Scroll Progress ──────────────────────────────────────────── */
(function () {
  const bar = document.getElementById('sp');
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - innerHeight;
    bar.style.width = (scrollY / max * 100) + '%';
  }, { passive: true });
})();


/* ── Navbar ───────────────────────────────────────────────────── */
(function () {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', scrollY > 60);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    const s = burger.querySelectorAll('span');
    if (open) {
      s[0].style.transform = 'rotate(45deg) translate(4.5px,4.5px)';
      s[1].style.opacity   = '0';
      s[2].style.transform = 'rotate(-45deg) translate(4.5px,-4.5px)';
    } else {
      s.forEach(sp => { sp.style.transform = ''; sp.style.opacity = '1'; });
    }
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '1';
      });
    });
  });
})();


/* ── Hero Name — character split ──────────────────────────────── */
function splitHeroName() {
  ['hn1', 'hn2'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const txt = el.textContent;
    let i = 0;
    el.innerHTML = '';
    for (const ch of txt) {
      const sp = document.createElement('span');
      sp.className = ch === ' ' ? 'ch sp' : 'ch';
      sp.style.setProperty('--i', i++);
      sp.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(sp);
    }
  });
}


/* ── Magnetic Buttons ─────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * .32;
      const dy = (e.clientY - r.top  - r.height / 2) * .32;
      el.style.transform  = `translate(${dx}px,${dy}px)`;
      el.style.transition = 'transform .12s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1)';
    });
  });
})();


/* ── Card Tilt ────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform  = `perspective(900px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale(1.02)`;
      card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1), border-color .3s, box-shadow .3s';
    });
  });
})();


/* ── Scroll Reveal ────────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -44px 0px' });
  els.forEach(el => io.observe(el));
})();


/* ── Count-Up (hero stat cards) ───────────────────────────────── */
(function () {
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tgt = parseInt(el.dataset.target, 10);
      const dur = 1600;
      const t0  = performance.now();

      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(easeOut(p) * tgt);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = tgt;
      })(performance.now());

      io.unobserve(el);
    });
  }, { threshold: .5 });

  document.querySelectorAll('.count-up').forEach(el => io.observe(el));
})();


/* ── Number Scramble (stats break section) ────────────────────── */
(function () {
  const digits = '0123456789';

  function scramble(el, target, dur) {
    const targetStr = String(target);
    const t0 = performance.now();

    (function tick(now) {
      const p     = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const locked = Math.floor(eased * targetStr.length);
      let out = '';
      for (let i = 0; i < targetStr.length; i++) {
        out += i < locked
          ? targetStr[i]
          : digits[Math.floor(Math.random() * 10)];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(performance.now());
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      scramble(e.target, parseInt(e.target.dataset.target, 10), 1800);
      io.unobserve(e.target);
    });
  }, { threshold: .5 });

  document.querySelectorAll('.scramble').forEach(el => io.observe(el));
})();


/* ── Skill Tag Stagger ────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.sk-tags').forEach(wrap => {
    const tags = wrap.querySelectorAll('span');
    tags.forEach((t, i) => {
      t.style.opacity   = '0';
      t.style.transform = 'translateY(10px)';
      t.style.transition = `opacity .35s ease ${i * 45}ms, transform .35s ease ${i * 45}ms`;
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        tags.forEach(t => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
        io.unobserve(e.target);
      });
    }, { threshold: .3 });
    io.observe(wrap);
  });
})();


/* ── Active Nav Link ──────────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.removeAttribute('style'));
        const active = document.querySelector(`.nav-a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--text)';
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));
})();


/* ── Ambient Mouse Glow ───────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const g = document.createElement('div');
  g.style.cssText = 'position:fixed;width:700px;height:700px;border-radius:50%;'+
    'background:radial-gradient(circle,rgba(99,102,241,.055) 0%,transparent 70%);'+
    'pointer-events:none;transform:translate(-50%,-50%);z-index:0;'+
    'transition:left .22s ease,top .22s ease;';
  document.body.appendChild(g);
  window.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top  = e.clientY + 'px';
  }, { passive: true });
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
    btn.innerHTML = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig; btn.disabled = false;
      form.reset();
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 5000);
    }, 1200);
  });
})();


/* ── Init Lucide Icons ────────────────────────────────────────── */
if (typeof lucide !== 'undefined') lucide.createIcons();
