<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_administrador.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $administrador = new AdministradorData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $administrador->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['correoAdministrador'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['correoAdministrador'];
                } else {
                    $result['error'] = 'Correo de administrador indefinido';
                }
                break;
            case 'readAllOne':
                // ? lectura de la tabla de administradores 
                if ($result['dataset'] = $administrador->readAllOne()) {
                    // ? si hay uno o mas datos se actualiza el estado y el mensaje
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros actualmente';
                }
                break;
            case 'readByName':
                // ? lectura de la tabla de administradores 
                if ($result['dataset'] = $administrador->readByName()) {
                    // ? si hay uno o mas datos se actualiza el estado y el mensaje
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros actualmente';
                }
                break;
            case 'readByEmail':
                // ? lectura de la tabla de administradores 
                if ($result['dataset'] = $administrador->readByEmail()) {
                    // ? si hay uno o mas datos se actualiza el estado y el mensaje
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros actualmente';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $administrador->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setTelefono($_POST['telefonoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setClave($_POST['claveAdmin']) or
                    !$administrador->setImagen($_FILES['imagenAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['claveAdmin'] != $_POST['claveAdmin2']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenAdministrador'], $administrador::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'error al registrar al administrador';
                }
                break;
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $administrador->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setTelefono($_POST['telefonoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setImagen($_FILES['imagenAdministrador'], $administrador->getFilename())
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador editado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenAdmin'], $administrador::RUTA_IMAGEN, $administrador->getFilename());
                } else {
                    $result['error'] = 'error al registrar al administrador';
                }
                break;
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$administrador->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$administrador->setClave($_POST['claveNueva'])) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            default:
                $result['error'] = 'acción no disponible dentro de la session';
                break;
        }
    } else {
        //? se realiza una acción cuando el administrador no tiene la sesión iniciada
        switch ($_GET['action']) {
            case 'readUsers':
                if ($administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombreAdmin']) or
                    !$administrador->setApellido($_POST['apellidoAdmin']) or
                    !$administrador->setTelefono($_POST['telefonoAdmin']) or
                    !$administrador->setCorreo($_POST['correoAdmin']) or
                    !$administrador->setClave($_POST['claveAdmin']) or
                    !$administrador->setImagen($_FILES['imagenAdmin'])

                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['claveAdmin'] != $_POST['claveAdmin2']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenAdmin'], $administrador::RUTA_IMAGEN);
                } else {
                    $result['error'] =  'Ocurrió un problema al registrar el administrador';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if ($administrador->checkUser($_POST['correoAdmin'], $_POST['claveAdmin'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'Credenciales incorrectas';
                }
                break;
            default:
                $result['error'] = 'acción no disponible fuera de la session';
                break;
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
