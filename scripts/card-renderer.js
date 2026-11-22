function initCards() {
    renderCards('work-grid', portfolioData.work);
    renderCards('projects-grid', portfolioData.projects);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
} else {
    initCards();
}

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
    if (!container || !container.querySelector('.card')) return;

    const getIcon = (id) => `
        <svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <use href="#${id}"></use>
        </svg>
    `;
    const arrowDown = getIcon('icon-arrow-down');
    const arrowUp = getIcon('icon-arrow-up');

    const btn = document.createElement('button');
    btn.className = 'section-expand-btn';
    btn.innerHTML = arrowDown;
    btn.setAttribute('aria-label', 'Show more');
    container.parentNode.insertBefore(btn, container.nextSibling);

    let expanded = false;

    // Height showing the first row plus 3/4 of the second one. On a phone (one column) the
    // cards are short, so three of them plus 3/4 of the fourth.
    const collapsedHeight = () => {
        const style = getComputedStyle(container);
        const cardHeight = container.querySelector('.card').offsetHeight;
        const gap = parseFloat(style.rowGap) || 0;
        const columns = style.gridTemplateColumns.split(' ').length;
        const rows = columns === 1 ? 3 : 1;
        return (cardHeight + gap) * rows + cardHeight * 0.75;
    };

    // Re-evaluated on every resize: the number of columns, so of rows, changes with the width
    const update = () => {
        // scrollHeight includes the clipped part, so no need to un-collapse to measure
        const fullHeight = container.scrollHeight;
        const limit = collapsedHeight();

        if (fullHeight <= limit + 10) {
            // Everything fits: no button
            btn.hidden = true;
            container.classList.remove('collapsed');
            container.style.maxHeight = '';
            return;
        }

        btn.hidden = false;
        if (expanded) {
            container.classList.remove('collapsed');
            container.style.maxHeight = `${fullHeight}px`;
        } else {
            container.classList.add('collapsed');
            container.style.maxHeight = `${limit}px`;
        }
    };

    btn.addEventListener('click', () => {
        expanded = !expanded;
        btn.classList.toggle('expanded', expanded);
        btn.innerHTML = expanded ? arrowUp : arrowDown;
        btn.setAttribute('aria-label', expanded ? 'Show less' : 'Show more');
        update();

        if (!expanded) {
            // Scroll back to the section if we are below it
            const sectionTop = container.offsetTop - 100; // navbar offset
            if (window.scrollY > sectionTop) {
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            }
        }
    });

    update();
    window.addEventListener('resize', update);
    // Images and fonts loading late can change the card height
    window.addEventListener('load', update);
}
