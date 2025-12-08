function copyEmail() {
    navigator.clipboard.writeText('brian@criaphore.com');
    const tooltip = document.getElementById('copy-tooltip');
    tooltip.style.opacity = '1';
    setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
}
