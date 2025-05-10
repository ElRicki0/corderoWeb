<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handle_requisicion.php');

// class requisicionData
class requisicionData extends requisicionHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
     *  Métodos para validar y asignar valores de los atributos.
     */

    public function setIdRequisicion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_requisicion = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la requisición es incorrecto';
            return false;
        }
    }

    public function setIdDetalle($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_detalle = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle es incorrecto';
            return false;
        }
    }

    public function setDupla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dupla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la dupla es incorrecto';
            return false;
        }
    }

    public function setMaterial($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->material = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del material es incorrecto';
            return false;
        }
    }

    public function setCantidad($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad de material es tiene que ser mayor o igual a 1';
            return false;
        }
    }
    
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
