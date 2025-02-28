<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_dupla.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $duplas = new DuplaData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        // ? se compara la acción del administrador con la session iniciada
        switch ($_GET['action']) {
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$duplas->setNombre($_POST['nombreDupla']) or
                    !$duplas->setTelefono($_POST['telefonoDupla']) or
                    !$duplas->setEmpleado1($_POST['duplaEmpleado1']) or
                    !$duplas->setEmpleado2($_POST['duplaEmpleado2'])
                ) {
                    $result['error'] = $duplas->getDataError();
                } elseif ($duplas->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cable creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el cable';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $duplas->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen duplas registrados';
                }
                break;
            case 'deleteRow':
                if (
                    !$duplas->setId($_POST['idDupla'])
                ) {
                    $result['error'] = $duplas->getDataError();
                } elseif ($duplas->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Dupla eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la dupla';
                }
                break;
            case 'readOne':
                if (!$duplas->setId(['idDupla'])) {
                    $result['error'] = $duplas->getDataError();
                } elseif ($result['dataset'] = $duplas->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Dupla inexistente';
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
