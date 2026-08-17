/* ================================
   DROPDOWN INITIALIZER
================================ */

function initDropdowns() {
    document.querySelectorAll(".nav-dropdown-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const menu = document.getElementById(btn.dataset.dropdown);
            if (menu) {
                menu.classList.toggle("show");
            }
        });
    });
}


/* ================================
   GALLERY COMPONENT INITIALIZER
================================ */

async function initGalleryComponent(el) {
    const folder = el.getAttribute("images/gallery");
    if (!folder) return;

    // Fetch list of images in folder
    const response = await fetch(`/images/gallery/gallery.json`);
    const images = await response.json();

    const container = el.querySelector("#galleryContainer");

    images.forEach(src => {
        const fullPath = `${folder}/${src}`;

        const card = document.createElement("div");
        card.className = "dog-card img";
        card.onclick = () => openImagePopup(fullPath);

        card.innerHTML = `<img src="${fullPath}">`;
        container.appendChild(card);
    });
}


/* ================================
   COMPONENT LOADER HOOK
================================ */

document.querySelectorAll("[data-component]").forEach(async el => {
    await loadComponent(el);

    const type = el.getAttribute("data-component");

    // Header loads FIRST → now dropdown buttons exist
    if (type === "header") {
        initDropdowns();
    }

    // Gallery component
    if (type === "gallery") {
        initGalleryComponent(el);
    }
});


/* ================================
   POPUP VIEWER
================================ */

function openImagePopup(src) {
    document.getElementById('imgPopupImg').src = src;
    document.getElementById('imgPopup').style.display = 'flex';
}
