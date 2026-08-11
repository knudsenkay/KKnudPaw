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
