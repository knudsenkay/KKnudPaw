/* ============================================================
   LOAD HEADER + NAV FIRST
============================================================ */
async function loadHeader() {
    // Load header
    const headerEl = document.getElementById("header");
    const headerHtml = await fetch("header.html").then(r => r.text());
    headerEl.innerHTML = headerHtml;

    // Load nav
    const navEl = document.getElementById("nav");
    const navHtml = await fetch("nav.html").then(r => r.text());
    navEl.innerHTML = navHtml;

    // AFTER nav is loaded, attach listeners
    attachMenuListeners();
}

loadHeader();


/* ============================================================
   ATTACH LISTENERS (runs AFTER nav loads)
============================================================ */
function attachMenuListeners() {

    // Main dropdown
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".nav-dropdown-btn");
        if (!btn) return;

        const menu = document.getElementById(btn.dataset.dropdown);
        if (menu) menu.classList.toggle("show");
    });

    // Group collapsibles
    document.addEventListener("click", (e) => {
        const groupBtn = e.target.closest(".group-btn");
        if (!groupBtn) return;

        const menu = document.getElementById(groupBtn.dataset.group);
        if (menu) menu.classList.toggle("show");
    });
}
