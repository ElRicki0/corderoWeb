<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_trabajo_dupla.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $trabajoDP = new TrabajoDuplaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idDupla'])) {
        //? se realiza una acción cuando el administrador tiene la sesión iniciada
        switch ($_GET['action']) {
            // ?acciones para las pantallas para empleado
            case 'startWork':
                // echo($_POST['latitudInicio']);
                // die;
                if (
                    !$trabajoDP->setLatitudInicio($_POST['latitud']) or
                    !$trabajoDP->setLongitudInicio($_POST['longitud'])
                ) {
                    $result['error'] = $trabajoDP->getDataError();
                } elseif ($trabajoDP->startWork()) {
                    $result['status'] = 1;
                    $result['message'] = 'jornada laboral iniciada con éxito';
                } else {
                    $result['error'] = 'ERROR #110 / consulte con un administrador para solucionar el problema';
                }
                break;
            case 'endWork':
            if (    
                !$trabajoDP->setLatitudFinal($_POST['latitud']) or
                !$trabajoDP->setLongitudFinal($_POST['longitud'])
            ) {
                $result['error'] = $trabajoDP->getDataError();
            } elseif ($trabajoDP->endWork()) {
                $result['status'] = 1;
                $result['message'] = 'jornada laboral terminada con éxito';
            } else {
                $result['error'] = 'ERROR #120 / consulte con un administrador para solucionar el problema';
            }
            break;
            case 'readInformation':
                if ($result['dataset'] = $trabajoDP->readInformation()) {
                    $result['status'] = 1;
                    $result['message'] = 'Información conseguida con éxito';
                } else {
                    $result['error'] = 'No existe información registrada';
                }
                break;
            case 'createRow':
                if ($trabajoDP->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Dupla configurada con éxito';
                    // Se asigna el estado del archivo después de insertar.e
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
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
