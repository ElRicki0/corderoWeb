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

    public function setTipo($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->tipo = $value;
            return true;
        } else {
            $this->data_error = 'tipo dupla incorrecto';
            return false;
        }
    }

    public function setUsuario($value, $min = 6, $max = 25)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El alias debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->usuario = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del usuario debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setClave($value)
    {
        if (Validator::validatePassword($value)) {
            $this->clave = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
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
