<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class EmpleadoHandler
{
    // ? declaración de variables de la base ded datos
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $dui = null;
    protected $telefono = null;
    protected $actualizacion = null;
    protected $imagen = null;
    protected $departamento = null;
    protected $municipio = null;

    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    public function getActualizacion()
    {
        return $this->actualizacion;
    }

    const RUTA_IMAGEN = '../../images/empleados/';


    /*
     *  Métodos para gestionar la cuenta del empleado.
     */
    // public function checkUser($username, $password)
    // {
    //     $sql = 'SELECT `id_empleado`, `correo_empleado`,`clave_empleado` FROM `tb_empleados` WHERE `correo_empleado` =?';
    //     $params = array($username);
    //     if (!($data = Database::getRow($sql, $params))) {
    //         return false;
    //     } elseif (password_verify($password, $data['clave_empleado'])) {
    //         $_SESSION['idEmpleado'] = $data['id_empleado'];
    //         $_SESSION['correoEmpleado'] = $data['correo_empleado'];
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // * validación para comprobar si la contraseña es correcta
    // public function checkPassword($password)
    // {
    //     $sql = 'SELECT clave_empleado
    //             FROM tb_empleados
    //             WHERE id_empleado = ?';
    //     $params = array($_SESSION['idEmpleado']);
    //     if (!($data = Database::getRow($sql, $params))) {
    //         return false;
    //     } elseif (password_verify($password, $data['clave_empleado'])) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    //* métodos SCRUD (search, create, read, update, and delete) para el manejo de variables 

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_empleado`,
                    `departamento_empleado`,
                    `municipio_empleado`,
                    `estado_empleado`
                FROM
                    `tb_empleados`
                WHERE
                    `nombre_empleado` LIKE ? OR 
                    `apellido_empleado` LIKE ? OR 
                    `DUI_empleado` LIKE ? OR 
                    `telefono_empleado` LIKE ? 
        ';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_empleados`(
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->apellido, $this->dui, $this->telefono, $this->imagen, $this->departamento, $this->municipio, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT
                    e.`id_empleado`,
                    e.`nombre_empleado`,
                    e.`apellido_empleado`,
                    e.`DUI_empleado`,
                    e.`telefono_personal_empleado`,
                    e.`imagen_empleado`,
                    e.`departamento_trabajo_empleado`,
                    e.`municipio_trabajo_empleado`,
                    e.`fecha_actualizacion_empleado`,
                    CASE 
                        WHEN d1.id_empleado1 IS NOT NULL OR d2.id_empleado2 IS NOT NULL THEN 1
                        ELSE 0
                    END AS `empleado_agregado`
                FROM
                    `tb_empleados` e
                LEFT JOIN
                    `tb_duplas` d1 ON e.`id_empleado` = d1.`id_empleado1`
                LEFT JOIN
                    `tb_duplas` d2 ON e.`id_empleado` = d2.`id_empleado2`
                GROUP BY
                    e.`id_empleado`';
        return Database::getRows($sql);
    }

    public function readByName()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `nombre_empleado`;';
        return Database::getRows($sql);
    }

    public function readByNameDesc()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `nombre_empleado` DESC';
        return Database::getRows($sql);
    }

    public function readByModify()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados
                ORDER BY
                    `fecha_actualizacion_empleado` DESC';
        return Database::getRows($sql);
    }
    // ! TERMINAR ESTO CON DUPLAS
    // public function readByInformation()
    // {
    //     $sql = 'SELECT
    //                 e.id_empleado,
    //                 e.nombre_empleado,
    //                 e.apellido_empleado,
    //                 e.DUI_empleado,
    //                 e.telefono_personal_empleado,
    //                 e.imagen_empleado,
    //                 e.fecha_actualizacion_empleado,
    //                 CASE WHEN t.id_empleado IS NOT NULL THEN 1 ELSE 0
    //             END AS empleado_agregado,
    //             COALESCE(t.estado_trabajo_empleado, 0) AS estado_trabajo_empleado
    //             FROM
    //                 tb_empleados e
    //             LEFT JOIN tb_trabajo_empleado t ON
    //                 e.id_empleado = t.id_empleado
    //             WHERE
    //                 t.id_empleado IS NOT NULL; -- Filtra solo los empleados agregados';
    //     return Database::getRows($sql);
    // }

    // public function readByNoInformation()
    // {
    //     $sql = 'SELECT
    //                 e.id_empleado,
    //                 e.nombre_empleado,
    //                 e.apellido_empleado,
    //                 e.DUI_empleado,
    //                 e.telefono_personal_empleado,
    //                 e.imagen_empleado,
    //                 e.fecha_actualizacion_empleado,
    //                 CASE WHEN t.id_empleado IS NOT NULL THEN 1 ELSE 0
    //             END AS empleado_agregado,
    //             COALESCE(t.estado_trabajo_empleado, 0) AS estado_trabajo_empleado
    //             FROM
    //                 tb_empleados e
    //             LEFT JOIN tb_trabajo_empleado t ON
    //                 e.id_empleado = t.id_empleado
    //             WHERE
    //                 t.id_empleado IS NULL; -- Filtra solo los empleados agregados';
    //     return Database::getRows($sql);
    // }

    public function readFilename()
    {
        $sql = 'SELECT
                    `imagen_empleado`
                FROM
                    `tb_empleados`
                WHERE
                    `id_empleado` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    `id_empleado`,
                    `nombre_empleado`,
                    `apellido_empleado`,
                    `DUI_empleado`,
                    `telefono_personal_empleado`,
                    `imagen_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_empleado`
                FROM
                    `tb_empleados`
                WHERE `id_empleado` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_empleados`
                SET
                    `nombre_empleado` = ?,
                    `apellido_empleado` = ?,
                    `DUI_empleado` = ?,
                    `telefono_personal_empleado` = ?,
                    `imagen_empleado` = ?,
                    `departamento_trabajo_empleado` = ?,
                    `municipio_trabajo_empleado` = ?,
                    `fecha_actualizacion_empleado` = ?
                WHERE
                    `id_empleado` = ?';
        $params = array($this->nombre, $this->apellido, $this->dui, $this->telefono, $this->imagen, $this->departamento, $this->municipio, $this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = '  DELETE FROM `tb_empleados` 
                WHERE `id_empleado` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
