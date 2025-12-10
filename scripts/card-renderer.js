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
        // Arrow SVG Logic
        // External: Box Arrow Up Right (#icon-external-link)
        // Internal: Standard Right Arrow (#icon-arrow-right)
        const iconId = isExternal ? '#icon-external-link' : '#icon-arrow-right';
        const arrowSVG = `
            <span class="card-arrow">
                <svg width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <use href="${iconId}"></use>
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
                    <div class="card-footer">
                        <span class="meta">${item.meta}</span>
                        ${item.link && !item.noHover ? arrowSVG : ''}
                    </div>
                </div>
            </${tag}>
        `;
    }).join('');

    // Initialize collapsible state
    setupCollapsible(containerId);
}

function setupCollapsible(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // We assume cards are mostly uniform height (controlled by CSS).
    // Execute immediately to avoid flash of expanded content.
    const cards = container.querySelectorAll('.card');
    if (cards.length === 0) return;

    // Determine grid Layout 
    // We want to show the first row.
    const firstCard = cards[0];
    const cardHeight = firstCard.offsetHeight;
    const gap = 32; // 2rem gap from CSS

    // Calculate the threshold. 
    // We want to show 1 full row + 0.75 of the second row (better visibility)
    const visibleHeight = (cardHeight * 1.75) + gap;

    if (container.scrollHeight > visibleHeight + 10) {
        // It needs collapsing
        container.classList.add('collapsed');
        container.style.maxHeight = `${visibleHeight}px`;

        // Add button
        const btn = document.createElement('button');
        btn.className = 'section-expand-btn';

        // Icon Helpers
        const getIcon = (id) => `
            <svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <use href="#${id}"></use>
            </svg>
        `;

        // Down Arrow (Show More)
        const arrowDown = getIcon('icon-arrow-down');
        // Up Arrow (Show Less)
        const arrowUp = getIcon('icon-arrow-up');

        btn.innerHTML = arrowDown;
        btn.setAttribute('aria-label', 'Show more');

        // Insert button after container
        container.parentNode.insertBefore(btn, container.nextSibling);

        btn.addEventListener('click', () => {
            const isCollapsed = container.classList.contains('collapsed');

            if (isCollapsed) {
                // Expand
                container.classList.remove('collapsed');
                container.style.maxHeight = `${container.scrollHeight}px`;
                btn.classList.add('expanded');
                btn.innerHTML = arrowUp;
            } else {
                // Collapse
                // Recalculate height in case of window resize or layout shift
                const currentFirstCard = container.querySelector('.card');
                const currentHeight = currentFirstCard ? currentFirstCard.offsetHeight : cardHeight;
                const currentVisibleHeight = (currentHeight * 1.75) + gap;

                container.classList.add('collapsed');
                container.style.maxHeight = `${currentVisibleHeight}px`;
                btn.classList.remove('expanded');
                btn.innerHTML = arrowDown;

                // Smooth scroll back to top of section if we are way down
                const sectionTop = container.offsetTop - 100; // navbar offset
                if (window.scrollY > sectionTop) {
                    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                }
            }
        });

        // Update max-height on window resize to handle grid column changes (3 -> 2 -> 1)
        window.addEventListener('resize', () => {
            if (container.classList.contains('collapsed')) {
                // Re-measure first row height in case it changed
                const newFirstCard = container.querySelector('.card');
                if (newFirstCard) {
                    const newHeight = (newFirstCard.offsetHeight * 1.75) + gap;
                    container.style.maxHeight = `${newHeight}px`;
                }
            } else {
                // If expanded, update max-height to fit content (responsive wrapping)
                // Actually, if expanded, we can just remove max-height or set to scrollHeight
                container.style.maxHeight = `${container.scrollHeight}px`;
            }
        });
    }
}

function renderReferences(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <a class="card glass-card small" href="${item.link}" target="_blank">
            <div class="icon-wrapper"><img src="${item.icon}" alt="${item.title}"></div>
            <span>${item.title}</span>
            <div class="card-arrow card-arrow-static">
                <svg width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <use href="#icon-external-link"></use>
                </svg>
            </div>
        </a>
    `).join('');

    // Initialize collapsible state
    setupCollapsible(containerId);
}
