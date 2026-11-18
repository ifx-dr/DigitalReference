document.addEventListener("DOMContentLoaded", function () {
    const mainIframe = document.getElementById('mainIframe');
    const frameWrapper = mainIframe.parentElement;
    const frameSection = frameWrapper.parentElement;
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const closeBtn = document.getElementById('closeBtn');
    const srcUrl = "https://service.tib.eu/webvowl/#iri=https://raw.githubusercontent.com/tibonto/dr/master/DigitalReference.ttl";

    function loadVisualization() {
        if (!mainIframe.src) {
            mainIframe.src = srcUrl;
        }
    }

    setTimeout(loadVisualization, 2000);

    // The existing iframe is enlarged instead of loading a second WebVOWL, so the graph keeps its state.
    // Where element full screen is not available (e.g. iPhone), the .is-fullscreen overlay is used alone.
    function openFullScreen() {
        loadVisualization();
        // Keeps the page height while the frame is out of the page flow, otherwise the scroll position jumps
        frameSection.style.minHeight = frameSection.offsetHeight + 'px';
        frameWrapper.classList.add('is-fullscreen');
        document.documentElement.classList.add('webvowl-fullscreen-open');
        if (document.fullscreenEnabled) {
            frameWrapper.requestFullscreen().catch(() => {});
        }
        closeBtn.focus({ preventScroll: true });
    }

    function closeFullScreen() {
        if (document.fullscreenElement) {
            // The resulting fullscreenchange event closes the overlay
            document.exitFullscreen().catch(() => {});
            return;
        }
        frameWrapper.classList.remove('is-fullscreen');
        frameSection.style.minHeight = '';
        document.documentElement.classList.remove('webvowl-fullscreen-open');
        fullScreenBtn.focus({ preventScroll: true });
    }

    fullScreenBtn.addEventListener('click', openFullScreen);
    closeBtn.addEventListener('click', closeFullScreen);

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && frameWrapper.classList.contains('is-fullscreen')) {
            closeFullScreen();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && frameWrapper.classList.contains('is-fullscreen')) {
            closeFullScreen();
        }
    });
});