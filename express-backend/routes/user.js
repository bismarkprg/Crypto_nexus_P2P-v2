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

  const [rows] = await pool.query(
    "SELECT nombre FROM usuarios WHERE id_usuario=?",
    [req.session.user_id]
  );
  res.json({ message: "Bienvenido al dashboard", user: rows[0] });
});

export default router;
