<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class TrabajoDuplaHandler
{
    // ? declaración de variables de la base ded datos
    protected $id = null;
    protected $latitudInicio = null;
    protected $longitudInicio = null;
    protected $horaInicio = null;
    protected $latitudFinal = null;
    protected $longitudFinal = null;
    protected $horaFinal = null;
    protected $estado = null;
    protected $dupla = null;
    protected $actualizacion = null;
    // protected $estado = null;

    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    public function getActualizacion()
    {
        return $this->actualizacion;
    }

    const RUTA_IMAGEN = '../../images/empleados/';

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
        $sql = 'INSERT INTO `tb_trabajo_duplas`(
                    `estado_trabajo_dupla`,
                    `id_dupla`,
                    `fecha_actualizacion_trabajo_dupla`
                )
                VALUES(
                    0,
                    ?,
                    ?
                )';
        $params = array($_SESSION['idDupla'], $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readInformation()
    {
        $sql = 'SELECT
                    `id_trabajo_dupla`,
                    `estado_trabajo_dupla`
                FROM
                    `tb_trabajo_duplas` tdp
                INNER JOIN tb_duplas dp ON
                    tdp.id_dupla = dp.id_dupla
                WHERE
                    dp.id_dupla = ?';
        $params = array($_SESSION['idDupla']);
        return Database::getRows($sql, $params);
    }

    public function readAll()
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
                    `tb_empleados`';
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
    // }eturn Database::executeRow($sql, $params);

    public function startWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_duplas`
                SET
                    `latitud_inicio_trabajo_dupla` = ?,
                    `longitud_inicio_trabajo_dupla` = ?,
                    `hora_inicio_trabajo_dupla` = ?,
                    `estado_trabajo_dupla` = 1
                WHERE
                `id_trabajo_dupla` = ?';
        $params = array($this->latitudInicio, $this->longitudInicio, $this->horaInicio, $_SESSION['idDupla']);
        return Database::executeRow($sql, $params);
    }

    public function endWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_duplas`
                SET
                    `latitud_final_trabajo_dupla` = ?,
                    `longitud_final_trabajo_dupla` = ?,
                    `hora_final_trabajo_dupla` = ?,
                    `estado_trabajo_dupla` = 0
                WHERE
                    `id_trabajo_dupla` = ?';
        $params = array($this->latitudFinal, $this->longitudFinal, $this->horaFinal, $_SESSION['idDupla']);
        return Database::executeRow($sql, $params);
    }
}
