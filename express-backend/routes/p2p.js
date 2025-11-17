import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db.js";

const router = express.Router();

/* ============================
   🔐 MIDDLEWARE: verificar sesión
   ============================ */
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Sesión no iniciada" });
  }
  next();
}

/* ==================================
   📁 CONFIGURACIÓN MULTER (Subir QR)
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
   1️⃣ LISTAR PUBLICACIONES ACTIVAS (Intercambio P2P)
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
   2️⃣ CREAR PUBLICACIÓN DEL USUARIO
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
   3️⃣ LISTAR PUBLICACIONES ACTIVAS DEL USUARIO
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
   4️⃣ CANCELAR PUBLICACIÓN (estado → cancelada)
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

export default router;
