// Career timeline under the work cards: a line with one dot per position (at its start year).
// Hover, focus or click a dot: its period lights up on the line and the matching card above is highlighted.
// Data comes from portfolioData.work (start / end years, end null = still going).
(function () {
    const now = new Date();
    const nowYear = now.getFullYear() + now.getMonth() / 12;

    function init() {
        const root = document.getElementById('work-timeline');
        if (!root || typeof portfolioData === 'undefined') return;

        // Keep the card index (cards are rendered in portfolioData.work order), then sort by date
        const items = portfolioData.work
            .map((item, cardIndex) => ({ ...item, cardIndex, endValue: item.end ?? nowYear }))
            .filter(item => typeof item.start === 'number')
            .sort((a, b) => a.start - b.start);
        if (!items.length) return;

        const minYear = Math.min(...items.map(i => i.start)) - 0.3;
        const maxYear = nowYear + 0.3;
        const pos = year => ((year - minYear) / (maxYear - minYear)) * 100;

        const dots = items.map((item, i) => `
            <button type="button" class="tl-dot${i % 2 ? ' below' : ''}" data-index="${i}" style="--left:${pos(item.start)}%; --delay:${i * 120}ms"
                aria-label="${item.title}, ${item.meta}">
                <span class="tl-dot-name">${item.short || item.title}</span>
                <span class="tl-dot-year">${item.start}</span>
            </button>`).join('');

        root.innerHTML = `
            <div class="tl-line">
                <span class="tl-range"></span>
                ${dots}
                <span class="tl-now" style="--left:${pos(nowYear)}%"><span>Now</span></span>
            </div>`;

        const range = root.querySelector('.tl-range');
        const dotEls = [...root.querySelectorAll('.tl-dot')];
        const cards = () => [...document.querySelectorAll('#work-grid .card')];

        let pinned = -1;

        function show(index) {
            dotEls.forEach((dot, i) => dot.classList.toggle('active', i === index));
            cards().forEach(card => card.classList.remove('tl-highlight'));
            if (index < 0) {
                range.style.opacity = '0';
                return;
            }
            const item = items[index];
            range.style.left = `${pos(item.start)}%`;
            range.style.width = `${pos(item.endValue) - pos(item.start)}%`;
            range.style.opacity = '1';
            const card = cards()[item.cardIndex];
            if (card) card.classList.add('tl-highlight');
        }

        dotEls.forEach((dot, i) => {
            dot.addEventListener('mouseenter', () => show(i));
            dot.addEventListener('mouseleave', () => show(pinned));
            dot.addEventListener('focus', () => show(i));
            dot.addEventListener('blur', () => show(pinned));
            dot.addEventListener('click', () => {
                pinned = pinned === i ? -1 : i;
                show(pinned === -1 ? i : pinned);
                // On a phone the card may be folded away or off screen: unfold, then bring it into view
                const card = cards()[items[i].cardIndex];
                if (pinned === i && card) {
                    const grid = document.getElementById('work-grid');
                    const expandBtn = grid.nextElementSibling;
                    if (grid.classList.contains('collapsed') && card.offsetTop + card.offsetHeight > grid.clientHeight
                        && expandBtn && expandBtn.classList.contains('section-expand-btn')) {
                        expandBtn.click();
                    }
                    const rect = card.getBoundingClientRect();
                    if (rect.top < 80 || rect.bottom > window.innerHeight) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
            dot.addEventListener('keydown', e => {
                if (e.key === 'ArrowRight' && dotEls[i + 1]) { e.preventDefault(); dotEls[i + 1].focus(); }
                if (e.key === 'ArrowLeft' && dotEls[i - 1]) { e.preventDefault(); dotEls[i - 1].focus(); }
            });
        });

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
