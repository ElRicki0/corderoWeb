<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_material.php');
//? Se instancia la clase del modelo.

//? Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    //? Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    //? Se instancia la clase correspondiente.
    $material = new MaterialData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idDupla'])) {
        switch ($_GET['action']) {
            case  'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $material->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $material->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readByCategory1':
                if ($result['dataset'] = $material->readByCategory1()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readByCategory2':
                if ($result['dataset'] = $material->readByCategory2()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readByCategory3':
                if ($result['dataset'] = $material->readByCategory3()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readByCategory4':
                if ($result['dataset'] = $material->readByCategory4()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readByCategory5':
                if ($result['dataset'] = $material->readByCategory5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen  materiales registrados';
                }
                break;
            case 'readOne':
                if (!$material->setId($_POST['idMaterial'])) {
                    $result['error'] = $material->getDataError();
                } elseif ($result['dataset'] = $material->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen un dato';
                } else {
                    $result['error'] = 'Cable inexistente';
                }
                break;
            default:
                $result['error'] = 'acción no disponible adentro de la sesión';
                break;
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
    print(json_encode('Recurso no encontrado'));
}
