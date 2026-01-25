document.addEventListener('DOMContentLoaded', () => {
    const copyrightElement = document.getElementById('copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; 2022 - ${currentYear} Brian Giannini`;
    }
});
