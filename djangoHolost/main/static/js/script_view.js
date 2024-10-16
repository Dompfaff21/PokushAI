function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + 5) + 'px';
  }
  
  window.addEventListener('load', () => {
    const textareas = document.querySelectorAll('textarea');
  
    textareas.forEach(textarea => {
      autoResizeTextarea(textarea);
  
      textarea.addEventListener('input', () => autoResizeTextarea(textarea));
    });
  });

 

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
    let stepForms = document.querySelectorAll('.step-form');
    let currentMaxHeight = parseInt(window.getComputedStyle(stepsContainer).maxHeight);
    let stepCount = stepForms.length;
    stepsContainer.style.maxHeight = `${currentMaxHeight + (800 * stepCount)}px`;
}

setInitialContainerHeight();
decreaseContainerMaxHeight();