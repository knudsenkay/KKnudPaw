/* ============================================================
   THEME INTERACTIONS
   - Safe against missing elements
   - Idempotent (safe to call multiple times)
   - Accessible (aria-expanded, Escape, outside click)
============================================================ */

(function () {
    "use strict";

    // Mark elements as already-wired so repeat calls don't stack listeners
    const WIRED = "data-dropdown-wired";

    // -------- helpers --------
    function isElement(el) {
        return el instanceof Element;
    }

    function getTarget(btn, attr) {
        const id = btn.dataset[attr];
        if (!id) return null;
        return document.getElementById(id);
    }

    function setExpanded(btn, menu, open) {
        if (isElement(btn)) btn.setAttribute("aria-expanded", String(open));
        if (isElement(menu)) menu.classList.toggle("show", open);
    }

    function closeAll(selector) {
        document.querySelectorAll(selector).forEach((btn) => {
            const menu = getTarget(btn, "dropdown") || getTarget(btn, "group");
            setExpanded(btn, menu, false);
        });
    }

    // Close any open dropdown when clicking outside
    document.addEventListener("click", (e) => {
        const insideNav = e.target.closest(".nav-dropdown-btn, .group-btn, .nav-dropdown, .group-menu");
        if (!insideNav) {
            closeAll(".nav-dropdown-btn, .group-btn");
        }
    });

    // Escape closes everything
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAll(".nav-dropdown-btn, .group-btn");
        }
    });

    // -------- main nav dropdown --------
    function initNavDropdowns() {
        document.querySelectorAll(".nav-dropdown-btn").forEach((btn) => {
            if (btn.hasAttribute(WIRED)) return;

            const menu = getTarget(btn, "dropdown");
            if (!menu) return;

            btn.setAttribute(WIRED, "");
            btn.setAttribute("aria-expanded", "false");
            btn.setAttribute("aria-controls", menu.id);

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const isOpen = menu.classList.contains("show");

                // close siblings (single-open behavior)
                document.querySelectorAll(".nav-dropdown-btn").forEach((other) => {
                    if (other !== btn) {
                        const otherMenu = getTarget(other, "dropdown");
                        setExpanded(other, otherMenu, false);
                    }
                });
                // also collapse any nested group menus
                document.querySelectorAll(".group-btn").forEach((g) => {
                    const gm = getTarget(g, "group");
                    setExpanded(g, gm, false);
                });

                setExpanded(btn, menu, !isOpen);
            });
        });
    }

    // -------- group dropdowns (nestable) --------
    function initGroupDropdowns() {
        document.querySelectorAll(".group-btn").forEach((btn) => {
            if (btn.hasAttribute(WIRED)) return;

            const menu = getTarget(btn, "group");
            if (!menu) return;

            btn.setAttribute(WIRED, "");
            btn.setAttribute("aria-expanded", "false");
            btn.setAttribute("aria-controls", menu.id);

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const isOpen = menu.classList.contains("show");
                setExpanded(btn, menu, !isOpen);
            });
        });
    }

    // -------- expose to global scope (autoload.js calls these) --------
    window.initNavDropdowns = initNavDropdowns;
    window.initGroupDropdowns = initGroupDropdowns;

    // Auto-init once DOM is ready (harmless if autoload calls again)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initNavDropdowns();
            initGroupDropdowns();
        });
    } else {
        initNavDropdowns();
        initGroupDropdowns();
    }
})();