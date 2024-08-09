// LOGIN

const container = document.getElementById('container');
const registerBtn = document.getElementById('reg_btn');
const loginBtn = document.getElementById('log_btn');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', function() {
        var closeAlert = document.getElementById('login_error');
                setTimeout(function() {
                    closeAlert.style.display = 'none';
                }, 3000)
    });