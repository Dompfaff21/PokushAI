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

// THEME

async function loadSvg(filePath) {
    const response = await fetch(filePath);
    const svgText = await response.text();
    return svgText;
}

async function loadMultipleSvgs(filePaths) {
    const svgPromises = filePaths.map(filePath => loadSvg(filePath));
    return await Promise.all(svgPromises);
}

async function setThemeIcons() {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let dark_theme_files = [
        '/static/pictures/theme_dark.svg',
        '/static/pictures/sidebar/home.svg',
        '/static/pictures/sidebar/programm.svg',
        '/static/pictures/sidebar/recipe.svg',
        '/static/pictures/sidebar/user.svg',
        '/static/pictures/sidebar/pigs.svg',
        '/static/pictures/face.svg',
        '/static/pictures/logout.svg',
    ];
    
    let light_theme_files = [
        '/static/pictures/theme.svg',
    ];

    let dark_theme_svgs = await loadMultipleSvgs(dark_theme_files);
    let light_theme_svgs = await loadMultipleSvgs(light_theme_files);

    const lightThemeIconPath = "/static/pictures/dark_theme/menu_dark.png";
    const darkThemeIconPath = "/static/pictures/light_theme/menu_light.png";
    const menuIcon = document.querySelector('.icon_hover');

    function toggleTheme() {
        const themeIcon = document.getElementById('theme-toggle');
        const body = document.body;

        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateMenuIcon(darkThemeIconPath);
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateMenuIcon(lightThemeIconPath);
        }
    }

    function updateMenuIcon(iconPath) {
        menuIcon.src = iconPath;
    }

    if (localStorage.getItem('theme') === 'dark-theme') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').innerHTML = dark_theme_svgs[0];
        document.getElementById('home').innerHTML = dark_theme_svgs[1];
        document.getElementById('programm').innerHTML = dark_theme_svgs[2];
        document.getElementById('recipe').innerHTML = dark_theme_svgs[3];
        document.getElementById('user').innerHTML = dark_theme_svgs[4];
        document.getElementById('pigs').innerHTML = dark_theme_svgs[5];
        if (document.getElementById('auth-icon')) {
            document.getElementById('auth-icon').innerHTML = isDarkTheme ? dark_theme_svgs[6] : light_theme_svgs[7];
        } else if (document.getElementById('logout-icon')) {
            document.getElementById('logout-icon').innerHTML = isDarkTheme ? dark_theme_svgs[7] : light_theme_svgs[6];
        }
    } else {
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').innerHTML = light_theme_svgs[0];
        document.getElementById('home').innerHTML = dark_theme_svgs[1];
        document.getElementById('programm').innerHTML = dark_theme_svgs[2];
        document.getElementById('recipe').innerHTML = dark_theme_svgs[3];
        document.getElementById('user').innerHTML = dark_theme_svgs[4];
        document.getElementById('pigs').innerHTML = dark_theme_svgs[5];
        if (document.getElementById('auth-icon')) {
            document.getElementById('auth-icon').innerHTML = isDarkTheme ? dark_theme_svgs[6] : light_theme_svgs[7];
        } else if (document.getElementById('logout-icon')) {
            document.getElementById('logout-icon').innerHTML = isDarkTheme ? dark_theme_svgs[7] : light_theme_svgs[6];
        }
    }
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

setThemeIcons();

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
    toggleIcons('/static/pictures/pig-work.gif');
}

function updateMenuIcon() {
    const body = document.body;
    const menuIcon = document.querySelector('.icon_hover');

    const darkThemeIconPath = "/static/pictures/light_theme/menu_light.png";
    const lightThemeIconPath = "/static/pictures/dark_theme/menu_dark.png";

    if (body.classList.contains('dark-theme')) {
        menuIcon.src = darkThemeIconPath;
    } else {
        menuIcon.src = lightThemeIconPath;
    }
}

function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    const body = document.body;

    if (storedTheme) {
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(storedTheme);
    }

    updateMenuIcon();
}

document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
});

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('collapsed');

    updateMenuIcon();
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