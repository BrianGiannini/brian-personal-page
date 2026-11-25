#!/usr/bin/env node
/**
 * Pre-renders portfolio cards from data/portfolio.js into index.html
 * so non-JS crawlers (AI search engines, scrapers) see every work item and project.
 *
 * Usage: node scripts/sync-cards.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'portfolio.js');
const indexPath = path.join(root, 'index.html');

const dataCode = fs.readFileSync(dataPath, 'utf8');
const sandbox = {};
vm.runInNewContext(`${dataCode}\nthis.portfolioData = portfolioData;`, sandbox);
const { portfolioData } = sandbox;

function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderCard(item) {
    const isExternal = Boolean(item.external);
    const noHoverClass = item.noHover ? ' no-hover' : '';
    const externalClass = isExternal ? ' is-external' : '';
    const imgClasses = item.blendC ? `${item.blendC} ` : '';
    const coverClass = item.cover ? ' cover' : '';
    const coverStyle = item.cover ? ` style="object-position: ${escapeHtml(item.cover)}"` : '';
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const labelAttr = item.label ? ` data-label="${escapeHtml(item.label)}"` : '';
    const iconId = isExternal ? '#icon-external-link' : '#icon-arrow-right';

    const titleHtml = item.link
        ? `<h3><a class="card-title-link" href="${escapeHtml(item.link)}"${targetAttr}>${escapeHtml(item.title)}</a></h3>`
        : `<h3>${escapeHtml(item.title)}</h3>`;

    const arrowHtml = item.link && !item.noHover
        ? `<span class="card-arrow"${labelAttr} aria-hidden="true">
                                <svg width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <use href="${iconId}"></use>
                                </svg>
                            </span>`
        : '';

    const darkImgHtml = item.imageDark
        ? `\n                            <img src="${escapeHtml(item.imageDark)}" alt="${escapeHtml(item.title)}" class="${imgClasses}img-dark"${coverStyle} loading="lazy" decoding="async">`
        : '';

    return `                        <article class="card glass-card${noHoverClass}${externalClass}">
                            <div class="card-img-wrapper${coverClass}">
                                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="${imgClasses}${item.imageDark ? 'img-light' : ''}"${coverStyle} loading="lazy" decoding="async">${darkImgHtml}
                            </div>
                            <div class="card-content">
                                ${titleHtml}
                                <p class="card-desc">${escapeHtml(item.description)}</p>
                                <button type="button" class="card-more" hidden aria-expanded="false">More</button>
                                <div class="card-footer">
                                    <span class="meta">${escapeHtml(item.meta ?? '')}</span>
                                    ${arrowHtml}
                                </div>
                            </div>
                        </article>`;
}

function replaceBlock(html, name, items) {
    const startTag = `<!-- CARDS:${name}:START -->`;
    const endTag = `<!-- CARDS:${name}:END -->`;
    const startIdx = html.indexOf(startTag);
    const endIdx = html.indexOf(endTag);
    if (startIdx === -1 || endIdx === -1) {
        throw new Error(`Missing markers ${startTag} / ${endTag} in index.html`);
    }
    const rendered = items.map(renderCard).join('\n');
    return `${html.slice(0, startIdx + startTag.length)}\n${rendered}\n                        ${html.slice(endIdx)}`;
}

let html = fs.readFileSync(indexPath, 'utf8');
html = replaceBlock(html, 'WORK', portfolioData.work);
html = replaceBlock(html, 'PROJECTS', portfolioData.projects);
html = replaceBlock(html, 'PERSONAL', portfolioData.personal);
fs.writeFileSync(indexPath, html);

console.log(`Synced ${portfolioData.work.length} work, ${portfolioData.projects.length} projects, ${portfolioData.personal.length} personal cards into index.html.`);
