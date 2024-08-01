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

// Обработчик события прокрутки
document.addEventListener("scroll", updateSidebarPosition);

// Обработчик события изменения размера окна
window.addEventListener("resize", updateSidebarPosition);

// Обработчик события изменения ориентации устройства
window.addEventListener("orientationchange", updateSidebarPosition);

// Вызов функции сразу после загрузки страницы
updateSidebarPosition();