window.ZenithAnim = {
  init(opts) {
    opts = opts || {};
    const on = opts.animations !== false;
    const k = opts.parallax == null ? 1 : opts.parallax;
    const ease = 'cubic-bezier(.2,.7,.2,1)';
    let io = null;
    if (on) {
      document.querySelectorAll('[data-line]').forEach(el => {
        const i = +el.dataset.line;
        el.style.transform = 'translateY(110%)';
        el.style.transition = `transform 1.3s ${ease} ${0.25 + i * 0.14}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; }));
      });
      const els = [...document.querySelectorAll('[data-reveal]')];
      els.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(48px)';
        el.style.transition = `opacity 1s ${ease}, transform 1.2s ${ease}`;
      });
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const sib = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
          el.style.transitionDelay = Math.min(sib.indexOf(el), 5) * 0.09 + 's';
          el.style.opacity = '1';
          el.style.transform = 'none';
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach(el => io.observe(el));
    }
    const tick = () => {
      if (!on) return;
      const vh = window.innerHeight;
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const p = el.parentElement.getBoundingClientRect();
        if (p.bottom < -100 || p.top > vh + 100) return;
        const off = (p.top + p.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax) * k;
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
      io && io.disconnect();
    };
  }
};
