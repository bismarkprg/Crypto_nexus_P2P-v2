"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const items = [
    { label: "Panel Principal", path: "/dashboard" },
    { label: "Intercambio P2P", path: "/intercambio_p2p" },
    { label: "Mis Publicaciones", path: "/mis_publicaciones" },
    { label: "Inversión", path: "/inversion" },
    { label: "Información", path: "/informacion" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Image src="/images/logo.png" alt="Logo" width={160} height={60} />
      </div>

      <nav>
        <ul>
          {items.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.label} className={isActive ? "active" : ""}>
                <Link href={item.path}>{item.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
