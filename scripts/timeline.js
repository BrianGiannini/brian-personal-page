// Career timeline: one bar per position on a year axis, a detail panel for the selected one.
// Data comes from portfolioData.work (start / end years, end null = still going).
(function () {
    const now = new Date();
    const nowYear = now.getFullYear() + now.getMonth() / 12;

    function init() {
        const root = document.getElementById('work-timeline');
        if (!root || typeof portfolioData === 'undefined') return;

        // Chronological order, oldest first
        const items = portfolioData.work
            .filter(item => typeof item.start === 'number')
            .map(item => ({ ...item, endValue: item.end ?? nowYear }))
            .sort((a, b) => a.start - b.start);
        if (!items.length) return;

        // Lanes: a position goes on the first lane where it does not overlap the previous bar
        const laneEnds = [];
        items.forEach(item => {
            let lane = laneEnds.findIndex(end => item.start >= end);
            if (lane === -1) lane = laneEnds.length;
            laneEnds[lane] = item.endValue;
            item.lane = lane;
        });

        const minYear = Math.min(...items.map(i => i.start));
        const maxYear = nowYear + 0.6;
        const pos = year => ((year - minYear) / (maxYear - minYear)) * 100;

        const ticks = [];
        for (let y = minYear; y <= Math.floor(nowYear); y++) ticks.push(y);

        const bars = items.map((item, i) => {
            const left = pos(item.start);
            const width = pos(item.endValue) - left;
            const ongoing = item.end === null || item.end === undefined;
            return `
                <button type="button" class="tl-bar${ongoing ? ' ongoing' : ''}" data-index="${i}"
                    style="--left:${left}%; --width:${width}%; --lane:${item.lane}; --delay:${i * 90}ms"
                    aria-label="${item.title}, ${item.meta}" aria-pressed="false">
                    <span class="tl-bar-label">${item.short || item.title}</span>
                </button>`;
        }).join('');

        const tickHtml = ticks.map(y => `
            <span class="tl-tick" style="--left:${pos(y)}%"><span>${y}</span></span>`).join('');

        root.style.setProperty('--lanes', laneEnds.length);
        root.innerHTML = `
            <div class="tl-chart">
                <div class="tl-lanes">
                    ${tickHtml}
                    ${bars}
                    <span class="tl-now" style="--left:${pos(nowYear)}%"><span>Now</span></span>
                </div>
                <div class="tl-axis"></div>
            </div>
            <article class="tl-detail" aria-live="polite">
                <div class="tl-detail-img"><img alt=""></div>
                <div class="tl-detail-body">
                    <span class="tl-detail-meta"></span>
                    <h3 class="tl-detail-title"></h3>
                    <p class="tl-detail-desc"></p>
                    <div class="tl-detail-actions">
                        <a class="tl-detail-link" target="_blank" rel="noopener">Visit
                            <svg width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                                stroke-linecap="round" stroke-linejoin="round"><use href="#icon-external-link"></use></svg>
                        </a>
                        <div class="tl-nav">
                            <button type="button" class="tl-prev" aria-label="Previous position">&#8592;</button>
                            <span class="tl-count"></span>
                            <button type="button" class="tl-next" aria-label="Next position">&#8594;</button>
                        </div>
                    </div>
                </div>
            </article>`;

        const barEls = [...root.querySelectorAll('.tl-bar')];
        const detail = root.querySelector('.tl-detail');
        const img = detail.querySelector('img');
        const meta = detail.querySelector('.tl-detail-meta');
        const title = detail.querySelector('.tl-detail-title');
        const desc = detail.querySelector('.tl-detail-desc');
        const link = detail.querySelector('.tl-detail-link');
        const count = detail.querySelector('.tl-count');
        const prev = detail.querySelector('.tl-prev');
        const next = detail.querySelector('.tl-next');

        let current = -1;
        function select(index, focus) {
            index = Math.max(0, Math.min(items.length - 1, index));
            if (index === current) return;
            current = index;
            const item = items[index];

            barEls.forEach((bar, i) => {
                bar.classList.toggle('active', i === index);
                bar.setAttribute('aria-pressed', String(i === index));
            });
            if (focus) barEls[index].focus();

            // Replay the entry animation
            detail.classList.remove('swap');
            void detail.offsetWidth;
            detail.classList.add('swap');

            img.src = item.image;
            img.alt = item.title;
            meta.textContent = item.meta;
            title.textContent = item.title;
            desc.textContent = item.description;
            if (item.link) {
                link.href = item.link;
                link.target = item.external ? '_blank' : '';
                link.hidden = false;
            } else {
                link.hidden = true;
            }
            count.textContent = `${index + 1} / ${items.length}`;
            prev.disabled = index === 0;
            next.disabled = index === items.length - 1;
        }

        barEls.forEach((bar, i) => {
            bar.addEventListener('click', () => select(i));
            bar.addEventListener('keydown', e => {
                if (e.key === 'ArrowRight') { e.preventDefault(); select(i + 1, true); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); select(i - 1, true); }
            });
        });
        prev.addEventListener('click', () => select(current - 1));
        next.addEventListener('click', () => select(current + 1));

        // A label that does not fit its bar is hidden rather than cut ("Fr...")
        const fitLabels = () => barEls.forEach(bar => {
            const label = bar.querySelector('.tl-bar-label');
            bar.classList.remove('no-label');
            bar.classList.toggle('no-label', label.scrollWidth > label.clientWidth + 1);
        });
        fitLabels();
        window.addEventListener('resize', fitLabels);
        if (document.fonts) document.fonts.ready.then(fitLabels);

        // Most recent position shown first
        select(items.length - 1);

        // Bars grow in when the timeline scrolls into view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (entries.some(e => e.isIntersecting)) {
                    root.classList.add('visible');
                    observer.disconnect();
                }
            }, { threshold: 0.2 });
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
