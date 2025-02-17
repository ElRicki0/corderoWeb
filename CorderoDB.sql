DROP DATABASE if EXISTS CorderoDB;

CREATE DATABASE CorderoDB;

USE CorderoDB;

CREATE TABLE
    tb_empleados (
        id_empleado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_empelado VARCHAR(50) NOT NULL,
        apellido_empleado VARCHAR(50),
        DUI_empleado VARCHAR(15) NOT NULL,
        telefono_empleado varchar(10) NOT NULL,
        correo_empleado VARCHAR(100) UNIQUE,
        clave_empleado VARCHAR(500),
        departamento_empleado VARCHAR(100),
        municipio_empleado VARCHAR(100),
        estado_empleado TINYINT (1) not null NULL,
        imagen_empleado VARCHAR(500)
    );

CREATE TABLE
    tb_herramientas (
        id_herramienta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_herramienta VARCHAR(50) NOT NULL,
        descripcion_herramienta VARCHAR(300) NOT NULL,
        categoria_herramienta VARCHAR(10),
        categoria_electrica VARCHAR(10),
        estado_herramienta TINYINT (1) NULL NULL,
        imagen_herramienta VARCHAR(300),
        id_empleado INT,
        FOREIGN KEY (id_empleado) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE
    );

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
    tb_categorias_cables (
        id_categoria_cable INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_categoria_cable VARCHAR(30) NOT NULL,
        descripcion_categoria_cable VARCHAR(500) NOT NULL,
        imagen_categoria_cable VARCHAR(150),
        fecha_categoria_cable date
    );

CREATE TABLE
    tb_cables (
        id_cable INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nombre_cable VARCHAR(50),
        descripcion_cable VARCHAR(150),
        longitud_minima_cable DECIMAL(20,2),
        longitud_cable DECIMAL(10, 2),
        estado_cable TINYINT not NULL,
        fecha_creacion_cable DATE,
        id_categoria_cable INT,
        FOREIGN KEY (id_categoria_cable) REFERENCES tb_categorias_cables (id_categoria_cable) ON DELETE CASCADE,
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

CREATE TABLE
    tb_jornada_empleado (
        id_jornada_empleado INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        inicio_jornada TIME,
        fin_jornada TIME,
        fecha_jornada DATE,
        id_empleado INT,
        FOREIGN KEY (id_empleado) REFERENCES tb_empleados (id_empleado) ON DELETE CASCADE
    );