"use client";

import "../dashboard/dashboard.css";
import { getP2P } from "@/lib/apiService";
import "./p2p.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { useEffect, useState } from "react";
import P2PBlock from "./P2PBlock";

export default function IntercambioP2P() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [orden, setOrden] = useState("precio");

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const publicacionesPorPagina = 5;

  useEffect(() => {
    getP2P().then((data) => {
      if (orden === "precio") {
        data.sort((a: any, b: any) => a.precio_venta_bob - b.precio_venta_bob);
      }
      setPublicaciones(data);
      setPaginaActual(1);
    });
  }, [orden]);

  // Calcular publicaciones en esta página
  const indexInicial = (paginaActual - 1) * publicacionesPorPagina;
  const indexFinal = indexInicial + publicacionesPorPagina;
  const publicacionesPag = publicaciones.slice(indexInicial, indexFinal);

  const totalPaginas = Math.ceil(publicaciones.length / publicacionesPorPagina);

  return (
    <div className="dashboard-container">
      
      <Sidebar />

      <div className="dashboard-content">
        <Header 
          userName="" 
          message="Intercambio P2P" 
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

          {/* CABECERA DE TABLA */}
          <div className="p2p-header">
            <span className="col-anunciante">Anunciante</span>
            <span className="col-precio">Precio</span>
            <span className="col-disponible">Disponible</span>
            <span className="col-limite">Límite de órdenes</span>
            <span className="col-operacion">Operación</span>
          </div>

          {/* LISTA DE PUBLICACIONES (solo 5 por página) */}
          <div className="p2p-grid">
            {publicacionesPag.map((item: any) => (
              <P2PBlock key={item.id_publicacion} data={item} />
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
    </div>
  );
}

