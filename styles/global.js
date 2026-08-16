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
function openImagePopup(src) {
    const popup = document.getElementById('imgPopup');
    const popupImg = document.getElementById('imgPopupImg');
    popupImg.src = src;
    popup.style.display = 'flex';
}

function closeImagePopup() {
    document.getElementById('imgPopup').style.display = 'none';
}
