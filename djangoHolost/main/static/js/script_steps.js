// PREVIEW

document.addEventListener('DOMContentLoaded', function() {
    const formsetContainer = document.getElementById('formset-container');
    const cutStepModal = document.getElementById('cutStep');
    const imageToCropStep = document.getElementById('imageToCropStep');
    const cropButtonStep = document.getElementById('cropButtonStep');
    const closeModalStep = document.getElementById('closeModalStep');

    let cropperStep;
    let currentInput;
    let isMousePressedInsideStep = false;
    let originalPreviewSrc;

    formsetContainer.addEventListener('click', function(event) {
        if (event.target.matches('.dish')) {
            currentInput = event.target.nextElementSibling;
            originalPreviewSrc = event.target.src;
            currentInput.click();
        }
    });

    formsetContainer.addEventListener('click', function(event) {
        if (event.target.matches('.step-image')) {
            event.target.value = '';
        }
    });

    formsetContainer.addEventListener('change', function(event) {
        if (event.target.matches('.step-image')) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {

                    imageToCropStep.src = e.target.result;
                    cutStepModal.style.display = 'flex';

                        if (cropperStep) {
                            cropperStep.destroy();
                        }

                        cropperStep = new Cropper(imageToCropStep, {
                            aspectRatio: 1,
                            viewMode: 1,
                            minCropBoxWidth: 100,
                            minCropBoxHeight: 100,
                            cropBoxResizable: true,
                            zoomable: false,
                            responsive: false,
                            scalable: false,
                            ready: function() {
                                const imageData = cropperStep.getImageData();
                                const cropBoxSize = Math.min(imageData.width, imageData.height);
                                const left = (imageData.width - cropBoxSize) / 2;
                                const top = (imageData.height - cropBoxSize) / 2;

                                cropperStep.setCropBoxData({
                                    left: imageData.left + left,
                                    top: imageData.top + top,
                                    width: cropBoxSize,
                                    height: cropBoxSize
                                });
                            }
                        });
                };

                reader.readAsDataURL(file);
            }
        }
    });

    cropButtonStep.addEventListener('click', function() {
        if (cropperStep) {
            const canvas = cropperStep.getCroppedCanvas({
                width: 300,
                height: 300,
            });

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const stepPreviewImage = currentInput.previousElementSibling;
                stepPreviewImage.src = url;

                cutStepModal.style.display = 'none';

                const file = new File([blob], currentInput.files[0].name, { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                currentInput.files = dataTransfer.files;
            });
        }
    });

    closeModalStep.addEventListener('click', function() {
        cutStepModal.style.display = 'none';

        if (cropperStep) {
            cropperStep.destroy();
        }

        const stepPreviewImage = currentInput.previousElementSibling;
        stepPreviewImage.src = originalPreviewSrc;
    });

    modalContent.addEventListener('mousedown', function() {
        isMousePressedInsideStep = true;
    });

    window.addEventListener('mouseup', function(event) {
        if (isMousePressedInsideStep) {
            isMousePressedInsideStep = false;
        } else if (event.target === cutStepModal) {
            cutStepModal.style.display = 'none';
            if (cropperStep) {
                cropperStep.destroy();
            }

            const stepPreviewImage = currentInput.previousElementSibling;
            stepPreviewImage.src = originalPreviewSrc;
        }
    });

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

// STEPS

document.addEventListener('DOMContentLoaded', function() {
    let deleteStepBtn = document.getElementById('delete-step-btn');
    let formsetContainer = document.getElementById('formset-container');
    let totalForms = document.querySelector('#id_steps-TOTAL_FORMS');
    let formNum = formsetContainer.querySelectorAll('.step-form').length;
    let addStepBtn = document.getElementById('add-step-btn');
    setInitialContainerHeight();
    toggleDeleteStepButton();

    addStepBtn.addEventListener('click', function(e) {
        let newForm = formsetContainer.querySelector('.step-form').cloneNode(true);

        let formRegex = new RegExp('steps-(\\d+)-', 'g');
        newForm.innerHTML = newForm.innerHTML.replace(formRegex, `steps-${formNum}-`);

        const label = newForm.querySelector('label');
        if (label) {
            label.setAttribute('for', `id_steps-${formNum}-step_des`);
            label.textContent = `Шаг ${formNum + 1}:`;
        }

        const newImage = newForm.querySelector('#preview1');
        const newInput = newForm.querySelector('.step-image');

        newImage.src = '/static/pictures/nophoto.svg';
        newInput.value = '';
        newForm.querySelector('textarea').value = '';

        const stepImageInput = newForm.querySelector('input[name="step_image"]');
        const stepDesTextarea = newForm.querySelector('textarea[name="step_des"]');
        
        if (stepImageInput) {
            stepImageInput.name = `steps-${formNum}-step_image`;
            stepImageInput.id = `id_steps-${formNum}-step_image`;
        }

        if (stepDesTextarea) {
            stepDesTextarea.name = `steps-${formNum}-step_des`;
            stepDesTextarea.id = `id_steps-${formNum}-step_des`;
        }

        newInput.addEventListener('change', function() {
            const file = newInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    newImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        formsetContainer.appendChild(newForm);
        formNum++;
        totalForms.value = formNum;

        toggleDeleteStepButton();
        increaseContainerMaxHeight();
    });

    deleteStepBtn.addEventListener('click', function(e) {
        let stepForms = formsetContainer.querySelectorAll('.step-form');

        if (stepForms.length > 1) {
            let lastStepForm = stepForms[stepForms.length - 1];
            formsetContainer.removeChild(lastStepForm);

            formNum--;
            totalForms.value = formNum;

            toggleDeleteStepButton();
            decreaseContainerMaxHeight();
        }
    });

    function toggleDeleteStepButton() {
        if (formNum > 1) {
            deleteStepBtn.style.display = 'block';
        } else {
            deleteStepBtn.style.display = 'none';
        }
    }

    function increaseContainerMaxHeight() {
        let stepsContainer = document.getElementById('steps_height');
        let currentMaxHeight = parseInt(window.getComputedStyle(stepsContainer).maxHeight);
        if (isNaN(currentMaxHeight)) {
            currentMaxHeight = 0;
        }
        stepsContainer.style.maxHeight = `${currentMaxHeight + 800}px`;
    }

    function decreaseContainerMaxHeight() {
        let stepsContainer = document.getElementById('steps_height');
        let currentMaxHeight = parseInt(window.getComputedStyle(stepsContainer).maxHeight);
        if (!isNaN(currentMaxHeight)) {
            stepsContainer.style.maxHeight = `${currentMaxHeight - 800}px`;
        }
    }

    function setInitialContainerHeight() {
        let stepsContainer = document.getElementById('steps_height');
        let stepForms = formsetContainer.querySelectorAll('.step-form');
        let currentMaxHeight = parseInt(window.getComputedStyle(stepsContainer).maxHeight);
        let stepCount = stepForms.length;
        stepsContainer.style.maxHeight = `${currentMaxHeight + (800 * stepCount)}px`;
    }
});