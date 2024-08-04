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

function toggleBodyScroll() {
    const body = document.querySelector('body');
    const isSmallScreen = window.matchMedia('(max-width: 700px) and (min-height: 390px)').matches;
    if (isSmallScreen && isMobile) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'visible'; 
    }
}

function openSidebar() {
    toggleBodyScroll();
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('collapsed');
    sidebar.style.backgroundColor = '#443435';
    toggleIcons('/static/pictures/pig-work.gif');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.querySelector('body');
    sidebar.classList.add('collapsed');
    sidebar.style.backgroundColor = '';
    body.style.overflow = 'visible'; 
    toggleIcons('static/pictures/dark_theme/menu_dark.png');
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
