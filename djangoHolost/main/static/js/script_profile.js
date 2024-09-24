// PASSWORD DISPLAY

async function loadSvg(filePath) {
    const response = await fetch(filePath);
    const svgText = await response.text();
    return svgText;
}

document.addEventListener('DOMContentLoaded', async function() {
    let svgShowEye = await loadSvg('/static/pictures/dark_theme/eye_dark.svg');
    let svgHideEye = await loadSvg('/static/pictures/dark_theme/hide_eye_dark.svg');
    const passwordFields = document.querySelectorAll('input[name="password"], input[name="password1"], input[name="password2"], input[name="new_password1"], input[name="new_password2"], input[name="old_password"]');
    const eyeIcons = document.querySelectorAll('.eye');
    passwordFields.forEach((passwordField, index) => {
        const eyeIcon = eyeIcons[index];

        if (passwordField && eyeIcon) {
            

            eyeIcon.innerHTML = svgShowEye;   
            eyeIcon.addEventListener('click', function() {
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    eyeIcon.innerHTML = svgHideEye;
                } else {
                    passwordField.type = 'password';
                    eyeIcon.innerHTML = svgShowEye;
                }
            });
        }    
    });
});

// ASIDE

document.addEventListener("DOMContentLoaded", function() {
    const sidebarItems = document.querySelectorAll('.sidebarp ul li');
    const contentBoxes = document.querySelectorAll('.content-box');

    function setActiveTab(item) {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        contentBoxes.forEach(box => box.style.display = 'none');
        const target = item.getAttribute('data-target');
        document.getElementById(target).style.display = 'block';

        const activeIndex = Array.from(sidebarItems).indexOf(item);
        localStorage.setItem('activeTabIndex', activeIndex);
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            setActiveTab(item);
        });
    });

    const isNavigatedFromAnotherPage = performance.getEntriesByType("navigation")[0].type !== "reload";
    const savedTabIndex = localStorage.getItem('activeTabIndex');

    if (isNavigatedFromAnotherPage) {
        setActiveTab(sidebarItems[0]);
    } else if (savedTabIndex !== null) {
        const savedTab = sidebarItems[savedTabIndex];
        if (savedTab) {
            setActiveTab(savedTab);
        }
    } else {
        setActiveTab(sidebarItems[0]);
    }
});

// PREVIEW

const inputElement = document.getElementById('id_image');
const previewElement = document.getElementById('preview');
const cropModal = document.getElementById('cut');
const closeModal = document.getElementById('closeModal');
const modalContent = document.querySelector('.modal-content');
const imageToCrop = document.getElementById('imageToCrop');
const cropButton = document.getElementById('cropButton');

let cropper;

let isMousePressedInside = false;

previewElement.addEventListener('click', function () {
    inputElement.click();
});

inputElement.addEventListener('click', function () {
    inputElement.value = '';
});

inputElement.addEventListener('change', function () {
    if (inputElement.files && inputElement.files[0]) {
        const file = inputElement.files[0];
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("Ошибка: размер файла превышает 2 МБ.");
            inputElement.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const width = img.width;
                const height = img.height;

                const MAX_WIDTH = 1280;
                const MAX_HEIGHT = 1024;
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    alert("Ошибка: изображение превышает максимальные размеры 1280x1024 пикселей.");
                    inputElement.value = '';
                    return;
                }
                imageToCrop.src = e.target.result;
                cropModal.style.display = 'flex';

                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }

                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 1,
                    minCropBoxWidth: 100,
                    minCropBoxHeight: 100,
                    maxCropBoxWidth: 300,
                    maxCropBoxHeight: 300,
                    cropBoxResizable: true,
                    zoomable: false,
                });
        };  };

        reader.readAsDataURL(file);
    }
});


cropButton.addEventListener('click', function () {
    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
    });

    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        previewElement.src = url;

        cropModal.style.display = 'none';

        const file = new File([blob], inputElement.files[0].name, { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;
    });
});

closeModal.addEventListener('click', function () {
    cropModal.style.display = 'none';

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
});

modalContent.addEventListener('mousedown', function () {
    isMousePressedInside = true;
});

window.addEventListener('mouseup', function (event) {
    if (isMousePressedInside) {
        isMousePressedInside = false;
    } else if (event.target === cropModal) {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }
});

