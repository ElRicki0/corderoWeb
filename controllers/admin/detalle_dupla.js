const DUPLA_API = 'services/admin/duplas.php';
const EMPLEADO_API = 'services/admin/empleado.php';

// ? constantes para actualizar las claves de las duplas 
const PASSWORD_MODAL = new bootstrap.Modal('#passwordModal'),
    PASSWORD_TITLE = document.getElementById('passwordTitle'),
    ID_CLAVE_DUPLA = document.getElementById('idClaveDupla'),
    PASSWORD_FORM = document.getElementById('passwordForm');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? contenido de formulario dupla para ocultar y agregar a los empleados
const CONTENIDO_EMPLEADO1 = document.getElementById('infoEmpleado1'),
    CONTENIDO_EMPLEADO2 = document.getElementById('infoEmpleado2');

// ? Constantes del registro de duplas
const SAVE_FORM = document.getElementById('saveForm'),
    ID_DUPLA = document.getElementById('idDupla'),
    TELEFONO_DUPLA = document.getElementById('telefonoEmpresaDupla'),
    TIPO_DUPLA = document.getElementById('tipoDupla'),
    USUARIO_DUPLA = document.getElementById('usuarioNombreDupla'),
    DUPLA_EMPLEADO_1 = document.getElementById('duplaEmpleado1'),
    DUPLA_EMPLEADO_2 = document.getElementById('duplaEmpleado2');

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);

// Método del eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'Detalles de la dupla';
    fillInformation();
})

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, 'updateRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillInformation();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// * función para mostrar la información genal de la dupla 

const fillInformation = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));

    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se establece un icono para el estado del producto.
        (parseInt(DATA.estado_dupla)) ? icon = 'text-success' : icon = 'text-danger';
        // Determinar el mensaje y las coordenadas según el estado
        let info, latitud, longitud;

        if (parseInt(DATA.estado_dupla) === 1) {
            info = 'Jornada iniciada';
            latitud = DATA.dataset.latitud_inicio;
            longitud = DATA.dataset.longitud_inicio;
        } else {
            info = 'Jornada no iniciada';
            latitud = DATA.dataset.latitud_final || DATA.dataset.latitud_inicio; // Usa final si existe, sino inicio
            longitud = DATA.dataset.longitud_final || DATA.dataset.longitud_inicio; // Usa final si existe, sino inicio
        }

        // Actualizar el iframe de Google Maps
        document.getElementById('ubicacionDupla').innerHTML = `
        <iframe width="350" height="350" style="border:0;" loading="lazy" allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=${latitud},${longitud}&hl=es&z=15&output=embed">
        </iframe>
        `
        // Obtener el elemento donde se mostrará el estado
        const ESTADO_DUPLA = document.getElementById('estadoDupla');

        // Limpiar clases previas
        ESTADO_DUPLA.classList.remove('text-success', 'text-danger');

        // Determinar el mensaje y las clases según el estado
        if (parseInt(DATA.dataset.estado_dupla) === 1) {
            ESTADO_DUPLA.textContent = 'Jornada iniciada';
            ESTADO_DUPLA.classList.add('text-success'); // Mensaje en verde
        } else {
            ESTADO_DUPLA.textContent = 'Jornada no iniciada';
            ESTADO_DUPLA.classList.add('text-danger'); // Mensaje en rojo
        }

        // Actualizar otros datos de la dupla
        document.getElementById('usuarioDupla').textContent = DATA.dataset.usuario_dupla;
        document.getElementById('telefonoDupla').textContent = DATA.dataset.telefono_empresa_dupla;
        (DATA.dataset.tipo_dupla) ? type = 'Permanente' : type = 'Temporal';
        document.getElementById('tipoDupla').textContent = type;

        // Actualizar datos de los empleados
        document.getElementById('empleadoImagen1').src = SERVER_URL.concat('images/empleados/', DATA.dataset.imagen_empleado1);
        document.getElementById('nombreEmpleado1').textContent = DATA.dataset.nombre_empleado1 + ' ' + DATA.dataset.apellido_empleado1;
        document.getElementById('telefonoEmpleado1').textContent = DATA.dataset.telefono_personal_empleado1;

        document.getElementById('empleadoImagen2').src = SERVER_URL.concat('images/empleados/', DATA.dataset.imagen_empleado2);
        document.getElementById('nombreEmpleado2').textContent = DATA.dataset.nombre_empleado2 + ' ' + DATA.dataset.apellido_empleado2;
        document.getElementById('telefonoEmpleado2').textContent = DATA.dataset.telefono_personal_empleado2;

        // `https://www.google.com/maps?q=${latitud},${longitud}&hl=es&z=15&output=embed`;
    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
        document.getElementById('informacionDupla').innerHTML = `
        <div class="col-5 justify-content-center align-items-center">
        <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>`;
    }
}

/*
*   Función para preparar el formulario al momento de cambiar la constraseña.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openPassword = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        PASSWORD_MODAL.show();
        // ? preparar el modal para actualizar datos
        PASSWORD_FORM.reset();
        PASSWORD_TITLE.textContent = 'Cambiar clave duplas';
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CLAVE_DUPLA.value = ROW.id_dupla;
    }
}

// Método del evento para cuando se envía el formulario de guardar.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PASSWORD_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, 'updatePassword', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        PASSWORD_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
})

const openUpdate = async () => {
    // Constante tipo objeto con los datos de la dupla seleccionada.
    const FORM = new FormData();
    FORM.append('idDupla', PARAMS.get('id'));
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DUPLA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar información';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;

        ID_DUPLA.value = ROW.id_dupla;
        USUARIO_DUPLA.value = ROW.usuario_dupla;
        TELEFONO_DUPLA.value = ROW.telefono_empresa_dupla;

        // ? Se llena el formulario con información relacionada a los empleados
        CONTENIDO_EMPLEADO1.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado1}" width="200px"
        height="200px" class="rounded mx-auto d-block" 
        onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado1" name="idEmpleado1"> -->
        <h5 class="text-white mt-2">Nombre empleado</h5>
        <p class="card-title text-white">${ROW.nombre_empleado1}</p>
        <p class="card-title text-white">${ROW.apellido_empleado1}</p>
        `;
        CONTENIDO_EMPLEADO2.innerHTML = `
        <img src="${SERVER_URL}images/empleados/${ROW.imagen_empleado2}" width="200px"
        height="200px" class="rounded mx-auto d-block" onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
        style="max-width: 100%; max-height: 100%; object-fit: contain;">
        <!-- <input type="number" class="d-none" id="idEmpleado2" name="idEmpleado2"> -->
        <h5 class="text-white mt-2">Nombre empleado</h5>
        <p class="card-title text-white">${ROW.nombre_empleado2}</p>
        <p class="card-title text-white">${ROW.apellido_empleado2}</p>
        `;

        fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado1', parseInt(ROW.id_empleado1));
        fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado2', parseInt(ROW.id_empleado2));
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const mostrarUbicacion = () => {
}

/*
* Función asíncrona para preparar un modal de confirmacion para una funcion de estado
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openState = async () => {

    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cambiar el tipo de dupla?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Constante tipo objeto con los datos de la dupla seleccionada.
        const FORM = new FormData();
        FORM.append('idDupla', PARAMS.get('id'));

        // Petición para cambiar el estado del cliente
        const DATA = await fetchData(DUPLA_API, 'updateStatus', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            sweetAlert(1, DATA.message, true); // Mensaje de éxito
            fillInformation(); // Recargar la tabla para visualizar los cambios
        } else {
            sweetAlert(1, 'Tipo cambiado con éxito', false); // Mensaje de error
            fillInformation(); // Recargar la tabla para visualizar los cambios
        }
    }
}