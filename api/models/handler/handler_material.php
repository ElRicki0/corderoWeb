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
    protected $unidad = null;
    protected $codigo = null;
    protected $minima = null;
    protected $cantidad = null;
    protected $imagen = null;
    protected $fecha = null;
    protected $administrador = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/material/';

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
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,    
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador,
                    ad.apellido_administrador
                FROM
                    `tb_materiales` mt
                INNER JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE
                    `nombre_material` LIKE ? OR `descripcion_material` LIKE ? OR `codigo_material` LIKE ? OR `categoria_material` LIKE ?';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO `tb_materiales`(
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `unidad_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
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
                    ?,
                    ?,
                    ?
                )';
        $params = array($this->nombre, $this->descripcion, $this->categoria, $this->unidad, $this->codigo, $this->minima, $this->cantidad, $this->imagen, $this->fecha,  $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_material
                FROM tb_materiales
                WHERE id_material = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // ? métodos para mostrar todos los datos
    public function readAll()
    {
        $sql = 'SELECT
                `id_material`,
                `nombre_material`,
                `descripcion_material`,
                `categoria_material`,
                `codigo_material`,
                `cantidad_minima_material`,
                `imagen_material`,
                cantidad_material,
                fecha_material,
                `unidad_material`,
                mt.id_administrador,
                ad.nombre_administrador, 
                ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
            FROM
                `tb_materiales` mt
                LEFT JOIN tb_administradores ad ON
                mt.id_administrador = ad.id_administrador
            ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador,
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                INNER JOIN tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE
                    `id_material` = ?';
        $params = array($this->id);
        return database::getRow($sql, $params);
    }

    // ? métodos para todos mostrar los datos ordenados por las categorías

    public function readByCategory1()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE categoria_material= "Uso habitual" 
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    public function readByCategory2()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE categoria_material= "Material para CL200"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    public function readByCategory3()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE categoria_material= "Acometida especial"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    public function readByCategory4()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE categoria_material= "Subterráneo"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    public function readByCategory5()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                WHERE categoria_material= "Antihurto y telegestión"
                ORDER BY 
                necesita_reposicion DESC,
                (cantidad_minima_material - cantidad_material) DESC;';
        return Database::getRows($sql);
    }

    // ? métodos para todos mostrar los datos ordenados por: 'Agregados o alterados recientemente'
    public function readByModify()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                ORDER BY
                    mt.`fecha_material` desc';
        return Database::getRows($sql);
    }

    public function readByMax()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                ORDER BY
                    `cantidad_material` DESC';
        return Database::getRows($sql);
    }

    public function readByMin()
    {
        $sql = 'SELECT
                    `id_material`,
                    `nombre_material`,
                    `descripcion_material`,
                    `categoria_material`,
                    `codigo_material`,
                    `cantidad_minima_material`,
                    `cantidad_material`,
                    `imagen_material`,
                    `unidad_material`,
                    ad.nombre_administrador, 
                    ad.apellido_administrador,
                CASE 
                    WHEN cantidad_material <= cantidad_minima_material THEN 1
                    ELSE 0
                END AS necesita_reposicion
                FROM
                    `tb_materiales` mt
                    INNER join
                    tb_administradores ad ON
                    mt.id_administrador = ad.id_administrador
                ORDER BY
                    `cantidad_material` ASC';
        return Database::getRows($sql);
    }


    public function UpdateRow()
    {
        $sql = 'UPDATE
                    `tb_materiales`
                SET
                    `nombre_material` = ?,
                    `descripcion_material` = ?,
                    `categoria_material` = ?,
                    `codigo_material` = ?,
                    `cantidad_minima_material` = ?,
                    `cantidad_material` = ?,
                    `fecha_material` = ?,
                    `id_administrador` = ?
                WHERE
                    `id_material` =?';
        $params = array($this->nombre, $this->descripcion, $this->categoria, $this->codigo, $this->minima, $this->cantidad, $this->fecha,  $_SESSION['idAdministrador'], $this->id);
        return Database::executeRow($sql, $params);
    }

    public function addQuantity()
    {
        $sql = 'UPDATE `tb_materiales` 
        SET `cantidad_material` = 
        `cantidad_material` + ? WHERE `id_material` = ?
        ';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function restQuantity()
    {
        $sql = 'UPDATE `tb_materiales` 
        SET `cantidad_material` = 
        `cantidad_material` - ? WHERE `id_material` = ?
        ';
        $params = array($this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function DeleteRow()
    {
        $sql = 'DELETE FROM `tb_materiales` WHERE `id_material` = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // ? funciones para gráficas
}
