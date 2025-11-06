import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, repeat_password } = req.body;

    if (password !== repeat_password) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ message: "La contraseña debe tener letras y números" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    req.session.user_id = result.insertId;
    res.status(201).json({ message: "Usuario registrado correctamente", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar", error: err.message });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre, password FROM usuarios WHERE nombre = ?",
      [username]
    );
    if (rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    req.session.user_id = user.id_usuario;
    res.json({ message: "Login exitoso", user: { id: user.id_usuario, nombre: user.nombre } });
  } catch (err) {
    res.status(500).json({ message: "Error en el login", error: err.message });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Sesión cerrada" });
  });
});

export default router;
