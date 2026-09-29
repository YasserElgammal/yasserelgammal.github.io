document.addEventListener('DOMContentLoaded', () => {
    const target = document.querySelector('[data-typing-role]');

    if (!target) {
        console.error('Typing target not found');
        return;
    }

    const roles = [
        'Backend Engineer',
        'PHP / Laravel Developer',
        'Go Developer'
    ];

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function animate() {
        const currentRole = roles[roleIndex];

        if (deleting) {
            charIndex--;
            target.textContent = currentRole.substring(0, charIndex);

            if (charIndex <= 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;

                setTimeout(animate, 500);
                return;
            }

            setTimeout(animate, 50);
            return;
        }

        const nextRole = roles[roleIndex];

        charIndex++;
        target.textContent = nextRole.substring(0, charIndex);

        if (charIndex >= nextRole.length) {
            deleting = true;

            setTimeout(animate, 1500);
            return;
        }

        setTimeout(animate, 80);
    }

    setTimeout(animate, 1500);
});