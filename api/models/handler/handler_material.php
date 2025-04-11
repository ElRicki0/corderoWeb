<?php
// se incluye la clase para  trabaja con la base de datos 
require_once('../../helpers/database.php');
// ? clase para controlar el comportamiento de la tabla de la base de datos
class MaterialHandler
{
    // ? declaración de atributos para el manejo de la base de datos  
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $categoria = null;
    protected $codigo = null;
    protected $minima = null;
    protected $cantidad = null;
    protected $fecha = null;
    protected $administrador = null;

    public function __construct()
    {
        $this->fecha = date('Y-m-d H:i:s'); // Formato año-mes-día
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    // ? Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                WHERE
                    c.nombre_cable LIKE ? OR c.descripcion_cable LIKE ? OR c.estado_cable LIKE ? OR c.id_categoria_cable LIKE ?               ';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_materiales`(
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `fecha_material`,
                    `id_administrador`
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
        $params = array($this->nombre, $this->descripcion, $this->categoria, $this->codigo, $this->minima, $this->cantidad, $this->fecha,  $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // ? métodos para mostrar todos los datos
    public function readAll()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `longitud_minima_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'nombre'
    public function readByName()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `descripcion_cable`,
                    `longitud_minima_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                ORDER BY
                    c.nombre_cable ASC';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'longitud cable (menor a mayor)'
    public function readByLengthDesc()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `descripcion_cable`,
                    `longitud_minima_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                ORDER BY
                    c.longitud_cable desc';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'longitud cable (mayor a menor)'
    public function readByLengthAsc()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `longitud_minima_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                ORDER BY
                    c.longitud_cable asc';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'Agregados o alterados recientemente'
    public function readByModify()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `longitud_minima_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable,
                    c.fecha_creacion_cable 
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                ORDER BY
                    c.fecha_creacion_cable asc';
        return Database::getRows($sql);
    }

    public function readAllOne()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `longitud_minima_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    cc.nombre_categoria_cable,
                    a.nombre_administrador,
                    a.apellido_administrador,
                    cc.imagen_categoria_cable,
                    c.id_administrador
                FROM
                    tb_cables c
                INNER JOIN tb_categorias_cables cc ON
                    c.id_categoria_cable = cc.id_categoria_cable
                INNER JOIN tb_administradores a ON
                    c.id_administrador = a.id_administrador
                WHERE
                    C.id_administrador = ?
        ';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    public function ReadOne()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
                    `longitud_minima_cable`,
                    `descripcion_cable`,
                    `longitud_cable`,
                    `estado_cable`,
                    `id_categoria_cable`,
                    `id_administrador`
                FROM
                    `tb_cables`
                WHERE
                    `id_cable` = ?';
        $params = array($this->id);
        return database::getRow($sql, $params);
    }

    public function UpdateRow()
    {
        $sql = 'UPDATE
                    `tb_cables`
                SET
                    `nombre_cable` = ?,
                    `descripcion_cable` = ?,
                    `longitud_minima_cable` = ?,
                    `longitud_cable` = ?,
                    `estado_cable` = ?,
                    `id_categoria_cable` = ?,
                    `fecha_creacion_cable` =?
                WHERE
                    `id_cable` = ?';
        // $params = array($this->nombre, $this->descripcion, $this->minima, $this->cantidad, $this->estado, $this->categoria, $this->categoria, $this->id);
        // return database::executeRow($sql, $params);
    }

    public function DeleteRow()
    {
        $sql = 'DELETE FROM `tb_cables` WHERE `id_cable` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // ? funciones para gráficas}

    public function cantidadRollosCategoria()
    {
        $sql = 'SELECT
                c.nombre_categoria_cable,
                COUNT(cb.id_cable) AS total_rollos
            FROM
                tb_categorias_cables c
            LEFT JOIN tb_cables cb ON
                c.id_categoria_cable = cb.id_categoria_cable
            GROUP BY
                c.nombre_categoria_cable';
        return Database::getRows($sql);
    }

    public function estadoCantidadesCables()
    {
        $sql = 'SELECT 
                    "Cantidad mayores" AS estado_cables, 
                    COUNT(*) AS cantidad
                FROM tb_cables
                WHERE longitud_cable >= longitud_minima_cable

                UNION ALL

                SELECT 
                    "Cantidad menores" AS estado_cables, 
                    COUNT(*) AS cantidad
                FROM tb_cables
                WHERE longitud_cable < longitud_minima_cable';
        return Database::getRows($sql);
    }

    public function estadoRolloscables()
    {
        $sql = "SELECT CASE WHEN
                    estado_cable = 0 THEN 'Nuevo' WHEN estado_cable = 1 THEN 'En uso' WHEN estado_cable = 2 THEN 'En ruta' ELSE 'Desconocido'
                END AS estado,
                COUNT(*) AS cantidad
                FROM
                    tb_cables
                GROUP BY
                estado_cable";
        return database::getRows($sql);
    }
}
