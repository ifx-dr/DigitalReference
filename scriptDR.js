document.addEventListener("DOMContentLoaded", function () {
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const fullContainer = document.getElementById('fullScreenContainer');
    const closeBtn = document.getElementById('closeBtn');
    const fullScreenIframe = document.getElementById('fullScreenIframe');
    const loadingIndicator = document.getElementById('loadingIndicator');

    fullScreenBtn.addEventListener('click', () => {
        fullContainer.style.display = "block";
        
        // Only load iframe if not already loaded
        if (!fullScreenIframe.src) {
            loadingIndicator.style.display = "block";
            fullScreenIframe.src = "https://ifx-dr.github.io/WebVOWL/#digitalreference";
        }
    });
    
    closeBtn.addEventListener('click', () => {
        fullContainer.style.display = "none";
    });
});