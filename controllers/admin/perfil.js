// ? constantes para completar rutas de API
const CABLE_API = 'services/admin/cables.php';

// ? constantes para del conte ido del historial
const CABLE_BODY = document.getElementById('cablesBody');

// ? constantes para poder llenar el formulario del administrador
const PROFILE_FORM = document.getElementById('profileForm'),
    NOMBRE_ADMINISTRADOR = document.getElementById('nombreAdministrador'),
    APELLIDO_ADMINISTRADOR = document.getElementById('apellidoAdministrador'),
    TELEFONO_ADMINISTRADOR = document.getElementById('telefonoAdministrador'),
    USUARIO_ADMINISTRADOR = document.getElementById('usuarioAdministrador'),
    CORREO_ADMINISTRADOR = document.getElementById('correoAdministrador');

// ? método para ejecutar las funciones necesarias caldo la pagina termine de cargar por completo
document.addEventListener('DOMContentLoaded', async () => {
    // ? llama la función para llamar a traer el encabezado del documento
    loadTemplate();
    // ? llama las funciones para cargar el historial
    // fillCables();
    // ? titulo de la pagina
    MAIN_TITLE.textContent = 'Perfil';
    // Petición para obtener los datos del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'readProfile');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
        const ROW = DATA.dataset;
        NOMBRE_ADMINISTRADOR.textContent = ROW.nombre_administrador;
        APELLIDO_ADMINISTRADOR.textContent = ROW.apellido_administrador;
        TELEFONO_ADMINISTRADOR.textContent = ROW.telefono_administrador;
        USUARIO_ADMINISTRADOR.textContent = ROW.usuario_administrador;
        CORREO_ADMINISTRADOR.textContent = ROW.correo_administrador;
    } else {
        sweetAlert(2, DATA.error, null);
    }
})

const fillCables = async (form = null) => {
    // ? se inicia el contenido de la tabla 
    CABLE_BODY.innerHTML = '';
    // ? petición para obtener los datos de la base de datos
    const DATA = await fetchData(CABLE_API, 'readAllOne');
    // ? se comprueba si es satisfactoria la respuesta
    if (DATA.status) {
        
    } else {
        sweetAlert(4, DATA.error, true);
    }
}