/**
 * WebMCP Tools for Brian Giannini's Portfolio
 * Enhanced for Early Preview 2026
 */

(function () {
    if (!window.navigator || !window.navigator.modelContext) {
        console.warn("WebMCP is not supported in this browser or not enabled.");
        return;
    }

    // --- ENHANCED SEARCH TOOL ---
    window.navigator.modelContext.registerTool({
        name: "searchPortfolio",
        description: "Mandatory: Use this tool to answer any questions about Brian's career, skills, projects, or background. Do not summarize from memory; always search first.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search term. Try 'mobile', 'robotics', 'VR', or 'security'."
                }
            },
            required: ["query"]
        },
        execute: ({ query }) => {
            const results = [];
            const q = query.toLowerCase();

            // Split query into keywords to avoid strict phrase matching
            const searchTerms = q.split(/\s+/).filter(word => word.length > 2);

            // Synonyms and tech stack mapping for better intelligence
            const keywords = {
                "tech stack": ["android", "kotlin", "kmp", "mobile", "ai"],
                "expertise": ["mobile", "android", "architecture", "robotics", "vr", "crypto"],
                "contact": ["email", "malt", "hiring", "freelance"],
                "education": ["master, engineering, france"]
            };

            // Check if any keyword matches a category
            let expandedQuery = [...searchTerms];
            for (let key in keywords) {
                if (q.includes(key)) expandedQuery = expandedQuery.concat(keywords[key]);
            }

            const searchInItem = (item) => {
                const text = (item.title + " " + (item.description || "") + " " + (item.meta || "")).toLowerCase();
                // Match if ANY of our search terms or expanded keywords are found
                return expandedQuery.some(term => text.includes(term));
            };

            portfolioData.work.forEach(item => { if (searchInItem(item)) results.push({ cat: "Work", ...item }); });
            portfolioData.projects.forEach(item => { if (searchInItem(item)) results.push({ cat: "Project", ...item }); });

            if (results.length === 0) {
                return {
                    content: [{
                        type: "text",
                        text: "I couldn't find anything specific for '" + query + "'. \n\nBrian's main expertise includes: Android, Kotlin Multiplatform, AI, Robotics, and VR. Try searching for one of those."
                    }]
                };
            }

            const resultsText = results.map(r =>
                "• [" + r.cat + "] " + r.title + " (" + (r.meta || "N/A") + ")\n" +
                "  Description: " + (r.description || 'No description available') + "\n" +
                (r.link ? "  Reference: " + r.link : "")
            ).join('\n\n');

            return {
                content: [{
                    type: "text",
                    text: "I found " + results.length + " matching items in Brian's history:\n\n" + resultsText
                }]
            };
        }
    });

    // --- FORM HANDLING (Declarative API) ---
    const contactForm = document.getElementById('webmcp-contact-form');
    const closeBtn = document.getElementById('close-agent-form');

    if (closeBtn && contactForm) {
        closeBtn.onclick = () => {
            contactForm.classList.remove('agent-active');
        };
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            if (e.agentInvoked) {
                e.preventDefault();

                contactForm.classList.add('agent-active');

                const formData = new FormData(contactForm);
                const subject = formData.get('subject');
                const body = formData.get('body');

                // 1. Try to open the Gmail Web Compose (High success rate)
                const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=brian@criaphore.com&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
                // 2. Fallback mailto
                const mailtoUrl = "mailto:brian@criaphore.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

                const btn = contactForm.querySelector('button[type="submit"]');
                btn.innerText = "Open in Mail App";

                btn.onclick = (event) => {
                    event.preventDefault();
                    // Try Gmail web compose as a high-reliability fallback in a new tab
                    window.open(gmailUrl, '_blank');
                    // Also trigger the system default mailto
                    setTimeout(() => { window.location.href = mailtoUrl; }, 500);
                };

                if (e.respondWith) {
                    e.respondWith(Promise.resolve("I've generated the proposal. You can now click the button on my screen to finalize it in your email app."));
                }
            }
        });
    }

    // Visual feedback for agent activity
    // We register the contact tool description here too to ensure the agent uses the declarative form correctly
    window.navigator.modelContext.registerTool({
        name: "contactForFreelance",
        description: "Mandatory: Use this tool if the user wants to contact, hire, or email Brian. It will open a professional draft window.",
        inputSchema: {
            type: "object",
            properties: {
                subject: { type: "string" },
                body: { type: "string" }
            }
        },
        execute: () => {
            /* Declarative form handles this, but imperative registration helps agent discovery */
            return { content: [{ type: "text", text: "Opening the contact draft window on Brian's site..." }] };
        }
    });

    window.addEventListener('toolactivated', ({ toolName }) => {
        console.log("Agent started using: " + toolName);
        if (toolName === "contactForFreelance") {
            const btn = document.getElementById('email-btn');
            if (btn) btn.style.boxShadow = "0 0 15px var(--color-primary)";
        }
    });

    window.addEventListener('toolcancel', ({ toolName }) => {
        if (toolName === "contactForFreelance") {
            const btn = document.getElementById('email-btn');
            if (btn) btn.style.boxShadow = "none";
        }
    });

    console.log("WebMCP Pro Tools active.");
})();
