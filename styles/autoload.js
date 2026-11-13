/* ============================================================
   AUTOLOAD
   ------------------------------------------------------------
   Loads shared components (head / nav / foot), page CSS, and
   page JS. Ensures:
     - Component HTML is injected before init runs
     - Scripts have executed before init runs
     - Stylesheets are applied before init runs
     - CSS loads in dependency order (theme before style)
     - Duplicate loads are coalesced via cached promises
     - Missing elements and failed loads degrade gracefully
============================================================ */

(function () {
    "use strict";

    /* ============================================================
       CONFIG
       ============================================================ */
    const COMPONENTS = [
        { targetId: "head", file: "000H.html" },
        { targetId: "nav",  file: "000N.html" },
        { targetId: "foot", file: "000F.html" }
    ];

    // Order matters: theme.css defines tokens + base styles,
    // style.css builds on top of them.
    const STYLESHEETS = [
        "styles/theme.css",
        "styles/style.css"
    ];

    // Order matters: global.js exposes init hooks used after boot.
    const SCRIPTS = [
        "styles/global.js"
    ];

    /* ============================================================
       CACHES (promise-based so concurrent callers await the same load)
       ============================================================ */
    const componentPromises = new Map();
    const cssPromises       = new Map();
    const jsPromises        = new Map();

    /* ============================================================
       COMPONENT LOADER
       Fetches an HTML partial and injects it into #<targetId>.
       Resolves even if the target element is missing or the fetch
       fails, so boot is never blocked by one bad component.
       ============================================================ */
    function loadComponent(targetId, file) {
        const key = `${targetId}::${file}`;
        if (componentPromises.has(key)) return componentPromises.get(key);

        const promise = new Promise((resolve) => {
            const el = document.getElementById(targetId);
            if (!el) {
                // Page doesn't use this slot -- resolve quietly.
                resolve();
                return;
            }

            fetch(file)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to load ${file} (${res.status})`);
                    }
                    return res.text();
                })
                .then((html) => {
                    el.innerHTML = html;
                    resolve();
                })
                .catch((err) => {
                    console.error(`[autoload] component "${file}" -> #${targetId}:`, err);
                    resolve(); // don't block boot
                });
        });

        componentPromises.set(key, promise);
        return promise;
    }

    /* ============================================================
       CSS LOADER
       Returns a promise that resolves when the stylesheet is
       loaded (or has failed). Cached per-file.
       ============================================================ */
    function loadCSS(file) {
        if (cssPromises.has(file)) return cssPromises.get(file);

        const promise = new Promise((resolve) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = file;
            link.onload  = () => resolve();
            link.onerror = () => {
                console.error(`[autoload] stylesheet failed: ${file}`);
                resolve(); // don't block boot
            };
            document.head.appendChild(link);
        });

        cssPromises.set(file, promise);
        return promise;
    }

    /* ============================================================
       JS LOADER
       Returns a promise that resolves when the script has executed
       (or has failed). Cached per-file.

       NOTE: `defer` has no effect on dynamically inserted scripts.
       We set `async = false` to preserve execution order among
       injected scripts.
       ============================================================ */
    function loadJS(file) {
        if (jsPromises.has(file)) return jsPromises.get(file);

        const promise = new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = file;
            script.async = false;
            script.onload  = () => resolve();
            script.onerror = () => {
                console.error(`[autoload] script failed: ${file}`);
                resolve(); // don't block boot
            };
            document.head.appendChild(script);
        });

        jsPromises.set(file, promise);
        return promise;
    }

    /* ============================================================
       INIT HOOKS
       Calls every exposed init function, guarding against
       missing globals and per-hook errors so one failure
       doesn't take down the rest.
       ============================================================ */
    function runInitHooks() {
        const hooks = ["initNavDropdowns", "initGroupDropdowns"];

        hooks.forEach((name) => {
            const fn = window[name];
            if (typeof fn !== "function") {
                console.warn(
                    `[autoload] window.${name} is not defined -- ` +
                    `did global.js load correctly?`
                );
                return;
            }
            try {
                fn();
            } catch (err) {
                console.error(`[autoload] ${name}() threw:`, err);
            }
        });
    }

    /* ============================================================
       BOOT
       - Load components, stylesheets, and scripts in parallel
       - Wait for all to settle (success OR failure)
       - Then run init hooks (idempotent thanks to global.js)
       ============================================================ */
    function boot() {
        // Kick everything off in parallel.
        const componentLoads = COMPONENTS.map(({ targetId, file }) =>
            loadComponent(targetId, file)
        );

        const cssLoads = STYLESHEETS.map(loadCSS);
        const jsLoads  = SCRIPTS.map(loadJS);

        // Wait for all regardless of individual failures.
        Promise.all([
            Promise.all(componentLoads),
            Promise.all(cssLoads),
            Promise.all(jsLoads)
        ])
            .then(() => {
                runInitHooks();
            })
            .catch((err) => {
                // Should never happen (all children resolve), but be safe.
                console.error("[autoload] boot failed:", err);
            });
    }

    /* ============================================================
       ENTRY
       ============================================================ */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();