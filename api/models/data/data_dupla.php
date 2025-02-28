<?php
//? Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
//? Se incluye la clase padre.
require_once('../../models/handler/handler_dupla.php');

// ? clase para manejar encasamiento de la clase cable

class DuplaData extends DuplasHandler
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
            $this->data_error = 'El identificador de la dupla es incorrecto';
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

    public function setTelefono($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    public function setEmpleado1($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->empleado1 = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del primer empleado es incorrecto';
            return false;
        }
    }

    public function setEmpleado2($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->empleado2 = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del segundo empleado es incorrecto';
            return false;
        }
    }
    // ? método para tener los datos adicionales del error
    public function getDataError()
    {
        return $this->data_error;
    }
}
