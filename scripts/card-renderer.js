function initCards() {
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
        const imgClasses = item.blendC || '';
        // "cover": a picture filling the whole image area, the value is its object-position
        const coverClass = item.cover ? 'cover' : '';
        const coverStyle = item.cover ? `style="object-position: ${item.cover}"` : '';
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
                <div class="card-img-wrapper ${coverClass}">
                    <img src="${item.image}" alt="${item.title}" class="${imgClasses}" ${coverStyle}>
                </div>
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p class="card-desc">${item.description}</p>
                    <button type="button" class="card-more" hidden aria-expanded="false">More</button>
                    <div class="card-footer">
                        <span class="meta">${item.meta}</span>
                        ${item.link && !item.noHover ? arrowSVG : ''}
                    </div>
                </div>
            </${tag}>
        `;
    }).join('');

    setupMoreButtons(container);
    // Initialize collapsible state
    setupCollapsible(containerId);
}

// "More" on a card whose description is cut by the clamp, "Less" to close it again
function setupMoreButtons(container) {
    const cards = [...container.querySelectorAll('.card')];
    const refresh = () => {
        cards.forEach(card => {
            const desc = card.querySelector('.card-desc');
            const btn = card.querySelector('.card-more');
            if (!desc || !btn || card.classList.contains('expanded')) return;
            btn.hidden = desc.scrollHeight <= desc.clientHeight + 1;
        });
        // Every row as tall as the tallest card, so all cards have the same size.
        // (On a phone the CSS keeps rows automatic: clamps give the cards one height there.)
        container.style.gridAutoRows = '';
        const tallest = Math.max(...cards.filter(c => !c.classList.contains('expanded')).map(c => c.offsetHeight));
        if (tallest > 0) container.style.gridAutoRows = `${tallest}px`;
        container.dispatchEvent(new Event('cards-resized'));
    };

    container.addEventListener('click', e => {
        const btn = e.target.closest('.card-more');
        if (!btn) return;
        // The card itself is a link: the button must not follow it
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.card');
        const open = !card.classList.contains('expanded');
        card.classList.toggle('expanded', open);
        btn.textContent = open ? 'Less' : 'More';
        btn.setAttribute('aria-expanded', String(open));
        // On a phone the card grows: let the + button logic re-measure
        container.dispatchEvent(new Event('cards-resized'));
    });

    refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    if (document.fonts) document.fonts.ready.then(refresh);
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
        // scrollHeight includes the clipped part. Expanded, the bottom padding comes back first.
        if (expanded) container.classList.remove('collapsed');
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
    container.addEventListener('cards-resized', update);
    // Images and fonts loading late can change the card height
    window.addEventListener('load', update);
}
