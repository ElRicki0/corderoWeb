<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_trabajo_dupla.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class TrabajoDuplaData extends TrabajoDuplaHandler
{
    // atributo genérico para manejo de errores
    private $data_error = null;
    /*
      *  Métodos para validar y asignar valores de los atributos.
      */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la información es incorrecto';
            return false;
        }
    }

    public function setLatitudInicio($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateDecimalNumber($value)) {
            $this->data_error = 'La latitud inicial contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->latitudInicio = $value;
            return true;
        } else {
            $this->data_error = 'La latitud debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setLongitudInicio($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateDecimalNumber($value)) {
            $this->data_error = 'La longitud inicial contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->longitudInicio = $value;
            return true;
        } else {
            $this->data_error = 'La longitud debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setHoraInicio($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateString($value)) {
            $this->data_error = 'La hora inicio contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->horaInicio = $value;
            return true;
        } else {
            $this->data_error = 'La hora debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setLatitudFinal($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateDecimalNumber($value)) {
            $this->data_error = 'La latitud Final contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->latitudFinal = $value;
            return true;
        } else {
            $this->data_error = 'La latitud Final debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setLongitudFinal($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateDecimalNumber($value)) {
            $this->data_error = 'La longitud Final contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->longitudFinal = $value;
            return true;
        } else {
            $this->data_error = 'La longitud Final debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setHoraFinal($value, $min = 2, $max = 500)
    {
        if (!$value) {
            return true;
        } elseif (!Validator::validateString($value)) {
            $this->data_error = 'La hora Final contiene caracteres prohibidos';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->horaFinal = $value;
            return true;
        } else {
            $this->data_error = 'La hora Final debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->data_error = 'Estado incorrecto';
            return false;
        }
    }

    public function setDupla($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->dupla = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la información es incorrecto';
            return false;
        }
    }
    
    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
