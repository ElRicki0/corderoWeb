DROP DATABASE if EXISTS CorderoDB;

CREATE DATABASE CorderoDB;

USE CorderoDB;

CREATE TABLE
    tb_administradores (
        id_administrador INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_administrador VARCHAR(50) NOt NULL,
        apellido_administrador VARCHAR(50) NOT NULL,
        correo_administrador VARCHAR(60) NOT NULL UNIQUE,
        telefono_administrador VARCHAR(10),
        clave_administrador VARCHAR(500) NOT NULL,
        fecha_clave DATE NOT NULL,
        codigo_clave VARCHAR(6) NOT NULL,
        imagen_administrador VARCHAR(300)
    );

CREATE TABLE
    tb_empleados (
        id_empleado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_empleado VARCHAR(50) NOT NULL,
        apellido_empleado VARCHAR(50),
        DUI_empleado VARCHAR(15) NOT NULL UNIQUE,
        telefono_personal_empleado varchar(10) NOT NULL,
        imagen_empleado VARCHAR(500),
        departamento_trabajo_empleado VARCHAR(100),
        municipio_trabajo_empleado VARCHAR(100),
        fecha_actualizacion_empleado DATETIME
    );

CREATE TABLE
    tb_duplas (
        id_dupla INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        usuario_dupla VARCHAR(100) UNIQUE,
        clave_dupla VARCHAR(500),
        telefono_empresa_dupla varchar(10) NOT NULL,
        tipo_dupla TINYINT (1) not NULL,
        id_empleado1 INT NOT NULL,
        id_empleado2 INT NULL,
        FOREIGN KEY (id_empleado1) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE,
        FOREIGN KEY (id_empleado2) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE,
        fecha_actualizacion_dupla DATETIME
    );

CREATE TABLE
    tb_trabajo_duplas (
        id_trabajo_dupla INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        latitud_inicio_trabajo_dupla varchar(300),
        longitud_inicio_trabajo_dupla varchar(300),
        hora_inicio_trabajo_dupla DATETIME,
        latitud_final_trabajo_dupla varchar(300),
        longitud_final_trabajo_dupla varchar(300),
        hora_final_trabajo_dupla DATETIME,
        estado_trabajo_dupla TINYINT (1) not NULL,
        id_dupla INT NOT NULL UNIQUE,
        FOREIGN KEY (id_dupla) REFERENCES tb_duplas (id_dupla) ON DELETE CASCADE,
        fecha_actualizacion_trabajo_dupla DATETIME
    );

CREATE TABLE
    tb_materiales (
        id_material INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_material VARCHAR(50) NOT NULL,
        descripcion_material VARCHAR(300),
        categoria ENUM (
            'Uso habitual',
            'Material para CL200',
            'Acometida especial',
            'Subterráneo',
            'Antihurto y telegestión'
        ) NOT NULL,
        codigo_material VARCHAR(6),
        cantidad_minima_material INT,
        cantidad_material INT NOT NULL,
        fecha_material DATETIME NOT NULL,
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_herramientas (
        id_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_herramienta VARCHAR(50) NOT NULL,
        descripcion_herramienta VARCHAR(300) NOT NULL,
        categoria_herramienta VARCHAR(10),
        categoria_electrica VARCHAR(10),
        estado_herramienta TINYINT (1) NULL NULL,
        imagen_herramienta VARCHAR(300)
    );

CREATE TABLE
    tb_unidades (
        id_unidad INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_unidad VARCHAR(50) NOT NULL,
        descripcion_unidad VARCHAR(200) NOT NULL,
        imagen_unidad VARCHAR(200)
    );

CREATE TABLE
    tb_cajas (
        id_caja INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_caja VARCHAR(50) NOT NULL,
        codigo_caja VARCHAR(6) NOT NULL,
        unidades_limite_caja INT,
        unidades_caja INT NOT NULL,
        id_unidad INT,
        FOREIGN KEY (id_unidad) REFERENCES tb_unidades (id_unidad) ON DELETE CASCADE,
        cantidad_unidades INT,
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_historial_cajas (
        id_historial_caja INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        fecha_ingreso DATETIME,
        fecha_salida DATETIME,
        comentario_historial_caja VARCHAR(250),
        id_caja INT,
        FOREIGN KEY (id_caja) REFERENCES tb_cajas (id_caja) ON DELETE CASCADE
    );

CREATE TABLE
    tb_EPP (
        id_EPP INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_EPP VARCHAR(50) NOT NULL,
        descripcion_EPP VARCHAR(50),
        imagen_EPP VARCHAR(120),
        cantidad_limite_EPP INT,
        cantidad_EPP INT NOT NULL,
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_guantes_EPP (
        id_guante INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_guante VARCHAR(50) NOT NULL,
        descripcion_guante VARCHAR(150),
        marca_guante VARCHAR(70),
        talla_guante VARCHAR(10) NOT NULL,
        expiracion_guante DATE,
        imagen_guante VARCHAR(150),
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_personal_EPP (
        id_personal_EPP INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        id_empleado INT,
        FOREIGN KEY (id_empleado) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE,
        id_EPP INT,
        FOREIGN KEY (id_EPP) REFERENCES tb_EPP (id_EPP) ON DELETE CASCADE,
        id_guante INT,
        FOREIGN KEY (id_guante) REFERENCES tb_guantes_EPP (id_guante) ON DELETE CASCADE,
        fecha_asignacion DATE NOT NULL
    );

CREATE TABLE
    tb_consumibles (
        id_consumible INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_consumible VARCHAR(50) NOT NULL,
        descripcion_consumible VARCHAR(200),
        cantidad_limite_consumible INT,
        cantidad_consumible INT NOT NULL,
        imagen_consumible VARCHAR(200),
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_repuestos_vehiculos (
        id_respuesto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_repuesto VARCHAR(30) NOT NULL,
        descripcion_repuesto VARCHAR(200),
        cantidad_limite_repuesto INT,
        cantidad_repuesto INT NOT NULL,
        imagen_repuesto varchar(200),
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );

CREATE TABLE
    tb_categorias_escaleras (
        id_categoria_escalera INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_categoria_escalera VARCHAR(30) NOT NULL,
        descripcion_categoria_escalera VARCHAR(300),
        marca_categoria_escalera VARCHAR(50),
        altura_categoria_escalera DECIMAL(3, 2) NOT NULL
    );

CREATE TABLE
    tb_escaleras (
        id_escalera INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_escalera VARCHAR(50) NOT NULL,
        cantidad_escalera INT NOT NULL,
        id_categoria_escalera INT,
        FOREIGN KEY (id_categoria_escalera) REFERENCES tb_categorias_escaleras (id_categoria_escalera) ON DELETE CASCADE,
        id_administrador INT,
        FOREIGN KEY (id_administrador) REFERENCES tb_administradores (id_administrador) ON DELETE CASCADE
    );