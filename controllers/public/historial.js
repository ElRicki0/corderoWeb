// ? Constante para el uso de las APIs
const REQUISICION_API = 'services/public/requisicion.php';

// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody');

document.addEventListener('DOMContentLoaded', function () {
// metodo para cargar el encabezado y el footer
    loadTemplate();
    MAIN_TITLE.innerHTML = 'Historial de Requisiciones';
    // Se carga el detalle del carrito de compras.
    ShowDetails();
});

const ShowDetails = async () => {
    // peticion para obtener los datos de todos los pedidos
    const DATA = await fetchData(REQUISICION_API, 'readAll');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el cuerpo de la tabla.
        TABLE_BODY.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.usuario_dupla}</td>
                    <td>${row.estado_requisicion}</td>
                    <td>${row.fecha_requisicion}</td>
                    <td>
                        <!-- Botón grande -->
                        <button class="btn btn-primary" onclick="showDetails(${row.id_requisicion})">
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