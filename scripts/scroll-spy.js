const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Skip newsletter section for scroll spy purposes
        if (section.getAttribute("id") === "newsletter") return;

        // Activate when the section enters the top third of the viewport
        if (pageYOffset >= sectionTop - (window.innerHeight * 0.5)) {
            current = section.getAttribute("id");
        }
    });

    // Specific check: If we are at the very bottom of the page, force the last section to be active
    // This handles cases where the last section is too short to hit the top offset
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
        const lastSection = sections[sections.length - 1];
        // Ensure we don't accidentally pick the footer or a script tag if querySelectorAll got them
        if (lastSection && lastSection.tagName === 'SECTION') {
            current = lastSection.getAttribute("id");
        }
    }

    navLi.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href").includes(current) && current !== "") {
            a.classList.add("active");
        }
    });
});

// Profile Image Transition Logic & Smooth Scrolling for Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for nav link clicks only
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
                        const elementPosition = targetEl.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        history.pushState(null, '', targetHref);
                    }
                }
            }
        });
    });

    const heroProfile = document.querySelector('.profile-frame');
    const navLogo = document.querySelector('.nav-logo');

    if (heroProfile && navLogo) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero profile is NOT intersecting (is out of view), show nav logo
                if (!entry.isIntersecting) {
                    navLogo.classList.add('visible');
                } else {
                    navLogo.classList.remove('visible');
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: "-80px 0px 0px 0px"
        });

        observer.observe(heroProfile);
    }
});
