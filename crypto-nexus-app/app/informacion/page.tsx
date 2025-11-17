"use client";

import "../dashboard/dashboard.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import Footer from "@/components/Footer";
import Guia from "@/sections/Guia";
import "./informacion.css";

export default function InformacionPage() {
  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Header 
          userName="" 
          message="Información"
        />

        <div className="info-container">

          {/* CONTENIDO PRINCIPAL */}
          <div className="info-content-box">
            <Guia />
          </div>

          {/* FOOTER */}
          <div className="info-footer-box">
            <Footer />
          </div>

        </div>
      </div>
    </div>
  );
}
