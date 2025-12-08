document.addEventListener('DOMContentLoaded', () => {
    renderCards('work-grid', portfolioData.work);
    renderCards('projects-grid', portfolioData.projects);
    renderReferences('references-grid', portfolioData.references);
});

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => {
        const isExternal = item.external;
        const noHoverClass = item.noHover ? 'no-hover' : '';
        const blendClass = item.blendC ? item.blendC : '';
        const targetAttr = isExternal ? 'target="_blank"' : '';
        const hrefAttr = item.link ? `href="${item.link}"` : '';

        // Arrow SVG
        const arrowSVG = `
            <span class="card-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </span>
        `;

        // Use <a> tag if a link exists, otherwise use <div>
        const tag = item.link ? 'a' : 'div';

        return `
            <${tag} class="card glass-card ${noHoverClass}" ${hrefAttr} ${targetAttr}>
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="${blendClass}">
                </div>
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <span class="meta">${item.meta}</span>
                </div>
                ${item.link && !item.noHover ? arrowSVG : ''}
            </${tag}>
        `;
    }).join('');
}

function renderReferences(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <a class="card glass-card small" href="${item.link}" target="_blank">
            <div class="icon-wrapper"><img src="${item.icon}" alt="${item.title}"></div>
            <span>${item.title}</span>
            <div class="card-arrow card-arrow-static">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
        </a>
    `).join('');
}
