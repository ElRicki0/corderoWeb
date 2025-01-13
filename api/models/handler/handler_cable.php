<?php
// se incluye la clase para  trabaja con la base de datos 
require_once('../../helpers/database.php');
// ? clase para controlar el comportamiento de la tabla de la base de datos
class CablesHandler
{
    // ? declaración de atributos para el manejo de la base de datos  
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $cantidad = null;
    protected $estado = null;
    protected $categoria = null;
    protected $administrador = null;

    // ? Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT `id_cable`, `nombre_cable`, `descripcion_cable`, `longitud_cable`, `estado_cable`, `id_categoria_cable`, `id_administrador` FROM `tb_cables` WHERE nombre_cable LIKE ? OR descripcion_cable LIKE ? OR estado_cable LIKE ? OR id_categoria_cable LIKE ? 
                ORDER BY nombre_cable';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_cables`(`nombre_cable`, `descripcion_cable`, `longitud_cable`, `estado_cable`, `id_categoria_cable`, `id_administrador`) 
        VALUES (?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->cantidad, $this->estado, $this->categoria,  $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
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
                    c.id_administrador = a.id_administrador';
        return Database::getRows($sql);
    }

    public function readAllOne()
    {
        $sql = 'SELECT
                    `id_cable`,
                    `nombre_cable`,
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
                    `longitud_cable` = ?,
                    `estado_cable` = ?,
                    `id_categoria_cable` = ?
                WHERE
                    `id_cable` = ?';
        $params = array($this->nombre, $this->descripcion, $this->cantidad, $this->estado, $this->categoria, $this->id);
        return database::executeRow($sql, $params);
    }

    public function DeleteRow()
    {
        $sql = 'DELETE FROM `tb_cables` WHERE `id_cable` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }


}
