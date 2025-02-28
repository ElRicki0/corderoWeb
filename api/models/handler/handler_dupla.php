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
    public function createRow()
    {
        $sql = '  INSERT INTO `tb_duplas`(
                `nombre_dupla`,
                `telefono_empresa_dupla`,
                `id_empleado1`,
                `id_empleado2`,
                `actualizacion`
            )
            VALUES(
                ?,
                ?,
                ?,
                ?,
                ?)';
        $params = array($this->nombre, $this->telefono, $this->empleado1, $this->empleado2, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
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
                    e2.imagen_empleado AS imagen_empleado2
                FROM
                    tb_duplas d
                INNER JOIN tb_empleados e1 ON
                    d.id_empleado1 = e1.id_empleado
                INNER JOIN tb_empleados e2 ON
                    d.id_empleado2 = e2.id_empleado;              ';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = '    SELECT
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
                        e2.imagen_empleado AS imagen_empleado2
                    FROM
                        tb_duplas d
                    INNER JOIN tb_empleados e1 ON
                        d.id_empleado1 = e1.id_empleado
                    INNER JOIN tb_empleados e2 ON
                        d.id_empleado2 = e2.id_empleado
                    WHERE d.id_dupla = ?;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
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
