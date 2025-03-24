<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class InfoTrabajoHandler
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
    protected $departamento = null;
    protected $municipio = null;
    protected $actualizacion = null;
    protected $empleado = null;

    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    public function getActualizacion()
    {
        return $this->actualizacion;
    }

    //* métodos SCRUD (search, create, read, update, and delete) para el manejo de variables 
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado    
                    WHERE e.nombre_empleado LIKE ? OR e.apellido_empleado LIKE ? OR e.correo_empleado LIKE ?';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_trabajo_empleado`(
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `id_empleado`,
                    `fecha_actualizacion_trabajo_empleado`
                )
                VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?)';
        $params = array($this->estado, $this->departamento, $this->municipio, $this->empleado, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado';
        return Database::getRows($sql);
    }

    public function readByName()
    {
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado ORDER BY e.nombre_empleado';
        return Database::getRows($sql);
    }

    public function readByNameDesc()
    {
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado ORDER BY e.nombre_empleado DESC';
        return Database::getRows($sql);
    }

    public function readByModify()
    {
        $sql = '  SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado
                ORDER BY
                    fecha_actualizacion_trabajo_empleado DESC;';
        return Database::getRows($sql);
    }

    public function readByActive()
    {
        $sql = '  SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado
                WHERE `estado_trabajo_empleado` = 1';
        return Database::getRows($sql);
    }

    public function readByInactive()
    {
        $sql = '  SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado
                WHERE `estado_trabajo_empleado` = 0';
        return Database::getRows($sql);
    }

    public function readByActive5()
    {
        $sql = '  SELECT
                    `id_trabajo_empleado`,
                    `latitud_inicio_trabajo_empleado`,
                    `longitud_inicio_trabajo_empleado`,
                    `hora_inicio_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado
                ORDER BY `hora_inicio_trabajo_empleado` DESC  -- Ordena por hora de finalización (más recientes primero)
                LIMIT 5';
        return Database::getRows($sql);
    }

    public function readByInactive5()
    {
        $sql = '  SELECT
                    `id_trabajo_empleado`,
                    `latitud_final_trabajo_empleado`,
                    `longitud_final_trabajo_empleado`,
                    `hora_final_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `fecha_actualizacion_trabajo_empleado`,
                    e.nombre_empleado,
                    e.apellido_empleado,
                    e.correo_empleado,
                    e.imagen_empleado
                FROM
                    `tb_trabajo_empleado` te
                INNER JOIN tb_empleados e ON
                    te.id_empleado = e.id_empleado
                ORDER BY `hora_final_trabajo_empleado` DESC  -- Ordena por hora de finalización (más recientes primero)
                LIMIT 5';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    `estado_trabajo_empleado`,
                    `departamento_trabajo_empleado`,
                    `municipio_trabajo_empleado`,
                    `id_empleado`
                FROM
                    `tb_trabajo_empleado`
                WHERE
                    `id_trabajo_empleado` = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readInformation()
    {
        $sql = 'SELECT
                    `id_trabajo_empleado`,
                    `estado_trabajo_empleado`
                FROM
                    `tb_trabajo_empleado`
                WHERE `id_empleado` = ?';
        $params = array($_SESSION['idEmpleado']);
        return Database::getRows($sql, $params);
    }

    public function updateRow()
    {
        $sql = '  UPDATE
                    `tb_trabajo_empleado`
                SET
                    `estado_trabajo_empleado` = ? ,
                    `departamento_trabajo_empleado` = ? ,
                    `municipio_trabajo_empleado` = ? ,
                    `fecha_actualizacion_trabajo_empleado` = ?
                WHERE
                    `id_trabajo_empleado` = ? ';
        $params = array($this->estado, $this->departamento, $this->municipio, $this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updateStatus()
    {
        $sql = '  UPDATE `tb_trabajo_empleado`
                    SET `estado_trabajo_empleado` = CASE 
                        WHEN `estado_trabajo_empleado` = 0 THEN 1 
                        WHEN `estado_trabajo_empleado` = 1 THEN 0 
                        ELSE `estado_trabajo_empleado` -- No cambia si es otro valor
                    END,
                    `fecha_actualizacion_trabajo_empleado` = ?
                    WHERE `id_trabajo_empleado` = ?;';
        $params = array($this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM `tb_trabajo_empleado` WHERE `id_trabajo_empleado`= ? ';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // ? métodos necesarios para el apartado public 

    public function startWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_empleado`
                SET
                    `latitud_inicio_trabajo_empleado` = ?,
                    `longitud_inicio_trabajo_empleado` = ?,
                    `hora_inicio_trabajo_empleado` = ?,
                    `estado_trabajo_empleado` = 1
                WHERE
                    `id_trabajo_empleado` = ?';
        $params = array($this->latitudInicio, $this->longitudInicio, $this->horaInicio, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function endWork()
    {
        $sql = 'UPDATE
                    `tb_trabajo_empleado`
                SET
                    `latitud_final_trabajo_empleado` = ?,
                    `longitud_final_trabajo_empleado` = ?,
                    `hora_final_trabajo_empleado` = ?,
                    `estado_trabajo_empleado` = 0
                WHERE
                    `id_trabajo_empleado` = ?';
        $params = array($this->latitudFinal, $this->longitudFinal, $this->horaFinal, $this->id);
        return Database::executeRow($sql, $params);
    }
}
