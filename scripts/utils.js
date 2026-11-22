function copyEmail() {
    navigator.clipboard.writeText('brian@criaphore.com');
    // Envelope flies off, a check mark draws in, then the envelope comes back
    const btn = document.getElementById('email-btn');
    if (btn) {
        btn.classList.remove('copied');
        void btn.offsetWidth; // restart the animation on a quick second click
        btn.classList.add('copied');
        clearTimeout(btn._copiedTimer);
        btn._copiedTimer = setTimeout(() => btn.classList.remove('copied'), 2000);
    }
    const tooltip = document.getElementById('copy-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '1';
        setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', copyEmail);
    }
});
