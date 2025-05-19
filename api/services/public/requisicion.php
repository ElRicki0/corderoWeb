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
    if (isset($_SESSION['idDupla'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            case 'createDetail':
                $_POST = Validator::validateForm($_POST);
                if (!$requisicion->startRequisicion()) {
                    $result['error'] = 'Ocurrió un problema al iniciar la requisición';
                } elseif (
                    !$requisicion->setMaterial($_POST['idMaterial']) or
                    !$requisicion->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->createDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material agregado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al agregar el material';
                }
                break;
            // Acción para obtener los productos agregados en el carrito de compras.
            case 'readDetail':
                if (!$requisicion->getRequisicion()) {
                    $result['error'] = 'No ha agregado materiales a la requisición';
                } elseif ($result['dataset'] = $requisicion->readDetail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen materiales en la requisición';
                }
                break;
            // Acción para obtener todas las requisiciones de la dupla.
            case 'readAll':
                if ($result['dataset'] = $requisicion->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen requisiciones registradas';
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
            case 'startRequisicion':
                if ($requisicion->startRequisicion()) {
                    $result['status'] = 1;
                    $result['message'] = 'Requisición iniciada';
                } else {
                    $result['error'] = 'No se pudo iniciar la requisición';
                }
                break;
            // Acción para actualizar la cantidad de un material en el carrito de compras.
            case 'updateDetail':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$requisicion->setIdDetalle($_POST['idDetalle']) or
                    !$requisicion->setCantidad($_POST['cantidadMaterial'])
                ) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->updateDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cantidad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la cantidad';
                }
                break;
            // Acción para remover un material del carrito de compras.
            case 'deleteDetail':
                if (!$requisicion->setIdDetalle($_POST['idDetalle'])) {
                    $result['error'] = $requisicion->getDataError();
                } elseif ($requisicion->deleteDetail()) {
                    $result['status'] = 1;
                    $result['message'] = 'Material removido correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el material';
                }
                break;
            // Acción para finalizar el carrito de compras.
            case 'finishOrder':
                if ($requisicion->finishOrder()) {
                    $result['status'] = 1;
                    $result['message'] = 'requisicion solicitada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al solicitar la requisición';
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
