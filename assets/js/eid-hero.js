(function () {
    const seasonElements = document.querySelectorAll('[data-eid-season]');
    const startDate = '2026-05-26';
    const endDate = '2026-05-31';

    function getLocalDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const today = getLocalDateKey(new Date());
    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get('eid') === 'preview';
    const isEidSeason = isPreview || (today >= startDate && today <= endDate);

    document.documentElement.classList.toggle('eid-preview', isPreview);

    seasonElements.forEach((element) => {
        element.hidden = !isEidSeason;
    });
})();
