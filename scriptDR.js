document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.map-container .idc');

    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const mapId = this.dataset.mapId;
            const mapArea = document.getElementById(mapId);
            if (mapArea) {
                mapArea.classList.add('highlight');
            }
        });

        link.addEventListener('mouseleave', function() {
            const mapId = this.dataset.mapId;
            const mapArea = document.getElementById(mapId);
            if (mapArea) {
                mapArea.classList.remove('highlight');
            }
        });
    });
});