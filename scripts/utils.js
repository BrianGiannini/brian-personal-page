function copyEmail() {
    navigator.clipboard.writeText('brian@criaphore.com');
    const tooltip = document.getElementById('copy-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '1';
        setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
    }

    // Also open default mail client
    window.location.href = 'mailto:brian@criaphore.com';
}

document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', copyEmail);
    }
});
