// ?constante para trabajar con la API
const EMPLADO_API = 'services/admin/empleado.php';

// ? Constantes del registro empleado
const SAVE_FORM = document.getElementById('saveForm'),
    ID_EMPLEADO = document.getElementById('idEmpleado'),
    NOMBRE_EMPLEADO = document.getElementById('nombreEmpleado'),
    APELLIDO_EMPLEADO = document.getElementById('apellidoEmpleado'),
    DUI_EMPLEADO = document.getElementById('duiEmpleado'),
    TELEFONO_EMPLEADO = document.getElementById('telefonoEmpleado'),
    DEPARTAMENTO_EMPLEADO = document.getElementById('departamentoEmpleado'),
    MUNICIPIO_EMPLEADO = document.getElementById('municipioEmpleado');
// CORREO_EMPLEADO = document.getElementById('correoEmpleado'),
// ESTADO_TRABAJO = document.getElementById('estadoTrabajo'),
// CLAVE_EMPLEADO = document.getElementById('clavesEmpleado');
// ESTADO_CONTENIDO = document.getElementById('estadoContenido'),


// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? CONSTANTES PARA MOSTRAR IMAGEN SELECCIONADA  PARA EL EMPLEADO
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra'),
    IMAGEN_EMPLEADO = document.getElementById('imagenEmpleado');

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// ? Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('empleados'),
    // BUSCADOR_DEPARTAMENTO = document.getElementById('buscadorDepartamento'),
    ROWS_FOUND = document.getElementById('rowsFound');

// ? Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    MAIN_TITLE.textContent = 'Pagina de empleados';
    fillTable();
});

// ? función para seleccionar imagen y visualizar imágenes
IMAGEN_EMPLEADO.addEventListener('change', function (event) {
    // Verifica si hay una imagen seleccionada
    if (event.target.files && event.target.files[0]) {
        // con el objeto Filereader lee el archivo seleccionado
        const reader = new FileReader();
        // Luego de haber leído la imagen seleccionada se nos devuelve un objeto de tipo blob
        // Con el método createObjectUrl de fileReader crea una url temporal para la imagen
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

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_EMPLEADO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(EMPLADO_API, action, FORM);
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

function actualizarMunicipios() {
    let departamento = DEPARTAMENTO_EMPLEADO.value;

    // Limpiar opciones previas
    MUNICIPIO_EMPLEADO.innerHTML = '<option value="">Seleccione un municipio</option>';

    // Definir los municipios por departamento
    let municipios = {
        "Ahuachapan": ["Ahuachapán", "Apaneca", "Atiquizaya", "Concepción de Ataco", "El Refugio", "Guaymango", "Jujutla", "San Francisco Menéndez", "San Lorenzo", "San Pedro Puxtla", "Tacuba", "Turín"],
        "Cabañas": ["Sensuntepeque", "Victoria", "Guacotecti", "Dolores", "Cinquera", "Ilobasco", "Jutiapa", "San Isidro", "Tejutepeque"],
        "Chalatenango": ["Chalatenango", "La Palma", "San Ignacio", "Nueva Concepción", "Tejutla", "Arcatao", "Azacualpa", "Citalá", "Comalapa", "Concepción Quezaltepeque", "Dulce Nombre de María", "El Carrizal", "El Paraíso", "La Laguna", "Las Vueltas", "Nombre de Jesús", "Ojos de Agua", "Potonico", "San Antonio de la Cruz", "San Antonio Los Ranchos", "San Fernando", "San Francisco Lempa", "San Francisco Morazán", "San Isidro Labrador", "San Luis del Carmen", "San Miguel de Mercedes", "San Rafael", "Santa Rita"],
        "Cuscatlán": ["Cojutepeque", "Suchitoto", "San Pedro Perulapán", "San Rafael Cedros", "El Carmen", "Monte San Juan", "San Bartolomé Perulapía", "San Cristóbal", "Tenancingo", "Santa Cruz Analquito", "Candelaria", "Oratorio de Concepción"],
        "La Libertad": ["Santa Tecla", "Antiguo Cuscatlán", "Colón", "San Juan Opico", "Quezaltepeque", "Chiltiupán", "Ciudad Arce", "Jayaque", "Huizúcar", "La Libertad", "Nuevo Cuscatlán", "San José Villanueva", "Tamanique", "Teotepeque", "Tepecoyo", "Zaragoza"],
        "La Paz": ["Zacatecoluca", "San Juan Nonualco", "San Pedro Masahuat", "San Rafael Obrajuelo", "Cuyultitán", "El Rosario", "Jerusalén", "Mercedes La Ceiba", "Olocuilta", "Paraíso de Osorio", "San Antonio Masahuat", "San Emigdio", "San Francisco Chinameca", "San Juan Talpa", "San Juan Tepezontes", "San Luis Talpa", "San Miguel Tepezontes", "San Pedro Nonualco", "Santa María Ostuma", "Santiago Nonualco", "Tapalhuaca"],
        "San Salvador": ["San Salvador", "Soyapango", "Mejicanos", "Apopa", "Ilopango", "San Marcos", "Cuscatancingo", "Ciudad Delgado", "Ayutuxtepeque", "Panchimalco", "Rosario de Mora", "San Martín", "Tonacatepeque"],
        "San Vicente": ["San Vicente", "Tecoluca", "Apastepeque", "San Ildefonso", "San Esteban Catarina", "San Lorenzo", "San Sebastián", "Santa Clara", "Santo Domingo", "Verapaz"],
        "Santa Ana": ["Santa Ana", "Metapán", "Chalchuapa", "Coatepeque", "Candelaria de la Frontera", "El Congo", "Masahuat", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santa Rosa Guachipilín", "Santiago de la Frontera", "Texistepeque"],
        "Sonsonate": ["Sonsonate", "Izalco", "Nahuizalco", "Juayúa", "Sonzacate", "Acajutla", "Armenia", "Caluco", "Cuisnahuat", "Nahulingo", "Salcoatitán", "San Antonio del Monte", "San Julián", "Santa Catarina Masahuat", "Santo Domingo de Guzmán"],
        "Usulután": ["Usulután", "Jiquilisco", "Santa María", "Puerto El Triunfo", "Jucuapa", "Berlín", "California", "Concepción Batres", "El Triunfo", "Ereguayquín", "Estanzuelas", "Mercedes Umaña", "Nueva Granada", "Ozatlán", "San Agustín", "San Buenaventura", "San Dionisio", "San Francisco Javier", "Santa Elena", "Tecapán"],
        "Morazán": ["San Francisco Gotera", "Cacaopera", "Joateca", "Perquín", "Sociedad", "Arambala", "Chilanga", "Corinto", "Delicias de Concepción", "El Divisadero", "El Rosario", "Gualococti", "Guatajiagua", "Jocoaitique", "Jocoro", "Lolotiquillo", "Meanguera", "Osicala", "San Carlos", "San Fernando", "San Isidro", "Sensembra", "Torola", "Yamabal", "Yoloaiquín"],
        "La Unión": ["La Unión", "Conchagua", "El Carmen", "Santa Rosa de Lima", "Intipucá", "Anamorós", "Bolívar", "Concepción de Oriente", "El Sauce", "Lislique", "Meanguera del Golfo", "Nueva Esparta", "Pasaquina", "Polorós", "San Alejo", "San José", "Yayantique", "Yucuaiquín"],
        "San Miguel": ["San Miguel", "Chinameca", "Quelepa", "Moncagua", "Nuevo Edén de San Juan", "San Antonio", "San Gerardo", "San Jorge", "San Luis de la Reina", "San Rafael Oriente", "Sesori", "Uluazapa"],
    };

    // Agregar opciones según el departamento seleccionado
    if (departamento && municipios[departamento]) {
        municipios[departamento].forEach(municipio => {
            let opcion = document.createElement("option");
            opcion.value = municipio;
            opcion.textContent = municipio;
            MUNICIPIO_EMPLEADO.appendChild(opcion);
        });
    }
}

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
    const DATA = await fetchData(EMPLADO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            (row.empleado_agregado) ? estado = 'info text-center mt-3">Empleado registrado' : estado = 'warning text-center mt-3">Empleado no registrado';
            (row.estado_trabajo_empleado) ? icon = 'bi bi-check-circle-fill' : icon = 'bi bi-pause-circle-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="col-12 card mt-2 text-bg-dark" id="searchForm">
                <div id="estadoTrabajo">
                    <h3 class="text-${estado}</h3>
                </div>
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
                                    <h5 class="text-white">DUI Empleado</h5>
                                    <p class="card-text text-white">${row.DUI_empleado}</p>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <h5 class="text-white">Teléfono empleado</h5>
                                    <p class="card-title text-white">${row.telefono_personal_empleado}
                                    <h5 class="text-white">Departamento</h5>
                                    <p class="card-title text-white">${row.departamento_trabajo_empleado}
                                    <h5 class="text-white">Municipio</h5>
                                    <p class="card-title text-white">${row.municipio_trabajo_empleado}
                                    
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12 col-md-12 col-lg-3 text-center my-5">
                            <div class="d-flex       flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_empleado})">
                                    <i class="bi bi-trash3-fill"></i> Eliminar
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_empleado})">
                                    <i class="bi bi-pencil-fill"></i>Actualizar
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
            action = 'readByNameAsc';
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
        case 6:
            action = 'readByInformation';
            break;
        case 7:
            action = 'readByNoInformation';
            break;
        default:
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(EMPLADO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del empleado.
            (row.empleado_agregado) ? estado = 'info text-center mt-3">Empleado registrado' : estado = 'warning text-center mt-3">Empleado no registrado';
            (row.estado_trabajo_empleado) ? icon = 'bi bi-check-circle-fill' : icon = 'bi bi-pause-circle-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="col-12 card mt-2 text-bg-dark" id="searchForm">
                <div id="estadoTrabajo">
                    <h3 class="text-${estado}</h3>
                </div>
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
                                    <h5 class="text-white">DUI Empleado</h5>
                                    <p class="card-text text-white">${row.DUI_empleado}</p>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-12">
                                    <h5 class="text-white">Teléfono empleado</h5>
                                    <p class="card-title text-white">${row.telefono_personal_empleado}
                                    <h5 class="text-white">Departamento</h5>
                                    <p class="card-title text-white">${row.departamento_trabajo_empleado}
                                    <h5 class="text-white">Municipio</h5>
                                    <p class="card-title text-white">${row.municipio_trabajo_empleado}
                                    
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12 col-md-12 col-lg-3 text-center my-5">
                            <div class="d-flex flex-column">
                                <button class="btn btn-outline-light mb-2" onclick="openDelete(${row.id_empleado})">
                                    <i class="bi bi-trash3-fill"></i> Eliminar
                                </button>
                                <button class="btn btn-outline-light mb-2" onclick="openUpdate(${row.id_empleado})">
                                    <i class="bi bi-pencil-fill"></i>Actualizar
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
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Agregar Empleado';
    // Se prepara el formulario.
    SAVE_FORM.reset();
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el Empleado de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idEmpleado', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(EMPLADO_API, 'deleteRow', FORM);
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
    // Mostrar el mensaje de confirmación
    const isConfirmed = await confirmAction('¿Estás seguro de que deseas actualizar este registro del empleado?');

    // Si el usuario cancela, no se realiza ninguna acción
    if (!isConfirmed) {
        sweetAlert(3, 'Acción cancelada', false);
        return;
    }

    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idEmpleado', id);

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(EMPLADO_API, 'readOne', FORM);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar empleado';

        // Se prepara el formulario.
        SAVE_FORM.reset();

        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_EMPLEADO.value = ROW.id_empleado;
        NOMBRE_EMPLEADO.value = ROW.nombre_empleado;
        APELLIDO_EMPLEADO.value = ROW.apellido_empleado;
        DUI_EMPLEADO.value = ROW.DUI_empleado;
        TELEFONO_EMPLEADO.value = ROW.telefono_personal_empleado;
        DEPARTAMENTO_EMPLEADO.value = ROW.departamento_trabajo_empleado;

        // Actualizar los municipios según el departamento
        actualizarMunicipios();
        MUNICIPIO_EMPLEADO.value = ROW.municipio_trabajo_empleado; // Asignar el municipio
    } else {
        sweetAlert(2, DATA.error, false);
    }
};