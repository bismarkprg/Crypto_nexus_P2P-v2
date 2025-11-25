-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2025 a las 22:18:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cryptonexus`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `id_admin` int(11) NOT NULL,
  `nombre_admin` varchar(100) NOT NULL,
  `email_admin` varchar(150) NOT NULL,
  `password_admin` char(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id_admin`, `nombre_admin`, `email_admin`, `password_admin`, `fecha_creacion`, `estado`) VALUES
(1, 'bismark', 'admin1@gmail.com', '123456', '2025-11-17 17:44:35', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ahorros`
--

CREATE TABLE `ahorros` (
  `id_ahorro` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cantidad_invertida` decimal(18,8) DEFAULT NULL,
  `tasa_interes` decimal(5,2) DEFAULT 7.00,
  `fecha_inicio` datetime DEFAULT current_timestamp(),
  `fecha_fin` datetime DEFAULT NULL,
  `ganancia` decimal(18,2) DEFAULT NULL,
  `tipo` enum('fijo','flexible') DEFAULT 'fijo',
  `estado` enum('activo','finalizado') DEFAULT 'activo',
  `tasa_aplicada` decimal(5,2) DEFAULT NULL,
  `apy_aplicado` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_eventos`
--

CREATE TABLE `auditoria_eventos` (
  `id_evento` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `tipo_evento` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_evento` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cambios_directos`
--

CREATE TABLE `cambios_directos` (
  `id_cambio` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cantidad_bob` decimal(18,2) DEFAULT NULL,
  `cantidad_usdt` decimal(18,8) DEFAULT NULL,
  `comision_aplicada` decimal(5,2) DEFAULT 5.00,
  `fecha_cambio` datetime DEFAULT current_timestamp(),
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_compras`
--

CREATE TABLE `chat_compras` (
  `id_chat` int(11) NOT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `emisor` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `imagen_voucher` longblob DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comisiones_globales`
--

CREATE TABLE `comisiones_globales` (
  `id_comision` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_operacion` enum('cambio_directo','p2p_compra','p2p_venta','transferencia','ahorro_fijo','staking_flexible','retiro','deposito') NOT NULL,
  `id_referencia` int(11) NOT NULL,
  `monto_usdt` decimal(18,8) NOT NULL,
  `porcentaje_comision` decimal(5,2) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `id_publicacion` int(11) DEFAULT NULL,
  `id_comprador` int(11) DEFAULT NULL,
  `cantidad_comprada` decimal(18,8) DEFAULT NULL,
  `fecha_compra` datetime DEFAULT current_timestamp(),
  `estado` enum('en progreso','completada','cancelada') DEFAULT 'en progreso'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Disparadores `compras`
--
DELIMITER $$
CREATE TRIGGER `actualizar_puntuacion_usuario` AFTER UPDATE ON `compras` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parametros_financieros`
--

CREATE TABLE `parametros_financieros` (
  `id_parametro` int(11) NOT NULL,
  `taza_comision` decimal(5,3) NOT NULL,
  `apr_ahorro_fijo` decimal(5,2) NOT NULL,
  `apy_ahorro_fijo` decimal(5,2) NOT NULL,
  `apr_staking_flexible` decimal(5,2) NOT NULL,
  `minimo_ahorro_fijo` decimal(18,2) NOT NULL,
  `minimo_staking_flexible` decimal(18,2) NOT NULL,
  `fecha_inicio_vigencia` date NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `parametros_financieros`
--

INSERT INTO `parametros_financieros` (`id_parametro`, `taza_comision`, `apr_ahorro_fijo`, `apy_ahorro_fijo`, `apr_staking_flexible`, `minimo_ahorro_fijo`, `minimo_staking_flexible`, `fecha_inicio_vigencia`, `fecha_registro`, `id_admin`) VALUES
(1, 0.000, 0.07, 0.08, 0.05, 100.00, 150.00, '2025-11-17', '2025-11-17 17:45:15', NULL),
(2, 0.000, 0.08, 0.08, 0.05, 100.00, 149.00, '2025-11-18', '2025-11-18 07:50:05', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones_venta`
--

CREATE TABLE `publicaciones_venta` (
  `id_publicacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `cantidad_venta` decimal(18,8) DEFAULT NULL,
  `precio_venta_bob` decimal(18,2) DEFAULT NULL,
  `minimo_compra` decimal(18,2) DEFAULT NULL,
  `maximo_compra` decimal(18,2) DEFAULT NULL,
  `imagen_qr` longblob DEFAULT NULL,
  `reglas_vendedor` text DEFAULT NULL,
  `estado` enum('activa','completada','cancelada') DEFAULT 'activa',
  `fecha_publicacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `descripcion`) VALUES
(1, 'Administrador', 'Acceso completo al sistema. Puede gestionar usuarios, transacciones y configuraciones.'),
(2, 'Usuario', 'Acceso limitado para operaciones básicas.'),
(3, 'Supervisor', 'Acceso intermedio. Puede supervisar operaciones, pero no modificar configuraciones críticas.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transferencias`
--

CREATE TABLE `transferencias` (
  `id_transferencia` int(11) NOT NULL,
  `id_emisor` int(11) DEFAULT NULL,
  `id_receptor` int(11) DEFAULT NULL,
  `cantidad` decimal(18,8) DEFAULT NULL,
  `fecha_transferencia` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `nombre_completo` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `pais_residencia` varchar(50) DEFAULT NULL,
  `ciudad_residencia` varchar(50) DEFAULT NULL,
  `nacionalidad` varchar(50) DEFAULT NULL,
  `tipo_documento` varchar(20) DEFAULT NULL,
  `documento_identidad` varchar(30) DEFAULT NULL,
  `numero_telefono` varchar(20) DEFAULT NULL,
  `password` char(255) NOT NULL,
  `numero_ordenes_venta` int(11) DEFAULT 0,
  `porcentaje_ordenes_exitosas` decimal(5,2) DEFAULT 0.00,
  `puntuacion_usuario` decimal(5,2) DEFAULT 0.00,
  `saldo_cripto` decimal(18,8) DEFAULT 0.00000000,
  `saldo_fondo_ahorro` decimal(18,8) DEFAULT 0.00000000,
  `saldo_publicacion_venta` decimal(18,8) DEFAULT 0.00000000,
  `balance_total` decimal(18,8) DEFAULT 0.00000000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `nombre_completo`, `email`, `fecha_nacimiento`, `pais_residencia`, `ciudad_residencia`, `nacionalidad`, `tipo_documento`, `documento_identidad`, `numero_telefono`, `password`, `numero_ordenes_venta`, `porcentaje_ordenes_exitosas`, `puntuacion_usuario`, `saldo_cripto`, `saldo_fondo_ahorro`, `saldo_publicacion_venta`, `balance_total`) VALUES
(1, 'bisk', 'Bismark Valenzuela Chamuco', 'usuario@mail.com', '2000-03-02', 'bolivia', 'la paz', 'boliviano', 'id', '8451263', '78451296', '$2a$10$QNatMUz735C9vdQtraYCbO4j8cHKufJXd8rAE1ZA.1OHrCvDDp5TK', 0, 0.00, 0.00, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(2, 'Juan', 'Juan de dios', 'usuario2@mail.com', '2001-08-21', 'bolivia', 'cochabamba', 'boliviano', 'id', '8945623', '74628591', '$2a$10$ebmcJZ/EFRds/MXr2xhAheEybtucRURNYCeLPsAsstDtjwrN00tVi', 0, 92.00, 95.00, 250.00000000, 1000.00000000, 860.00000000, 2110.00000000),
(3, 'Pablo', 'pablo iglesias posting', 'usuario3@mail.com', '2005-05-02', 'bolivia', 'la paz', 'boliviano', 'id', '6295485', '71122549', '$2a$10$ohYhMb9kj25.PxVxe1z0zu6FrfrIa1VXWIMnQqU8eMjbvi4AykHzC', 0, 0.00, 0.00, 0.00000000, 0.00000000, 0.00000000, 0.00000000),
(4, 'Poli', 'Policarpo Sanchez Martinez', 'usuario4@gmail.com', '2000-02-03', 'bolivia', 'la paz', 'boliviano', 'id', '6546298', '75894622', '$2a$10$2q90NGUrdPfiTG8cFOgbTuWVwbx2NfoJ6GF9UhiRBTeQJg65gasFy', 456, 100.00, 98.00, 5000.00000000, 456.00000000, 894.00000000, 6350.00000000);

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `actualizar_saldo_total` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
    -- Solo actualiza si alguna de las columnas que contribuyen al total ha cambiado
    IF NEW.saldo_cripto <> OLD.saldo_cripto OR
       NEW.saldo_fondo_ahorro <> OLD.saldo_fondo_ahorro OR
       NEW.saldo_publicacion_venta <> OLD.saldo_publicacion_venta THEN
        SET NEW.balance_total = NEW.saldo_cripto + NEW.saldo_fondo_ahorro + NEW.saldo_publicacion_venta;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `calcular_saldo_total` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
    SET NEW.balance_total = NEW.saldo_cripto + NEW.saldo_fondo_ahorro + NEW.saldo_publicacion_venta;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_asignacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id_usuario`, `id_rol`, `fecha_asignacion`) VALUES
(1, 1, '2025-11-11 13:07:02'),
(1, 2, '2025-11-11 13:07:02'),
(2, 2, '2025-11-11 13:07:02'),
(3, 2, '2025-11-11 13:07:02');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email_admin` (`email_admin`);

--
-- Indices de la tabla `ahorros`
--
ALTER TABLE `ahorros`
  ADD PRIMARY KEY (`id_ahorro`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `auditoria_eventos`
--
ALTER TABLE `auditoria_eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indices de la tabla `cambios_directos`
--
ALTER TABLE `cambios_directos`
  ADD PRIMARY KEY (`id_cambio`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indices de la tabla `chat_compras`
--
ALTER TABLE `chat_compras`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `emisor` (`emisor`);

--
-- Indices de la tabla `comisiones_globales`
--
ALTER TABLE `comisiones_globales`
  ADD PRIMARY KEY (`id_comision`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_publicacion` (`id_publicacion`),
  ADD KEY `id_comprador` (`id_comprador`);

--
-- Indices de la tabla `parametros_financieros`
--
ALTER TABLE `parametros_financieros`
  ADD PRIMARY KEY (`id_parametro`),
  ADD KEY `parametros_financieros_ibfk_1` (`id_admin`);

--
-- Indices de la tabla `publicaciones_venta`
--
ALTER TABLE `publicaciones_venta`
  ADD PRIMARY KEY (`id_publicacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `transferencias`
--
ALTER TABLE `transferencias`
  ADD PRIMARY KEY (`id_transferencia`),
  ADD KEY `id_emisor` (`id_emisor`),
  ADD KEY `id_receptor` (`id_receptor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento_identidad` (`documento_identidad`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id_usuario`,`id_rol`),
  ADD KEY `usuario_rol_ibfk_2` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ahorros`
--
ALTER TABLE `ahorros`
  MODIFY `id_ahorro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de la tabla `auditoria_eventos`
--
ALTER TABLE `auditoria_eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cambios_directos`
--
ALTER TABLE `cambios_directos`
  MODIFY `id_cambio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de la tabla `chat_compras`
--
ALTER TABLE `chat_compras`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comisiones_globales`
--
ALTER TABLE `comisiones_globales`
  MODIFY `id_comision` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=465;

--
-- AUTO_INCREMENT de la tabla `parametros_financieros`
--
ALTER TABLE `parametros_financieros`
  MODIFY `id_parametro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `publicaciones_venta`
--
ALTER TABLE `publicaciones_venta`
  MODIFY `id_publicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `transferencias`
--
ALTER TABLE `transferencias`
  MODIFY `id_transferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ahorros`
--
ALTER TABLE `ahorros`
  ADD CONSTRAINT `ahorros_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `auditoria_eventos`
--
ALTER TABLE `auditoria_eventos`
  ADD CONSTRAINT `auditoria_eventos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `auditoria_eventos_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`);

--
-- Filtros para la tabla `cambios_directos`
--
ALTER TABLE `cambios_directos`
  ADD CONSTRAINT `cambios_directos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `cambios_directos_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`);

--
-- Filtros para la tabla `chat_compras`
--
ALTER TABLE `chat_compras`
  ADD CONSTRAINT `chat_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `chat_compras_ibfk_2` FOREIGN KEY (`emisor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `comisiones_globales`
--
ALTER TABLE `comisiones_globales`
  ADD CONSTRAINT `comisiones_globales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `comisiones_globales_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones_venta` (`id_publicacion`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_comprador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `parametros_financieros`
--
ALTER TABLE `parametros_financieros`
  ADD CONSTRAINT `parametros_financieros_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`);

--
-- Filtros para la tabla `publicaciones_venta`
--
ALTER TABLE `publicaciones_venta`
  ADD CONSTRAINT `publicaciones_venta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `transferencias`
--
ALTER TABLE `transferencias`
  ADD CONSTRAINT `transferencias_ibfk_1` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `transferencias_ibfk_2` FOREIGN KEY (`id_receptor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
