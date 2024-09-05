// SCRIPT FOR SIDEBAR

function updateSidebarPosition() {
    var header = document.querySelector("header");
    var sidebar = document.querySelector(".sidebar");
    var headerHigh = header.getBoundingClientRect();

    if (headerHigh.bottom > 0) {
        sidebar.style.top = headerHigh.bottom + "px";
    } else {
        sidebar.style.top = "0px";
    }
}

document.addEventListener("scroll", updateSidebarPosition);

window.addEventListener("resize", updateSidebarPosition);

window.addEventListener("orientationchange", updateSidebarPosition);

updateSidebarPosition();

// SCRIPT FOR ICON AND CLOSE BUTTON IN SIDEBAR

const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

function updateButtonDisplay() {
    const button = document.querySelector('.close-btn');
    if (isMobile) {
        button.style.display = 'inline';
    } else {
        button.style.display = 'none';
    }
}

window.addEventListener("resize", updateButtonDisplay());

function toggleIcons(src) {
    const icons = document.querySelectorAll('.sidebar__item .icon_hover');
    icons.forEach(icon => {
        icon.src = src;
    });
}

function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('collapsed');
    sidebar.style.backgroundColor = '#443435';
    toggleIcons('/static/pictures/pig-work.gif');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('collapsed');
    sidebar.style.backgroundColor = '';
    toggleIcons('/static/pictures/dark_theme/menu_dark.png');
}

if (!isMobile) {
    document.querySelector('.sidebar').addEventListener('mouseenter', function() {
        openSidebar();
    });
    
    document.querySelector('.sidebar').addEventListener('mouseleave', function() {
        closeSidebar();
    });
}

if (isMobile) {
    document.querySelector('.sidebar').addEventListener('click', function(event) {
        event.stopPropagation();
        if (document.querySelector('.sidebar').classList.contains('collapsed')) {
            openSidebar();
        }
    });
}

document.querySelector('.close-btn').addEventListener('click', function(event) {
    event.stopPropagation();
    closeSidebar();
});

document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('.close-btn');
    if (!sidebar.contains(event.target) && !closeBtn.contains(event.target)) {
        if (!sidebar.classList.contains('collapsed')) {
            closeSidebar();
        }
    }
});

// SCRIPT FOR TG

document.getElementById("tg").addEventListener("click", function() {
    window.open("https://t.me/three_pigs_inc", "_blank");
});

// ERROR

document.addEventListener('DOMContentLoaded', function () {
    var closeButton = document.querySelector('.messages-popup .close-button');
    var messagesPopup = document.querySelector('.messages-popup');

    if (closeButton) {
        closeButton.addEventListener('click', function () {
            messagesPopup.style.display = 'none';
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var messages = document.querySelector('.messages');

    if (messages) {
        if (messages.querySelector('.error')) {
            messages.classList.add('has-error');
        } else if (messages.querySelector('.success')) {
            messages.classList.add('has-success');
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var messagespopup = document.querySelector('.messages-popup');

    if (messagespopup) {
        if (messagespopup.querySelector('.error')) {
            messagespopup.classList.add('hav-error');
        } else if (messagespopup.querySelector('.success')) {
            messagespopup.classList.add('hav-success');
        }
    }
});

// THEME

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme');
        }
    }
}

function toggleTheme() {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
}

themeToggle.addEventListener('click', toggleTheme);

initializeTheme();

// AVATAR PREVIEW

    const inputElement = document.getElementById('id_image');
    const previewElement = document.getElementById('preview');

    previewElement.addEventListener('click', function() {
        inputElement.click();
    });

    inputElement.addEventListener('change', function() {
        if (inputElement.files && inputElement.files[0]) {
            const file = inputElement.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                previewElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });