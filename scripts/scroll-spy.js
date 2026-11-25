document.addEventListener('DOMContentLoaded', () => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-links li a')];

    const setActive = (id) => {
        navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
    };

    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        const visible = new Set();
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target.id);
                else visible.delete(entry.target.id);
            });
            const activeSection = sections.find((s) => visible.has(s.id));
            if (activeSection) setActive(activeSection.id);
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach((section) => sectionObserver.observe(section));

        // Handle reaching the very bottom of the page when the last section is short
        window.addEventListener('scroll', () => {
            if (window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 2) {
                setActive(sections[sections.length - 1].id);
            }
        }, { passive: true });
    }

    // Smooth scroll for nav link clicks
    document.querySelectorAll('.nav-links a, .nav-logo').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = link.getAttribute('href');
            if (targetHref && targetHref.startsWith('#')) {
                e.preventDefault();
                if (targetHref === '#' || targetHref === '#about') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    history.pushState(null, '', window.location.pathname);
                } else {
                    const targetEl = document.querySelector(targetHref);
                    if (targetEl) {
                        const navOffset = 80;
                        const offsetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        history.pushState(null, '', targetHref);
                    }
                }
            }
        });
    });

    const heroProfile = document.querySelector('.profile-frame');
    const navLogo = document.querySelector('.nav-logo');

    if (heroProfile && navLogo && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                navLogo.classList.toggle('visible', !entry.isIntersecting);
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: '-80px 0px 0px 0px'
        });
        observer.observe(heroProfile);
    }
});
