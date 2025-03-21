// ?constante para trabajar con la API
const INFO_TRABAJO_API = 'services/admin/info_trabajo.php';

// Variables para guardar hora y ubicación de inicio y final de jornada
const HORA_INICIO = document.getElementById('horaInicio'),
    LATITUD_INICIO = document.getElementById('latitudInicio'),
    LONGITUD_INICIO = document.getElementById('longitudInicio'),
    HORA_FINAL = document.getElementById('horaFinal');

// constantes para la inserción de botones para empleado
const BUTTONS_OPTIONS = document.getElementById('buttonsOptions');

// Variables para identificar el registro del empleado
const SAVE_FORM = document.getElementById('saveForm'),
    ID_INFORMACION = document.getElementById('idInformacion');

// Método que se ejecuta al cargar la página web
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Inicio empleados';
    fillOptions();
    // Actualizar la hora inmediatamente al cargar la página
    actualizarHora();
    // Actualizar la hora cada segundo (1000 milisegundos)
    setInterval(actualizarHora, 1000);
});

// Función para actualizar la hora
function actualizarHora() {
    // Obtener la hora actual
    const horaActual = new Date().toLocaleTimeString();
    // método para obtener la ubicación del usuario
    getLocation()
    // Asignar la hora actual a los elementos HTML
    HORA_INICIO.value = horaActual;
    HORA_FINAL.value = horaActual;

    // Mostrar el valor en la consola
    console.log(HORA_INICIO.value + ' - ' + HORA_FINAL.value + ' = hora actual');
}

function getLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                // var mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                console.log(lat + ' - ' + lon + ' = ubicación actual');
                LONGITUD_INICIO.value = lon;
                LATITUD_INICIO.value = lat
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error.message);
            }
        );
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }
}

// // Método del evento para cuando se envía el formulario de guardar.
// SAVE_FORM.addEventListener('submit', async (event) => {
//     // Se evita recargar la página web después de enviar el formulario.
//     event.preventDefault();
//     // Se define un objeto con los datos del registro seleccionado.
//     const FORM = new FormData();
//     // Petición para iniciar la jornada del registro seleccionado.
//     const DATA = await fetchData(INFO_TRABAJO_API, 'startWork', FORM);
//     // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
//     if (DATA.status) {
//         // Se muestra un mensaje de éxito.
//         sweetAlert(1, DATA.message, true);
//         // Se carga nuevamente la tabla para visualizar los cambios.
//     } else {
//         sweetAlert(2, DATA.error, false);
//     }
// });

const startWork = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el Empleado de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('idInformacion', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(INFO_TRABAJO_API, 'startWork', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);

            // Lógica para alternar los botones
            const startButton = document.querySelector('button.btn-primary'); // Botón "Inicio jornada"
            const endButton = document.querySelector('button.btn-warning');  // Botón "Fin de jornada"

            if (startButton && endButton) {
                // Alternar clases
                startButton.classList.remove('btn-primary');
                startButton.classList.add('btn-warning');
                startButton.disabled = true; // Deshabilitar el botón clickeado

                endButton.classList.remove('btn-warning');
                endButton.classList.add('btn-primary');
                endButton.disabled = false; // Habilitar el otro botón
            }

            // Se carga nuevamente la tabla para visualizar los cambios.
            // fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
};

const fillOptions = async () => {
    BUTTONS_OPTIONS.innerHTML = '';
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(INFO_TRABAJO_API, 'readInformation');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            BUTTONS_OPTIONS.innerHTML += `
                <button type="button" class="btn btn-primary" onclick="startWork(${row.id_trabajo_empleado})">Inicio jornada</button>
                <button type="button" class="btn btn-warning" onclick="startWork(${row.id_trabajo_empleado})">Inicio Fin de jornada</button>            
            `;
        });
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        ID_INFORMACION.value = ROW.id_trabajo_empleado;
    } else {
        sweetAlert(2, DATA.error, null);
    }
}

const openLocation = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                console.log(lat + ' - ' + lon + ' = ubicación actual');
                window.open(mapsUrl, "_blank");
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error.message);
            }
        );
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }
    // Abrir Google Maps en una nueva ventana
}