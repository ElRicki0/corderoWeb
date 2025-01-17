<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradorHandler
{
    //* declaración de variables de la tabla administrador
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $usuario = null;
    protected $correo = null;
    protected $telefono = null;
    protected $clave = null;
    protected $fecha_clave = null;
    protected $codigo = null;
    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/admin/';

    public function __construct()
    {
        // Generar un código aleatorio de 6 dígitos y asignarlo a $codigo
        $this->codigo = rand(100000, 999999);
        $this->fecha_clave = date('Y-m-d'); // Formato año-mes-día
    }

    // Método para obtener el código (opcional)
    public function getCodigo()
    {
        return $this->codigo;
    }

    public function getFechaContrasenia()
    {
        return $this->fecha_clave;
    }

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_administrador, correo_administrador, clave_administrador
                FROM tb_administradores 
                WHERE correo_administrador=?';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_administrador'])) {
            $_SESSION['idAdministrador'] = $data['id_administrador'];
            $_SESSION['correoAdministrador'] = $data['correo_administrador'];
            return true;
        } else {
            return false;
        }
    }

    // validación para comprobar si la contraseña es correcta
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_administrador
                FROM tb_administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_administrador'])) {
            return true;
        } else {
            return false;
        }
    }

    //* métodos SCRUD (search, create, read, update, and delete) para el manejo de variables 

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, usuario_administrador, telefono_administrador
                FROM tb_administradores
                WHERE apellido_administrador LIKE ? OR nombre_administrador LIKE ? OR correo_administrador LIKE ? OR usuario_administrador LIKE ? OR telefono_administrador LIKE ? AND id_administrador <> ?
                ORDER BY id_administrador';
        $params = array($value, $value, $value, $value, $value, $_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_administradores(nombre_administrador, apellido_administrador, usuario_administrador, telefono_administrador, correo_administrador, clave_administrador, fecha_clave, codigo_clave, imagen_administrador)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->usuario, $this->telefono, $this->correo,  $this->clave, $this->fecha_clave, $this->codigo, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT `id_administrador` FROM `tb_administradores`';
        return Database::getRows($sql);
    }

    public function readAllOne()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, usuario_administrador, telefono_administrador, correo_administrador, imagen_administrador FROM tb_administradores
        where id_administrador<>?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRows($sql, $params);
    }

    public function readProfile()
    {
        $sql = '  SELECT
                    `id_administrador`,
                    `nombre_administrador`,
                    `apellido_administrador`,
                    `usuario_administrador`,
                    `correo_administrador`,
                    `telefono_administrador`,
                    `imagen_administrador`
                FROM
                    `tb_administradores`
                WHERE
                    `id_administrador` = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE
                    `tb_administradores`
                SET
                    `nombre_administrador` = ?,
                    `apellido_administrador` = ?,
                    `usuario_administrador` = ?,
                    `correo_administrador` = ?,
                    `telefono_administrador` = ?,
                    `imagen_administrador` = ?
                WHERE
                    `id_administrador` = ?';
        $params = array($this->nombre, $this->apellido, $this->usuario, $this->correo, $this->telefono, $this->imagen, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    public function changePassword()
    {
        $sql = 'UPDATE
                    `tb_administradores`
                SET
                    `clave_administrador` = ?,
                    `fecha_clave` = ?,
                    `codigo_clave` = ?
                WHERE
                    `id_administrador`=?';
        $params = array($this->clave, $this->fecha_clave, $this->codigo,  $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }


    public function readFilename()
    {
        $sql = 'SELECT tb_administradores
                FROM CorderoDB
                WHERE id_administrador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
}
