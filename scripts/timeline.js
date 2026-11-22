// Career timeline tied to the work cards: one dot per card, placed on the card itself.
// Wide screens: a horizontal line under the card row (row and line scroll / drag together when too narrow).
// Phone (one card per row): a vertical line along the left of the cards.
// Hover, focus or click a dot: its period lights up on the line and its card is highlighted.
(function () {
    const PHONE = window.matchMedia('(max-width: 720px)');

    function init() {
        const root = document.getElementById('work-timeline');
        const grid = document.getElementById('work-grid');
        const scroller = document.getElementById('work-scroller');
        if (!root || !grid || typeof portfolioData === 'undefined') return;

        const items = portfolioData.work;
        const cards = () => [...grid.querySelectorAll('.card')];
        if (!cards().length) return;

        root.innerHTML = `
            <div class="tl-line">
                <span class="tl-range"></span>
                <span class="tl-now"><span>Now</span></span>
                ${items.map((item, i) => `
                    <button type="button" class="tl-dot" data-index="${i}" style="--delay:${i * 120}ms"
                        aria-label="${item.title}, ${item.meta}">
                        <span class="tl-dot-name">${item.short || item.title}</span>
                        <span class="tl-dot-year">${item.start ?? ''}</span>
                    </button>`).join('')}
            </div>`;

        const line = root.querySelector('.tl-line');
        const range = root.querySelector('.tl-range');
        const dotEls = [...root.querySelectorAll('.tl-dot')];

        // Dot positions in px along the line, the "Now" end at 0
        let positions = [];
        let pinned = -1;
        let current = -1;

        // Phone: the line lives inside the card list (so it folds and fades with it),
        // wide screens: under the card row, in the same scroller
        function place() {
            const vertical = PHONE.matches;
            root.classList.toggle('vertical', vertical);
            grid.classList.toggle('has-timeline', vertical);
            if (vertical && root.parentNode !== grid) grid.appendChild(root);
            if (!vertical && root.parentNode === grid) grid.parentNode.insertBefore(root, grid.nextSibling);
            measure();
        }

        function measure() {
            const vertical = root.classList.contains('vertical');
            const lineBox = line.getBoundingClientRect();
            positions = cards().map(card => {
                const box = card.getBoundingClientRect();
                return vertical
                    ? box.top + box.height / 2 - lineBox.top
                    : box.left + box.width / 2 - lineBox.left;
            });
            dotEls.forEach((dot, i) => dot.style.setProperty('--pos', `${positions[i] ?? 0}px`));
            show(current);
        }

        function show(index) {
            current = index;
            dotEls.forEach((dot, i) => dot.classList.toggle('active', i === index));
            cards().forEach((card, i) => card.classList.toggle('tl-highlight', i === index));
            if (index < 0) {
                range.style.opacity = '0';
                return;
            }
            // Period: from the dot to "Now" if still going, else to the next (newer) card's dot
            const item = items[index];
            const ongoing = item.end === null || item.end === undefined;
            const from = ongoing || index === 0 ? 0 : positions[index - 1];
            const to = positions[index];
            range.style.setProperty('--from', `${from}px`);
            range.style.setProperty('--size', `${Math.max(0, to - from)}px`);
            range.style.opacity = '1';
        }

        dotEls.forEach((dot, i) => {
            dot.addEventListener('mouseenter', () => show(i));
            dot.addEventListener('mouseleave', () => show(pinned));
            dot.addEventListener('focus', () => show(i));
            dot.addEventListener('blur', () => show(pinned));
            dot.addEventListener('click', () => {
                pinned = pinned === i ? -1 : i;
                show(pinned === -1 ? i : pinned);
            });
            dot.addEventListener('keydown', e => {
                const next = ['ArrowRight', 'ArrowDown'].includes(e.key) ? i + 1
                    : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? i - 1 : null;
                if (next !== null && dotEls[next]) { e.preventDefault(); dotEls[next].focus(); }
            });
        });

        // Hovering a card lights its dot too
        grid.addEventListener('mouseover', e => {
            const card = e.target.closest('.card');
            if (card) show(cards().indexOf(card));
        });
        grid.addEventListener('mouseleave', () => show(pinned));

        if (scroller) enableDragScroll(scroller);

        place();
        PHONE.addEventListener('change', place);
        window.addEventListener('resize', measure);
        window.addEventListener('load', measure);
        grid.addEventListener('cards-resized', () => requestAnimationFrame(measure));
        if (document.fonts) document.fonts.ready.then(measure);
        if ('ResizeObserver' in window) new ResizeObserver(measure).observe(grid);

        // Dots pop in one after the other when the line scrolls into view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (entries.some(e => e.isIntersecting)) {
                    root.classList.add('visible');
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(root);
        } else {
            root.classList.add('visible');
        }
    }

    // Mouse drag scrolls the card row sideways (touch and trackpads scroll natively).
    // A drag must not open the card link it started on.
    function enableDragScroll(scroller) {
        let startX = 0;
        let startScroll = 0;
        let dragging = false;
        let moved = false;

        const overflowing = () => scroller.scrollWidth > scroller.clientWidth + 1;
        const refresh = () => scroller.classList.toggle('draggable', overflowing());
        refresh();
        window.addEventListener('resize', refresh);
        window.addEventListener('load', refresh);

        scroller.addEventListener('pointerdown', e => {
            if (e.pointerType !== 'mouse' || e.button !== 0 || !overflowing()) return;
            dragging = true;
            moved = false;
            startX = e.clientX;
            startScroll = scroller.scrollLeft;
        });
        window.addEventListener('pointermove', e => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 5 && !moved) {
                moved = true;
                scroller.classList.add('dragging');
            }
            if (moved) scroller.scrollLeft = startScroll - dx;
        });
        window.addEventListener('pointerup', () => {
            if (!dragging) return;
            dragging = false;
            scroller.classList.remove('dragging');
        });
        // The click that ends a drag does not open a card
        scroller.addEventListener('click', e => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                moved = false;
            }
        }, true);
        // Links and images would start a native drag instead
        scroller.addEventListener('dragstart', e => e.preventDefault());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
