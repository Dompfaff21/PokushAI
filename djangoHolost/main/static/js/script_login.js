// LOGIN

const container = document.getElementById('container');
const registerBtn = document.getElementById('reg_btn');
const loginBtn = document.getElementById('log_btn');
const regBTN = document.getElementById('registerBtn');
const logBTN = document.getElementById('loginBtn');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

regBTN.addEventListener('click', () => {
    localStorage.setItem('containerState', 'active');
});

logBTN.addEventListener('click', () => {
    localStorage.setItem('containerState', '');
});

window.addEventListener('load', () => {
    const state = localStorage.getItem('containerState');
    if (state === 'active') {
        container.classList.add("active");
    } else {
        container.classList.remove("active");
    }
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

// PASSWORD DISPLAY

document.addEventListener('DOMContentLoaded', function() {
    const svgHideEye = `<svg xmlns="http://www.w3.org/2000/svg" width="300pt" height="300pt" version="1.0" viewBox="0 0 512 512">
      <path d="m426 65-30 28-27 27-13-5a277 277 0 0 0-140-16c-51 8-96 28-138 62a344 344 0 0 0-78 92c-1 6 1 10 9 22 24 36 58 71 93 94l11 7-24 24c-20 21-24 25-25 28-1 6 1 11 5 15s9 6 15 5c3-1 22-20 183-180C399 136 446 88 447 85c2-7 0-14-6-18-3-3-11-4-15-2zm-136 66c17 2 36 7 51 13l3 1-16 16-16 17-3-2c-5-4-22-11-29-13-11-3-35-3-45-1-19 5-33 13-47 26a96 96 0 0 0-26 47c-2 10-2 33 1 44 2 8 9 23 13 30l2 3-20 20-21 20-9-6c-33-21-67-52-88-83l-5-7 5-7c18-26 48-57 75-75a253 253 0 0 1 175-43zm-20 63 18 7-43 44-44 43-3-5c-3-7-6-19-6-27 0-41 39-72 78-62zm144-28-11 11 9 8c20 16 47 45 62 66l3 5-4 6c-17 25-47 56-73 75a244 244 0 0 1-189 42l-9-1-13 13-12 13a289 289 0 0 0 116 10 324 324 0 0 0 209-138c13-19 13-21 1-39a351 351 0 0 0-77-82l-12 11z"/>
      <path d="m334 246-14 14-1 8a66 66 0 0 1-51 51l-8 1-14 14-14 14c1 2 17 4 24 4 25 0 49-10 68-28 19-20 27-40 27-67 0-12-1-25-3-25l-14 14z"/>
    </svg>`;
    
    const svgShowEye = `<svg xmlns="http://www.w3.org/2000/svg" width="300pt" height="300pt" version="1.0" viewBox="0 0 512 512">
      <path d="M240.4 104c-84.6 4.9-164.4 50.2-228 129.4-16.6 20.7-16.6 24.4.1 45.3C76 358 156.1 403.2 241.1 407.9c96.1 5.2 187-40.2 258.5-129.3 16.6-20.7 16.6-24.4-.1-45.3-46.4-57.9-101.6-97.7-162.6-117.2-19-6.1-41.9-10.5-59.9-11.6-19.6-1.1-23.8-1.2-36.6-.5zm36.8 46.6c28.7 5.4 56.3 25 71.3 50.5 18 30.8 19.9 68 5.1 99.5-5.8 12.3-11.4 20.3-20.9 30.1-53.5 55.1-144.6 38.3-175.6-32.4-11.2-25.5-11.4-56.7-.5-83.3 10.5-25.9 33.4-48.5 59.5-58.8 19.8-7.8 39.6-9.6 61.1-5.6z"/>
      <path d="M245.5 199c-16.3 3.5-30.7 13.6-38.9 27.4-6.1 10.1-8.1 17.6-8 29.6 0 11.6 1.1 16.3 5.7 26 4.3 8.9 16.7 21.3 25.8 25.7 32.1 15.5 69.4-.3 81-34.2 3.3-9.7 3.4-24.9.2-35-7.3-23.1-28.5-39.2-52.8-40.1-4.9-.2-10.8.1-13 .6z"/>
    </svg>`;
    
    function encodeSvgToDataUrl(svg) {
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")}`;
    }
    encodeSvgToDataUrl(svgHideEye);
    encodeSvgToDataUrl(svgShowEye);

    const passwordFields = document.querySelectorAll('input[name="password"], input[name="password1"], input[name="password2"]');
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