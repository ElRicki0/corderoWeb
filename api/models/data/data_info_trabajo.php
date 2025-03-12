<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/handler_info_trabajo.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class InfoTrabajoData extends InfoTrabajoHandler
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
        } elseif (!Validator::validateString($value)) {
            $this->data_error = 'La latitud contiene caracteres prohibidos';
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
        } elseif (!Validator::validateString($value)) {
            $this->data_error = 'La longitud contiene caracteres prohibidos';
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
            $this->data_error = 'La hora contiene caracteres prohibidos';
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
        } elseif (!Validator::validateString($value)) {
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
        } elseif (!Validator::validateString($value)) {
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

    public function setDepartamento($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El departamento debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->departamento = $value;
            return true;
        } else {
            $this->data_error = 'El departamento debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setMunicipio($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El municipio debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->municipio = $value;
            return true;
        } else {
            $this->data_error = 'El municipio debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setEmpleado($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->empleado = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la información es incorrecto';
            return false;
        }
    }
}
