"use client";

import "../dashboard/dashboard.css";
import "./inversion.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useEffect, useState } from "react";
import api from "../../lib/api"; // ← ✔ usamos la instancia configurada

export default function InversionPage() {
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [info, setInfo] = useState<any>(null);

  // Modal
  const [modal, setModal] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [tipoInversion, setTipoInversion] = useState("");

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const inversionesPorPagina = 5;

  /* ==============================================
      1. OBTENER USUARIO DE LA SESIÓN
  =============================================== */
  useEffect(() => {
    api
      .get("/dashboard") // ← Usa baseURL desde .env
      .then((res) => {
        setIdUsuario(res.data.id_usuario);
      })
      .catch((err) => console.log(err));
  }, []);

  /* ==============================================
      2. CARGAR INFO DE INVERSIONES DEL USUARIO
  =============================================== */
  useEffect(() => {
    if (!idUsuario) return;

    api
      .get(`/inversion/info/${idUsuario}`)
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, [idUsuario]);

  if (!info) return <div className="inv-container">Cargando...</div>;

  /* ==============================================
      3. CREAR INVERSION
  =============================================== */
  const invertir = async () => {
    if (!cantidad) return alert("Ingrese un monto");

    try {
      await api.post("/inversion/crear", {
        id_usuario: idUsuario,
        cantidad,
        tipo: tipoInversion,
      });

      alert("Inversión creada correctamente");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al invertir");
    }
  };

  /* ==============================================
      4. CERRAR INVERSION FLEXIBLE
  =============================================== */
  const cerrarFlexible = async (inv: any) => {
    if (!confirm("¿Está seguro de cerrar la operación?")) return;

    await api.post("/inversion/cerrar", {
      id_ahorro: inv.id_ahorro,
      id_usuario: idUsuario,
      tipo: inv.tipo,
    });

    alert("Operación cerrada.");
    window.location.reload();
  };

  /* ==============================================
      5. PAGINACIÓN
  =============================================== */
  const totalPaginas = Math.ceil(info.inversiones.length / inversionesPorPagina);
  const startIndex = (paginaActual - 1) * inversionesPorPagina;

  const inversionesPaginadas = info.inversiones.slice(
    startIndex,
    startIndex + inversionesPorPagina
  );

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header userName="" message="Inversión" />

        <div className="inv-container">
          {/* =============================================
              TARJETAS SUPERIORES
          ============================================== */}
          <div className="inv-top">
            <div className="inv-card">
              <p>Total Invertido</p>
              <h2>${info.total_invertido.toFixed(2)}</h2>
            </div>

            <div className="inv-card">
              <p>Ganancias Totales Estimadas</p>
              <h2 style={{ color: "#42ff60" }}>
                +${info.apy_total.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* =============================================
              OPORTUNIDADES DE INVERSION
          ============================================== */}
          <h2>Oportunidades de Inversión</h2>

          <div className="inv-opciones">
            {/* AHORRO FIJO */}
            <div className="inv-option">
              <h3>Ahorro Fijo USDT</h3>
              <p>30 días</p>
              <p>
                APR Estimado:{" "}
                <span className="green">{info.parametros.apr_ahorro_fijo}%</span>
              </p>
              <p>Mínimo: {info.parametros.minimo_ahorro_fijo} USDT</p>

              <button
                onClick={() => {
                  setTipoInversion("fijo");
                  setModal(true);
                }}
              >
                Invertir Ahora
              </button>
            </div>

            {/* STAKING FLEXIBLE */}
            <div className="inv-option">
              <h3>Staking Flexible USDT</h3>
              <p>Retiro libre</p>
              <p>
                APR Estimado:{" "}
                <span className="green">
                  {info.parametros.apr_staking_flexible}%
                </span>
              </p>
              <p>Mínimo: {info.parametros.minimo_staking_flexible} USDT</p>

              <button
                onClick={() => {
                  setTipoInversion("flexible");
                  setModal(true);
                }}
              >
                Invertir Ahora
              </button>
            </div>
          </div>

          {/* =============================================
              MIS INVERSIONES
          ============================================== */}
          <h2>Mis Inversiones</h2>

          <table className="inv-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Monto Invertido</th>
                <th>Interés Generado</th>
                <th>Inicio</th>
                <th>Vencimiento</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {inversionesPaginadas.map((inv: any) => {
                const dias = Math.floor(
                  (new Date().getTime() -
                    new Date(inv.fecha_inicio).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                const interesGen =
                  Number(inv.cantidad_invertida) *
                  (Number(inv.tasa_aplicada) / 100) *
                  (dias / 365);

                const fechaIni = new Date(inv.fecha_inicio).toLocaleDateString(
                  "es-BO"
                );

                const fechaFin =
                  inv.tipo === "fijo"
                    ? new Date(
                        new Date(inv.fecha_inicio).getTime() +
                          30 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("es-BO")
                    : "N/A";

                return (
                  <tr key={inv.id_ahorro}>
                    <td>
                      {inv.tipo === "fijo"
                        ? "Ahorro Fijo (30 días)"
                        : "Staking Flexible USDT"}
                    </td>
                    <td>{Number(inv.cantidad_invertida).toFixed(2)} USDT</td>
                    <td>{interesGen.toFixed(2)} USDT</td>
                    <td>{fechaIni}</td>
                    <td>{fechaFin}</td>

                    <td>
                      {inv.tipo === "flexible" ? (
                        <button
                          className="cerrar-btn"
                          onClick={() => cerrarFlexible(inv)}
                        >
                          Cerrar
                        </button>
                      ) : (
                        <button className="bloqueado-btn" disabled>
                          Bloqueado
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* =============================================
              PAGINACIÓN ESTILO BINANCE
          ============================================== */}
          <div className="pagination-binance">
            {paginas.map((num) => (
              <button
                key={num}
                className={`page-btn ${num === paginaActual ? "active" : ""}`}
                onClick={() => setPaginaActual(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* =============================================
            MODAL DE INVERSIÓN
        ============================================== */}
        {modal && (
          <div className="modal-bg">
            <div className="modal-box">
              <h3>
                Invertir (
                {tipoInversion === "fijo"
                  ? "Ahorro Fijo"
                  : "Staking Flexible"}
                )
              </h3>

              <input
                type="number"
                placeholder="Cantidad a invertir"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />

              <button onClick={invertir} className="modal-btn">
                Invertir
              </button>
              <button
                onClick={() => setModal(false)}
                className="modal-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
