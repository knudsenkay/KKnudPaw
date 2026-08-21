/* ================================
   MAIN MENU DROPDOWN (EVENT DELEGATION)
================================ */

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-dropdown-btn");
    if (!btn) return;

    const menu = document.getElementById(btn.dataset.dropdown);
    if (menu) {
        menu.classList.toggle("show");
    }
});


/* ================================
   GROUP COLLAPSIBLES (EVENT DELEGATION)
================================ */

document.addEventListener("click", (e) => {
    const groupBtn = e.target.closest(".group-btn");
    if (!groupBtn) return;

    const menu = document.getElementById(groupBtn.dataset.group);
    if (menu) {
        menu.classList.toggle("show");
    }
});


/* ================================
   LOAD HEADER + NAV
================================ */

async function loadHeader() {
    const headerEl = document.getElementById("header");
    const html = await fetch("header.html").then(r => r.text());
    headerEl.innerHTML = html;

    // Load nav.html into #nav, NOT inside Start-menu
    const navHtml = await fetch("nav.html").then(r => r.text());
    document.getElementById("nav").innerHTML = navHtml;
}

loadHeader();
