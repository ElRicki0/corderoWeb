<?php
//? Se incluye la clase del modelo.
require_once('../../models/data/data_material.php');

//? Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    //? Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    //? Se instancia la clase correspondiente.
    $material = new MaterialData;
    //? Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        // if (isset($_SESSION['idAdministrador'])) {
        // ? se compara la acción del administrador con la session iniciada
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
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$material->setNombre($_POST['nombreMaterial']) or
                    !$material->setDescripcion($_POST['descripcionMaterial']) or
                    !$material->setCategoria($_POST['CategoriaMaterial']) or
                    !$material->setCodigo($_POST['codigoMaterial'])or
                    !$material->setCantidad($_POST['cantidadMaterial']) or
                    !$material->setMinimo($_POST['cantidadMinimaMaterial'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->CreateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar el material';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $material->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readByName':
                if ($result['dataset'] = $material->readByName()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readByLengthDesc':
                if ($result['dataset'] = $material->readByLengthDesc()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readByLengthAsc':
                if ($result['dataset'] = $material->readByLengthAsc()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readByModify':
                if ($result['dataset'] = $material->readByModify()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'readOne':
                if (!$material->setId($_POST['idCable'])) {
                    $result['error'] = $material->getDataError();
                } elseif ($result['dataset'] = $material->readOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen un dato';
                } else {
                    $result['error'] = 'Cable inexistente';
                }
                break;
            case 'readAllOne':
                if ($result['dataset'] = $material->readAllOne()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen cables registrados';
                }
                break;
            case 'cantidadRollosCategoria':
                if ($result['dataset'] = $material->cantidadRollosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'estadoCantidadesCables':
                if ($result['dataset'] = $material->estadoCantidadesCables()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'estadoRolloscables':
                if ($result['dataset'] = $material->estadoRolloscables()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            // case 'updateRow':
            //     $_POST = Validator::validateForm($_POST);
            //     if (
            //         !$material->setId($_POST['idCable']) or
            //         !$material->setNombre($_POST['nombreCable']) or
            //         !$material->setDescripcion($_POST['descripcionCable']) or
            //         !$material->setLongitud($_POST['longitudCable']) or
            //         !$material->setMinimo($_POST['longitudMinimaCable']) or
            //         !$material->setCategoria($_POST['categoriaCable']) or
            //         !$material->setEstado($_POST['estadoCable'])
            //     ) {
            //         $result['error'] = $material->getDataError();
            //     } elseif ($material->UpdateRow()) {
            //         $result['status'] = 1;
            //         $result['message'] = 'Cable editado correctamente';
            //     } else {
            //         $result['error'] = 'Error al editar la unidad';
            //     }
            //     break;
            case 'deleteRow':
                if (
                    !$material->setId($_POST['idCable'])
                ) {
                    $result['error'] = $material->getDataError();
                } elseif ($material->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cable eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el cable';
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
