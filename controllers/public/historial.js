// ? Constante para el uso de las APIs
const REQUISICION_API = 'services/public/requisicion.php';

// constante de modals
const SHOWMODAL = new bootstrap.Modal('#showModal');

// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    MODAL_BODY = document.getElementById('modalTableBody');

document.addEventListener('DOMContentLoaded', function () {
    // metodo para cargar el encabezado y el footer
    loadTemplate();
    MAIN_TITLE.innerHTML = 'Historial de Requisiciones';
    // Se carga el detalle del carrito de compras.
    ShowDetails();
});

const ShowDetails = async () => {
    // peticion para obtener los datos de todos los pedidos
    const DATA = await fetchData(REQUISICION_API, 'readAllDupla');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el cuerpo de la tabla.
        TABLE_BODY.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            let STATE = '';
            switch (row.estado_requisicion) {
                case 'Pendiente':
                    STATE = "warning'>Pendiente";
                    break;
                case 'Procesando':
                    STATE = "success'>Procesando";
                    break;
                case 'Aprobada':
                    STATE = "primary'>Aprobada";
                    break;
                case 'Entregada':
                    STATE = "text-info'>Entregada";
                    break;
                default:
                    break;
            }
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.usuario_dupla}</td>
                    <td class='text-${STATE}</td>
                    <td>${row.fecha_requisicion}</td>
                    <td>
                        <!-- Botón grande -->
                        <button class="btn btn-primary" onclick="showMaterials(${row.id_requisicion})">
                            Ver Detalles
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        TABLE_BODY.innerHTML = `
        <div class="col-5    justify-content-center align-items-center">
            <img src="../../resources/images/error/404iNFORMACION.png" class="card-img-top" alt="ERROR CARGAR IMAGEN">
        </div>
        `;
        // Se muestra un mensaje de error.
        sweetAlert(2, DATA.error, false);
    }
};

const showMaterials = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idRequisicion', id);
    // se inicializa la tabla de materiales
    MODAL_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(REQUISICION_API, 'readByOrder', FORM);
    if (DATA.status) {
        SHOWMODAL.show();
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            MODAL_BODY.innerHTML += `
                <tr>                    
                    <td>${row.nombre_material}</td>
                    <td>${row.cantidad_total}</td>
                </tr>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
        SHOWMODAL.hide();
    }
}