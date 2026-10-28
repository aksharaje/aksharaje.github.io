// Scroll-reveal + paper-diagram interactions.
// Honors prefers-reduced-motion (CSS cancels animations; this script
// still runs but makes elements visible immediately).

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll reveal ----------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  }

  // --- Paper diagram: language-as-evidence ------------------------
  // Hovering/tapping a lane focuses it and reveals the hidden-assumption
  // layer under the Chinese lane.
  document.querySelectorAll('.diag-lang').forEach(root => {
    const lanes = root.querySelectorAll('.lane');
    const focus = (laneEl) => {
      root.classList.add('focused');
      lanes.forEach(l => l.classList.toggle('on', l === laneEl));
      if (laneEl && laneEl.dataset.lane === 'zh') {
        root.classList.add('show-assumption');
      } else {
        root.classList.remove('show-assumption');
      }
    };
    const clear = () => {
      root.classList.remove('focused');
      root.classList.remove('show-assumption');
      lanes.forEach(l => l.classList.remove('on'));
    };
    lanes.forEach(l => {
      l.addEventListener('mouseenter', () => focus(l));
      l.addEventListener('focus', () => focus(l), true);
      l.addEventListener('click', (e) => {
        e.stopPropagation();
        if (l.classList.contains('on')) { clear(); } else { focus(l); }
      });
    });
    root.addEventListener('mouseleave', clear);
  });

  // --- Paper diagram: cost incidence ------------------------------
  // Animate bar widths from 0 to their final width when the diagram
  // enters the viewport.
  const costDiagrams = document.querySelectorAll('.diag-cost');
  if (costDiagrams.length) {
    const animateCost = (root) => {
      const bars = root.querySelectorAll('.bar');
      bars.forEach(b => {
        const finalWidth = b.getAttribute('width');
        b.setAttribute('width', '0');
        // force reflow then set to final width so the CSS transition fires
        requestAnimationFrame(() => {
          requestAnimationFrame(() => b.setAttribute('width', finalWidth));
        });
      });
    };
    if (reduceMotion || !('IntersectionObserver' in window)) {
      // leave widths as-authored; no animation
    } else {
      const io2 = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            animateCost(e.target);
            io2.unobserve(e.target);
          }
        }
      }, { threshold: 0.35 });
      costDiagrams.forEach(d => io2.observe(d));
    }
  }
})();
