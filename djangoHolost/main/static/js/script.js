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

// SCRIPT FOR ICON

document.querySelector('.sidebar').addEventListener('mouseenter', function() {
    const icons = document.querySelectorAll('.sidebar__item .icon_hover');
    icons.forEach(icon => {
        const originalSrc = icon.src;
        icon.setAttribute('data-original', originalSrc);
        icon.src = '/static/pictures/pig-work.gif';
    });
});

document.querySelector('.sidebar').addEventListener('mouseleave', function() {
    const icons = document.querySelectorAll('.sidebar__item .icon_hover');
    icons.forEach(icon => {
        setTimeout(() => {
            icon.classList.add('hidden'); // Начинаем плавно скрывать текущую иконку
            setTimeout(() => {
                const originalSrc = icon.getAttribute('data-original');
                icon.src = originalSrc; // Восстанавливаем оригинальную иконку
                icon.classList.remove('hidden'); // Показываем иконку снова
            }, 30); // Задержка перед сменой изображения
        }, 200); // Задержка перед началом скрытия
    });
});