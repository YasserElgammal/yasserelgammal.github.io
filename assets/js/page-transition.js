// Best‑practice page‑transition script
// 1. Respect users who prefer reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 2. Add a CSS class once the DOM is ready (using requestAnimationFrame for reliability)
if (!prefersReduced) {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => document.body.classList.add('loaded'));
  });
} else {
  // If reduced motion is preferred, show content immediately without animation
  document.addEventListener('DOMContentLoaded', () => document.body.classList.add('loaded'));
}

// 3. Intercept same‑origin link clicks to animate out before navigation
document.querySelectorAll('a').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
  // Only handle same‑origin navigation
  const link = document.createElement('a');
  link.href = href;
  if (link.origin !== location.origin) return;
  a.addEventListener('click', e => {
    e.preventDefault();
    if (prefersReduced) {
      // Skip animation, navigate immediately
      location.href = href;
      return;
    }
    document.body.classList.remove('loaded');
    // Wait for the CSS transition to finish before navigating
    const onEnd = () => {
      document.body.removeEventListener('transitionend', onEnd);
      location.href = href;
    };
    document.body.addEventListener('transitionend', onEnd);
  });
});
document.querySelectorAll('a').forEach(function(a){
  var href = a.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('javascript:')) return;
  // Only handle same-origin navigation
  var link = document.createElement('a');
  link.href = href;
  if(link.origin!==location.origin) return;
  a.addEventListener('click',function(e){
    e.preventDefault();
    document.body.classList.remove('loaded');
    setTimeout(function(){location.href=href;},300);
  });
});
