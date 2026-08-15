(function () {
    const root = document.documentElement;
    const toggles = document.querySelectorAll('[data-theme-toggle]');

    function getThemeLabel(theme) {
        return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }

    function applyTheme(theme, persist) {
        root.dataset.theme = theme;

        if (persist) {
            try {
                localStorage.setItem('theme', theme);
            } catch (error) {}
        }

        toggles.forEach((toggle) => {
            toggle.setAttribute('aria-label', getThemeLabel(theme));
            toggle.setAttribute('title', getThemeLabel(theme));
            toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        });
    }

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
        });
    });

    applyTheme(root.dataset.theme || 'light', false);

    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('.section-jump, .back-to-hero').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            window.history.replaceState(null, '', link.getAttribute('href'));
        });
    });
})();
