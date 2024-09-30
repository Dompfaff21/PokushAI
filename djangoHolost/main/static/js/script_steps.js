document.addEventListener('DOMContentLoaded', function() {
    const formsetContainer = document.getElementById('formset-container');

    formsetContainer.addEventListener('click', function(event) {
        if (event.target.matches('#preview1')) {
            const inputFile = event.target.nextElementSibling;
            inputFile.click();
        }
    });

    formsetContainer.addEventListener('change', function(event) {
        if (event.target.matches('.step-image')) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                const previewImage = event.target.previousElementSibling;

                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    });
});


// STEPS

document.addEventListener('DOMContentLoaded', function() {
    let formsetContainer = document.getElementById('formset-container');
    let addStepBtn = document.getElementById('add-step-btn');
    let stepsContainer = document.getElementById('steps_height');

    let totalForms = document.querySelector('#id_steps-TOTAL_FORMS');
    let formNum = formsetContainer.querySelectorAll('.step-form').length;

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

        increaseContainerMaxHeight();
    });

    function increaseContainerMaxHeight() {
        let currentMaxHeight = parseInt(window.getComputedStyle(stepsContainer).maxHeight);
        if (isNaN(currentMaxHeight)) {
            currentMaxHeight = 0;
        }
        stepsContainer.style.maxHeight = `${currentMaxHeight + 400}px`;
    }
});