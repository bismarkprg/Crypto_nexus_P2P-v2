"use client";
import Image from "next/image";
import type { TabId } from "@/app/page";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export default function NavBar({ active, onChange }: { active: TabId; onChange: (t: TabId) => void; }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="tabs">
          <Image src="/images/logo.png" alt="Logo" width={120} height={40} className="navbar-logo" />
          <button className={`tab ${active === "inicio" ? "active" : ""}`} onClick={() => onChange("inicio")}>INICIO</button>
          <button className={`tab ${active === "nosotros" ? "active" : ""}`} onClick={() => onChange("nosotros")}>NOSOTROS</button>
          <button className={`tab ${active === "guia" ? "active" : ""}`} onClick={() => onChange("guia")}>GUÍA</button>
          <button className={`tab ${active === "blog" ? "active" : ""}`} onClick={() => onChange("blog")}>BLOG</button>
        </div>

        <div className="actions">
          <a id="btn-register" className="action-btn btn-register" href={`${BACKEND}/register`}>Registrarse</a>
          <a id="btn-login" className="action-btn btn-login" href="/login">Iniciar Sesión</a>

          <a className="action-btn" id="btn-language" href="#">
            <Image src="/images/icon/lang.png" alt="Idioma" width={30} height={30} className="btn-language" />
          </a>

          <a className="action-btn" href="#">
            <Image src="/images/icon/brightness.png" alt="Brillo" width={30} height={30} className="btn-bright" />
          </a>
        </div>
      </div>
    </div>
  );
}
