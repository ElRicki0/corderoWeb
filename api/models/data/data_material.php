<?php
//? Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
//? Se incluye la clase padre.
require_once('../../models/handler/handler_material.php');
// ? clase para manejar encasamiento de la clase cable
class MaterialData extends MaterialHandler
{
    // ? atributos adicionales
    private $data_error = null;
    private $filename = null;

    /*
     *   Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del material es incorrecto';
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

    public function setCantidad($value)
    {
        if (!Validator::validateNaturalNumber($value)) {
            $this->data_error = 'La cantidad debe ser un número entero positivo';
            return false;
        } else {
            $this->cantidad = $value;
            return true;
        }
    }

    public function setMinimo($value)
    {
        if (Validator::validateNaturalNumber($value) or true) {
            $this->minima = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad minima debe ser un número entero positivo';
            return false;
        }
    }

    public function setCategoria($value)
    {
        if (Validator::validateString($value)) {
            $this->categoria = $value;
            return true;
        } else {
            $this->data_error = 'La categoría es incorrecta';
            return false;
        }
    }

    public function setUnidad($value)
    {
        if (Validator::validateString($value)) {
            $this->unidad = $value;
            return true;
        } else {
            $this->data_error = 'La unidad es incorrecta';
            return false;
        }
    }

    public function setCodigo($value, $min = 5, $max = 6)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El codigo debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->codigo = $value;
            return true;
        } else {
            $this->data_error = 'El código debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen = $filename;
            return true;
        } else {
            $this->imagen = 'default.png';
            return true;
        }
    }

    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_material'];
            return true;
        } else {
            $this->data_error = 'material inexistente';
            return false;
        }
    }

    // ? método para tener los datos adicionales del error
    public function getDataError()
    {
        return $this->data_error;
    }
    
    public function getFilename()
    {
        return $this->filename;
    }
}
