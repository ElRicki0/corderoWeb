<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_cables.php');

//? Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    //? Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    //? Se instancia la clase correspondiente.
    $cable = new CableData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        // ? se compara la acción del administrador con la session iniciada
        switch ($_GET['action']) {
            case  'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $cable->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;

            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cable->setNombre($_POST['nombreCable']) or
                    !$cable->setDescripcion($_POST['descripcionCable']) or
                    !$cable->setLongitud($_POST['longitudCable']) or
                    !$cable->setCategoria($_POST['categoriaCable']) or
                    !$cable->setEstado($_POST['estadoCable'])
                ) {
                    $result['error'] = $cable->getDataError();
                } elseif ($cable->CreateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el cable';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $cable->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readOne':
                if (!$cable->setId($_POST['idCable'])) {
                    $result['error'] = $cable->getDataError();
                } elseif ($result['dataset'] = $cable->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cable inexistente';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
