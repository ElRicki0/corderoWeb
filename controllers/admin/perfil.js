// ? constantes para completar rutas de API
const CABLE_API = 'services/admin/cables.php';

// ? constantes para del conte ido del historial
const CABLE_BODY = document.getElementById('cablesBody');

//? constantes para poder mostrar la imagen seleccionada
const IMAGEN_MUESTRA = document.getElementById('imagenMuestra');

// ?constantes para formulario modal
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');

// ? constantes para poder llenar el formulario del administrador
const SAVE_FORM = document.getElementById('saveForm'),
    NOMBRE_ADMINISTRADOR_INFO = document.getElementById('nombreAdministradorInfo'),
    APELLIDO_ADMINISTRADOR_INFO = document.getElementById('apellidoAdministradorInfo'),
    TELEFONO_ADMINISTRADOR_INFO = document.getElementById('telefonoAdministradorInfo'),
    USUARIO_ADMINISTRADOR_INFO = document.getElementById('usuarioAdministradorInfo'),
    IMAGEN_ADMINISTRADOR_INFO = document.getElementById('imagenAdministradorInfo'),
    CORREO_ADMINISTRADOR_INFO = document.getElementById('correoAdministradorInfo');

const ID_ADMINISTRADOR = document.getElementById('idAdministrador'),
    NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdmin'),
    APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdmin'),
    TELEFONO_ADMINISTRADOR = document.getElementById('telefonoAdmin'),
    USUARIO_ADMINISTRADOR = document.getElementById('usuarioAdmin'),
    IMAGEN_ADMINISTRADOR = document.getElementById('imagenAdmin'),
    IMAGEN_VISUAL_ADMINISTRADOR = document.getElementById('imagenVisualAdmin'),
    CORREO_ADMINISTRADOR = document.getElementById('correoAdmin');

// ? Constante para establecer la modal de cambiar contraseña.
const PASSWORD_MODAL = new bootstrap.Modal('#passwordModal');
// ? Constante para establecer el formulario de cambiar contraseña.
const PASSWORD_FORM = document.getElementById('passwordForm');

// ? método para ejecutar las funciones necesarias caldo la pagina termine de cargar por completo
document.addEventListener('DOMContentLoaded', async () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();

    // ? llama las funciones para cargar el historial
    // fillCables();

    // ? llama la función para mostrar los datos del perfil
    showProfile();

    // ? titulo de la pagina
    MAIN_TITLE.textContent = 'Perfil';
})

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

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(USER_API, 'editProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // ? llama la función para mostrar los datos del perfil
        showProfile();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Mètodo del evento para cuando se envía el formulario de cambiar contraseña.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PASSWORD_FORM);
    // Petición para actualizar la constraseña.
    const DATA = await fetchData(USER_API, 'changePassword', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        PASSWORD_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

const openUpdate = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idAdministrador', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USER_API, 'readProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar Perfil';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_ADMINISTRADOR.value = ROW.id_administrador;
        NOMBRE_ADMINISTRADOR.value = ROW.nombre_administrador;
        APELLIDO_ADMINISTRADOR.value = ROW.apellido_administrador;
        TELEFONO_ADMINISTRADOR.value = ROW.telefono_administrador;
        CORREO_ADMINISTRADOR.value = ROW.correo_administrador;
        // IMAGEN_ADMINISTRADOR.src = SERVER_URL.concat('images/admin/', ROW.imagen_administrador);
        // console.log(IMAGEN_ADMINISTRADOR.value);
        // ? llama la función para mostrar los datos del perfil
        showProfile();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openPassword = async (id) => {
    // Se abre la caja de diálogo que contiene el formulario.
    PASSWORD_MODAL.show();
    // Se restauran los elementos del formulario.
    PASSWORD_FORM.reset();
}

const showProfile = async () => {
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        NOMBRE_ADMINISTRADOR_INFO.textContent = ROW.nombre_administrador;
        APELLIDO_ADMINISTRADOR_INFO.textContent = ROW.apellido_administrador;
        TELEFONO_ADMINISTRADOR_INFO.textContent = ROW.telefono_administrador;
        IMAGEN_ADMINISTRADOR_INFO.src = SERVER_URL.concat('images/admin/', ROW.imagen_administrador);
        CORREO_ADMINISTRADOR_INFO.textContent = ROW.correo_administrador;
    } else {
        sweetAlert(2, DATA.error, null);
    }
}