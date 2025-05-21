// constantes para completar las ruta de
const MATERIALES_API = 'services/admin/materiales.php';
const REQUISICION_API = 'services/admin/requisicion.php';
// constantes para el formulario de búsqueda
const SEARCH_FORM = document.getElementById('searchForm');
// constantes para establecer el contenido de la tabla
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound'),
    TABLE_COLUMNS = document.getElementById('tableColumns');
// constante de modals
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    ITEM_MODAL = new bootstrap.Modal('#itemModal'),
    MODAL_BODY = document.getElementById('modalTableBody'),
    MODAL_MATERIAL = document.getElementById('materialName'),
    MODAL_DATE = document.getElementById('dateMaterials');
// Constante para establecer el formulario de cambiar material.
const ITEM_FORM = document.getElementById('itemForm');

document.addEventListener('DOMContentLoaded', () => {
    loadTemplate();
    // llama la función para rellenar la tabla al cargar la pagina
    fillTable();
});

// Método del evento para cuando se envía el formulario de cambiar cantidad del material.
ITEM_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ITEM_FORM);
    // Petición para actualizar la cantidad del material.
    const DATA = await fetchData(REQUISICION_API, 'updateDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        
        // Se cierra la caja de diálogo del formulario.
        ITEM_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
* Función asíncrona para llenar la tabla con los registros disponibles.
* Parámetros: form (objeto opcional con los datos de búsqueda).
* Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, action, form);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <tr>
                <td>${row.usuario_dupla}</td>
                <td>${row.fecha_requisicion}</td>
                <td>
                    <button type="button" class="btn btn-secondary" onclick="showMaterials(${row.id_requisicion}, 1)">
                        <h3>
                            <i class="bi bi-eye-fill"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-info" onclick="showMaterials(${row.id_requisicion}, 2)">
                        <h3>
                            <i class="bi bi-pencil-fill"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="openDelete(${row.id_requisicion})">
                        <h3>
                            <i class="bi bi-trash-fill"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-success" onclick="approveRequisicion(${row.id_requisicion})">
                        <h3>
                            <i class="bi bi-check-lg"></i>
                        </h3>
                    </button>
                    <button type="button" class="btn btn-primary disabled" onclick="approveRequisicion(${row.id_requisicion})">
                        <h3>
                            <i class='bi bi-filetype-pdf'></i>
                        </h3>
                    </button>
                </td>
            </tr>`;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
};

// *función asíncrona para llenar la tabla con los registros 
const showMaterials = async (id, botones) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = '';
    MODAL_DATE.innerHTML = '';
    TABLE_COLUMNS.innerHTML = ``;
    // se comprueba que la acción que se desea realizar (visualizar o editar)
    switch (botones) {
        case 1:
            TABLE_COLUMNS.innerHTML = `
            <th>MATERIAL</th>
            <th>CANTIDAD</th>
            `;
            break;
        case 2:
            TABLE_COLUMNS.innerHTML = `
            <th>MATERIAL</th>
            <th>CANTIDAD</th>
            <th>ACCIONES</th>
            `;
            break;
        default:
            break;
    }
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
    if (DATA.status) {

        SAVE_MODAL.show();
        switch (botones) {
            case 1:
                // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                DATA.dataset.forEach(row => {

                    MODAL_DATE.innerHTML = row.ultima_fecha_requisicion;
                    MODAL_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total}</td>
                </tr>
            `;
                });
                break;
            case 2:
                // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                DATA.dataset.forEach(row => {

                    MODAL_DATE.innerHTML = row.ultima_fecha_requisicion;
                    MODAL_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.id_detalle_requisicion}, ${row.cantidad_total})">
                            <h3>
                                <i class="bi bi-plus-slash-minus"></i>
                            </h3>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDeleteMaterial(${row.id_detalle_requisicion}, ${row.id_requisicion}, 2)">
                            <h3>
                                <i class="bi bi-trash-fill"></i>
                            </h3>
                        </button>
                    </td>
                </tr>
            `;
                });
                break;
            default:
                break;
        }
    } else {
        sweetAlert(4, DATA.error, true);
        SAVE_MODAL.hide();
    }

}

// * función asíncrona para llenar la tabla para alterar la cantidad de
// * materiales de cada requisición
const openUpdate = (id, quantity) => {
    // se oculta el primer modal para darle pase al segundo modal
        SAVE_MODAL.hide();
    if (id == null && quantity == null) {
        console.log('error en un valor null');
    } else {
        // se abre el segundo modal con el contendió
        ITEM_MODAL.show();
        document.getElementById('idDetalle').value =id;
        document.getElementById('cantidadMaterial').value =quantity;
    }
}

/*
*   Función asíncrona para mostrar un mensaje de confirmación al momento de eliminar un material de la requisición.
*   Parámetros: id (identificador del material).
*   Retorno: ninguno.
*/
async function openDeleteMaterial(idDetalle, idRequisicion, botones) {
    const RESPONSE = await confirmAction('¿Está seguro de remover el material?');
    if (RESPONSE) {
        const FORM = new FormData();
        FORM.append('idDetalle', idDetalle);
        const DATA = await fetchData(REQUISICION_API, 'deleteMaterial', FORM);
        if (DATA.status) {
            await sweetAlert(1, DATA.message, true);
            // Vuelve a mostrar los materiales actualizados en el modal
            showMaterials(idRequisicion, botones);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}