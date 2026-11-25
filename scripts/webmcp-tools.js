/**
 * WebMCP Tools for Brian Giannini's Portfolio
 * Compatible with W3C WebMCP 2026 (document.modelContext and navigator.modelContext).
 */

(function () {
    const modelContext = document.modelContext || (window.navigator && window.navigator.modelContext);
    if (!modelContext || typeof modelContext.registerTool !== 'function') {
        return;
    }

    // --- PORTFOLIO SEARCH TOOL ---
    modelContext.registerTool({
        name: "searchPortfolio",
        description: "Search Brian Giannini's career history, skills, projects, and personal pages by keyword.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search term, e.g. 'AI', 'mobile', 'KMP', 'robotics', 'VR', 'security', or 'travels'."
                }
            },
            required: ["query"]
        },
        execute: ({ query }) => {
            if (typeof portfolioData === 'undefined') {
                return { content: [{ type: "text", text: "Portfolio data is not loaded yet." }] };
            }

            const results = [];
            const q = String(query || '').toLowerCase().trim();
            const searchTerms = q.split(/\s+/).filter(word => word.length > 1);

            const keywords = {
                "tech stack": ["android", "kotlin", "kmp", "compose", "mobile", "ai"],
                "expertise": ["mobile", "android", "kmp", "ai", "architecture", "robotics", "vr", "crypto"],
                "contact": ["email", "malt", "hiring", "freelance"],
                "education": ["master", "engineering", "france"]
            };

            let expandedQuery = [...searchTerms];
            for (const key in keywords) {
                if (q.includes(key)) expandedQuery = expandedQuery.concat(keywords[key]);
            }

            const searchInItem = (item) => {
                const text = `${item.title} ${item.description || ''} ${item.meta || ''}`.toLowerCase();
                return expandedQuery.some(term => text.includes(term));
            };

            (portfolioData.work || []).forEach(item => { if (searchInItem(item)) results.push({ cat: "Work", ...item }); });
            (portfolioData.projects || []).forEach(item => { if (searchInItem(item)) results.push({ cat: "Project", ...item }); });
            (portfolioData.personal || []).forEach(item => { if (searchInItem(item)) results.push({ cat: "Personal", ...item }); });

            if (results.length === 0) {
                return {
                    content: [{
                        type: "text",
                        text: `No direct match for '${query}'. Brian's core expertise covers Mobile & AI Software Engineering (cross-platform mobile, KMP, agentic AI workflows, MCP, Robotics, and VR). Contact: contact@briangiannini.com`
                    }]
                };
            }

            const resultsText = results.map(r =>
                `• [${r.cat}] ${r.title} (${r.meta || "N/A"})\n` +
                `  Description: ${r.description || 'No description available'}\n` +
                (r.link ? `  Reference: ${r.link}` : '')
            ).join('\n\n');

            return {
                content: [{
                    type: "text",
                    text: `Found ${results.length} matching items in Brian Giannini's portfolio:\n\n${resultsText}`
                }]
            };
        }
    });

    // --- HIRE INFO TOOL ---
    modelContext.registerTool({
        name: "getHireInfo",
        description: "Get structured information on Brian Giannini's freelance availability, AI & Mobile Software Engineering services, location, and contact links.",
        inputSchema: {
            type: "object",
            properties: {}
        },
        execute: () => {
            return {
                content: [{
                    type: "text",
                    text: [
                        "Brian Giannini - Mobile & AI Software Engineer (10+ years, ex-Ledger, SoftBank Robotics, Thales).",
                        "Location: Paris, France (available for remote freelance consulting).",
                        "Services:",
                        "- AI-Native Mobile Products (iOS & Android, Kotlin Multiplatform, LLM & RAG integration)",
                        "- Agentic Workflows & MCP Tooling (multi-agent pipelines, MCP servers, custom agent skills)",
                        "- Senior Mobile Architecture (clean architecture, BLE/IoT hardware integration, CI/CD)",
                        "Contact: contact@briangiannini.com",
                        "Malt: https://www.malt.fr/profile/briangiannini",
                        "LinkedIn: https://www.linkedin.com/in/briangiannini1/",
                        "Machine-readable profile: https://briangiannini.com/profile.json"
                    ].join("\n")
                }]
            };
        }
    });

    // --- DECLARATIVE FORM HANDLING (contactForFreelance) ---
    const contactForm = document.getElementById('webmcp-contact-form');
    const closeBtn = document.getElementById('close-agent-form');

    if (closeBtn && contactForm) {
        closeBtn.addEventListener('click', () => {
            contactForm.classList.remove('agent-active');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            if (!e.agentInvoked) return;
            e.preventDefault();

            contactForm.classList.add('agent-active');

            const formData = new FormData(contactForm);
            const subject = String(formData.get('subject') || '');
            const body = String(formData.get('body') || '');

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contact@briangiannini.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            const mailtoUrl = `mailto:contact@briangiannini.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = "Open in Mail App";
                btn.onclick = (event) => {
                    event.preventDefault();
                    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                    setTimeout(() => { window.location.href = mailtoUrl; }, 500);
                };
            }

            if (typeof e.respondWith === 'function') {
                e.respondWith(Promise.resolve("Prepared a draft email to contact@briangiannini.com. The user can click 'Open in Mail App' to send it."));
            }
        });
    }

    const onActivated = ({ toolName }) => {
        if (toolName === "contactForFreelance") {
            const btn = document.getElementById('email-btn');
            if (btn) btn.style.boxShadow = "0 0 15px var(--color-primary)";
        }
    };

    const onCancel = ({ toolName }) => {
        if (toolName === "contactForFreelance") {
            const btn = document.getElementById('email-btn');
            if (btn) btn.style.boxShadow = "none";
        }
    };

    if (typeof modelContext.addEventListener === 'function') {
        modelContext.addEventListener('toolactivated', onActivated);
        modelContext.addEventListener('toolcancel', onCancel);
    }
    window.addEventListener('toolactivated', onActivated);
    window.addEventListener('toolcancel', onCancel);
})();
