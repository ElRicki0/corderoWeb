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
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null);
    // $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null, 'fileStatus' => null);
    // ? se verifica si hay un session iniciada como administrador, de lo contrario el código termina con un error
    if (isset($_SESSION['idAdministrador'])) {
        //? se realiza una acción cuando el administrador tiene la sesión iniciada
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $empleado->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen empleados registrados';
                }
                break;
            case 'readOne':
                if (!$empleado->setId($_POST['idEmpleado'])) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($result['dataset'] = $empleado->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Empleado inexistente';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setDUI($_POST['duiEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado']) or
                    !$empleado->setCorreo($_POST['correoEmpleado']) or
                    !$empleado->setClave($_POST['claveEmpleado']) or
                    !$empleado->setDepartamento($_POST['departamentoEmpleado']) or
                    !$empleado->setMunicipio($_POST['municipioEmpleado']) or
                    !$empleado->setEstado(isset($_POST['estadoEmpleado'])) or
                    !$empleado->setImagen($_FILES['imagenEmpleado'])
                ) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($_POST['claveEmpleado'] != $_POST['claveEmpleado2']) {
                    $result['error'] = 'Claves no validas';
                } elseif ($empleado->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el administrador';
                }
                break;
            case 'deleteRow':
                if (
                    !$empleado->setId($_POST['idEmpleado']) or
                    !$empleado->setFilename()
                ) {
                    $result['error'] = $empleado->getDataError();
                } elseif ($empleado->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un error al eliminar el empleado';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$empleado->setId($_POST['idEmpleado']) or
                    !$empleado->setFilename() or
                    !$empleado->setNombre($_POST['nombreEmpleado']) or
                    !$empleado->setApellido($_POST['apellidoEmpleado']) or
                    !$empleado->setDUI($_POST['duiEmpleado']) or
                    !$empleado->setTelefono($_POST['telefonoEmpleado']) or
                    !$empleado->setCorreo($_POST['correoEmpleado']) or
                    !$empleado->setDepartamento($_POST['departamentoEmpleado']) or
                    !$empleado->setMunicipio($_POST['municipioEmpleado']) or
                    !$empleado->setEstado(isset($_POST['estadoEmpleado'])) or
                    !$empleado->setImagen($_FILES['imagenEmpleado'], $empleado->getFilename())
                ) {
                    $result['error'] =$empleado->getDataError();
                } elseif ($empleado->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Empleado modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenEmpleado'],$empleado::RUTA_IMAGEN,$empleado->getFilename());
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
