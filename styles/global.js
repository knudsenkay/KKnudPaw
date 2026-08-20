/* ================================
   DROPDOWN VIA EVENT DELEGATION
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
   LOAD HEADER + NAV
================================ */

async function loadHeader() {
    const headerEl = document.getElementById("header");
    const html = await fetch("header.html").then(r => r.text());
    headerEl.innerHTML = html;

    // Load nav into the dropdown container
    const navHtml = await fetch("nav.html").then(r => r.text());
    document.getElementById("Start-menu").innerHTML = navHtml;
}

loadHeader();
