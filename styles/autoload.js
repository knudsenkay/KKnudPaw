/* ============================================================
   AUTOLOAD
   - Loads shared components (head / nav / foot)
   - Loads page CSS and JS
   - Waits for scripts to actually load before calling init
   - Safe against missing elements and duplicate loads
============================================================ */

(function () {
    "use strict";

    // Track what we've already loaded so repeat calls don't double-load
    const loadedCSS = new Set();
    const loadedJS  = new Set();

    /* ---------------- component loader ---------------- */
    // Fetches an HTML partial and injects it into #<targetId>.
    // Resolves even if the target element is missing (page may not use it).
    function loadComponent(targetId, file) {
        const el = document.getElementById(targetId);
        if (!el) {
            // Nothing to inject into on this page -- skip quietly.
            return Promise.resolve();
        }

        return fetch(file)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to load ${file} (${res.status})`);
                }
                return res.text();
            })
            .then((html) => {
                el.innerHTML = html;
            })
            .catch((err) => {
                console.error(`[autoload] component "${file}" → #${targetId}:`, err);
            });
    }

    /* ---------------- CSS loader ---------------- */
    // Returns a promise that resolves when the stylesheet is loaded.
    function loadCSS(file) {
        if (loadedCSS.has(file)) return Promise.resolve();
        loadedCSS.add(file);

        return new Promise((resolve) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = file;
            link.onload  = () => resolve();
            link.onerror = () => {
                console.error(`[autoload] stylesheet failed: ${file}`);
                resolve(); // don't block the rest of the boot
            };
            document.head.appendChild(link);
        });
    }

    /* ---------------- JS loader ---------------- */
    // Returns a promise that resolves when the script has executed.
    function loadJS(file) {
        if (loadedJS.has(file)) return Promise.resolve();
        loadedJS.add(file);

        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = file;
            script.defer = true;
            script.onload  = () => resolve();
            script.onerror = () => {
                console.error(`[autoload] script failed: ${file}`);
                resolve(); // don't block the rest of the boot
            };
            document.head.appendChild(script);
        });
    }

    /* ---------------- boot ---------------- */
    function boot() {
        // 1) Load shared components and the two behavior scripts in parallel.
        //    global.js exposes initNavDropdowns / initGroupDropdowns.
        const components = Promise.all([
            loadComponent("head", "000H.html"),
            loadComponent("nav",  "000N.html"),
            loadComponent("foot", "000F.html")
        ]);

        const scripts = Promise.all([
            loadJS("styles/global.js"),
        ]);

        // 2) Load stylesheets (fire-and-forget is fine; they apply when ready).
        loadCSS("styles/style.css");
        loadCSS("styles/theme.css");

        // 3) Once both the DOM fragments are in place AND the scripts have run,
        //    initialize the nav dropdowns. global.js also self-inits, so this
        //    is a safety net for the case where autoload runs first.
        Promise.all([components, scripts]).then(() => {
            try {
                if (typeof window.initNavDropdowns === "function") {
                    window.initNavDropdowns();
                }
                if (typeof window.initGroupDropdowns === "function") {
                    window.initGroupDropdowns();
                }
            } catch (err) {
                console.error("[autoload] init failed:", err);
            }
        });
    }

    /* ---------------- entry ---------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        // DOM already parsed (script loaded late / deferred)
        boot();
    }
})();