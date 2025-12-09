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

// Profile Image Transition Logic
document.addEventListener('DOMContentLoaded', () => {
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
