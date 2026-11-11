document.addEventListener("DOMContentLoaded", () => {

    function loadComponent(targetId, file) {
        return fetch(file)
            .then(res => res.text())
            .then(html => {
                const el = document.getElementById(targetId);
                if (el) el.innerHTML = html;
            });
    }

    function loadCSS(file) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = file;
        document.head.appendChild(link);
    }

    function loadJS(file) {
        const script = document.createElement("script");
        script.src = file;
        document.head.appendChild(script);
    }

    Promise.all([
        loadComponent("header", "header.html"),
        loadComponent("main-nav", "navigation.html"),
        loadComponent("footer", "footer.html")
    ]).then(() => {
        if (typeof initNavDropdowns === "function") initNavDropdowns();
        if (typeof initGroupDropdowns === "function") initGroupDropdowns();
    });

    /* Correct paths */
    loadCSS("styles/style.css");
    loadCSS("styles/theme.css");
    loadJS("styles/global.js");

});
