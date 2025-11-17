"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function NuevaPublicacionForm({ onSuccess }: any) {
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [minimo, setMinimo] = useState("");
  const [maximo, setMaximo] = useState("");
  const [reglas, setReglas] = useState("");
  const [qrFile, setQrFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("cantidad_venta", cantidad);
    formData.append("precio_venta_bob", precio);
    formData.append("minimo_compra", minimo);
    formData.append("maximo_compra", maximo);
    formData.append("reglas_vendedor", reglas);

    if (qrFile) {
      formData.append("imagen_qr", qrFile);
    }

    try {
      await api.post("/p2p/crear_publicacion", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Publicación creada correctamente.");
      onSuccess();     // Refrescar lista
    } catch (error) {
      console.error("Error creando publicación:", error);
    }
  };

  return (
    <div className="form-box">
      <h2>Crear Nueva Publicación</h2>
      <p>Define tus propias condiciones y publica tu anuncio en el mercado P2P.</p>

      <form onSubmit={handleSubmit} className="form-publicacion">

        <label>Cantidad a vender (USDT)</label>
        <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />

        <label>Precio por unidad (BOB)</label>
        <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} />

        <h3>Límite Mínimo</h3>
        <input type="number" value={minimo} onChange={(e) => setMinimo(e.target.value)} />

        <h3>Límite Máximo</h3>
        <input type="number" value={maximo} onChange={(e) => setMaximo(e.target.value)} />

        <h3>QR de pago</h3>
        <div className="qr-upload">
          <input type="file" accept="image/*" onChange={(e: any) => setQrFile(e.target.files[0])} />
        </div>

        <h3>Términos y Condiciones (Opcional)</h3>
        <textarea value={reglas} onChange={(e) => setReglas(e.target.value)} />

        <button className="btn-publicar" type="submit">
          Publicar Anuncio
        </button>
      </form>
    </div>
  );
}
