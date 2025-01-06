<?php
//? Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
//? Se incluye la clase padre.
require_once('../../models/handler/handler_cable.php');
// ? clase para manejar encasamiento de la clase cable
class CableData extends CablesHandler
{
    // ? atributos adicionales
    private $data_error = null;

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del producto es incorrecto';
            return false;
        }
    }

    public function setNombre($value, $min = 2, $max = 250)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombre = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setDescripcion($value, $min = 2, $max = 250)
    {
        if (!Validator::validateString($value)) {
            $this->data_error = 'La descripción contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->descripcion = $value;
            return true;
        } else {
            $this->data_error = 'La descripción debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setLongitud($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            $this->data_error = 'La longitud debe ser un número entero positivo';
            return false;
        }
    }

    public function setCategoria($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la categoría es incorrecto';
            return false;
        }
    }

    public function setEstado($value, $min = 2, $max = 250)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->estado = $value;
            return true;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto wawa';
            return false;
        }
    }

    // ? método para tener los datos adicionales del error

    public function getDataError()
    {
        return $this->data_error;
    }
}
