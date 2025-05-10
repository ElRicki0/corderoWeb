// ? constantes para completar las rutas api
const MATERIALES_API = 'services/public/materiales.php';
const REQUISICION_API = 'services/public/requisicion.php';

// ? Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm'),
    SEARCH_INPUT = document.getElementById('search');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    SAVE_FORM = document.getElementById('saveForm');

// Constantes para establecer los elementos del formulario de guardar.
const ID_MATERIAL = document.getElementById('idMaterial'),
    NOMBRE_MATERIAL = document.getElementById('nombreMaterial'),
    DESCRIPCION_MATERIAL = document.getElementById('descripcionMaterial'),
    UNIDADES_MATERIAL = document.getElementById('unidadMaterial'),
    CANTIDAD_MATERIAL = document.getElementById('cantidadMaterial');

// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('materials'),
    ROWS_FOUND = document.getElementById('rowsFound');

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

// se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    // Función para cargar la plantilla de la página
    loadTemplate();
    fillTable(null, 1); // Cargar la tabla con todos los materiales por defecto 
})

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
    SEARCH_INPUT.value = ''; // Limpiar el campo de búsqueda    
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



// ? método para abrir modal de solicitar material
const orderMaterial = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idMaterial', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MATERIALES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_MATERIAL.value = ROW.id_material;
        NOMBRE_MATERIAL.textContent = ROW.nombre_material;
        DESCRIPCION_MATERIAL.textContent = ROW.descripcion_material;
        UNIDADES_MATERIAL.textContent = ROW.unidad_material;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(REQUISICION_API, 'createDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se constata si el cliente ha iniciado sesión.
    if (DATA.status) {
        sweetAlert(1, DATA.message, false);
        // sweetAlert(1, DATA.message, false, 'cart.html');
    } else if (DATA.session) {
        sweetAlert(2, DATA.error, false);
    } else {
        sweetAlert(3, DATA.error, true);
        // sweetAlert(3, DATA.error, true, 'login.html');
    }
})

const fillTable = async (form = null, buscador) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    let action = form ? 'searchRows' : 'readAll'; // Valor por defecto para action

    // Si el buscador tiene un valor válido (1-7), sobrescribe la acción
    if (buscador >= 1 && buscador <= 7) {
        switch (buscador) {
            case 1:
                action = 'readAll';
                activarBoton(BOTON_GENERAL);
                break;
            case 2:
                action = 'readByCategory1';
                activarBoton(BOTON_USO_COTIDIANO);
                break;
            case 3:
                action = 'readByCategory2';
                activarBoton(BOTON_CL200);
                break;
            case 4:
                action = 'readByCategory3';
                activarBoton(BOTON_ACOMETIDA_ESPECIAL);
                break;
            case 5:
                action = 'readByCategory4';
                activarBoton(BOTON_SUBTERRANEO);
                break;
            case 6:
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
    else {
        // Opcional: Resetear todos si no hay coincidencia
        resetearBotones();
        BOTON_GENERAL.classList.add('btn-success'); // Por defecto
        console.log('Error: buscador fuera de rango (1-7)');
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
            TABLE_BODY.innerHTML += `
            <!-- Tarjeta 1 -->
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${row.nombre_material}</h5>
                        <div class="round bg-info rounded-3 text-dark px-2 my-2">
                            <h5 class="card-text">${info}</h5>
                        </div>
                        <p class="card-text">${row.descripcion_material}</p>
                        <p class="card-text"><small class="text-muted">Código: ${row.codigo_material}</small></p>
                        <button type="button" class="btn btn-primary"
                            onclick="orderMaterial(${row.id_material})"><h2>Solicitar material</h2></button>
                    </div>
                </div>
            </div>`;

        })
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}