document.addEventListener("DOMContentLoaded", function () {
    const mainIframe = document.getElementById('mainIframe');
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const fullContainer = document.getElementById('fullScreenContainer');
    const closeBtn = document.getElementById('closeBtn');
    const fullScreenIframe = document.getElementById('fullScreenIframe');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const srcUrl = "https://service.tib.eu/webvowl/#iri=https://raw.githubusercontent.com/tibonto/dr/master/DigitalReference.ttl";

    setTimeout(() => {
        if (mainIframe && !mainIframe.src) {
            mainIframe.src = srcUrl;
        }
    }, 2000);

    fullScreenBtn.addEventListener('click', () => {
        fullContainer.style.display = "block";
        
        // Only load iframe if not already loaded
        if (!fullScreenIframe.src) {
            loadingIndicator.style.display = "block";
            fullScreenIframe.src = srcUrl;
        }
    });
    
    closeBtn.addEventListener('click', () => {
        fullContainer.style.display = "none";
    });
});