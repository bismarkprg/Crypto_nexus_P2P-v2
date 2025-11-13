import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// POST /register_form
router.post("/register_form", async (req, res) => {
  const userId = req.session.user_id;
  if (!userId) return res.status(401).json({ message: "No autenticado" });

  const {
    nombre_completo,
    fecha_nacimiento,
    pais_residencia,
    ciudad_residencia,
    nacionalidad,
    tipo_documento,
    documento_identidad,
    numero_telefono,
  } = req.body;

  try {
    await pool.query(
      `UPDATE usuarios SET
        nombre_completo=?, fecha_nacimiento=?, pais_residencia=?,
        ciudad_residencia=?, nacionalidad=?, tipo_documento=?,
        documento_identidad=?, numero_telefono=?
        WHERE id_usuario=?`,
      [
        nombre_completo,
        fecha_nacimiento,
        pais_residencia,
        ciudad_residencia,
        nacionalidad,
        tipo_documento,
        documento_identidad,
        numero_telefono,
        userId,
      ]
    );
    res.json({ message: "Datos actualizados correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar", error: err.message });
  }
});

// GET /dashboard
router.get("/dashboard", async (req, res) => {
  if (!req.session.user_id)
    return res.status(401).json({ message: "Debe iniciar sesión" });

  try {
    const [rows] = await pool.query(
      `SELECT nombre, balance_total, saldo_cripto, saldo_fondo_ahorro, saldo_publicacion_venta
       FROM usuarios WHERE id_usuario=?`,
      [req.session.user_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(rows[0]); // 🔹 Devolvemos directamente los campos
  } catch (err) {
    res.status(500).json({ message: "Error al obtener datos", error: err.message });
  }
});


export default router;
