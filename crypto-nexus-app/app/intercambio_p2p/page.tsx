"use client";

import "../dashboard/dashboard.css";
import { getP2P } from "@/lib/apiService";
import "./p2p.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useEffect, useState, useCallback } from "react";
import P2PBlock from "./P2PBlock";
import {
  crearCompraP2P,
  getParametros,
  getDetalleCompra,
  getChatMensajes,
  enviarChatMensaje,
  cancelarCompra,
  completarCompra,
  subirVoucher,
  getUserSession,
} from "@/lib/apiService";

export default function IntercambioP2P() {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [orden, setOrden] = useState("precio");
  const [usuarioActual, setUsuarioActual] = useState<any>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const publicacionesPorPagina = 5;

  // Modal compra
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPub, setSelectedPub] = useState<any | null>(null);
  const [montoPagar, setMontoPagar] = useState<number>(0);
  const [recibiras, setRecibiras] = useState<number>(0);
  const [tasaComision, setTasaComision] = useState<number>(0);

  // Espera confirmación
  const [showWaiting, setShowWaiting] = useState(false);
  const [compraId, setCompraId] = useState<number | null>(null);

  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMensajes, setChatMensajes] = useState<any[]>([]);
  const [detalleCompra, setDetalleCompra] = useState<any | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState<number>(0); // en segundos
  
  // Voucher
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const u = await getUserSession();
        setUsuarioActual(u);
      } catch (e) {
        console.error("Error obteniendo usuario actual", e);
      }
    };
    cargarUsuario();
  }, []);


  // --------------------------------------------
  // Cargar P2P
  useEffect(() => {
    getP2P().then((data) => {
      if (orden === "precio") {
        data.sort(
          (a: any, b: any) => a.precio_venta_bob - b.precio_venta_bob
        );
      }
      setPublicaciones(data);
      setPaginaActual(1);
    });
  }, [orden]);

  const indexInicial = (paginaActual - 1) * publicacionesPorPagina;
  const indexFinal = indexInicial + publicacionesPorPagina;
  const publicacionesPag = publicaciones.slice(indexInicial, indexFinal);
  const totalPaginas = Math.ceil(publicaciones.length / publicacionesPorPagina);

  // --------------------------------------------
  // Abrir modal de compra
  const handleComprar = async (pub: any) => {
    setSelectedPub(pub);
    setMontoPagar(0);
    setRecibiras(0);

    try {
      const param = await getParametros();
      setTasaComision(Number(param.taza_comision));
    } catch (e) {
      console.error("Error obteniendo parámetros", e);
    }

    setShowBuyModal(true);
  };

  // Recalcular recibiras al cambiar monto
  useEffect(() => {
    if (!selectedPub || !tasaComision || !montoPagar) {
      setRecibiras(0);
      return;
    }
    const A = montoPagar;
    const B = Number(selectedPub.precio_venta_bob);
    const C = tasaComision;
    const r = A / B - C;
    setRecibiras(r > 0 ? r : 0);
  }, [montoPagar, selectedPub, tasaComision]);

  // Confirmar compra desde modal
  const confirmarCompra = async () => {
    if (!selectedPub) return;
    try {
      const data = await crearCompraP2P(
        selectedPub.id_publicacion,
        montoPagar
      );
      setCompraId(data.id_compra);
      setShowBuyModal(false);
      setShowWaiting(true);
      // El comprador esperará hasta que el proveedor acepte (pooling leve en abrirChat)
    } catch (e: any) {
      console.error("Error creando compra", e);
      alert(e.response?.data?.message || "Error al crear compra");
    }
  };

  // --------------------------------------------
  // Chat: carga mensajes periódicamente
  const loadChat = useCallback(async (id_compra: number) => {
    try {
      const msgs = await getChatMensajes(id_compra);
      setChatMensajes(msgs);
    } catch (e) {
      console.error("Error cargando chat", e);
    }
  }, []);

  useEffect(() => {
    if (!showChat || !compraId) return;

    // Timer 15 minutos
    setTiempoRestante(15 * 60);
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // cancelar compra en backend
          if (compraId) {
            cancelarCompra(compraId);
          }
          setShowChat(false);
          alert("Tiempo agotado, la compra ha sido cancelada");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling mensajes cada 3s
    loadChat(compraId);
    const interval = setInterval(() => {
      loadChat(compraId);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [showChat, compraId, loadChat]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !compraId) return;
    try {
      await enviarChatMensaje(compraId, nuevoMensaje.trim());
      setNuevoMensaje("");
      await loadChat(compraId);
    } catch (e) {
      console.error("Error enviando mensaje", e);
    }
  };

  const handleCancelarChat = async () => {
    if (!compraId) return;
    await cancelarCompra(compraId);
    setShowChat(false);
  };

  const handleCompletarChat = async () => {
    if (!compraId) return;
    try {
      const res = await completarCompra(compraId);
      alert(res.message || "Confirmación registrada");
      // Si la otra parte ya confirmó, backend liquida y podemos cerrar
      setShowChat(false);
      window.location.href = "/dashboard";
    } catch (e: any) {
      console.error("Error completando compra", e);
      alert(e.response?.data?.message || "Error al completar compra");
    }
  };

  // --------------------------------------------
  // Abrir chat desde Header (proveedor)
  const abrirChatDesdeHeader = async (id_compra: number) => {
    setCompraId(id_compra);
    setShowWaiting(false);
    setShowChat(true);
    const detalle = await getDetalleCompra(id_compra);   // ✔ NUEVO
    setDetalleCompra(detalle);                           // ✔ NUEVO
    await loadChat(id_compra);
  };

  // Abrir chat para comprador (cuando proveedor ya aceptó)
  const abrirChatComoComprador = async () => {
    if (!compraId) return;
    setShowWaiting(false);
    setShowChat(true);
    const detalle = await getDetalleCompra(compraId);     // ✔ NUEVO
    setDetalleCompra(detalle);                            // ✔ NUEVO

    await loadChat(compraId);
  };

  // --------------------------------------------
  // Helpers UI
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };
  const enviarVoucher = async () => {
    if (!voucherFile || !compraId) return;

    try {
      await subirVoucher(compraId, voucherFile);
      setVoucherFile(null);
      await loadChat(compraId);
    } catch (e) {
      console.error("Error enviando voucher:", e);
    }
  };
  const soyComprador =
  usuarioActual &&
  detalleCompra &&
  usuarioActual.id_usuario === detalleCompra.id_comprador;
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header
          userName=""
          message="Intercambio P2P"
          onOpenChat={abrirChatDesdeHeader}
        />

        <div className="p2p-container">
          {/* BUSCADOR */}
          <div className="p2p-search-bar">
            <input
              type="number"
              placeholder="Buscar por monto"
              className="p2p-search-input"
            />
            <button className="p2p-search-btn">Buscar</button>

            <div className="p2p-sort">
              <label>Ordenar por:</label>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="p2p-sort-select"
              >
                <option value="precio">Precio</option>
              </select>
            </div>
          </div>

          {/* CABECERA */}
          <div className="p2p-header">
            <span className="col-anunciante">Anunciante</span>
            <span className="col-precio">Precio</span>
            <span className="col-disponible">Disponible</span>
            <span className="col-limite">Límite de órdenes</span>
            <span className="col-operacion">Operación</span>
          </div>

          {/* LISTA */}
          <div className="p2p-grid">
            {publicacionesPag.map((item: any) => (
              <P2PBlock
                key={item.id_publicacion}
                data={item}
                onComprar={handleComprar}
              />
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              « Anterior
            </button>

            <span>
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente »
            </button>
          </div>
        </div>
      </div>

      {/* MODAL COMPRA */}
      {showBuyModal && selectedPub && (
        <div className="modal-overlay">
          <div className="modal-box modal-premium">

            {/* Botón X */}
            <button className="modal-close" onClick={() => setShowBuyModal(false)}>
              ✕
            </button>

            <h2 className="modal-title">Comprar USDT</h2>

            {/* DATOS BÁSICOS */}
            <div className="modal-section">
              <p><strong>Precio:</strong> {Number(selectedPub.precio_venta_bob).toFixed(2)} BOB</p>
              <p><strong>Comisión:</strong> {tasaComision} USDT</p>
            </div>

            {/* Pagarás */}
            <div className="modal-field">
              <label>Pagarás</label>
              <div className="modal-input-group">
                <input
                  type="number"
                  value={montoPagar}
                  onChange={(e) => setMontoPagar(Number(e.target.value))}
                />
                <span className="input-addon">BOB</span>
              </div>
            </div>

            {/* Recibirás */}
            <div className="modal-field">
              <label>Recibirás</label>
              <div className="modal-input-group">
                <input type="text" value={recibiras.toFixed(6)} readOnly />
                <span className="input-addon">USDT</span>
              </div>
            </div>

            {/* CONDICIONES ANUNCIANTE */}
            <div className="modal-section reglas-box">
              <h3>Condiciones del anunciante</h3>
              <p>{selectedPub.reglas_vendedor}</p>
            </div>

            {/* BOTONES */}
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowBuyModal(false)}>
                Cancelar
              </button>

              <button className="btn-buy" onClick={confirmarCompra}>
                Comprar USDT
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL ESPERANDO PROVEEDOR */}
      {showWaiting && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3 className="modal-title">Esperando confirmación…</h3>
            <p>Cuando el proveedor acepte, se abrirá el chat automáticamente.</p>

            <div className="loader" />

            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => {
                  if (compraId) cancelarCompra(compraId);
                  setShowWaiting(false);
                }}
              >
                Cancelar
              </button>

              <button
                className="btn-buy"
                onClick={abrirChatComoComprador}
                disabled={!compraId}
              >
                Ir al chat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CHAT */}
      {showChat && compraId && (
        <div className="modal-overlay">
          <div className="modal-box modal-chat">

            {/* HEADER DEL CHAT */}
            <div className="chat-header">
              <h3 className="modal-title">Chat de compra #{compraId}</h3>
              <span className="timer">Tiempo: {formatTime(tiempoRestante)}</span>
            </div>

            <p className="warning">
              ⚠ No presionar <strong>Completado</strong> hasta confirmar la transacción.
            </p>

            {/* QR DEL VENDEDOR (solo si existe) */}
            {soyComprador && detalleCompra?.imagen_qr && (
              <div className="qr-box">
                <img
                  src={`${backendURL.replace("/api","")}/uploads_qr/${detalleCompra.imagen_qr}`}
                  className="qr-img chat-qr"
                  onClick={() =>
                    setPreviewImage(
                      `${backendURL.replace("/api","")}/uploads_qr/${detalleCompra.imagen_qr}`
                    )
                  }
                />
              </div>
            )}

            {/* MENSAJES DEL CHAT */}
            <div className="chat-messages">

              {chatMensajes.map((m) => (
                <div
                  key={m.id_chat}
                  className={`chat-message ${m.es_mio ? "mine" : "theirs"}`}
                >
                  {/* MENSAJE DE TEXTO */}
                  {m.mensaje && <p>{m.mensaje}</p>}

                  {/* VOUCHER */}
                  {m.imagen_voucher && typeof m.imagen_voucher === "string" && (
                    <div className="voucher-bubble">
                      {m.imagen_voucher.toLowerCase().endsWith(".pdf") ? (
                        <a
                          href={`${backendURL.replace("/api", "")}/uploads_vouchers/${m.imagen_voucher}`}
                          target="_blank"
                          className="voucher-pdf"
                        >
                          📄 Ver PDF
                        </a>
                      ) : (
                        <img
                          src={`${backendURL.replace("/api", "")}/uploads_vouchers/${m.imagen_voucher}`}
                          className="voucher-img"
                          alt="voucher"
                          onClick={() =>
                            setPreviewImage(
                              `${backendURL.replace("/api", "")}/uploads_vouchers/${m.imagen_voucher}`
                            )
                          }
                        />
                      )}
                    </div>
                  )}

                  <span className="time">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}

            </div>

            {/* INPUT DE MENSAJE */}
            <div className="chat-input">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje…"
              />
              <button className="btn-buy" onClick={enviarMensaje}>Enviar</button>
            </div>

            {/* INPUT DE ARCHIVO (VOUCHER) */}
           {soyComprador && (
              <div className="voucher-upload">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setVoucherFile(e.target.files?.[0] || null)}
                />
                <button className="btn-buy" onClick={enviarVoucher}>
                  Enviar archivo
                </button>
              </div>
            )}

            {/* BOTONES FINALES */}
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={handleCancelarChat}>Cancelar</button>
              <button className="btn-buy" onClick={handleCompletarChat}>Completado</button>
            </div>

          </div>
        </div>
      )}
      {/* MODAL DE PREVISUALIZACIÓN DE VOUCHER */}
      {previewImage && (
        <div
          className="preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div className="preview-box" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreviewImage(null)}>
              ✕
            </button>
            <img src={previewImage} className="preview-img" alt="voucher full" />
          </div>
        </div>
      )}
    </div>
  );
}
