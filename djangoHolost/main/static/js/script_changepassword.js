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

// PASSWORD DISPLAY

async function loadSvg(filePath) {
    const response = await fetch(filePath);
    const svgText = await response.text();
    return svgText;
}

document.addEventListener('DOMContentLoaded', async function() {
    let svgShowEye = await loadSvg('/static/pictures/dark_theme/eye_dark.svg');
    let svgHideEye = await loadSvg('/static/pictures/dark_theme/hide_eye_dark.svg');
    const passwordFields = document.querySelectorAll('input[name="password"], input[name="password1"], input[name="password2"], input[name="new_password1"], input[name="new_password2"]');
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