// ? constantes para completar la rutas de las API
const CATEGORIA_CABLE_API = 'services/admin/categoria_cable.php';

// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tiposCables'),
    ROWS_FOUND = document.getElementById('rowsFound');

// ? constantes de los elementos modal
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? constantes del formulario de registros 
const SAVE_FORM = document.getElementById('saveForm'),
    ID_CATEGORIA_CABLE = document.getElementById('idCategoriaCable'),
    NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
    DESCRIPCION_CATEGORIA = document.getElementById('descripcionCategoria');

// ?constantes de imagen
const IMAGEN_CATEGORIA = document.getElementById('imagenCategoria'),
    IMAGEN_MUESTRA = document.getElementById('imagenMuestra');


// ? metodo que se ejecuta al momento de cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    // ? se ejecuta el método que muestra el encabezado y el footer
    loadTemplate();
    // ? se ejecuta el método para mostrar todos los registros de la tabla 
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

// ?funcion para seleccionar imagen y visualizar imágenes
IMAGEN_CATEGORIA.addEventListener('change', function (event) {
    // Verifica si hay una imagen seleccionada
    if (event.target.files && event.target.files[0]) {
        // con el objeto Filereader lee el archivo seleccionado
        const reader = new FileReader();
        // Luego de haber leido la imagen selecionada se nos devuelve un objeto de tipo blob
        // Con el metodo createObjectUrl de fileReader crea una url temporal para la imagen
        reader.onload = function (event) {
            // finalmente la url creada se le asigna el atributo de la etiqueta img
            IMAGEN_MUESTRA.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar Categoría cable';
    IMAGEN_MUESTRA.src = ('../../resources/images/error/404Cable.png');
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CATEGORIA_CABLE.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CATEGORIA_CABLE_API, action, FORM);
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
    const DATA = await fetchData(CATEGORIA_CABLE_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            (parseInt(row.estado_producto)) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="card text-bg-dark mb-5">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src="${SERVER_URL}images/cables/${row.imagen_categoria_cable}" width="200"
                                class="rounded border border-primary" alt="Imagen de error"
                                onerror="this.onerror=null; this.src='../../resources/images/error/404Cable.png ';">
                        </div>
                        <div class="col-lg-7 col-md-8 col-sm-12 text-center">
                            <h5 class="text-white">Tipo de cable</h5>
                            <p class="card-title text-white">${row.nombre_categoria_cable}</p>
                            <h5 class="text-white">Descripción</h5>
                            <p class="card-text text-white">${row.descripcion_categoria_cable}</p>
                        </div>
                        <div class="col-lg-2 col-md-12 col-sm-12 text-center mt-3">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_categoria_cable})">
                                    <i class="bi bi-pencil-square"></i> Editar Registro
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_categoria_cable})">
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
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idCategoriaCable', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CATEGORIA_CABLE_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar categoría';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CATEGORIA_CABLE.value = ROW.id_categoria_cable;
        NOMBRE_CATEGORIA.value = ROW.nombre_categoria_cable;
        DESCRIPCION_CATEGORIA.value = ROW.descripcion_categoria_cable;
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
    const RESPONSE = await confirmAction('¿Desea eliminar el categoría de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idCategoriaCable', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CATEGORIA_CABLE_API, 'deleteRow', FORM);
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