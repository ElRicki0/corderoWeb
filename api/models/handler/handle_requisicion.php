<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas Requisición y DETALLE_REQUISICIÓN.
*/
class requisicionHandler
{
    protected $id_requisicion = null;
    protected $id_detalle = null;
    protected $dupla = null;
    protected $material = null;
    protected $cantidad = null;
    protected $estado = null;

    // Aquí puedes implementar los métodos que interactúan con las propiedades de requisicionHandler

    /*
    *   ESTADOS DE LA REQUISICIÓN
    *   Pendiente (valor por defecto en la base de datos). requisición en proceso y se puede modificar el detalle.
    *   Finalizado. requisición terminada por la dupla y ya no es posible modificar el detalle.
    *   Aproada. requisición enviado la dupla.
    *   Anulado. requisición cancelado por la dupla después de ser finalizado.
    */

    // * métodos SCRUD (Select, Create, Read, Update, Delete) para manejar las requisiciones y detalles de requisiciones

    // método para verificar si existe una requisición o se inicia una nueva
    public function getRequisicion()
    {
        $this->estado = 'Pendiente';
        $sql = "SELECT id_requisicion FROM requisiciones WHERE estado = ? AND id_dupla = ?";
        $params = array($this->estado, $_SESSION['idDupla']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idRequisicion'] = $data['id_requisicion'];
            return true;
        } else {
            return false;
        }
    }

    // * método para iniciar una nueva requisición en proceso
    public function startRequisicion()
    {
        if ($this->getRequisicion()) {
            return true;
        } else {
            $sql = 'INSERT INTO `tb_requisiciones`(`id_dupla`)
                    VALUES(?)';
            $params = array($_SESSION['idDupla']);
            if ($_SESSION['idRequisicion'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    // Método para agregar material a la requisición actual.
    public function createDetail()
    {
        $sql = 'INSERT INTO `tb_detalle_requisiciones`(
                            `cantidad_detalle_requisicion`,
                            `id_material`,
                            `id_requisicion`
                        )
                        VALUES(
                            ?,
                            ?,
                            ?
                        )';
        $params = array($this->cantidad, $this->material, $_SESSION['idRequisicion']);
        return Database::executeRow($sql, $params);
    }

    // método para leer los detalles de la requisición actual
    public function readDetail()
    {
        $sql = 'SELECT
                    dr.id_detalle_requisicion,
                    m.nombre_material,
                    dr.cantidad_detalle_requisicion,
                    r.estado
                FROM
                    tb_detalle_requisiciones dr
                INNER JOIN tb_materiales m ON m.id_material = dr.id_material
                INNER JOIN tb_requisiciones r ON r.id_requisicion = dr.id_requisicion
                WHERE
                    dr.id_requisicion = ?';
        $params = array($_SESSION['idRequisicion']);
        return Database::getRows($sql, $params);
    }
}
