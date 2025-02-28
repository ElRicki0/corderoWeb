// ?constante para trabajar con la api
const EMPLEADO_API = 'services/admin/empleado.php';
const DUPLA_API = 'services/admin/duplas.php';
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? contenido de formulario dupla para ocultar y agregar a los empleados
const CONTENIDO_EMPLEADO1 = document.getElementById('infoEmpleado1'),
    CONTENIDO_EMPLEADO2 = document.getElementById('infoEmpleado2');

// ? Constantes del registro de duplas
const SAVE_FORM = document.getElementById('saveForm'),
    ID_DUPLA = document.getElementById('idDupla'),
    telefono_DUPLA = document.getElementById('telefonoDupla'),
    NOMBRE_DUPLA = document.getElementById('nombreDupla'),
    ID_EMPLEADO_1 = document.getElementById('idEmpleado1'),
    DUPLA_EMPLEADO_1 = document.getElementById('duplaEmpleado1'),
    ID_EMPLEADO_2 = document.getElementById('idEmpleado2'),
    DUPLA_EMPLEADO_2 = document.getElementById('duplaEmpleado2');


// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('duplas'),
    ROWS_FOUND = document.getElementById('rowsFound');

// ? Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    MAIN_TITLE.textContent = 'Administración duplas';
    fillTable();
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_DUPLA.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DUPLA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

const openCreate = async () => {
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear dupla para empleados';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado1');
    fillSelect(EMPLEADO_API, 'readAll', 'duplaEmpleado2');
    CONTENIDO_EMPLEADO1.innerHTML = '';
    CONTENIDO_EMPLEADO2.innerHTML = '';
}

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null, buscador) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(DUPLA_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            (row.estado_empleado1) ? icon1 = 'bi bi-pause-circle-fill' : icon1 = 'bi bi-check-circle-fill';
            (row.estado_empleado2) ? icon2 = 'bi bi-pause-circle-fill' : icon2 = 'bi bi-check-circle-fill';

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="col-12 card mt-2 text-bg-dark" id="searchForm">
    <div class="row justify-content-center align-items-center gx-0">
        <!-- Contenedor de empleados -->
        <div class="col-md-12 col-lg-9 d-flex flex-wrap justify-content-between text-center gap-4">
            <div class="container">
                <h1>Nombre Dupla: ${row.nombre_dupla}</h1>
                <h3>Teléfono Dupla: ${row.telefono_empresa_dupla}</h3>
            </div>

            <div class="row w-100 mb-3">
                <!-- Empleado 1 -->
                <div class="col-lg-6 col-md-12 col-sm-12 text-center">
                    <div class="d-flex justify-content-center mt-3">
                        <img src="${SERVER_URL}images/empleados/${row.imagen_empleado1}" class="card-img-top"
                            alt="Imagen de empleado"
                            onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
                            style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;">
                    </div>
                    <h5 class="text-white mt-2">Nombre empleado</h5>
                    <p class="card-title text-white">${row.nombre_empleado1}</p>
                    <p class="card-title text-white">${row.apellido_empleado1}</p>
                    <h5 class="text-white">Correo Empleado</h5>
                    <p class="card-text text-white">${row.correo_empleado1}</p>
                    <h5 class="text-white">Estado empleado</h5>
                    <p class="card-text text-white">Estado: <i class="${icon1} text-white"></i></p>
                </div>

                <!-- Empleado 2 -->
                <div class="col-lg-6 col-md-12 col-sm-12 text-center">
                    <div class="d-flex justify-content-center mt-3">                        
                    <img src="${SERVER_URL}images/empleados/${row.imagen_empleado2}" class="card-img-top"
                            alt="Imagen de empleado"
                            onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
                            style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;">
                    </div>
                    <h5 class="text-white mt-2">Nombre empleado</h5>
                    <p class="card-title text-white">${row.nombre_empleado2}</p>
                    <p class="card-title text-white">${row.apellido_empleado2}</p>
                    <h5 class="text-white">Correo Empleado</h5>
                    <p class="card-text text-white">${row.correo_empleado2}</p>
                    <h5 class="text-white">Estado empleado</h5>
                    <p class="card-text text-white">Estado: <i class="${icon2} text-white"></i></p>
                </div>
            </div>
        </div>

        <!-- Botones de acción alineados verticalmente -->
        <div class="col-sm-12 col-md-12 col-lg-3 d-flex flex-column justify-content-center align-items-center">
            <button class="btn btn-outline-light mb-2 w-75" onclick="openDelete(${row.id_dupla})">
                <i class="bi bi-trash3-fill"></i> Eliminar
            </button>
            <button class="btn btn-outline-light mb-2 w-75" onclick="openUpdate(${row.id_dupla})">
                <i class="bi bi-pencil-fill"></i> Actualizar
            </button>
            <button class="btn btn-outline-light mb-2 w-75" onclick="openState(${row.id_dupla})">
                <i class="bi bi-exclamation-octagon"></i> Cambiar Estado
            </button>
            <button type="button" class="btn btn-outline-light mb-2 w-75" onclick="openChart(${row.id_dupla})">
                <i class="bi bi-bar-chart-line-fill"></i> Ver Gráfico
            </button>
        </div>
    </div>
</div>

`;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
        TABLE_BODY.innerHTML += `
        <div class="col-5 justify-content-center align-items-center">
                <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
            </div>
        `
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la dupla de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDupla', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DUPLA_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDupla', id);
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
        ID_CABLE.value = ROW.id_cable;
        NOMBRE_CABLE.value = ROW.nombre_cable;
        DESCRIPCION_CABLE.value = ROW.descripcion_cable;
        LONGITUD_CABLE.value = ROW.longitud_cable;
        LONGITUD_MINIMA_CABLE.value = ROW.longitud_minima_cable;
        ESTADO_CABLE.value = ROW.estado_cable;
        fillSelect(CATEGORIA_CABLE_API, 'readAll', 'categoriaCable', parseInt(ROW.id_categoria_cable));
    } else {
        sweetAlert(2, DATA.error, false);
    }
}