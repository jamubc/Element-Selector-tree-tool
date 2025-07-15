// ==UserScript==
// @name         Element Selector Tool
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  Press Ctrl+E to get friendly CSS selectors for any element
// @author       jamubc
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      Apache 2.0
// @inject-into  content
// ==/UserScript==

(function() {
    'use strict';

    let active = false, overlay, tooltip, current;
    let initialized = false;

    function getSelector(el) {
        // Priority 1: ID (most reliable)
        if (el.id) return `#${el.id}`;

        // Priority 2: Data attributes (often used for testing/automation)
        const dataAttrs = Array.from(el.attributes).filter(a => a.name.startsWith('data-'));
        if (dataAttrs.length) {
            const key = dataAttrs.find(a => a.name.includes('test') || a.name.includes('id') || a.name.includes('name')) || dataAttrs[0];
            return `[${key.name}="${key.value}"]`;
        }

        // Priority 3: Unique class combination
        if (el.className && typeof el.className === 'string') {
            const classes = el.className.trim().split(/\s+/).filter(c => c && !c.match(/^(active|hover|focus|disabled)$/));
            if (classes.length) {
                const selector = `${el.tagName.toLowerCase()}.${classes.join('.')}`;
                // Check if selector is unique
                if (document.querySelectorAll(selector).length === 1) return selector;
            }
        }

        // Priority 4: Role or aria-label
        if (el.getAttribute('role')) return `[role="${el.getAttribute('role')}"]`;
        if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;

        // Priority 5: For common elements, use semantic approach
        const tag = el.tagName.toLowerCase();
        if (['button', 'input', 'select', 'textarea'].includes(tag)) {
            if (el.name) return `${tag}[name="${el.name}"]`;
            if (el.type) return `${tag}[type="${el.type}"]`;
        }

        // Last resort: Minimal path from nearest ID
        let path = [];
        let current = el;
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
                path.unshift(`#${current.id}`);
                break;
            }
            const parent = current.parentElement;
            if (parent) {
                const index = Array.from(parent.children).indexOf(current) + 1;
                selector += `:nth-child(${index})`;
            }
            path.unshift(selector);
            current = parent;
        }
        return path.join(' > ');
    }

    function highlight(el) {
        const rect = el.getBoundingClientRect();
        const selector = getSelector(el);

        // Thin precise border
        overlay.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;background:transparent;border:1px solid #0088ff;pointer-events:none;z-index:2147483647;display:block;box-sizing:border-box;outline:1px solid rgba(255,255,255,0.5);outline-offset:-2px`;

        // Build enhanced tree view
        let content = selector;

        // Always build tree view to show element hierarchy with attributes
        const buildTree = () => {
            const elements = [];
            let curr = el;

            // Collect elements up to root or nearest ID
            while (curr && curr !== document.body) {
                const attrs = [];

                // Build comprehensive element description
                const tag = curr.tagName.toLowerCase();
                const parts = [];
                
                // Always start with tag
                parts.push(`<span style="color:#6db3f2">${tag}</span>`);
                
                // Add ID if present
                if (curr.id) {
                    parts.push(`<span style="color:#86c1b9">#${curr.id}</span>`);
                }
                
                // Add classes (first 2-3 meaningful ones)
                if (curr.className && typeof curr.className === 'string') {
                    const classes = curr.className.trim().split(/\s+/)
                        .filter(c => c && !c.match(/^(active|hover|focus|disabled|selected|open|closed|ng-|css-)/))
                        .slice(0, 2);
                    if (classes.length > 0) {
                        parts.push(`<span style="color:#f0c674">.${classes.join('.')}</span>`);
                    }
                }
                
                // Add key attributes
                if (curr.getAttribute('role')) {
                    parts.push(`<span style="color:#cc99cc">[role=${curr.getAttribute('role')}]</span>`);
                }
                
                // Show actual data attributes
                const dataAttrs = Array.from(curr.attributes)
                    .filter(attr => attr.name.startsWith('data-'))
                    .slice(0, 2); // Show first 2 data attributes
                    
                dataAttrs.forEach(attr => {
                    let value = attr.value;
                    if (value.length > 12) value = value.substring(0, 10) + '..';
                    parts.push(`<span style="color:#cc99cc">[${attr.name}="${value}"]</span>`);
                });
                
                // Add text content for leaf nodes
                if (curr.textContent && curr.textContent.trim() && curr.children.length === 0) {
                    const text = curr.textContent.trim().substring(0, 15);
                    parts.push(`<span style="color:#b19cd9">"${text}${curr.textContent.trim().length > 15 ? '...' : ''}"</span>`);
                }
                
                attrs.push(parts.join(' '));

                elements.unshift({
                    tag: curr.tagName.toLowerCase(),
                    attrs: attrs,
                    element: curr
                });

                if (curr.id) break; // Stop at ID
                curr = curr.parentElement;
            }

            // Build tree display with proper tree characters
            return elements.map((item, i) => {
                const isTarget = i === elements.length - 1;
                const isRoot = i === 0;
                
                let line = '';
                
                // Build indent with vertical lines
                for (let j = 0; j < i; j++) {
                    line += j < i - 1 ? '│ ' : '';
                }
                
                // Add connector
                if (!isRoot) {
                    line += isTarget ? '└─ ' : '├─ ';
                }

                let display = item.attrs.join(' ') || item.tag;

                // Highlight target with better visual distinction
                if (isTarget) {
                    return `<span style="color:#666">${line}</span><span style="background:rgba(0,255,255,0.1);padding:1px 3px;border-radius:2px">${display}</span>`;
                }
                return `<span style="color:#666">${line}</span>${display}`;
            }).join('\n');
        };

        const tree = buildTree();

        // Truncate selector for display
        const displaySelector = selector.length > 60 ? selector.substring(0, 57) + '...' : selector;

        // Remove text preview - already shown in tree

        // Only show the selector if it's different from the last item in tree
        const lastTreeItem = tree.split('\n').pop();
        const lastTreeText = lastTreeItem.replace(/<[^>]*>/g, '').trim();
        const selectorDisplay = lastTreeText.includes(selector) || selector === lastTreeText.replace(/[└─\s]/g, '') 
            ? '' 
            : `\n<div style="margin-top:8px;padding-top:8px;border-top:1px solid #444"><div style="font-size:11px;color:#0ff">${displaySelector}</div></div>`;
        
        content = `${tree}${selectorDisplay}`;

        tooltip.innerHTML = content;
        tooltip.style.cssText = 'position:fixed;background:#000;color:#fff;padding:10px 12px;font:11px monospace;border-radius:4px;pointer-events:none;z-index:2147483647;display:block;max-width:500px;box-shadow:0 2px 8px rgba(0,0,0,0.4);line-height:1.5;white-space:pre-wrap';

        // Calculate tooltip dimensions after styling
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 5;

        // Find best position (priority: top, bottom, right, left)
        let pos = null;

        // Try above
        if (rect.top - tooltipRect.height - gap > 0) {
            pos = {
                left: Math.min(Math.max(rect.left, gap), window.innerWidth - tooltipRect.width - gap),
                top: rect.top - tooltipRect.height - gap
            };
        }
        // Try below
        else if (rect.bottom + tooltipRect.height + gap < window.innerHeight) {
            pos = {
                left: Math.min(Math.max(rect.left, gap), window.innerWidth - tooltipRect.width - gap),
                top: rect.bottom + gap
            };
        }
        // Try right
        else if (rect.right + tooltipRect.width + gap < window.innerWidth) {
            pos = {
                left: rect.right + gap,
                top: Math.min(Math.max(rect.top, gap), window.innerHeight - tooltipRect.height - gap)
            };
        }
        // Try left
        else if (rect.left - tooltipRect.width - gap > 0) {
            pos = {
                left: rect.left - tooltipRect.width - gap,
                top: Math.min(Math.max(rect.top, gap), window.innerHeight - tooltipRect.height - gap)
            };
        }
        // Fallback: top-right corner of viewport
        else {
            pos = {
                left: window.innerWidth - tooltipRect.width - 20,
                top: 20
            };
        }

        tooltip.style.left = pos.left + 'px';
        tooltip.style.top = pos.top + 'px';
    }

    function toggle() {
        active = !active;
        document.body.style.cursor = active ? 'crosshair' : '';
        if (!active) {
            overlay.style.display = 'none';
            tooltip.style.display = 'none';
        }

        const notif = document.createElement('div');
        notif.textContent = active ? 'Selector mode ON (Press Escape to exit)' : 'Selector mode OFF';
        notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:10px 15px;border-radius:4px;z-index:2147483647;font-family:Arial';
        
        // Safari-safe notification appending
        try {
            document.body.appendChild(notif);
        } catch (e) {
            // Fallback for CSP issues
            document.documentElement.appendChild(notif);
        }
        setTimeout(() => {
            try {
                notif.remove();
            } catch (e) {
                // Fallback removal
                if (notif.parentNode) {
                    notif.parentNode.removeChild(notif);
                }
            }
        }, 2000);
    }

    // Safari-compatible initialization with CSP handling
    function safariCompatibleInit() {
        return new Promise((resolve) => {
            // Wait for body to be available
            const waitForBody = () => {
                if (document.body) {
                    resolve();
                } else {
                    setTimeout(waitForBody, 10);
                }
            };
            waitForBody();
        });
    }

    // Initialize function
    function init() {
        if (initialized) return;
        initialized = true;

        // Create elements with Safari-compatible approach
        overlay = document.createElement('div');
        tooltip = document.createElement('div');
        overlay.style.display = 'none';
        tooltip.style.display = 'none';
        
        // Use safer DOM manipulation for Safari
        try {
            document.body.appendChild(overlay);
            document.body.appendChild(tooltip);
        } catch (e) {
            // Fallback for CSP issues
            document.documentElement.appendChild(overlay);
            document.documentElement.appendChild(tooltip);
        }

        // Register shortcuts with native keyboard events
        document.addEventListener('keydown', (e) => {
            // Ctrl+E to toggle
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                toggle();
            }
            // Escape to exit
            if (e.key === 'Escape' && active) {
                e.preventDefault();
                toggle();
            }
        });

        // Event listeners
        document.addEventListener('mouseover', e => {
            if (active && e.target !== overlay && e.target !== tooltip) {
                current = e.target;
                highlight(e.target);
            }
        });

        // Update position on scroll
        document.addEventListener('scroll', () => {
            if (active && current) {
                highlight(current);
            }
        }, true);

        // Update on window resize
        window.addEventListener('resize', () => {
            if (active && current) {
                highlight(current);
            }
        });

        document.addEventListener('click', e => {
            if (active && current) {
                e.preventDefault();
                e.stopPropagation();

                const selector = getSelector(current);
                
                // Try modern clipboard API first, fallback to execCommand
                const copyToClipboard = async (text) => {
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(text);
                            return true;
                        }
                    } catch (err) {
                        // Fallback to execCommand
                    }
                    
                    // Fallback method for Safari and other browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';
                    document.body.appendChild(textarea);
                    textarea.select();
                    textarea.setSelectionRange(0, 99999);
                    
                    try {
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textarea);
                        return successful;
                    } catch (err) {
                        document.body.removeChild(textarea);
                        return false;
                    }
                };
                
                copyToClipboard(selector).then(success => {
                    const notif = document.createElement('div');
                    notif.textContent = success ? 'Copied: ' + selector : 'Failed to copy: ' + selector;
                    notif.style.cssText = `position:fixed;top:20px;right:20px;background:${success ? '#4CAF50' : '#f44336'};color:white;padding:10px 15px;border-radius:4px;z-index:2147483647;font-family:Arial`;
                    
                    // Safari-safe notification appending
                    try {
                        document.body.appendChild(notif);
                    } catch (e) {
                        // Fallback for CSP issues
                        document.documentElement.appendChild(notif);
                    }
                    setTimeout(() => {
                        try {
                            notif.remove();
                        } catch (e) {
                            // Fallback removal
                            if (notif.parentNode) {
                                notif.parentNode.removeChild(notif);
                            }
                        }
                    }, 2000);
                });
            }
        });
    }

    // Safari-compatible initialization with better CSP handling
    function safariInit() {
        // For Safari, we need to be more careful about timing and CSP
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                safariCompatibleInit().then(init);
            });
        } else {
            // DOM already loaded, but wait for body to be ready
            safariCompatibleInit().then(init);
        }
    }

    // Check if we're in Safari and use appropriate initialization
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        // Safari-specific initialization
        safariInit();
    } else {
        // Standard initialization for other browsers
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // Also reinitialize on navigation changes for SPAs
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Give the page time to render
            setTimeout(() => {
                if (!initialized || !document.body.contains(overlay)) {
                    initialized = false;
                    init();
                }
            }, 500);
        }
    }).observe(document, {subtree: true, childList: true});

    // Handle history navigation
    window.addEventListener('popstate', () => {
        setTimeout(() => {
            if (!initialized || !document.body.contains(overlay)) {
                initialized = false;
                init();
            }
        }, 500);
    });
})();