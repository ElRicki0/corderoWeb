<?php
// se incluye la clase para  trabaja con la base de datos 
require_once('../../helpers/database.php');
// ? clase para controlar el comportamiento de la tabla de la base de datos
class DuplasHandler
{
    // ? declaración de atributos para el manejo de la base de datos  
    protected $id = null;
    protected $nombre = null;
    protected $telefono = null;
    protected $tipo = null;
    protected $empleado1 = null;
    protected $empleado2 = null;
    protected $actualizacion = null;

    public function __construct()
    {
        $this->actualizacion = date('Y-m-d  H:i:s'); // Formato año-mes-día
    }

    public function getActualizacion()
    {
        return $this->actualizacion;
    }

    // ? Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = '  SELECT
                        d.id_dupla,
                        d.nombre_dupla,
                        d.telefono_empresa_dupla,
                        d.id_empleado1, 
                        d.id_empleado2,
                        e1.nombre_empleado AS nombre_empleado1,
                        e1.apellido_empleado AS apellido_empleado1,
                        e1.correo_empleado AS correo_empleado1,
                        e1.estado_empleado AS estado_empleado1,
                        e1.imagen_empleado AS imagen_empleado1,
                        e2.nombre_empleado AS nombre_empleado2,
                        e2.apellido_empleado AS apellido_empleado2,
                        e2.correo_empleado AS correo_empleado2,
                        e2.estado_empleado AS estado_empleado2,
                        e2.imagen_empleado AS imagen_empleado2,
                        CASE
                            WHEN e1.estado_empleado = 0 AND e2.estado_empleado = 0 THEN 0
                            WHEN e1.estado_empleado <> e2.estado_empleado THEN 0
                            WHEN e1.estado_empleado = 1 AND e2.estado_empleado = 1 THEN 1
                            ELSE 0 -- Por defecto, si hay algún caso no cubierto
                        END AS estado_dupla
                    FROM
                        tb_duplas d
                    LEFT JOIN tb_empleados e1 ON
                        d.id_empleado1 = e1.id_empleado
                    LEFT JOIN tb_empleados e2 ON
                        d.id_empleado2 = e2.id_empleado;  
                    WHERE
                        d.nombre_dupla LIKE ? OR
                        d.telefono_empresa_dupla LIKE ? 
                ';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = '  INSERT INTO `tb_duplas`(
                `nombre_dupla`,
                `telefono_empresa_dupla`,
                `tipo_dupla`,   
                `id_empleado1`,
                `id_empleado2`,
                `fecha_actualizacion_dupla`
            )
            VALUES(
                ?,
                ?,
                ?,
                ?,
                ?,
                ?)';
        $params = array($this->nombre, $this->telefono, $this->tipo, $this->empleado1, $this->empleado2, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado';
        return Database::getRows($sql);
    }

    public function readByName()
    {
        $sql = ' SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                ORDER BY d.nombre_dupla';
        return Database::getRows($sql);
    }

    public function readByNameDesc()
    {
        $sql = ' SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                ORDER BY d.nombre_dupla DESC';
        return Database::getRows($sql);
    }

    public function readByModify()
    {
        $sql = ' SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    d.fecha_actualizacion_dupla,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                ORDER BY d.fecha_actualizacion_dupla DESC';
        return Database::getRows($sql);
    }

    public function readByActive()
    {
        $sql = 'SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                WHERE
                    t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1; -- Filtra duplas con estado_dupla = 1';
        return Database::getRows($sql);
    }

    public function readByInactive()
    {
        $sql = 'SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                WHERE
                    (t1.estado_trabajo_empleado = 0 OR t2.estado_trabajo_empleado = 0) -- Filtra duplas con estado_dupla = 0
                    OR (t1.estado_trabajo_empleado IS NULL OR t2.estado_trabajo_empleado IS NULL); -- Incluye casos donde falta registro';
        return Database::getRows($sql);
    }

    public function readByTypePermanent()
    {
        $sql = 'SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    d.fecha_actualizacion_dupla,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                    WHERE tipo_dupla=1';
        return Database::getRows($sql);
    }

    public function readByTypeTemporal()
    {
        $sql = '    SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    d.fecha_actualizacion_dupla,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                    WHERE tipo_dupla=0';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    d.id_dupla,
                    d.nombre_dupla,
                    d.telefono_empresa_dupla,
                    d.id_empleado1,
                    d.id_empleado2,
                    d.tipo_dupla,
                    e1.nombre_empleado AS nombre_empleado1,
                    e1.apellido_empleado AS apellido_empleado1,
                    e1.correo_empleado AS correo_empleado1,
                    e1.imagen_empleado AS imagen_empleado1,
                    t1.estado_trabajo_empleado AS estado_trabajo_empleado1,
                    e2.nombre_empleado AS nombre_empleado2,
                    e2.apellido_empleado AS apellido_empleado2,
                    e2.correo_empleado AS correo_empleado2,
                    e2.imagen_empleado AS imagen_empleado2,
                    t2.estado_trabajo_empleado AS estado_trabajo_empleado2,
                    d.fecha_actualizacion_dupla,
                    CASE
                        WHEN t1.estado_trabajo_empleado = 1 AND t2.estado_trabajo_empleado = 1 THEN 1
                        ELSE 0
                    END AS estado_dupla
                FROM
                    tb_duplas d
                LEFT JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                LEFT JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado
                LEFT JOIN tb_trabajo_empleado t1 ON
                    e1.id_empleado = t1.id_empleado
                LEFT JOIN tb_trabajo_empleado t2 ON
                    e2.id_empleado = t2.id_empleado
                    WHERE d.id_dupla = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_duplas`
                SET
                    `nombre_dupla` = ?,
                    `telefono_empresa_dupla` = ?,
                    `tipo_dupla` = ?,
                    `id_empleado1` = ?,
                    `id_empleado2` = ?,
                    `fecha_actualizacion_dupla` = ?
                WHERE
                    `id_dupla` = ?';
        $params = array($this->nombre, $this->telefono, $this->tipo, $this->empleado1, $this->empleado2, $this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updateStatus()
    {
        $sql = 'UPDATE `tb_duplas`
                SET `tipo_dupla` = CASE 
                    WHEN `tipo_dupla` = 0 THEN 1 
                    WHEN `tipo_dupla` = 1 THEN 0 
                    ELSE `tipo_dupla` -- No cambia si es otro valor
                END,
                `fecha_actualizacion_dupla` = ?
                WHERE `id_dupla` = ?;';
        $params = array($this->actualizacion, $this->id);
        return Database::getRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE
            FROM
                `tb_duplas`
            WHERE
                `id_dupla` = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
