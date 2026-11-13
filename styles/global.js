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

    // Collapse every group (nested) menu. Optionally scope to a container.
    function closeAllGroups(root) {
        const scope = isElement(root) ? root : document;
        scope.querySelectorAll(".group-btn").forEach((btn) => {
            const menu = getTarget(btn, "group");
            setExpanded(btn, menu, false);
        });
    }

    // Collapse every top-level dropdown (and, transitively, its groups).
    function closeAllTopLevel() {
        document.querySelectorAll(".nav-dropdown-btn").forEach((btn) => {
            const menu = getTarget(btn, "dropdown");
            setExpanded(btn, menu, false);
        });
    }

    function closeAll() {
        closeAllTopLevel();
        closeAllGroups();
    }

    // Close any open dropdown when clicking outside
    document.addEventListener("click", (e) => {
        // e.target can be a non-Element (e.g. document) in rare cases
        if (!isElement(e.target)) return;

        const insideNav = e.target.closest(
            ".nav-dropdown-btn, .group-btn, .nav-dropdown, .group-menu"
        );
        if (!insideNav) {
            closeAll();
        }
    });

    // Escape closes everything
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAll();
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

                // Single-open behavior: collapse every other top-level
                // dropdown...
                document.querySelectorAll(".nav-dropdown-btn").forEach((other) => {
                    if (other !== btn) {
                        const otherMenu = getTarget(other, "dropdown");
                        setExpanded(other, otherMenu, false);
                    }
                });

                // ...and every group menu (inside any dropdown), regardless
                // of whether we're opening or closing this one. This keeps
                // nested state consistent: closing a top-level dropdown
                // also collapses its child groups so it reopens fresh.
                closeAllGroups();

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

                // Close sibling group menus at the same depth (single-open
                // within a parent) but leave ancestor/descendant state alone
                // unless we're collapsing this branch.
                const parentMenu = btn.parentElement;
                if (isElement(parentMenu)) {
                    parentMenu.querySelectorAll(":scope > .group-menu").forEach((sibling) => {
                        if (sibling === menu) return;
                        // Find the button controlling this sibling
                        const sibBtn = parentMenu.querySelector(
                            `:scope > .group-btn[data-group="${sibling.id}"]`
                        );
                        if (sibBtn) setExpanded(sibBtn, sibling, false);
                    });
                }

                // If we're closing this branch, collapse descendants too.
                if (isOpen) {
                    closeAllGroups(menu);
                }

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