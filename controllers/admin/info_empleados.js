// ?constante para trabajar con la API
const INFO_TRABAJO_API = 'services/admin/info_trabajo.php';
const EMPLEADO_API = 'services/admin/empleado.php';

// ? Constantes del registro empleado
const SAVE_FORM = document.getElementById('saveForm'),
    ID_Trabajo = document.getElementById('idTrabajo'),
    DEPARTAMENTO_TRABAJO = document.getElementById('departamentoTrabajo'),
    MUNICIPIO_TRABAJO = document.getElementById('municipioTrabajo'),
    ESTADO_TRABAJO = document.getElementById('estadoTrabajo');


// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// ? Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('trabajos'),
    // BUSCADOR_DEPARTAMENTO = document.getElementById('buscadorDepartamento'),
    ROWS_FOUND = document.getElementById('rowsFound');

// ? Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    MAIN_TITLE.textContent = 'Información laboral empleados';
    fillTable();
});

function actualizarMunicipios() {
    let departamento = document.getElementById("departamentoTrabajo").value;

    // Limpiar opciones previas
    MUNICIPIO_TRABAJO.innerHTML = '<option value="">Seleccione un municipio</option>';

    // Definir los municipios por departamento
    let municipios = {
        "Ahuachapan": ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio"],
        "Cabañas": ["Sensuntepeque", "Victoria", "Guacotecti", "Dolores", "Cinquera"],
        "Chalatenango": ["Chalatenango", "La Palma", "San Ignacio", "Nueva Concepción", "Tejutla"],
        "La Libertad": ["Santa Tecla", "Antiguo Cuscatlán", "Colón", "San Juan Opico", "Quezaltepeque"],
        "La Paz": ["Zacatecoluca", "San Juan Nonualco", "San Pedro Masahuat", "San Rafael Obrajuelo"],
        "San Salvador": ["San Salvador", "Soyapango", "Mejicanos", "Apopa", "Ilopango"],
        "San Vicente": ["San Vicente", "Tecoluca", "Apastepeque", "San Ildefonso", "San Esteban Catarina"],
        "Santa Ana": ["Santa Ana", "Metapán", "Chalchuapa", "Coatepeque", "Candelaria de la Frontera"],
        "Sonsonate": ["Sonsonate", "Izalco", "Nahuizalco", "Juayúa", "Sonzacate"],
        "Usulután": ["Usulután", "Jiquilisco", "Santa María", "Puerto El Triunfo", "Jucuapa"],
        "Morazán": ["San Francisco Gotera", "Cacaopera", "Joateca", "Perquín", "Sociedad"],
        "La Unión": ["La Unión", "Conchagua", "El Carmen", "Santa Rosa de Lima", "Intipucá"],
        "San Miguel": ["San Miguel", "Chinameca", "Quelepa", "Moncagua", "Nuevo Edén de San Juan"],
        // "Tecapa": ["Tecapa 1", "Tecapa 2", "Tecapa 3"] // Agrega municipios si es un departamento válido
    };

    // Agregar opciones según el departamento seleccionado
    if (departamento && municipios[departamento]) {
        municipios[departamento].forEach(municipio => {
            let opcion = document.createElement("option");
            opcion.value = municipio;
            opcion.textContent = municipio;
            MUNICIPIO_TRABAJO.appendChild(opcion);
        });
    }
}

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_Trabajo.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(INFO_TRABAJO_API, action, FORM);
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

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(INFO_TRABAJO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.            
            (row.estado_empleado) ? icon = 'bi bi-pause-circle-fill' : icon = 'bi bi-check-circle-fill';

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="col-12 card mt-2 text-bg-dark" id="searchForm">
                    <div class="row justify-content-center align-items-center">
                        <div class="col-12 mt-3 d-flex justify-content-center align-items-center"
                            style="height: 300px; width: 300px;">
                            <img src="${SERVER_URL}images/empleados/${row.imagen_empleado}" class="rounded border border-primary" alt="..."
                                onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
                                style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>

                        <div class=" col-md-12 col-lg-3 card-body d-flex flex-column align-items-center text-center">
                            <div class="row">

                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <h5 class="text-white">Nombre empleado</h5>
                                    <p class="card-title text-white">${row.nombre_empleado} ${row.apellido_empleado}</p>
                                    <h5 class="text-white">Correo Empleado</h5>
                                    <p class="card-text text-white">${row.correo_empleado}</p>
                                    <h5 class="text-white">Estado empleado</h5>
                                    <p class="card-text text-white">Estado: <i class="${icon} text-white h1"></i></p>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <h5 class="text-white">Departamento Empleado</h5>
                                    <p class="card-text text-white">${row.departamento_trabajo_empleado}</p>
                                    <h5 class="text-white">Municipio Empleado</h5>
                                    <p class="card-text text-white">${row.municipio_trabajo_empleado}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12 col-md-12 col-lg-3 text-center my-5">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_trabajo_empleado})">
                                    <i class="bi bi-trash3-fill"></i> Eliminar
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_trabajo_empleado})">
                                    <i class="bi bi-pencil-fill"></i>Actualizar
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openState(${row.id_trabajo_empleado})">
                                    <i class="bi bi-exclamation-octagon"></i> Cambiar Estado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>          `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
                <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
            </div>
        `
        sweetAlert(4, DATA.error, true);
    }
}

const readAllTable = async (form = null, buscador) => {
    // ? Se inicia el contenido de la tabla 
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';

    switch (buscador) {
        case 1:
            action = 'readByName';
            break;
        case 2:
            action = 'readByNameDesc';
            break;
        case 3:
            action = 'readByModify';
            break;
        case 4:
            action = 'readByActive';
            break;
        case 5:
            action = 'readByInactive';
            break;
        default:
            sweetAlert(4, 'Acción no disponible', true);

            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(INFO_TRABAJO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            (row.estado_empleado) ? icon = 'bi bi-pause-circle-fill' : icon = 'bi bi-check-circle-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="col-12 card mt-2 text-bg-dark" id="searchForm">
                <div class="row justify-content-center align-items-center">
                    <div class="col-12 mt-3 d-flex justify-content-center align-items-center"
                        style="height: 300px; width: 300px;">
                        <img src="${SERVER_URL}images/empleados/${row.imagen_empleado}" class="rounded border border-primary" alt="..."
                            onerror="this.onerror=null; this.src='../../resources/images/error/404Empleado.png';"
                            style="max-width: 100%; max-height: 100%; object-fit: contain;">
                    </div>

                    <div class=" col-md-12 col-lg-3 card-body d-flex flex-column align-items-center text-center">
                        <div class="row">

                            <div class="col-lg-6 col-md-12 col-sm-12">
                                <h5 class="text-white">Nombre empleado</h5>
                                <p class="card-title text-white">${row.nombre_empleado} ${row.apellido_empleado}</p>
                                <h5 class="text-white">Correo Empleado</h5>
                                <p class="card-text text-white">${row.correo_empleado}</p>
                                <h5 class="text-white">Estado empleado</h5>
                                <p class="card-text text-white">Estado: <i class="${icon} text-white h1"></i></p>
                            </div>
                            <div class="col-lg-6 col-md-12 col-sm-12">
                                <h5 class="text-white">Departamento Empleado</h5>
                                <p class="card-text text-white">${row.departamento_trabajo_empleado}</p>
                                <h5 class="text-white">Municipio Empleado</h5>
                                <p class="card-text text-white">${row.municipio_trabajo_empleado}</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-12 col-lg-3 text-center my-5">
                        <div class="d-flex flex-column">
                            <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_trabajo_empleado})">
                                <i class="bi bi-trash3-fill"></i> Eliminar
                            </button>
                            <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_trabajo_empleado})">
                                <i class="bi bi-pencil-fill"></i>Actualizar
                            </button>
                            <button class="btn btn-outline-light mb-2" onclick="openState(${row.id_trabajo_empleado})">
                                <i class="bi bi-exclamation-octagon"></i> Cambiar Estado
                            </button>
                        </div>
                    </div>
                </div>
            </div>          `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        TABLE_BODY.innerHTML = `
            <div class="col-5    justify-content-center align-items-center">
                    <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
                </div>
            `
        sweetAlert(4, DATA.error, true);
    }
}

/*
* Función asíncrona para preparar un modal de confirmacion para una funcion de estado
* Parámetros: id (identificador del registro seleccionado).
* Retorno: ninguno.
*/
const openState = async (id) => {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cambiar el estado del empleado?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idTrabajo', id);

        // Petición para cambiar el estado del cliente
        const DATA = await fetchData(INFO_TRABAJO_API, 'updateStatus', FORM);

        // Se comprueba si la respuesta es satisfactoria
        if (DATA.status) {
            sweetAlert(1, DATA.message, true); // Mensaje de éxito
            fillTable(); // Recargar la tabla para visualizar los cambios
        } else {
            sweetAlert(2, DATA.error, false); // Mensaje de error
        }
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar la información de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idTrabajo', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(INFO_TRABAJO_API, 'deleteRow', FORM);
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

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idTrabajo', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(INFO_TRABAJO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar informacion';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_Trabajo.value = ROW.id_trabajo_empleado;
        fillSelect(EMPLEADO_API, 'readAll', 'empleadoTrabajo', parseInt(ROW.id_empleado));

        // Asignar el valor del departamento
        DEPARTAMENTO_TRABAJO.value = ROW.departamento_trabajo_empleado;

        // Llamar a la función para actualizar los municipios
        actualizarMunicipios();

        // Esperar a que los municipios se carguen
        setTimeout(() => {
            // Asignar el valor del municipio después de que se actualicen las opciones
            MUNICIPIO_TRABAJO.value = ROW.municipio_trabajo_empleado;
        }, 100); // Pequeño retraso para asegurar la carga de los municipios

        // Manejar el estado del trabajo
        if (ROW.estado_trabajo_empleado == 1) {
            document.getElementById('estadoTrabajo1').checked = true; // Activo
        } else if (ROW.estado_trabajo_empleado == 0) {
            document.getElementById('estadoTrabajo2').checked = true; // Inactivo
        }

    } else {
        sweetAlert(2, DATA.error, false);
    }
};

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar información laboral';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(EMPLEADO_API, 'readAll', 'empleadoTrabajo');

}