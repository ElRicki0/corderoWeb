// ? constantes para completar las rutas api
const CABLE_API = 'services/admin/cables.php';
const CATEGORIA_CABLE_API = 'services/admin/categoria_cable.php';

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('cables'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// constantes para guardar o editar un registro
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CABLE = document.getElementById('idCable'),
    NOMBRE_CABLE = document.getElementById('nombreCable'),
    DESCRIPCION_CABLE = document.getElementById('descripcionCable'),
    ESTADO_CABLE = document.getElementById('estadoCable'),
    LONGITUD_CABLE = document.getElementById('longitudCable');

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función para cargar la tabla de contenido
    fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
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
    const DATA = await fetchData(CABLE_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            let icon;

            switch (parseInt(row.estado_cable)) {
                case 0:
                    icon = 'bi bi-bookmark-star'; // Estado 0
                    break;
                case 1:
                    icon = 'bi bi-bookmark-star-fill'; // Estado 1
                    break;
                case 2:
                    icon = 'bi bi-truck'; // Estado 2
                    break;
                default:
                    icon = 'bi bi-question-circle-fill'; // Para estados no contemplados
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/error/images/404Administrador.png';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del cable</h5>
                            <p class="card-title text-white">${row.nombre_cable}</p>
                            <h5 class="text-white">Descripción del cable</h5>
                            <p class="card-text text-white">${row.descripcion_cable}</p>
                            <h5 class="text-white">Longitud cable</h5>
                            <p class="card-text text-white">${row.longitud_cable} Metros MT.</p>
                            <h5 class="text-white">Longitud minima del cable</h5>
                            <p class="card-text text-white">${row.longitud_minima_cable} Metros MT.</p>
                            <h5 class="text-white">Estado del cable</h5>
                            <p class="card-text text-white"><i class="${icon}"></i></p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_cable})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
        TABLE_BODY.innerHTML+=`
        <div class="col-5 justify-content-center align-items-center">
                <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
            </div>
        `
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar Cables';
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(CATEGORIA_CABLE_API, 'readAll', 'categoriaCable');
}

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CABLE.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CABLE_API, action, FORM);
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
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idCable', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CABLE_API, 'readOne', FORM);
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
        ESTADO_CABLE.value = ROW.estado_cable;
        fillSelect(CATEGORIA_CABLE_API, 'readAll', 'categoriaCable', parseInt(ROW.id_categoria_cable));
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el cable de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCable', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CABLE_API, 'deleteRow', FORM);
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

// ? función asíncrona para ordenar los registros de diferentes formas que el  usuario  requiera
// *alfabéticamente
const orderByName = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CABLE_API, 'readByName', form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            let icon;

            switch (parseInt(row.estado_cable)) {
                case 0:
                    icon = 'bi bi-bookmark-star'; // Estado 0
                    break;
                case 1:
                    icon = 'bi bi-bookmark-star-fill'; // Estado 1
                    break;
                case 2:
                    icon = 'bi bi-truck'; // Estado 2
                    break;
                default:
                    icon = 'bi bi-question-circle-fill'; // Para estados no contemplados
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/error/images/404Administrador.png';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del cable</h5>
                            <p class="card-title text-white">${row.nombre_cable}</p>
                            <h5 class="text-white">Descripción del cable</h5>
                            <p class="card-text text-white">${row.descripcion_cable}</p>
                            <h5 class="text-white">Longitud cable</h5>
                            <p class="card-text text-white">${row.longitud_cable} Metros MT.</p>
                            <h5 class="text-white">Estado del cable</h5>
                            <p class="card-text text-white"><i class="${icon}"></i></p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_cable})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// *mayor a menor
const readByLengthDesc = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CABLE_API, 'readByLengthDesc', form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            let icon;

            switch (parseInt(row.estado_cable)) {
                case 0:
                    icon = 'bi bi-bookmark-star'; // Estado 0
                    break;
                case 1:
                    icon = 'bi bi-bookmark-star-fill'; // Estado 1
                    break;
                case 2:
                    icon = 'bi bi-truck'; // Estado 2
                    break;
                default:
                    icon = 'bi bi-question-circle-fill'; // Para estados no contemplados
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/error/images/404Administrador.png';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del cable</h5>
                            <p class="card-title text-white">${row.nombre_cable}</p>
                            <h5 class="text-white">Descripción del cable</h5>
                            <p class="card-text text-white">${row.descripcion_cable}</p>
                            <h5 class="text-white">Longitud cable</h5>
                            <p class="card-text text-white">${row.longitud_cable} Metros MT.</p>
                            <h5 class="text-white">Estado del cable</h5>
                            <p class="card-text text-white"><i class="${icon}"></i></p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_cable})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// *mayor a menor
const readByLengthAsc = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CABLE_API, 'readByLengthAsc', form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            let icon;

            switch (parseInt(row.estado_cable)) {
                case 0:
                    icon = 'bi bi-bookmark-star'; // Estado 0
                    break;
                case 1:
                    icon = 'bi bi-bookmark-star-fill'; // Estado 1
                    break;
                case 2:
                    icon = 'bi bi-truck'; // Estado 2
                    break;
                default:
                    icon = 'bi bi-question-circle-fill'; // Para estados no contemplados
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/error/images/404Administrador.png';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del cable</h5>
                            <p class="card-title text-white">${row.nombre_cable}</p>
                            <h5 class="text-white">Descripción del cable</h5>
                            <p class="card-text text-white">${row.descripcion_cable}</p>
                            <h5 class="text-white">Longitud cable</h5>
                            <p class="card-text text-white">${row.longitud_cable} Metros MT.</p>
                            <h5 class="text-white">Estado del cable</h5>
                            <p class="card-text text-white"><i class="${icon}"></i></p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_cable})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// *mayor a menor
const readByModify = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CABLE_API, 'readByModify', form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            let icon;

            switch (parseInt(row.estado_cable)) {
                case 0:
                    icon = 'bi bi-bookmark-star'; // Estado 0
                    break;
                case 1:
                    icon = 'bi bi-bookmark-star-fill'; // Estado 1
                    break;
                case 2:
                    icon = 'bi bi-truck'; // Estado 2
                    break;
                default:
                    icon = 'bi bi-question-circle-fill'; // Para estados no contemplados
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/error/images/404Administrador.png';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del cable</h5>
                            <p class="card-title text-white">${row.nombre_cable}</p>
                            <h5 class="text-white">Descripción del cable</h5>
                            <p class="card-text text-white">${row.descripcion_cable}</p>
                            <h5 class="text-white">Longitud cable</h5>
                            <p class="card-text text-white">${row.longitud_cable} Metros MT.</p>
                            <h5 class="text-white">Estado del cable</h5>
                            <p class="card-text text-white"><i class="${icon}"></i></p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_cable})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}