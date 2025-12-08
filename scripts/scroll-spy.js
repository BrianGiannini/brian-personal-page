const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Skip newsletter section for scroll spy purposes
        if (section.getAttribute("id") === "newsletter") return;

        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });

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
