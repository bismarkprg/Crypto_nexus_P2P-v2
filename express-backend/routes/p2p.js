import express from "express";
import { pool } from "../db.js";

const router = express.Router();

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
      WHERE pv.estado = 'activa'   -- ✔ SOLO publicaciones activas
      ORDER BY pv.precio_venta_bob ASC`
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo publicaciones" });
  }
});

export default router;
