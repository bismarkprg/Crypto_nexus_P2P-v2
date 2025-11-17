import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* ============================================================
   1. OBTENER DATOS COMPLETOS DE INVERSION DEL USUARIO EN SESIÓN
============================================================ */
router.get("/inversion/info/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    // PARAMETROS FINANCIEROS (último registro)
    const [paramRows] = await pool.query(`
      SELECT *
      FROM parametros_financieros
      ORDER BY id_parametro DESC
      LIMIT 1
    `);
    const parametros = paramRows[0];

    // AHORROS ACTIVOS DEL USUARIO
    const [ahorros] = await pool.query(`
      SELECT
        id_ahorro,
        id_usuario,
        cantidad_invertida,
        tasa_interes,
        tasa_aplicada,
        apy_aplicado,
        tipo,
        estado,
        fecha_inicio
      FROM ahorros
      WHERE id_usuario = ? AND estado = 'activo'
      ORDER BY fecha_inicio DESC
    `, [idUsuario]);

    // TOTAL INVERTIDO (solo activos)
    const total = ahorros.reduce(
      (sum, r) => sum + Number(r.cantidad_invertida),
      0
    );

    // APY TOTAL (suma del interés acumulado actual)
    const apyTotal = ahorros.reduce(
      (sum, r) => sum + Number(r.apy_aplicado ?? 0),
      0
    );

    // SALDO DEL USUARIO (nombre real del campo)
    const [[usuario]] = await pool.query(`
      SELECT saldo_cripto
      FROM usuarios
      WHERE id_usuario = ?
    `, [idUsuario]);

    return res.json({
      parametros,
      inversiones: ahorros,
      total_invertido: total,
      apy_total: apyTotal,
      saldo_cripto: usuario.saldo_cripto
    });

  } catch (error) {
    console.error("Error obteniendo info de inversión:", error);
    res.status(500).json({ error: "Error obteniendo info de inversión" });
  }
});


/* ============================================================
   2. CREAR NUEVA INVERSION (FIJO O FLEXIBLE)
============================================================ */
router.post("/inversion/crear", async (req, res) => {
  const { id_usuario, cantidad, tipo } = req.body;

  try {
    // SALDO DEL USUARIO
    const [[usr]] = await pool.query(`
      SELECT saldo_cripto FROM usuarios WHERE id_usuario=?
    `, [id_usuario]);

    // ✔ CORREGIDO: usar saldo_cripto correctamente
    if (Number(cantidad) > Number(usr.saldo_cripto)) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    // PARAMETROS FINANCIEROS
    const [[param]] = await pool.query(`
      SELECT *
      FROM parametros_financieros
      ORDER BY id_parametro DESC 
      LIMIT 1
    `);

    // ✔ tasa correcta según tipo
    const tasa =
      tipo === "fijo"
        ? Number(param.apr_ahorro_fijo)
        : Number(param.apr_staking_flexible);

    // ✔ APY inicial basado en APR real
    const apyInicial = Number(cantidad) * (tasa / 100) * (1 / 365);

    // INSERTAR INVERSION
    await pool.query(`
      INSERT INTO ahorros 
      (id_usuario, cantidad_invertida, tasa_interes, tasa_aplicada, apy_aplicado, tipo, estado, fecha_inicio)
      VALUES (?, ?, ?, ?, ?, ?, 'activo', NOW())
    `, [id_usuario, cantidad, tasa, tasa, apyInicial, tipo]);

    // DESCONTAR SALDO CORRECTO
    await pool.query(`
      UPDATE usuarios SET saldo_cripto = saldo_cripto - ? WHERE id_usuario = ?
    `, [cantidad, id_usuario]);

    res.json({ message: "Inversión creada correctamente" });

  } catch (error) {
    console.log("Error creando inversión:", error);
    res.status(500).json({ error: "Error creando inversión" });
  }
});


/* ============================================================
   3. CERRAR INVERSION FLEXIBLE
============================================================ */
router.post("/inversion/cerrar", async (req, res) => {
  const { id_ahorro, id_usuario, tipo } = req.body;

  try {
    const [[inv]] = await pool.query(`
      SELECT cantidad_invertida, apy_aplicado, tipo
      FROM ahorros
      WHERE id_ahorro = ?
    `, [id_ahorro]);

    if (!inv) return res.status(404).json({ error: "Ahorro no encontrado" });

    if (inv.tipo === "fijo") {
      return res.status(400).json({ error: "No se puede cerrar ahorro fijo antes de 30 días" });
    }

    const total = Number(inv.cantidad_invertida) + Number(inv.apy_aplicado);

    // MARCAR COMO FINALIZADO
    await pool.query(`
      UPDATE ahorros
      SET estado = 'finalizado'
      WHERE id_ahorro = ?
    `, [id_ahorro]);

    // ABONAR AL USUARIO
    await pool.query(`
      UPDATE usuarios
      SET saldo_cripto = saldo_cripto + ?
      WHERE id_usuario = ?
    `, [total, id_usuario]);

    res.json({ message: "Inversión flexible cerrada correctamente" });

  } catch (error) {
    console.error("Error cerrando inversión:", error);
    res.status(500).json({ error: "Error cerrando inversión" });
  }
});

export default router;
