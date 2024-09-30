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
                    responsive: false,
                    scalable: false,
                });
            };
        };  

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

document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(function(input) {
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        }

        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
    });
});