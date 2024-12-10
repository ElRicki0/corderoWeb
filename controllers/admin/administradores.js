
// ? CONSTANTES PARA MOSTRAR IMAGEN SELECCIONADA  PARA EL PERFIL DEL ADMINISTRADOR
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra'),
    IMAGEN_ADMINISTRADOR = document.getElementById('imagenAdministrador');

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('administradores'),
    ROWS_FOUND = document.getElementById('rowsFound');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
    NOMBRE_ADMINISTRADOR = document.getElementById('nombreApellido'),
    APELLIDO_ADMINISTRADOR = document.getElementById('apellidoApellido'),
    CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador'),
    TELEFONO_ADMINISTRADOR = document.getElementById('telefonoEmpleado'),
    FECHA_ADMINISTRADOR = document.getElementById('fechaEmpleado'),
    ESTADO_ADMINISTRADOR = document.getElementById('estadoEmpleado')

// ? método cuando el documento ha cargado con éxito 
document.addEventListener('DOMContentLoaded', () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama la función para cargar la tabla de contenido
    fillTable();
});

IMAGEN_ADMINISTRADOR.addEventListener('change', function (event) {
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
    (form) ? action = 'searchRows' : action = 'readAllOne';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(USER_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            (row.estado_empleado) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
<div class="col-12 card mt-2 inicioIndex" id="searchForm">
    <div class="row  ">
        <div class="col-sm-12 col-md-12 col-lg-3 mt-3 d-flex align-items-center justify-content-center" 
             style="height: 300px; width: 300px;">
                <img src="${SERVER_URL}images/empleados/${row.imagen_empleado}" class="card-img-top" alt="..." 
                 onerror="this.onerror=null; this.src='../../resources/img/error/cliente.jpg';" 
                 style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>


        <div class="col-sm-12 col-md-12 col-lg-3 card-body d-flex flex-column align-items-center text-center">
            <h5 class="text-white">Nombre empleado</h5>
            <p class="card-title text-white">${row.nombre_empleado} ${row.apellido_empleado}</p>
            <h5 class="text-white">DUI Empleado</h5>
            <p class="card-text text-white">${row.dui_empleado}</p>
            <h5 class="text-white">Correo Empleado</h5>
            <p class="card-text text-white">${row.correo_empleado}</p>
            <h5 class="text-white">Estado empleado</h5>
            <p class="card-text text-white">Estado: <i class="${icon} text-white"></i></p>
        </div>3
        <div class="col-sm-12 col-md-12 col-lg-3 text-center my-5">
            <div class=" ">
                <div class="d-flex flex-column">
                    <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_empleado})">
                        <i class="bi bi-trash3-fill"></i> Eliminar
                    </button>
                    <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_empleado})">
                        <i class="bi bi-pencil-fill"></i>Actualizar
                    </button>
                    <button class="btn btn-outline-light mb-2" onclick="openState(${row.id_empleado})">
                        <i class="bi bi-exclamation-octagon"></i> Cambiar Estado
                    </button>
                    <button type="button" class="btn btn-outline-light mb-2" onclick="openChart(${row.id_empleado})">
                        <i class="bi bi-bar-chart-line-fill"></i> Ver Gráfico
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
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
                <img src="../../resources/error/images/404Informacion.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
            </div>
        `
        sweetAlert(4, DATA.error, true);
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
    MODAL_TITLE.textContent = 'Agregar Administrador';
    IMAGEN_MUESTRA.src = SERVER_URL.concat('images/administradores/404Administrador.png');
    // Se prepara el formulario.
    SAVE_FORM.reset();
}