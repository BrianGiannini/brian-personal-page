function initCards() {
    hydrateOrRender('work-grid', portfolioData.work);
    hydrateOrRender('projects-grid', portfolioData.projects);
    hydrateOrRender('personal-grid', portfolioData.personal);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCards);
} else {
    initCards();
}

function hydrateOrRender(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Static cards are pre-rendered in index.html by scripts/sync-cards.mjs.
    // Fall back to client-side rendering only if the container is empty.
    if (!container.querySelector('.card')) {
        container.innerHTML = items.map(item => {
            const isExternal = Boolean(item.external);
            const noHoverClass = item.noHover ? 'no-hover' : '';
            const externalClass = isExternal ? 'is-external' : '';
            const imgClasses = item.blendC || '';
            const coverClass = item.cover ? 'cover' : '';
            const coverStyle = item.cover ? `style="object-position: ${item.cover}"` : '';
            const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
            const labelAttr = item.label ? `data-label="${item.label}"` : '';
            const iconId = isExternal ? '#icon-external-link' : '#icon-arrow-right';
            const arrowSVG = `
                <span class="card-arrow" ${labelAttr} aria-hidden="true">
                    <svg width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <use href="${iconId}"></use>
                    </svg>
                </span>
            `;
            const titleHtml = item.link
                ? `<h3><a class="card-title-link" href="${item.link}" ${targetAttr}>${item.title}</a></h3>`
                : `<h3>${item.title}</h3>`;

            return `
                <article class="card glass-card ${noHoverClass} ${externalClass}">
                    <div class="card-img-wrapper ${coverClass}">
                        <img src="${item.image}" alt="${item.title}" class="${imgClasses} ${item.imageDark ? 'img-light' : ''}" ${coverStyle} loading="lazy" decoding="async">
                        ${item.imageDark ? `<img src="${item.imageDark}" alt="${item.title}" class="${imgClasses} img-dark" ${coverStyle} loading="lazy" decoding="async">` : ''}
                    </div>
                    <div class="card-content">
                        ${titleHtml}
                        <p class="card-desc">${item.description}</p>
                        <button type="button" class="card-more" hidden aria-expanded="false">More</button>
                        <div class="card-footer">
                            <span class="meta">${item.meta ?? ''}</span>
                            ${item.link && !item.noHover ? arrowSVG : ''}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    setupMoreButtons(container);
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
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.card');
        const open = !card.classList.contains('expanded');
        card.classList.toggle('expanded', open);
        btn.textContent = open ? 'Less' : 'More';
        btn.setAttribute('aria-expanded', String(open));
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
        <svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <use href="#${id}"></use>
        </svg>
    `;
    const arrowDown = getIcon('icon-arrow-down');
    const arrowUp = getIcon('icon-arrow-up');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'section-expand-btn';
    btn.innerHTML = arrowDown;
    btn.setAttribute('aria-label', 'Show more');
    btn.setAttribute('aria-expanded', 'false');
    container.parentNode.insertBefore(btn, container.nextSibling);

    let expanded = false;

    const collapsedHeight = () => {
        const style = getComputedStyle(container);
        const cardHeight = container.querySelector('.card').offsetHeight;
        const gap = parseFloat(style.rowGap) || 0;
        const columns = style.gridTemplateColumns.split(' ').length;
        const rows = columns === 1 ? 3 : 1;
        return (cardHeight + gap) * rows + cardHeight * 0.75;
    };

    const update = () => {
        if (expanded) container.classList.remove('collapsed');
        const fullHeight = container.scrollHeight;
        const limit = collapsedHeight();
        const phoneOnly = container.dataset.collapse === 'phone' && !window.matchMedia('(max-width: 720px)').matches;

        if (phoneOnly || fullHeight <= limit + 10) {
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
        btn.setAttribute('aria-expanded', String(expanded));
        update();

        if (!expanded) {
            const sectionTop = container.offsetTop - 100;
            if (window.scrollY > sectionTop) {
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            }
        }
    });

    update();
    window.addEventListener('resize', update);
    container.addEventListener('cards-resized', update);
    window.addEventListener('load', update);
}
