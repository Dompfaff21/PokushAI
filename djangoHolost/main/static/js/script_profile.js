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
    const container1 = document.querySelector('.container1');

    function setActiveTab(item) {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        contentBoxes.forEach(box => box.style.display = 'none');
        const target = item.getAttribute('data-target');
        const targetElement = document.getElementById(target);
        targetElement.style.display = 'block';

        if (target === 'posts-info') {
            container1.style.background = 'none';
            container1.style.border = 'none';
        } else {
            container1.style.background = '';
            container1.style.border = '';
        }

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