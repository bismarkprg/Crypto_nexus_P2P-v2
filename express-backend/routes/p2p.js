import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db.js";

const router = express.Router();

/* ============================
    MIDDLEWARE: verificar sesión
   ============================ */
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Sesión no iniciada" });
  }
  next();
}

/* ==================================
    CONFIGURACIÓN MULTER (Subir QR)
   ================================== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_qr/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* =====================================================
   1️ LISTAR PUBLICACIONES ACTIVAS (Intercambio P2P)
   ===================================================== */

router.get("/p2p/listar", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        pv.id_publicacion,
        pv.precio_venta_bob,
        pv.cantidad_venta,
        pv.minimo_compra,
        pv.maximo_compra,
        pv.reglas_vendedor,
        pv.imagen_qr,
        u.id_usuario,
        u.nombre,
        u.numero_ordenes_venta,
        u.porcentaje_ordenes_exitosas,
        u.pais_residencia,
        u.puntuacion_usuario
      FROM publicaciones_venta pv
      INNER JOIN usuarios u ON pv.id_usuario = u.id_usuario
      WHERE pv.estado = 'activa'
      ORDER BY pv.precio_venta_bob ASC`
    );

    res.json(rows);

  } catch (err) {
    console.error("Error cargando publicaciones activas:", err);
    res.status(500).json({ error: "Error obteniendo publicaciones" });
  }
});

/* =====================================================
   2️ CREAR PUBLICACIÓN DEL USUARIO
   ===================================================== */

router.post("/p2p/crear_publicacion", requireLogin, upload.single("imagen_qr"), async (req, res) => {
  try {
    const {
      cantidad_venta,
      precio_venta_bob,
      minimo_compra,
      maximo_compra,
      reglas_vendedor
    } = req.body;

    if (!cantidad_venta || !precio_venta_bob || !minimo_compra || !maximo_compra) {
      return res.status(400).json({ error: "Todos los campos son obligatorios excepto reglas" });
    }

    const imagen_qr = req.file ? req.file.filename : null;

    await pool.query(
      `INSERT INTO publicaciones_venta 
       (id_usuario, cantidad_venta, precio_venta_bob, minimo_compra, maximo_compra, reglas_vendedor, imagen_qr, fecha_publicacion, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'activa')`,
      [
        req.session.userId,
        cantidad_venta,
        precio_venta_bob,
        minimo_compra,
        maximo_compra,
        reglas_vendedor || "",
        imagen_qr
      ]
    );

    res.json({ message: "Publicación creada correctamente" });

  } catch (err) {
    console.error("Error creando publicación:", err);
    res.status(500).json({ error: "Error creando publicación" });
  }
});

/* =====================================================
   3️ LISTAR PUBLICACIONES ACTIVAS DEL USUARIO
   ===================================================== */

router.get("/p2p/mis_publicaciones", requireLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_publicacion, precio_venta_bob, minimo_compra, maximo_compra,
              cantidad_venta, fecha_publicacion, estado
       FROM publicaciones_venta
       WHERE id_usuario = ? AND estado = 'activa'
       ORDER BY fecha_publicacion DESC`,
      [req.session.userId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Error obteniendo mis publicaciones:", err);
    res.status(500).json({ error: "Error obteniendo mis publicaciones" });
  }
});

/* =====================================================
   4️ CANCELAR PUBLICACIÓN (estado → cancelada)
   ===================================================== */

router.put("/p2p/cancelar_publicacion/:id", requireLogin, async (req, res) => {
  try {
    const idPublicacion = req.params.id;

    await pool.query(
      `UPDATE publicaciones_venta 
       SET estado = 'cancelada'
       WHERE id_publicacion = ? AND id_usuario = ?`,
      [idPublicacion, req.session.userId]
    );

    res.json({ message: "Publicación cancelada correctamente" });

  } catch (err) {
    console.error("Error cancelando publicación:", err);
    res.status(500).json({ error: "Error cancelando publicación" });
  }
});

/* Desde aqui solo es la pestana de chat  NOTA: XD */

/* =====================================================
   OBTENER ÚLTIMA TASA DE COMISIÓN
   ===================================================== */
router.get("/p2p/parametros", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM parametros_financieros ORDER BY fecha_inicio_vigencia DESC LIMIT 1"
    );
    if (!rows.length) return res.status(404).json({ error: "No hay parámetros" });
    res.json(rows[0]);

  } catch (err) {
    console.error("Error obteniendo parámetros:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =====================================================
   CREAR COMPRA P2P (COMPRADOR)
   ===================================================== */
router.post("/p2p/comprar", requireLogin, async (req, res) => {
  try {
    const idComprador = req.session.userId;
    const { id_publicacion, monto_bob } = req.body;

    if (!id_publicacion || !monto_bob) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // Obtener publicación
    const [[pub]] = await pool.query(
      `SELECT * FROM publicaciones_venta 
       WHERE id_publicacion = ? AND estado = 'activa'`,
      [id_publicacion]
    );
    if (!pub) return res.status(404).json({ error: "Publicación no encontrada" });

    // Obtener parámetros financieros (tasa_comision)
    const [[param]] = await pool.query(`
      SELECT * FROM parametros_financieros 
      ORDER BY fecha_inicio_vigencia DESC LIMIT 1
    `);
    const tasaComision = Number(param.taza_comision); // monto fijo en USDT

    const A = Number(monto_bob);
    const B = Number(pub.precio_venta_bob);
    const C = tasaComision;

    const recibiras = A / B - C;
    if (recibiras <= 0) {
      return res.status(400).json({ error: "Monto insuficiente para cubrir comisión" });
    }

    // Validar límites
    if (A < pub.minimo_compra || A > pub.maximo_compra) {
      return res.status(400).json({ error: "Monto fuera de los límites permitidos" });
    }

    // Crear compra en progreso
    const [result] = await pool.query(
      `INSERT INTO compras 
       (id_publicacion, id_comprador, monto_bob, cantidad_comprada, estado)
       VALUES (?, ?, ?, ?, 'en progreso')`,
      [id_publicacion, idComprador, A, recibiras]
    );

    const id_compra = result.insertId;

    res.json({
      id_compra,
      recibiras,
      tasaComision
    });

  } catch (err) {
    console.error("Error creando compra:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =====================================================
   SOLICITUDES PENDIENTES PARA EL PROVEEDOR
   ===================================================== */
router.get("/p2p/solicitudes", requireLogin, async (req, res) => {
  try {
    const idVendedor = req.session.userId;

    const [rows] = await pool.query(
      `SELECT c.id_compra, c.monto_bob, c.cantidad_comprada, c.fecha_compra,
              u.nombre AS nombre_comprador
       FROM compras c
       JOIN publicaciones_venta p ON p.id_publicacion = c.id_publicacion
       JOIN usuarios u ON u.id_usuario = c.id_comprador
       WHERE p.id_usuario = ?
         AND c.estado = 'en progreso'
         AND c.confirmada_proveedor = 0
       ORDER BY c.fecha_compra DESC`,
      [idVendedor]
    );

    res.json(rows);

  } catch (err) {
    console.error("Error obteniendo solicitudes:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =====================================================
   PROVEEDOR ACEPTA COMPRA
   ===================================================== */
router.post("/p2p/compras/:id/aceptar", requireLogin, async (req, res) => {
  try {
    const idVendedor = req.session.userId;
    const id_compra = req.params.id;

    // Verificar que la compra pertenece al vendedor
    const [[row]] = await pool.query(
      `SELECT p.id_usuario AS id_vendedor
       FROM compras c
       JOIN publicaciones_venta p ON p.id_publicacion = c.id_publicacion
       WHERE c.id_compra = ?`,
      [id_compra]
    );

    if (!row || row.id_vendedor !== idVendedor) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await pool.query(
      `UPDATE compras SET confirmada_proveedor = 1 
       WHERE id_compra = ?`,
      [id_compra]
    );

    res.json({ message: "Compra aceptada" });

  } catch (err) {
    console.error("Error aceptando compra:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =====================================================
   CANCELAR COMPRA (COMPRADOR O VENDEDOR)
   ===================================================== */
router.post("/p2p/compras/:id/cancelar", requireLogin, async (req, res) => {
  try {
    const idUsuario = req.session.userId;
    const id_compra = req.params.id;

    const [[row]] = await pool.query(
      `SELECT c.id_comprador, p.id_usuario AS id_vendedor
       FROM compras c
       JOIN publicaciones_venta p ON p.id_publicacion = c.id_publicacion
       WHERE c.id_compra = ?`,
      [id_compra]
    );

    if (!row) return res.status(404).json({ error: "Compra no encontrada" });

    if (![row.id_comprador, row.id_vendedor].includes(idUsuario)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await pool.query(
      `UPDATE compras SET estado = 'cancelada'
       WHERE id_compra = ?`,
      [id_compra]
    );

    res.json({ message: "Compra cancelada" });

  } catch (err) {
    console.error("Error cancelando compra:", err);
    res.status(500).json({ error: "Error interno" });
  }
});


/* =====================================================
   DETALLE COMPLETO DE LA COMPRA (PARA CHAT)
   ===================================================== */
router.get("/p2p/compras/:id/detalle", requireLogin, async (req, res) => {
  try {
    const id_compra = req.params.id;

    const [[row]] = await pool.query(
      `SELECT c.*, 
              p.reglas_vendedor, p.imagen_qr,
              u_v.nombre AS nombre_vendedor,
              u_c.nombre AS nombre_comprador
       FROM compras c
       JOIN publicaciones_venta p ON p.id_publicacion = c.id_publicacion
       JOIN usuarios u_v ON u_v.id_usuario = p.id_usuario
       JOIN usuarios u_c ON u_c.id_usuario = c.id_comprador
       WHERE c.id_compra = ?`,
      [id_compra]
    );

    if (!row) return res.status(404).json({ error: "Compra no encontrada" });

    res.json({
      ...row,
      imagen_qr: row.imagen_qr ? String(row.imagen_qr) : null,
    });

  } catch (err) {
    console.error("Error obteniendo detalle:", err);
    res.status(500).json({ error: "Error interno" });
  }
});


/* =====================================================
   LISTAR MENSAJES DEL CHAT
   ===================================================== */
router.get("/p2p/chat/:id_compra", requireLogin, async (req, res) => {
  try {
    const id_compra = req.params.id_compra;
    const idUsuarioActual = req.session.userId;

    const [rows] = await pool.execute(
      `SELECT id_chat, id_compra, id_usuario, mensaje, imagen_voucher, timestamp
       FROM chat_compras
       WHERE id_compra = ?
       ORDER BY timestamp ASC`,
      [id_compra]
    );

    const mensajes = rows.map((r) => ({
      id_chat: r.id_chat,
      mensaje: r.mensaje ? String(r.mensaje) : "",
      imagen_voucher: r.imagen_voucher ? String(r.imagen_voucher) : null,
      timestamp: r.timestamp,
      es_mio: r.id_usuario === idUsuarioActual,   // ✔ ESTA ES LA LÍNEA CLAVE
    }));

    res.json(mensajes);

  } catch (err) {
    res.status(500).json({ message: "Error cargando chat" });
  }
});


/* =====================================================
   ENVIAR MENSAJE DE CHAT
   ===================================================== */
router.post("/p2p/chat/:id_compra", requireLogin, async (req, res) => {
  try {
    const id_compra = req.params.id_compra;
    const emisor = req.session.userId;
    const { mensaje } = req.body;

    if (!mensaje) return res.status(400).json({ error: "Mensaje vacío" });

    await pool.execute(
      `INSERT INTO chat_compras (id_compra, id_usuario, mensaje, imagen_voucher, es_mio)
      VALUES (?, ?, ?, ?, ?)`,
      [id_compra, req.session.userId, mensaje.trim(), null, true]
    );

    res.json({ message: "Mensaje enviado" });

  } catch (err) {
    console.error("Error enviando mensaje:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =====================================================
   Aplicacion de multer para subir comprobante de pago (paso previo colocando otro destino)
   ===================================================== */
const storageVoucher = multer.diskStorage({
  destination: "uploads_vouchers/",
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + path.extname(file.originalname));
  }
});
const uploadVoucher = multer({ storage: storageVoucher });

/* =====================================================
   SUBIR COMPROBANTE AL CHAT
   ===================================================== */
router.post("/p2p/chat/:id_compra/voucher", uploadVoucher.single("voucher"), async (req, res) => {
  try {
    const id_compra = req.params.id_compra;

    if (!req.file) {
      return res.status(400).json({ message: "No se envió archivo" });
    }

    const filename = req.file.filename;

    await pool.execute(
      `INSERT INTO chat_compras (id_compra, id_usuario, mensaje, imagen_voucher, es_mio)
      VALUES (?, ?, ?, ?, ?)`,
      [id_compra, req.session.userId, null, filename, true]
    );

    res.json({ message: "Voucher subido", filename });
  } catch (err) {
    console.error("Error subiendo voucher:", err);
    res.status(500).json({ message: "Error subiendo voucher" });
  }
});


/* =====================================================
   COMPLETAR COMPRA (AMBAS PARTES)
   ===================================================== */
router.post("/p2p/compras/:id/completar", requireLogin, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const idUsuario = req.session.userId;
    const id_compra = req.params.id;

    await connection.beginTransaction();

    // Obtener datos completos de compra + vendedor + comprador
    const [[compra]] = await connection.query(
      `SELECT c.*, 
              p.id_usuario AS id_vendedor,
              p.cantidad_venta,
              u_c.saldo_cripto AS saldo_comprador,
              u_v.saldo_publicacion_venta
       FROM compras c
       JOIN publicaciones_venta p ON p.id_publicacion = c.id_publicacion
       JOIN usuarios u_c ON u_c.id_usuario = c.id_comprador
       JOIN usuarios u_v ON u_v.id_usuario = p.id_usuario
       WHERE c.id_compra = ? FOR UPDATE`,
      [id_compra]
    );

    if (!compra) {
      await connection.rollback();
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    if (![compra.id_comprador, compra.id_vendedor].includes(idUsuario)) {
      await connection.rollback();
      return res.status(403).json({ error: "No autorizado" });
    }

    // Marcar confirmación
    const campo = idUsuario === compra.id_comprador ? 
      "confirmacion_comprador" : 
      "confirmacion_vendedor";

    await connection.query(
      `UPDATE compras SET ${campo} = 1 WHERE id_compra = ?`,
      [id_compra]
    );

    // Leer confirmaciones
    const [[c2]] = await connection.query(`
      SELECT * FROM compras WHERE id_compra = ? FOR UPDATE
    `, [id_compra]);

    if (!(c2.confirmacion_comprador && c2.confirmacion_vendedor)) {
      await connection.commit();
      return res.json({ message: "Confirmación registrada, esperando a la otra parte" });
    }

    // Ambos confirmaron → liquidar
    const [[param]] = await connection.query(
      "SELECT * FROM parametros_financieros ORDER BY fecha_inicio_vigencia DESC LIMIT 1"
    );
    const tasaComision = Number(param.taza_comision);

    const cant = Number(c2.cantidad_comprada);

    // 1) Abonar al comprador
    await connection.query(
      `UPDATE usuarios 
       SET saldo_cripto = saldo_cripto + ?
       WHERE id_usuario = ?`,
      [cant, c2.id_comprador]
    );

    // 2) Descontar al vendedor
    await connection.query(
      `UPDATE publicaciones_venta 
       SET cantidad_venta = cantidad_venta - ? - ?
       WHERE id_publicacion = ?`,
      [cant, tasaComision, c2.id_publicacion]
    );

    await connection.query(
      `UPDATE usuarios 
       SET saldo_publicacion_venta = saldo_publicacion_venta - ? - ?,
           numero_ordenes_venta = numero_ordenes_venta + 1
       WHERE id_usuario = ?`,
      [cant, tasaComision, compra.id_vendedor]
    );

    // 3) Registrar comisiones globales
    await connection.query(
      `INSERT INTO comisiones_globales
        (id_usuario, tipo_operacion, id_referencia, monto_usdt, porcentaje_comision, id_admin)
       VALUES (?, 'compra', ?, ?, ?, 1)`,
      [compra.id_vendedor, id_compra, cant, tasaComision]
    );

    // 4) Cerrar compra
    await connection.query(
      `UPDATE compras SET estado = 'completada'
       WHERE id_compra = ?`,
      [id_compra]
    );

    await connection.commit();
    res.json({ message: "Transacción completada con éxito" });

  } catch (err) {
    console.error("Error completando compra:", err);
    await connection.rollback();
    res.status(500).json({ error: "Error interno" });

  } finally {
    connection.release();
  }
});



export default router;

