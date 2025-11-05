"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Inicio from "@/sections/Inicio";
import Nosotros from "@/sections/Nosotros";
import Guia from "@/sections/Guia";
import Blog from "@/sections/Blog";

export type TabId = "inicio" | "nosotros" | "guia" | "blog";

export default function HomePage() {
  const [active, setActive] = useState<TabId>("inicio");

  return (
    <>
      <NavBar active={active} onChange={setActive} />
      <main className="content-wrapper">
        {active === "inicio" && <Inicio />}
        {active === "nosotros" && <Nosotros />}
        {active === "guia" && <Guia />}
        {active === "blog" && <Blog />}
      </main>
      <Footer />
    </>
  );
}
