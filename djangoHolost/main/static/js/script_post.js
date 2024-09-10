// PREVIEW

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