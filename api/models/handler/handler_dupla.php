<?php
// se incluye la clase para  trabaja con la base de datos 
require_once('../../helpers/database.php');
// ? clase para controlar el comportamiento de la tabla de la base de datos
class DuplasHandler
{
    // ? declaración de atributos para el manejo de la base de datos  
    protected $id = null;
    // protected $nombre = null;
    protected $telefono = null;
    protected $tipo = null;
    protected $usuario = null;
    protected $clave = null;
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

    // ? métodos para administrar al usuario de la dupla

    /*
     *  Métodos para gestionar la cuenta del empleado.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT
                    `id_dupla`,
                    `usuario_dupla`,
                    `clave_dupla`
                FROM
                    `tb_duplas`
                WHERE
                    `usuario_dupla`= ?';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_dupla'])) {
            $_SESSION['idDupla'] = $data['id_dupla'];
            $_SESSION['usuarioDupla'] = $data['usuario_dupla'];
            return true;
        } else {
            return false;
        }
    }

    // * validación para comprobar si la contraseña es correcta
    public function checkPassword($password)
    {
        $sql = 'SELECT	
                    `clave_dupla`
                FROM
                    `tb_duplas`
                WHERE
                    `usuario_dupla`= ?';
        $params = array($_SESSION['idDupla']);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_dupla'])) {
            return true;
        } else {
            return false;
        }
    }

    // ? Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = '  SELECT
                    dp.`id_dupla`,
                    dp.`telefono_empresa_dupla`,
                    dp.`tipo_dupla`,
                    dp.`usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    CASE 
                        WHEN td.estado_trabajo_dupla IS NULL OR td.estado_trabajo_dupla = 0 THEN 0
                        ELSE 1
                    END AS estado_trabajo,
                    dp.`fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                LEFT JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                LEFT JOIN tb_trabajo_duplas td ON
                    dp.id_dupla = td.id_dupla AND td.estado_trabajo_dupla = 1
                    WHERE dp.usuario_dupla like ? or dp.telefono_empresa_dupla LIKE ? OR em1.nombre_empleado LIKE ? 
                    OR em1.apellido_empleado LIKE ? OR em1.telefono_personal_empleado LIKE ? OR em2.nombre_empleado LIKE ? 
                    OR em2.apellido_empleado LIKE ? OR em2.telefono_personal_empleado LIKE ? 
                ';
        $params = array($value, $value, $value, $value, $value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_duplas`(
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    `clave_dupla`,
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
                    ?,
                    ?)';
        $params = array($this->telefono, $this->tipo, $this->usuario, $this->clave, $this->empleado1, $this->empleado2, $this->actualizacion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT
                    dp.`id_dupla`,
                    dp.`telefono_empresa_dupla`,
                    dp.`tipo_dupla`,
                    dp.`usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    CASE 
                        WHEN td.estado_trabajo_dupla IS NULL OR td.estado_trabajo_dupla = 0 THEN 0
                        ELSE 1
                    END AS estado_trabajo,
                    dp.`fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                LEFT JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                LEFT JOIN tb_trabajo_duplas td ON
                    dp.id_dupla = td.id_dupla AND td.estado_trabajo_dupla = 1;';
        return Database::getRows($sql);
    }

    public function readProfile()
    {
        $sql = 'SELECT
                    dp.`id_dupla`,
                    dp.`telefono_empresa_dupla`,
                    dp.`tipo_dupla`,
                    dp.`usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    CASE 
                        WHEN td.estado_trabajo_dupla IS NULL OR td.estado_trabajo_dupla = 0 THEN 0
                        ELSE 1
                    END AS estado_trabajo,
                    dp.`fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                LEFT JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                LEFT JOIN tb_trabajo_duplas td ON
                    dp.id_dupla = td.id_dupla AND td.estado_trabajo_dupla = 1
                WHERE dp.`id_dupla` = ?;';
        $params = array($_SESSION['idDupla']);
        return Database::getRow($sql, $params);
    }

    public function readByName()
    {
        $sql = ' SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                ORDER BY `usuario_dupla`';
        return Database::getRows($sql);
    }

    public function readByNameDesc()
    {
        $sql = ' SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                ORDER BY usuario_dupla DESC';
        return Database::getRows($sql);
    }

    public function readByModify()
    {
        $sql = 'SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                ORDER BY fecha_actualizacion_dupla DESC';
        return Database::getRows($sql);
    }

    public function readByActive()
    {
        $sql = 'SELECT
                    dp.`id_dupla`,
                    dp.`telefono_empresa_dupla`,
                    dp.`tipo_dupla`,
                    dp.`usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    1 AS estado_trabajo,
                    dp.`fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                LEFT JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                INNER JOIN tb_trabajo_duplas td ON
                    dp.id_dupla = td.id_dupla 
                WHERE
                    td.estado_trabajo_dupla = 1; -- Filtra duplas con estado_dupla = 1';
        return Database::getRows($sql);
    }

    public function readByInactive()
    {
        $sql = 'SELECT
                    dp.`id_dupla`,
                    dp.`telefono_empresa_dupla`,
                    dp.`tipo_dupla`,
                    dp.`usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    0 AS estado_trabajo,
                    dp.`fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                LEFT JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                LEFT JOIN tb_trabajo_duplas td ON
                    dp.id_dupla = td.id_dupla
                WHERE
                    td.id_dupla IS NULL OR td.estado_trabajo_dupla = 0;';
        return Database::getRows($sql);
    }

    public function readByTypePermanent()
    {
        $sql = 'SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                    WHERE tipo_dupla=1';
        return Database::getRows($sql);
    }

    public function readByTypeTemporal()
    {
        $sql = '    SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado 
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                WHERE tipo_dupla=0';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    `id_dupla`,
                    `telefono_empresa_dupla`,
                    `tipo_dupla`,
                    `usuario_dupla`,
                    em1.id_empleado AS id_empleado1,
                    em1.nombre_empleado AS nombre_empleado1,
                    em1.apellido_empleado AS apellido_empleado1,
                    em1.telefono_personal_empleado AS telefono_personal_empleado1,
                    em1.imagen_empleado AS imagen_empleado1,
                    em2.id_empleado AS id_empleado2,
                    em2.nombre_empleado AS nombre_empleado2,
                    em2.apellido_empleado AS apellido_empleado2,
                    em2.telefono_personal_empleado AS telefono_personal_empleado2,
                    em2.imagen_empleado AS imagen_empleado2,
                    `fecha_actualizacion_dupla`
                FROM
                    `tb_duplas` dp
                INNER JOIN tb_empleados em1 ON
                    dp.id_empleado1 = em1.id_empleado
                INNER JOIN tb_empleados em2 ON
                    dp.id_empleado2 = em2.id_empleado
                WHERE dp.id_dupla = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE
                    `tb_duplas`
                SET
                    `telefono_empresa_dupla` = ?,
                    `tipo_dupla` = ?,
                    `usuario_dupla` = ?,
                    `id_empleado1` = ?,
                    `id_empleado2` = ?,
                    `fecha_actualizacion_dupla` = ?
                WHERE
                    `id_dupla` =?';
        $params = array($this->telefono, $this->tipo, $this->usuario, $this->empleado1, $this->empleado2, $this->actualizacion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updatePassword()
    {
        $sql = 'UPDATE
                    `tb_duplas`
                SET
                    `clave_dupla` = ?,
                    `fecha_actualizacion_dupla` = ?
                WHERE
                    `id_dupla` = ?';
        $params = array($this->clave,$this->actualizacion, $this->id);
        return DATABASE::executeRow($sql, $params);
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
