// MAIN MENU BUTTON
function initNavDropdowns() {
    const mainBtn = document.querySelector('.nav-dropdown-btn');
    const mainMenu = document.getElementById(mainBtn.dataset.dropdown);

    mainBtn.addEventListener('click', () => {
        mainMenu.classList.toggle('show');
    });
}

// GROUP BUTTONS
function initGroupDropdowns() {
    const groupButtons = document.querySelectorAll('.group-btn');

    groupButtons.forEach(btn => {
        const groupId = btn.dataset.group;
        const groupMenu = document.getElementById(groupId);

        btn.addEventListener('click', () => {
            groupMenu.classList.toggle('show');
        });
    });
}
