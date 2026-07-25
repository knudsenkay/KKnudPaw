document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const menu = document.getElementById(btn.dataset.dropdown);
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
});
