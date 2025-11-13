import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/cotizacion-usdt", async (req, res) => {
  try {
    const response = await axios.get("https://criptoya.com/api/USDT/BOB/0.1");
    const raw = response.data;

    // Convertir en lista de plataformas
    const listaPlataformas = Object.entries(raw)
      .map(([nombre, datos]) => ({
        plataforma: nombre,
        precio: datos?.totalBid ?? null
      }))
      .filter(item => typeof item.precio === "number") // solo válidas
      .slice(0, 6); // máximo 6 plataformas

    res.json({
      plataformas: listaPlataformas,
      raw
    });

  } catch (err) {
    console.error("Error obteniendo cotización:", err.message);
    res.status(500).json({ error: "No se pudo obtener la cotización" });
  }
});

export default router;
