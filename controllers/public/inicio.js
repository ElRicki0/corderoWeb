// método que se ejecuta al cargar la pagina web
document.addEventListener('DOMContentLoaded', async () => {
loadTemplate();
MAIN_TITLE.textContent = 'Inicio empleados';
});

    

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                // Abrir Google Maps en una nueva ventana
                window.open(mapsUrl, "_blank");
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error.message);
            }
        );
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }
}