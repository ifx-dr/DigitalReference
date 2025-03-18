document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.map-container .idc');
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    const fullContainer = document.getElementById('fullScreenContainer');
    const closeBtn = document.getElementById('closeBtn');

    fullScreenBtn.addEventListener('click', () => {
        fullContainer.style.display = "block";
    });
    closeBtn.addEventListener('click', () => {
        fullContainer.style.display = "none";
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', function () {
            const mapId = this.dataset.mapId;
            const mapArea = document.getElementById(mapId);
            if (mapArea) {
                mapArea.classList.add('highlight');
            }
        });

        link.addEventListener('mouseleave', function () {
            const mapId = this.dataset.mapId;
            const mapArea = document.getElementById(mapId);
            if (mapArea) {
                mapArea.classList.remove('highlight');
            }
        });
    });
});