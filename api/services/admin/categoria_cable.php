<?php
// ? se incluye la clase del modelo
require_once('../../models/data/data_categoria_cable.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $categoria_cable = new CableCategoriaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $categoria_cable->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$categoria_cable->setNombre($_POST['nombreCategoria']) or
                    !$categoria_cable->setDescripcion($_POST['descripcionCategoria']) or
                    !$categoria_cable->setImagen($_FILES['imagenCategoria'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($categoria_cable->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'categoría creada correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenCategoria'], $categoria_cable::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $categoria_cable->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen categorías registradas';
                }
                break;
            case 'readOne':
                if (!$categoria_cable->setId($_POST['idCategoriaCable'])) {
                    $result['error'] = $categoria_cable->getDataError();
                } elseif ($result['dataset'] = $categoria_cable->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Categoría inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$categoria_cable->setId($_POST['idCategoriaCable']) or
                    !$categoria_cable->setFilename() or
                    !$categoria_cable->setNombre($_POST['nombreCategoria']) or
                    !$categoria_cable->setDescripcion($_POST['descripcionCategoria']) or
                    !$categoria_cable->setImagen($_FILES['imagenCategoria'], $categoria_cable->getFilename())
                ) {
                    $result['error'] = $categoria_cable->getDataError();
                } elseif ($categoria_cable->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Categoría modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenCategoria'], $categoria_cable::RUTA_IMAGEN, $categoria_cable->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la categoria';
                }
                break;
            case 'deleteRow':
                if (
                    !$categoria_cable->setId($_POST['idCategoriaCable']) or
                    !$categoria_cable->setFilename()
                ) {
                    $result['error'] = $categoria_cable->getDataError();
                } elseif ($categoria_cable->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Categoría eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($categoria_cable::RUTA_IMAGEN, $categoria_cable->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la categoria';
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
    }else {
        print(json_encode('Acceso denegado'));
    }
}else {
    print(json_encode('Recurso no disponible'));
}
