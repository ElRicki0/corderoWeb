<?php
// ? se incluye la conexión a la base de datos
require_once('../../helpers/database.php');

// ?clase para manejar el comportamiento de la tabla independiente tb_categorías_cables

class CategoriaCableHandler
{
    // ? declaración de variables de la tabla
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $imagen = null;

    // ? constante de ruta de las imágenes
    const RUTA_IMAGEN = ('../../images/cables/');

    // ? métodos para realizar SCRUD

    // * método de búsqueda en la tabla
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_categoria_cable, nombre_categoria_cable, descripcion_categoria_cable
                FROM tb_categorias_cables
                WHERE nombre_categoria_cable LIKE ? OR descripcion_categoria_cable LIKE ?
                ORDER BY nombre_categoria_cable';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    // *método para crear nuevo registro
    public function createRow()
    {
        $sql = 'INSERT INTO tb_categorias_cables(nombre_categoria_cable, descripcion_categoria_cable, imagen_categoria_cable)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    // * método para visualizar todos los registros de la tabla 
    public function readAll()
    {
        $sql = 'SELECT * FROM tb_categorias_cables';
        return Database::getRows($sql);
    }

    // * método para visualizar solamente un registro
    public function readOne()
    {
        $sql = 'SELECT * FROM tb_categorias_cables
                WHERE id_categoria_cable = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_categoria_cable
                FROM tb_categorias_cables
                WHERE id_categoria_cable = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // * método para actualizar un registro
    public function updateRow()
    {
        $sql = 'UPDATE tb_categorias_cables
                SET imagen_categoria_cable = ?, nombre_categoria_cable = ?, descripcion_categoria_cable = ?
                WHERE id_categoria_cable = ?';
        $params = array($this->imagen, $this->nombre, $this->descripcion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_categorias_cables
                WHERE id_categoria_cable = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
