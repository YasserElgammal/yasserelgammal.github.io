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
})();
