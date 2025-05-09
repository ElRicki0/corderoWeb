// ? constantes para completar las rutas api
const MATERIALES_API = 'services/admin/materiales.php';

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('registrosMaterial'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// Constantes para mostrar el modal para actualizar la cantidad de los materiales.
const MATERIAL_MODAL = new bootstrap.Modal('#materialModal'),
    TIPO_MATERIAL_MODAL = new bootstrap.Modal('#TipoMaterialModal'),
    MATERIAL_TITTLE = document.getElementById('TipoAltMaterial');

// constantes para mostrar y preparar los datos del modal
const ID_CANTIDAD_TIPO_MATERIAL = document.getElementById('idTipoMaterialCantidad'),
    QUANTITY_FORM = document.getElementById('updateQuantityForm'),
    CANTIDAD_ACTUAL_MATERIAL = document.getElementById('cantidadActualMaterial'),
    CANTIDAD_ACTUALIZADA_MATERIAL = document.getElementById('cantidadActualizadaMaterial'),
    ACTUALIZAR_MATERIAL = document.getElementById('actualizarMaterial');

// constantes para guardar o editar un registro
const SAVE_FORM = document.getElementById('saveForm'),
    ID_MATERIAL = document.getElementById('idMaterial'),
    ID_MATERIAL_CONTENIDO = document.getElementById('idMaterialCantidad'),
    NOMBRE_MATERIAL = document.getElementById('nombreMaterial'),
    DESCRIPCION_MATERIAL = document.getElementById('descripcionMaterial'),
    CATEGORIA_MATERIAL = document.getElementById('CategoriaMaterial'),
    CODIGO_MATERIAL = document.getElementById('codigoMaterial'),
    CANTIDAD_MINIMA_MATERIAL = document.getElementById('cantidadMinimaMaterial'),
    CANTIDAD_MATERIAL = document.getElementById('cantidadMaterial');

// constantes para los botones de categoría de bodega
const BOTON_GENERAL = document.getElementById('botonGeneral'),
    BOTON_USO_COTIDIANO = document.getElementById('botonUsoCotidiano'),
    BOTON_CL200 = document.getElementById('botonCL200'),
    BOTON_ACOMETIDA_ESPECIAL = document.getElementById('botonAcomedidaEspecial'),
    BOTON_SUBTERRANEO = document.getElementById('botonSubterraneo'),
    BOTON_ANTI_TELE = document.getElementById('botonAntiTele');

// Obtener todos los botones relevantes
const botones = [
    BOTON_GENERAL,
    BOTON_USO_COTIDIANO,
    BOTON_CL200,
    BOTON_ACOMETIDA_ESPECIAL,
    BOTON_SUBTERRANEO,
    BOTON_ANTI_TELE
];

let TIPO_CANTIDAD_MATERIAL, CANTIDAD_Mt;

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función para cargar la tabla de contenido
    readAllTable(null, 1);
});

// Función para resetear todos los botones a 'btn-secondary'
function resetearBotones() {
    botones.forEach(boton => {
        boton.classList.remove('btn-success', 'disabled');
        boton.classList.add('btn-secondary');
    });
}

// Función para activar un botón específico
function activarBoton(boton) {
    resetearBotones();
    boton.classList.remove('btn-secondary');
    boton.classList.add('btn-success', 'disabled');
}

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    readAllTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Siempre prevenir el comportamiento por defecto primero

    // Obtener valores como números
    const cantidad = parseInt(CANTIDAD_MATERIAL.value);
    const cantidadMinima = parseInt(CANTIDAD_MINIMA_MATERIAL.value);

    // Validación en el cliente
    if (isNaN(cantidad) || cantidad <= 0) {
        sweetAlert(2, 'La cantidad debe ser un número entero positivo', false);
        return;
    }

    if (cantidad <= cantidadMinima) {
        sweetAlert(2, `La cantidad debe ser mayor a la cantidad minima: (${cantidadMinima})`, false);
        return;
    }

    // Verificar la acción a realizar
    const action = ID_MATERIAL.value ? 'updateRow' : 'createRow';

    try {
        // Constante tipo objeto con los datos del formulario
        const FORM = new FormData(SAVE_FORM);

        // Petición para guardar los datos del formulario
        const DATA = await fetchData(MATERIALES_API, action, FORM);

        // Manejar la respuesta
        if (DATA.status) {
            SAVE_MODAL.hide();
            sweetAlert(1, DATA.message, true);
            readAllTable(null, 1);
        } else {
            sweetAlert(2, DATA.error || 'Error desconocido', false);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        sweetAlert(2, 'Error al procesar la solicitud', false);
    }
});

QUANTITY_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Siempre prevenir el comportamiento por defecto primero 
    // Constante tipo objeto con los datos del formulario
    let action;

    switch (TIPO_CANTIDAD_MATERIAL) {
        case 1:
            action = 'addQuantity';
            break;
        case 2:
            action = 'restQuantity';
            break;
        default:
            action = 'null'; // Si no es 1 ni 2 (o está vacío)
    }
    const FORM = new FormData(QUANTITY_FORM);

    // Petición para guardar los datos del formulario
    const DATA = await fetchData(MATERIALES_API, action, FORM);

    // Manejar la respuesta
    if (DATA.status) {
        TIPO_MATERIAL_MODAL.hide();
        sweetAlert(1, DATA.message, true);
        readAllTable(null, 1);
    } else {
        sweetAlert(2, DATA.error || 'Error desconocido', false);
    }
})


/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar Material';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idMaterial', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar información';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MATERIAL.value = ROW.id_material;
        NOMBRE_MATERIAL.value = ROW.nombre_material;
        DESCRIPCION_MATERIAL.value = ROW.descripcion_material;
        CATEGORIA_MATERIAL.value = ROW.categoria_material;
        CODIGO_MATERIAL.value = ROW.codigo_material;
        CANTIDAD_MINIMA_MATERIAL.value = ROW.cantidad_minima_material;
        CANTIDAD_MATERIAL.value = ROW.cantidad_material;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// * Función asincrona para preparar el formulario al momento de actualizar la cantidad de material
const openUpdateQuantity = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idMaterial', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        MATERIAL_MODAL.show();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MATERIAL_CONTENIDO.value = ROW.id_material;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openQuantity = async (id, tipoCambio) => {
    MATERIAL_TITTLE.textContent = '';
    switch (tipoCambio) {
        case 1:
            MATERIAL_TITTLE.textContent = 'agregar material';
            TIPO_CANTIDAD_MATERIAL = 1;
            break;
        case 2:
            MATERIAL_TITTLE.textContent = 'restar material';
            TIPO_CANTIDAD_MATERIAL = 2;
            break
        default:
            break;
    }
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idMaterial', id);
    // Petición para obtener los datos del registro solicitado
    const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
    // se comprueba si la repuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción
    if (DATA.status) {
        // Se muestra la caja de dialogo con su titulo
        const ROW = DATA.dataset;
        ID_CANTIDAD_TIPO_MATERIAL.value = ROW.id_material;
        CANTIDAD_ACTUAL_MATERIAL.textContent = ROW.cantidad_material;
        CANTIDAD_Mt = parseInt(ROW.cantidad_material);
        console.log(CANTIDAD_Mt);
        // CANTIDAD_ACTUALIZADA_MATERIAL.textContent = ROW.cantidad_material + 
        // console.log('contenido es ' + ROW.cantidad_material + ' o owo')
        // ACTUALIZAR_MATERIAL.value = ROW.
        // se inicializa loa campos con los datos
    } else {

    }
}

const updateActualQuantity = async (cantidad) => {
    switch (TIPO_CANTIDAD_MATERIAL) {
        case 1:
            CANTIDAD_ACTUALIZADA_MATERIAL.textContent = Number(cantidad.value) + Number(CANTIDAD_Mt);
            break;
        case 2:
            if (cantidad.value > CANTIDAD_Mt) {
                CANTIDAD_ACTUALIZADA_MATERIAL.textContent = 'Cantidad no permitida';
            } else {
                CANTIDAD_ACTUALIZADA_MATERIAL.textContent = CANTIDAD_Mt - cantidad.value;
            }
            break;
        default:
            sweetAlert(1, 'Error al mostrar datos', true);
            break;
    }
    console.log(CANTIDAD_Mt);
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el materia de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idMaterial', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(MATERIALES_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            readAllTable(null, 1);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// *función asíncrona para mostrar una categoría especifica o mostrar todos los registros 
const showCategory = async (category, form) => {
    let info;
    switch (category) {
        case 1:
            info = 'readAll';
            estado = 1;
            activarBoton(BOTON_GENERAL);
            break;
        case 2:
            info = 'readByCategory1';
            estado = 2;
            activarBoton(BOTON_USO_COTIDIANO);
            break;
        case 3:
            info = 'readByCategory2';
            estado = 3;
            activarBoton(BOTON_CL200);
            break;
        case 4:
            info = 'readByCategory3';
            estado = 4;
            activarBoton(BOTON_ACOMETIDA_ESPECIAL);
            break;
        case 5:
            info = 'readByCategory4';
            estado = 5;
            activarBoton(BOTON_SUBTERRANEO);
            break;
        case 6:
            info = 'readByCategory5';
            estado = 6;
            activarBoton(BOTON_ANTI_TELE);
            break;
        default:
            // Opcional: Resetear todos si no hay coincidencia
            resetearBotones();
            BOTON_GENERAL.classList.add('btn-success'); // Por defecto
            break;
    }
    // Se inicializa el contenido de la tabla.
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(MATERIALES_API, info, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            let info;
            // ? icono y texto para clasificar la categoría
            switch (row.categoria_material) {
                case 'Uso habitual':
                    info = '<i class="bi bi-house-door"></i> Uso habitual';
                    break;
                case 'Material para CL200':
                    info = '<i class="bi bi-lightning-charge"></i> Material para CL200';
                    break;
                case 'Acometida especial':
                    info = '<i class="bi bi-lightning-fill"></i> Acometida especial';
                    break;
                case 'Subterráneo':
                    info = '<i class="bi bi-minecart-loaded"></i> Subterráneo';
                    break;
                case 'Antihurto y telegestión':
                    info = '<i class="bi bi-shield-lock"></i> Antihurto y telegestión';
                    break;
                default:
                    break;
            }

            if (row.necesita_reposicion == 1) {
                cantidad = `<div class="round alert alert-danger rounded-3 mb-2" role="alert">
                                <i class="bi bi-exclamation-triangle-fill"></i> <strong class=''>¡Atención! material es menor a la cantidad minima</strong>
                            </div>`;

                sweetAlert(3, 'materiales con poco stock');
            } else {
                cantidad = '';
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-5 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del material</h5>
                            <p class="card-title text-white">${row.nombre_material}</p>
                            <h5 class="text-white">Descripción del material</h5>
                            <p class="card-text text-white">${row.descripcion_material}</p>
                            <h5 class="text-white">Código Material</h5>
                            <p class="card-text text-white">${row.codigo_material} Unidades</p>
                        </div>
                        <div class="col-lg-5 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Cantidad actual material</h5>
                            <p class="card-text text-white">${row.cantidad_material} Metros MT.</p>
                            <h5 class="text-white">Cantidad minima material</h5>
                            <p class="card-text text-white">${row.cantidad_minima_material} Metros MT.</p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}
                            </p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column ">
                                <div class="round bg-info rounded-3 text-dark mb-2">
                                    <h5 class="card-text ">${info}</h5>
                                </div>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_material})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_material})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdateQuantity(${row.id_material})">
                                    <i class="bi bi-clipboard-plus-fill"></i> Editar Cantidad
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
        TABLE_BODY.innerHTML += `
        <div class="col-5 justify-content-center align-items-center">
                <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
            </div>
        `
    }
}

// ? función asíncrona para ordenar los registros de diferentes formas que el  usuario  requiera
const readAllTable = async (form = null, buscador) => {

    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';

    let action = form ? 'searchRows' : 'readAll'; // Valor por defecto

    // Si el buscador tiene un valor válido (1-4), sobrescribe la acción
    if (buscador >= 1 && buscador <= 4) {
        switch (buscador) {
            case 1:
                action = 'readAll';
                break;
            case 2:
                action = 'readByMax';
                break;
            case 3:
                action = 'readByMin';
                break;
            case 4:
                action = 'readByModify';
                break;
            case 5:
                action = 'readAll';
                activarBoton(BOTON_GENERAL);
                break;
            case 6:
                action = 'readByCategory1';
                activarBoton(BOTON_USO_COTIDIANO);
                break;
            case 7:
                action = 'readByCategory2';
                activarBoton(BOTON_CL200);
                break;
            case 8:
                action = 'readByCategory3';
                activarBoton(BOTON_ACOMETIDA_ESPECIAL);
                break;
            case 9:
                action = 'readByCategory4';
                activarBoton(BOTON_SUBTERRANEO);
                break;
            case 10:
                action = 'readByCategory5';
                activarBoton(BOTON_ANTI_TELE);
                break;
            default:
                // Opcional: Resetear todos si no hay coincidencia
                resetearBotones();
                BOTON_GENERAL.classList.add('btn-success'); // Por defecto
                break;
        }
    }

    const DATA = await fetchData(MATERIALES_API, action, form);

    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            let info;
            // ? icono y texto para clasificar la categoría
            switch (row.categoria_material) {
                case 'Uso habitual':
                    info = '<i class="bi bi-house-door"></i> Uso habitual';
                    break;
                case 'Material para CL200':
                    info = '<i class="bi bi-lightning-charge"></i> Material para CL200';
                    break;
                case 'Acometida especial':
                    info = '<i class="bi bi-lightning-fill"></i> Acometida especial';
                    break;
                case 'Subterráneo':
                    info = '<i class="bi bi-minecart-loaded"></i> Subterráneo';
                    break;
                case 'Antihurto y telegestión':
                    info = '<i class="bi bi-shield-lock"></i> Antihurto y telegestión';
                    break;
                default:
                    break;
            }

            if (row.necesita_reposicion == 1) {
                cantidad = `<div class="round alert alert-danger rounded-3 mb-2" role="alert">
                                <i class="bi bi-exclamation-triangle-fill"></i> <strong class=''>¡Atención! material es menor a la cantidad minima</strong>
                            </div>`;

                sweetAlert(3, 'materiales con poco stock');
            } else {
                cantidad = '';
            }

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-5 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Nombre del material</h5>
                            <p class="card-title text-white">${row.nombre_material}</p>
                            <h5 class="text-white">Descripción del material</h5>
                            <p class="card-text text-white">${row.descripcion_material}</p>
                            <h5 class="text-white">Código Material</h5>
                            <p class="card-text text-white">${row.codigo_material} Unidades</p>
                        </div>
                        <div class="col-lg-5 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Cantidad actual material</h5>
                            <p class="card-text text-white">${row.cantidad_material} Metros MT.</p>
                            <h5 class="text-white">Cantidad minima material</h5>
                            <p class="card-text text-white">${row.cantidad_minima_material} Metros MT.</p>
                            <h5 class="text-white">Registro alterado por:</h5>
                            <p class="card-text text-white">${row.nombre_administrador} ${row.apellido_administrador}
                            </p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column ">
                                ${cantidad}
                                <div class="round bg-info rounded-3 text-dark mb-2">
                                    <h5 class="card-text ">${info}</h5>
                                </div>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_material})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_material})">
                                    <i class="bi bi-trash"></i> Eliminar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdateQuantity(${row.id_material})">
                                    <i class="bi bi-clipboard-plus-fill"></i> Editar Cantidad
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