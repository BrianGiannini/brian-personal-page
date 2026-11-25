function copyEmail(e) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return; // Fall back to native mailto: link
    }
    e.preventDefault();
    navigator.clipboard.writeText('contact@briangiannini.com').then(() => {
        const btn = document.getElementById('email-btn');
        if (btn) {
            btn.classList.add('copied');
            clearTimeout(btn._copiedTimer);
            btn._copiedTimer = setTimeout(() => btn.classList.remove('copied'), 2000);
        }
        const tooltip = document.getElementById('copy-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            clearTimeout(tooltip._hideTimer);
            tooltip._hideTimer = setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
        }
    }).catch(() => {
        window.location.href = 'mailto:contact@briangiannini.com';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', copyEmail);
    }
});
