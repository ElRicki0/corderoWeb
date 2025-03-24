const CABLES_API = 'services/admin/cables.php'
const INFO_EMPLEADOS_API = 'services/admin/info_empleado.php'

// ? variables para mostrar a los últimos empleados que iniciaron y terminaron una jornada laboral
const JORNADAS_EMPLEADOS = document.getElementById('jornadasEmpleados'),
    INICIO_BOTON = document.getElementById('inicioBoton'),
    FINALIZACION_BOTON = document.getElementById('finalizacionBoton');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    MAIN_TITLE.textContent = 'Pagina principal';
    // Llamada a la función para mostrar el encabezado y bar del documento.
    loadTemplate();
    graficoBarrasCategorias();
    graficoPastelCategorias();
    graficoPastelestadosRollos();
});

/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasCategorias = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(CABLES_API, 'cantidadRollosCategoria');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let categorias = [];
        let cantidades = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            categorias.push(row.nombre_categoria_cable);
            cantidades.push(row.total_rollos);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        pieGraph('grafica1', categorias, cantidades, 'Cantidad de categorías', 'Cantidad de rollos por categoría');
    } else {
        document.getElementById('ContanidoCable1').remove();
        console.log(DATA.error);
    }
}

/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/

const graficoPastelestadosRollos = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(CABLES_API, 'estadoRolloscables');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let estados = [];
        let cantidad = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            estados.push(row.estado);
            cantidad.push(row.cantidad);
        });
        // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
        barGraph('grafica3', estados, cantidad, 'Estados por cables');
    } else {
        document.getElementById('ContanidoCable2').remove();
        console.log(DATA.error);
    }
}

/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/

const graficoPastelCategorias = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(CABLES_API, 'estadoCantidadesCables');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let Estados = [];
        let Porcentajes = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            Estados.push(row.estado_cables);
            Porcentajes.push(row.cantidad);
        });
        // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
        barGraph('grafica2', Estados, Porcentajes, 'Porcentaje de longitudes por cable');
    } else {
        document.getElementById('ContanidoCable3').remove();
        console.log(DATA.error);
    }
}

// *   función asíncrona para mostrar los últimos 5 inicios de jornada laboral o las finalizaciones.
// *   Parámetros: ninguno.
// *   Retorno: ninguno.
const inicioJornadas = async () => {
    JORNADAS_EMPLEADOS.innerHTML = '';
    INICIO_BOTON.classList.add('disabled');
    FINALIZACION_BOTON.classList.remove('disabled');
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(INFO_EMPLEADOS_API, 'readByActive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            (parseInt(row.estado_producto)) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#empleadoInformacion${row.id_trabajo_empleado}" aria-expanded="false"
                            aria-controls="empleadoInformacion${row.id_trabajo_empleado}">
                            ${row.nombre_empleado} ${row.apellido_empleado}
                        </button>
                    </h2>
                    <div id="empleadoInformacion${row.id_trabajo_empleado}" class="accordion-collapse collapse"
                        data-bs-parent="#jornadasEmpleados">
                        <div class="accordion-body">
                            <button type="button" class="btn btn-info"><h5>Mostrar ubicación</h5></button>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

const finalizacionJornadas = async () => {
    JORNADAS_EMPLEADOS.innerHTML = '';
    FINALIZACION_BOTON.classList.add('disabled');
    INICIO_BOTON.classList.remove('disabled');
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(INFO_EMPLEADOS_API, 'readByInactive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece un icono para el estado del producto.
            (parseInt(row.estado_producto)) ? icon = 'bi bi-eye-fill' : icon = 'bi bi-eye-slash-fill';
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne" aria-expanded="false"
                            aria-controls="flush-collapseOne">
                            Accordion Item #1
                        </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">Placeholder content for this accordion, which is intended to
                            demonstrate the <code>.accordion-flush</code> class. This is the first item's
                            accordion body.</div>
                    </div>
                </div>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}