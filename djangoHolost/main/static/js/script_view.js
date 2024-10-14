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