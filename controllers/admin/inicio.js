const CABLES_API = 'services/admin/cables.php'
const TRABAJO_DUPLA_API = 'services/admin/trabajo_dupla.php'

// ? variables para mostrar a los últimos empleados que iniciaron y terminaron una jornada laboral
const JORNADAS_EMPLEADOS = document.getElementById('jornadasEmpleados'),
    INICIO_BOTON = document.getElementById('inicioBoton'),
    FINALIZACION_BOTON = document.getElementById('finalizacionBoton');

// ? variables para mostrar la ubicación de la dupla inicial y final de la dupla
const UBICACION_DUPLA = document.getElementById('ubicacionDupla');

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
* Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
* Parámetros: ninguno.
* Retorno: ninguno.
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
* Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
* Parámetros: ninguno.
* Retorno: ninguno.
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
* Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
* Parámetros: ninguno.
* Retorno: ninguno.
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

// * función asíncrona para mostrar los últimos 5 inicios de jornada laboral o las finalizaciones.
// * Parámetros: ninguno.
// * Retorno: ninguno.
const inicioJornadas = async () => {
    JORNADAS_EMPLEADOS.innerHTML = '';
    INICIO_BOTON.classList.add('disabled');
    FINALIZACION_BOTON.classList.remove('disabled');
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readByActive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#empleadoInformacion${row.id_trabajo_dupla}" aria-expanded="false"
                    aria-controls="empleadoInformacion${row.id_trabajo_dupla}">
                    <h4>CÓDIGO DUPLA: ${row.usuario_dupla}</h4>
                </button>
            </h2>
            <div id="empleadoInformacion${row.id_trabajo_dupla}" class="accordion-collapse collapse"
                data-bs-parent="#jornadasEmpleados">
                <div class="accordion-body">
                    <div class="my-3">
                        <h5 class="text-warning">HORA INICIO</h5>
                        <p>${row.hora_inicio_trabajo_dupla}</p>
                        <h5>Nombre empleado1: </h5>
                        <p>
                            ${row.nombre_empleado1} ${row.apellido_empleado1}
                        </p>
                        <h5>Nombre empleado2: </h5>
                        <p>
                            ${row.nombre_empleado2} ${row.apellido_empleado2}
                        </p>
                    </div>
                    <button type="button" class="btn btn-info" onclick="mostrarInformacion(${row.latitud_inicio_trabajo_dupla}, ${row.longitud_inicio_trabajo_dupla})">
                        <h5>Mostrar ubicación</h5>
                    </button>
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
    const DATA = await fetchData(TRABAJO_DUPLA_API, 'readByInactive5');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            JORNADAS_EMPLEADOS.innerHTML += `
<div class="accordion-item">
    <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#empleadoInformacion${row.id_trabajo_dupla}" aria-expanded="false"
            aria-controls="empleadoInformacion${row.id_trabajo_dupla}">
            <h4>CÓDIGO DUPLA: ${row.usuario_dupla}</h4>
        </button>
    </h2>
    <div id="empleadoInformacion${row.id_trabajo_dupla}" class="accordion-collapse collapse"
            data-bs-parent="#jornadasEmpleados">
            <div class="accordion-body">
                <div class="my-3">
                    <h5 class="text-warning">HORA FINAL</h5>
                    <p>${row.hora_final_trabajo_dupla}</p>

                    <h5>Nombre empleado1: </h5>
                    <p>
                        ${row.nombre_empleado1} ${row.apellido_empleado1}
                    </p>
                    <h5>Nombre empleado2: </h5>
                    <p>
                        ${row.nombre_empleado2} ${row.apellido_empleado2}
                    </p>
                </div>
                <button type="button" class="btn btn-info" onclick="mostrarInformacion(${row.latitud_final_trabajo_dupla}, ${row.longitud_final_trabajo_dupla})">
                    <h5>Mostrar ubicación</h5>
                </button>
            </div>
        </div>
    </div>
`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// ? método para mostrar la ubicacion inicial y final de  
const mostrarInformacion = (latitud, longitud) => {
    if (!latitud || !longitud) {
        console.error("Error: Latitud o longitud no válidas.");
        return;
    }

    UBICACION_DUPLA.innerHTML = `
        <iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=${latitud},${longitud}&hl=es&z=15&output=embed">
        </iframe>
    `;
};
