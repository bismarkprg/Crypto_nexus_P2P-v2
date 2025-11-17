"use client";

import "../dashboard/dashboard.css";
import "./misPublicaciones.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import NuevaPublicacionForm from "./NuevaPublicacionForm";
import PublicacionItem from "./PublicacionItem";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function MisPublicaciones() {

  const [publicaciones, setPublicaciones] = useState([]);

  const cargarPublicaciones = async () => {
    try {
      const res = await api.get("/p2p/mis_publicaciones");
      setPublicaciones(res.data);
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error);
    }
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Header userName="" message="Mis publicaciones" />

        <div className="publicaciones-container">
          {/* FORMULARIO */}
          <NuevaPublicacionForm onSuccess={cargarPublicaciones} />

          {/* LISTADO */}
          <div className="lista-publicaciones-box">
            <h2>Mis Publicaciones Activas</h2>
            <p>Administra tus anuncios.</p>

            <div className="lista-publicaciones">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Precio</th>
                    <th>Límites min/max (BOB)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {publicaciones.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                        No tienes publicaciones activas.
                      </td>
                    </tr>
                  ) : (
                    publicaciones.map((p: any) => (
                      <PublicacionItem
                        key={p.id_publicacion}
                        data={p}
                        onCancel={cargarPublicaciones}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

