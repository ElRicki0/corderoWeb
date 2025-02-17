const CABLES_API = 'services/admin/cables.php'

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