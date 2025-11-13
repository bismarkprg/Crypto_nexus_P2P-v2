"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const [active, setActive] = useState("Panel Principal");

  const items = [
    "Panel Principal",
    "Intercambio P2P",
    "Mis Publicaciones",
    "Inversión",
    "Información",
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Image src="/images/logo.png" alt="Logo" width={160} height={60} />
      </div>
      <nav>
        <ul>
          {items.map((item) => (
            <li
              key={item}
              className={active === item ? "active" : ""}
              onClick={() => setActive(item)}
            >
              <Link href="#">{item}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
