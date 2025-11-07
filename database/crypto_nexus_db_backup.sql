-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellidos VARCHAR(50),
    fecha_nacimiento DATE,
    pais_residencia VARCHAR(50),
    ciudad_residencia VARCHAR(50),
    nacionalidad VARCHAR(50),
    tipo_documento VARCHAR(20),
    documento_identidad VARCHAR(30) UNIQUE,
    numero_telefono VARCHAR(20),
    password CHAR(102) NOT NULL,
    numero_ordenes_venta INT DEFAULT 0,
    porcentaje_ordenes_exitosas DECIMAL(5,2) DEFAULT 0.00,
    puntuacion_usuario DECIMAL(5,2) DEFAULT 0.00,
    saldo_cripto DECIMAL(18,8) DEFAULT 0.0,
    saldo_fondo_ahorro DECIMAL(18,8) DEFAULT 0.0,
    saldo_publicacion_venta DECIMAL(18,8) DEFAULT 0.0,
    balance_total DECIMAL(18,8) DEFAULT 0.0
);

-- Tabla de publicaciones de venta
CREATE TABLE publicaciones_venta (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    cantidad_venta DECIMAL(18,8),
    precio_venta_bob DECIMAL(18,2),
    minimo_compra DECIMAL(18,2),
    imagen_qr BLOB,
    reglas_vendedor TEXT,
    estado ENUM('activa', 'completada', 'cancelada') DEFAULT 'activa',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de compras
CREATE TABLE compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion INT,
    id_comprador INT,
    cantidad_comprada DECIMAL(18,8),
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('en progreso', 'completada', 'cancelada') DEFAULT 'en progreso',
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones_venta(id_publicacion),
    FOREIGN KEY (id_comprador) REFERENCES usuarios(id_usuario)
);

-- Tabla de chats en compras
CREATE TABLE chat_compras (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT,
    emisor INT,
    mensaje TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra),
    FOREIGN KEY (emisor) REFERENCES usuarios(id_usuario)
);

-- Tabla de transferencias
CREATE TABLE transferencias (
    id_transferencia INT AUTO_INCREMENT PRIMARY KEY,
    id_emisor INT,
    id_receptor INT,
    cantidad DECIMAL(18,8),
    fecha_transferencia DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emisor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_receptor) REFERENCES usuarios(id_usuario)
);

-- Tabla de ahorros
CREATE TABLE ahorros (
    id_ahorro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    cantidad_invertida DECIMAL(18,8),
    tasa_interes DECIMAL(5,2) DEFAULT 7.00,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    estado ENUM('activo', 'finalizado') DEFAULT 'activo',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de cambios directos con comisión
CREATE TABLE cambios_directos (
    id_cambio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    cantidad_bob DECIMAL(18,2),
    cantidad_usdt DECIMAL(18,8),
    comision_aplicada DECIMAL(5,2) DEFAULT 5.00,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


-- Trigger para actualizar la puntuacion total del usuario después de una transferencia      
DELIMITER //

CREATE TRIGGER actualizar_puntuacion_usuario
AFTER UPDATE ON compras
FOR EACH ROW
BEGIN
    DECLARE id_vendedor INT;
    DECLARE total_ordenes INT;
    DECLARE exitosas INT;

    -- Solo actualizar si el estado cambió a 'completada'
    IF NEW.estado = 'completada' AND OLD.estado != 'completada' THEN

        -- Obtener el id del vendedor (dueño de la publicación)
        SELECT id_usuario INTO id_vendedor
        FROM publicaciones_venta
        WHERE id_publicacion = NEW.id_publicacion;

        -- Contar todas las compras asociadas a publicaciones del vendedor
        SELECT COUNT(*) INTO total_ordenes
        FROM compras c
        JOIN publicaciones_venta p ON c.id_publicacion = p.id_publicacion
        WHERE p.id_usuario = id_vendedor;

        -- Contar las compras completadas exitosamente
        SELECT COUNT(*) INTO exitosas
        FROM compras c
        JOIN publicaciones_venta p ON c.id_publicacion = p.id_publicacion
        WHERE p.id_usuario = id_vendedor AND c.estado = 'completada';

        -- Actualizar la puntuación del usuario
        UPDATE usuarios
        SET 
            numero_ordenes_venta = total_ordenes,
            porcentaje_ordenes_exitosas = (exitosas / total_ordenes) * 100,
            puntuacion_usuario = (exitosas / total_ordenes) * 100
        WHERE id_usuario = id_vendedor;

    END IF;
END;
//

DELIMITER ;

--insertar usuarios de ejemplo

-- Vendedor
INSERT INTO usuarios (
    nombre, apellidos, fecha_nacimiento, pais_residencia, ciudad_residencia,
    nacionalidad, tipo_documento, documento_identidad, numero_telefono
) VALUES (
    'Carlos', 'Rojas', '1990-04-12', 'Bolivia', 'La Paz',
    'Boliviana', 'CI', '12345678LP', '+59170000001'
);

-- Comprador
INSERT INTO usuarios (
    nombre, apellidos, fecha_nacimiento, pais_residencia, ciudad_residencia,
    nacionalidad, tipo_documento, documento_identidad, numero_telefono
) VALUES (
    'Lucía', 'Gutiérrez', '1995-09-22', 'Bolivia', 'Cochabamba',
    'Boliviana', 'CI', '87654321CB', '+59170000002'
);

-- Asumiendo que el id de Carlos es 1
INSERT INTO publicaciones_venta (
    id_usuario, cantidad_venta, precio_venta_bob, minimo_compra, imagen_qr, reglas_vendedor
) VALUES (
    1, 100.00, 7.10, 10.00, 'qr_carlos.png', 'Solo pagos inmediatos via QR.'
);

-- Compra 1 - Completada
INSERT INTO compras (
    id_publicacion, id_comprador, cantidad_comprada, estado
) VALUES (
    1, 2, 20.00, 'completada'
);

-- Compra 2 - Cancelada
INSERT INTO compras (
    id_publicacion, id_comprador, cantidad_comprada, estado
) VALUES (
    1, 2, 30.00, 'cancelada'
);

-- Compra 3 - En progreso
INSERT INTO compras (
    id_publicacion, id_comprador, cantidad_comprada, estado
) VALUES (
    1, 2, 15.00, 'en progreso'
);

-- Simular que la compra 3 fue completada (esto disparará el trigger)
UPDATE compras
SET estado = 'completada'
WHERE id_compra = 3;

SELECT
    nombre, numero_ordenes_venta, porcentaje_ordenes_exitosas, puntuacion_usuario
FROM usuarios
WHERE id_usuario = 1;


