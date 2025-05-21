<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_requisicion.php');
// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $requisicion = new requisicionData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $requisicion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen requisiciones pendientes...';
                }
                break;
            // acción para leer todo el historial de las  requisiciones realizadas
            case 'readByOrder':
                if (!$requisicion->setIdRequisicion($_POST['idRequisicion'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($result['dataset'] = $requisicion->readByOrder()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Requisición inexistente';
                }
                break;
            // acción para actualizar la cantidad de la solicitud del material
            case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdDetalle($_POST['idDetalle']) or
                    !$requisicion->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->updateQuantity()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }

                break;
            case 'deleteMaterial':
                if (!$requisicion->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->deleteMaterial()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material removido correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el material';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible';
        }
    } else {
        print(json_encode('Acceso denegado'));
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
