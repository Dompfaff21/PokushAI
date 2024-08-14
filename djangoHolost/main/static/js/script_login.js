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


document.addEventListener('DOMContentLoaded', function () {
    var closeButton = document.querySelector('.messages-popup .close-button');
    var messagesPopup = document.querySelector('.messages-popup');

    if (closeButton) {
        closeButton.addEventListener('click', function () {
            messagesPopup.style.display = 'none';
        });
    }
});

