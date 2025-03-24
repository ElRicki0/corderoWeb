<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_info_trabajo.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $trabajo = new InfoTrabajoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador']) or true) {
        //? se realiza una acción cuando el administrador tiene la sesión iniciada
        switch ($_GET['action']) {
            // ? acciones de servidor para administrador
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $trabajo->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $trabajo->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByName':
                if ($result['dataset'] = $trabajo->readByName()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByNameDesc':
                if ($result['dataset'] = $trabajo->readByNameDesc()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByModify':
                if ($result['dataset'] = $trabajo->readByModify()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByActive':
                if ($result['dataset'] = $trabajo->readByActive()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByInactive':
                if ($result['dataset'] = $trabajo->readByInactive()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$trabajo->setDepartamento($_POST['departamentoTrabajo']) or
                    !$trabajo->setMunicipio($_POST['municipioTrabajo']) or
                    !$trabajo->setEmpleado($_POST['empleadoTrabajo']) or
                    !$trabajo->setEstado(isset($_POST['estadoTrabajo']) ? 1 : 0)
                ) {
                    $result['error'] = $trabajo->getDataError();
                } elseif ($trabajo->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la información';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$trabajo->setId($_POST['idTrabajo']) or
                    !$trabajo->setDepartamento($_POST['departamentoTrabajo']) or
                    !$trabajo->setMunicipio($_POST['municipioTrabajo']) or
                    !$trabajo->setEmpleado($_POST['empleadoTrabajo']) or
                    !$trabajo->setEstado(isset($_POST['estadoTrabajo']) ? 1 : 0)
                ) {
                    $result['error'] = $trabajo->getDataError();
                } elseif ($trabajo->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información actualizada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al editar la información';
                }
                break;
            case 'updateStatus':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$trabajo->setId($_POST['idTrabajo'])
                ) {
                    $result['error'] = $trabajo->getDataError();
                } elseif ($trabajo->updateStatus()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado actualizado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al actualizar el estado';
                }
                break;
            case 'readOne':
                if (!$trabajo->setId($_POST['idTrabajo'])) {
                    $result['error'] = $trabajo->getDataError();
                } elseif ($result['dataset'] = $trabajo->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Información inexistente';
                }
                break;
            case 'readByActive5':
                if ($result['dataset'] = $trabajo->readByActive5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;
            case 'readByInactive5':
                if ($result['dataset'] = $trabajo->readByInactive5()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen información registrada';
                }
                break;

            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
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
    print(json_encode('Recurso no disponible'));
}
