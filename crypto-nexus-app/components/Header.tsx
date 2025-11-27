"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getSolicitudesP2P, aceptarCompra, cancelarCompra } from "@/lib/apiService";
import { logoutUser } from "@/lib/apiService";

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
        setUserMenu(false);
      }
    } 

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);//Hook para cerrar menus al hacer click afuera


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
    // 1. Marcar en backend que la compra fue aceptada
    const res = await aceptarCompra(id_compra);

    // 2. Actualizar las solicitudes del vendedor
    await fetchSolicitudes();

    // 3. Cerrar el menú emergente de notificación
    setOpenMenu(false);

    // 4. Abrir chat en page.tsx (MODAL CHAT)
    if (onOpenChat) {
      onOpenChat(id_compra);
    }

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

  const handleLogout = async () => {
    try {
      await logoutUser();                 // Cierre de sesión real
      window.location.href = "/";    // redirección a la pagina de inicio
    } catch (e) {
      console.error("Error cerrando sesión:", e);
    }
  };

  const [userMenu, setUserMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <header className="dashboard-header">
      <div className="user-info">
        <h2>
          {message} <span className="highlight">{userName}</span>
        </h2>
      </div>

      <div className="header-right" ref={wrapperRef}>
        {/* Botón de mensajes */}
        <div className="messages-wrapper">
          <button
            className="messages-button"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <Image
            src="/images/icon/envelope.png"
            alt="Icono mensajes"
            width={35}
            height={35}
            className="icon"
          />
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
        {/* Icono de usuario con menú */}
        <div className="user-icon-wrapper">
          <button
            className="user-icon-button"
            onClick={() => setUserMenu(!userMenu)}
          >
            <Image
              src="/images/user_icon.png"
              alt="Usuario"
              width={70}
              height={70}
              className="icon"
            />
          </button>

          {userMenu && (
            <div className="user-dropdown">
              <button
                className="user-dropdown-item"
                onClick={() => window.location.href = "/perfil"}   // ← ajusta la ruta si deseas otra
              >
                Editar perfil
              </button>

              <button
                className="user-dropdown-item logout"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
