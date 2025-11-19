"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSolicitudesP2P, aceptarCompra, cancelarCompra } from "@/lib/apiService";

interface HeaderProps {
  userName: string;
  message?: string;
  // callback opcional para abrir el chat desde una solicitud
  onOpenChat?: (id_compra: number) => void;
}

export default function Header({
  userName,
  message = "Bienvenido de nuevo,",
  onOpenChat,
}: HeaderProps) {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    // Cargar solicitudes iniciales
    fetchSolicitudes();

    // Polling cada 10s
    const interval = setInterval(fetchSolicitudes, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const data = await getSolicitudesP2P();
      setSolicitudes(data);
    } catch (e) {
      console.error("Error cargando solicitudes P2P", e);
    }
  };

  const handleAceptar = async (id_compra: number) => {
    try {
      await aceptarCompra(id_compra);
      await fetchSolicitudes();
      setOpenMenu(false);
      onOpenChat && onOpenChat(id_compra);
    } catch (e) {
      console.error("Error aceptando compra", e);
    }
  };

  const handleCancelar = async (id_compra: number) => {
    try {
      await cancelarCompra(id_compra);
      await fetchSolicitudes();
    } catch (e) {
      console.error("Error cancelando compra", e);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="user-info">
        <h2>
          {message} <span className="highlight">{userName}</span>
        </h2>
      </div>

      <div className="header-right">
        {/* Botón de mensajes */}
        <div className="messages-wrapper">
          <button
            className="messages-button"
            onClick={() => setOpenMenu(!openMenu)}
          >
            💬
            {solicitudes.length > 0 && (
              <span className="messages-badge">{solicitudes.length}</span>
            )}
          </button>

          {openMenu && (
            <div className="messages-dropdown">
              {solicitudes.length === 0 && (
                <p className="empty">No tienes solicitudes pendientes</p>
              )}

              {solicitudes.map((s) => (
                <div key={s.id_compra} className="messages-item">
                  <div className="messages-info">
                    <strong>{s.nombre_comprador}</strong>
                    <span>Monto solicitado: {Number(s.monto_bob).toFixed(2)} BOB</span>
                    <span>
                      Recibirá: {Number(s.cantidad_comprada).toFixed(4)} USDT
                    </span>
                  </div>
                  <div className="messages-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => handleCancelar(s.id_compra)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => handleAceptar(s.id_compra)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icono de usuario */}
        <div className="user-icon">
          <Image
            src="/images/user_icon.png"
            alt="Icono de usuario"
            width={45}
            height={45}
            className="icon"
          />
        </div>
      </div>
    </header>
  );
}
