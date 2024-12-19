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
    IMAGEN_MUESTRA.src = ('../../resources/error/images/404Cable.png');
    // Se prepara el formulario.
    SAVE_FORM.reset();
}