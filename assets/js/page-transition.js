// Page transition script
// Respect users who prefer reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Show page once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => document.body.classList.add('loaded'));
});

// Intercept same-origin link clicks to animate out before navigation
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;

  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  // Only handle same-origin navigation
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
  } catch {
    return;
  }

  e.preventDefault();

  if (prefersReduced) {
    location.href = href;
    return;
  }

  document.body.classList.remove('loaded');
  setTimeout(() => { location.href = href; }, 300);
});
