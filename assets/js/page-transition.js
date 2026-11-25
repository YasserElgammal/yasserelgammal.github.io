// Page transition script
// Respect users who prefer reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Show page once DOM is ready
document.body.classList.add('page-transitions-enabled');
window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));

// Intercept same-origin link clicks to animate out before navigation
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;

  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  // Only handle same-origin navigation
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
  } catch {
    return;
  }

  e.preventDefault();

  if (prefersReduced) {
    location.href = href;
    return;
  }

  document.body.classList.add('is-leaving');
  setTimeout(() => { location.href = href; }, 300);
});
