function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
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

// // function ejemplo() {
//     if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const lat = position.coords.latitude;
//                 const lon = position.coords.longitude;
//                 const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

//                 console.log("Ubicación para Google Maps:");
//                 console.log(mapsUrl);
//             },
//             (error) => {
//                 console.error("Error al obtener la ubicación:", error.message);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0,
//             }
//         );
//     } else {
//         console.log("La geolocalización no es compatible con este navegador.");
//     }
// }

// // Llamar a la función
// ejemplo();
