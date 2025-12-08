const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Skip newsletter section for scroll spy purposes
        // so it doesn't steal focus from References at the bottom
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
