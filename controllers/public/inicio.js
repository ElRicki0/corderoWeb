// ?constante para trabajar con la API
const TRABAJO_DUPLA_API = 'services/public/trabajo_dupla.php';

// Variables para guardar hora y ubicación de inicio y final de jornada
const HORA_INICIO = document.getElementById('horaInicio'),
    LATITUD = document.getElementById('latitud'),
    LONGITUD = document.getElementById('longitud'),
    HORA_FINAL = document.getElementById('horaFinal');

// constantes para la inserción de botones para empleado
const BUTTONS_OPTIONS = document.getElementById('buttonsOptions');

// Variables para identificar el registro del empleado
const SAVE_FORM = document.getElementById('saveForm'),
    ID_INFORMACION = document.getElementById('idInformacion');

// variables para mostrar la información del empleado
const INFO_EMPLOYEE = document.getElementById('infoEmployee'),
    USUARIO_DUPLA = document.getElementById('usuarioDupla'),
    NOMBRE_EMPLEADO1 = document.getElementById('nombreEmpleado1'),
    NOMBRE_EMPLEADO2 = document.getElementById('nombreEmpleado2'),
    // CORREO_EMPLEADO = document.getElementById('correoEmpleado'),
    TELEFONO_EMPLEADO1 = document.getElementById('telefonoEmpleado1'),
    TELEFONO_EMPLEADO2 = document.getElementById('telefonoEmpleado2');

// Método que se ejecuta al cargar la página web
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Inicio empleados';
    fillOptions();
    fillInformation();
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
                LONGITUD.value = lon;
                LATITUD.value = lat
            },
            (error) => {
                console.error("Error al obtener la ubicación:", error.message);
            }
        );
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }
}

const startWork = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea iniciar la jornada?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('idInformacion', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(TRABAJO_DUPLA_API, 'startWork', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // ? recarga el estado del empleado
            fillOptions();
            // * método para habilitar y deshabilitar botones 
            // // Lógica para alternar los botones
            // const startButton = document.querySelector('button.btn-primary'); // Botón "Inicio jornada"
            // const endButton = document.querySelector('button.btn-warning');  // Botón "Fin de jornada"

            // if (startButton && endButton) {
            //     // Alternar clases
            //     startButton.classList.remove('btn-primary');
            //     startButton.classList.add('btn-warning');
            //     startButton.disabled = true; // Deshabilitar el botón clickeado

            //     endButton.classList.remove('btn-warning');
            //     endButton.classList.add('btn-primary');
            //     endButton.disabled = false; // Habilitar el otro botón
            // }

            // Se carga nuevamente la tabla para visualizar los cambios.
            // fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
};

const endWork = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea terminar la jornada?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData(SAVE_FORM);
        FORM.append('idInformacion', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(TRABAJO_DUPLA_API, 'endWork', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // ? recarga el estado del empleado
            fillOptions();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const fillOptions = async () => {
    BUTTONS_OPTIONS.innerHTML = '';
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readInformation');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            const jornadaIniciada = parseInt(row.estado_trabajo_dupla);
            // Se establece un icono para el estado del producto.
            const estado = jornadaIniciada ? 'text-info">Jornada iniciada' : 'text-warning">Jornada no iniciada';

            // Deshabilitar iniciar jornada si ya está iniciada, y terminar jornada si no está iniciada
            const disabledIniciar = jornadaIniciada ? 'disabled' : '';
            const disabledTerminar = !jornadaIniciada ? 'disabled' : '';

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            BUTTONS_OPTIONS.innerHTML += `
                <div class="col-12 mb-4">
                    <div class="bg-secondary d-inline-block p-3 rounded">
                        <h4>Estado de trabajo</h4>
                        <h4 class="${estado}</h4>
                    </div>
                </div>
                <div class="col-12">
                    <button type="button" class="btn btn-primary" ${disabledIniciar}
                        onclick="startWork(${row.id_trabajo_dupla})"><h2>Iniciar jornada</h2></button>
                    <button type="button" class="btn btn-warning" ${disabledTerminar}
                        onclick="endWork(${row.id_trabajo_dupla})"><h2>Terminar jornada</h2></button>
                </div>           
            `;
        });
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        ID_INFORMACION.value = ROW.id_trabajo_empleado;
    } else {
        sweetAlert(2, DATA.error, null);
        const DATA2 = await fetchData(TRABAJO_DUPLA_API, 'createRow');
        if (DATA2.status) {
            sweetAlert(1, DATA2.message, true);
            // ? recarga el estado del empleado
            fillOptions();       
        } else {
            sweetAlert(2, DATA2.error, false);
        }
    }
}

const fillInformation = async () => {

    // petición para obtener los datos del empleado
    const DATA = await fetchData(USER_API, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        USUARIO_DUPLA.textContent= ROW.usuario_dupla;
        NOMBRE_EMPLEADO1.textContent = 'EMPLEADO 1: ' + ROW.nombre_empleado1 + ' ' + ROW.apellido_empleado1;
        NOMBRE_EMPLEADO2.textContent = 'EMPLEADO 2: ' + ROW.nombre_empleado2 + ' ' + ROW.apellido_empleado2;
        // CORREO_EMPLEADO.textContent = ROW.correo_empleado;
        TELEFONO_EMPLEADO1.textContent = 'EMPLEADO 1: ' + ROW.telefono_personal_empleado1;
        TELEFONO_EMPLEADO2.textContent = 'EMPLEADO 2: ' + ROW.telefono_personal_empleado2;
    } else {
        sweetAlert(4, DATA.error, true);
        INFO_EMPLOYEE.innerHTML = '';
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

const verificationAcount = async () => {
    const DATA = await fetchData(USER_API,);
}