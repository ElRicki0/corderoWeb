<?php
// Se incluye la clase del modelo.
require_once('../../models/data/data_empleado.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $empleado = new EmpleadoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null, 'fileStatus' => null);
    
    if (isset($_SESSION['idAdministrador'])) {
        //? se realiza una acción cuando el administrador tiene la sesión iniciada
        switch ($_GET['action']) {
            case 'readAll':
                // ? lectura de la tabla de empleados 
                if ($result['dataset'] = $empleado->readAll()) {
                    // ? si hay uno o mas datos se actualiza el estado y el mensaje
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros actualmente';
                }
                break;

            default:
                # code...
                break;
        }
    } else {
        //? se realiza una acción cuando el administrador ni el empleado tiene la sesión iniciada
        switch ($_GET['action']) {
            case '':
                # code...
                break;

            default:
                # code...
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
