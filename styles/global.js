}
function initHeaderComponents() {
    const buttons = document.querySelectorAll('.nav-dropdown-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.dropdown;
            const menu = document.getElementById(id);
            menu.classList.toggle('open');
        });
    });
}
document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const menu = document.getElementById(btn.dataset.dropdown);
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
});
function initDropdowns() {
    document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.dropdown;
            document.getElementById(id).classList.toggle('open');
        });
    });


/* ================================
   GALLERY COMPONENT INITIALIZER
================================ */

async function initGalleryComponent(el) {
    const folder = el.getAttribute("images/gallery");
    if (!folder) return;

    // Fetch list of images in folder
    const response = await fetch(`/data/gallery.json`);
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

/* Hook into your existing component loader */
document.querySelectorAll("[data-component]").forEach(async el => {
    await loadComponent(el);

    if (el.getAttribute("data-component") === "gallery") {
        initGalleryComponent(el);
    }
});

/* ================================
   POPUP
================================ */

function openImagePopup(src) {
    document.getElementById('imgPopupImg').src = src;
    document.getElementById('imgPopup').style.display = 'flex';
}
