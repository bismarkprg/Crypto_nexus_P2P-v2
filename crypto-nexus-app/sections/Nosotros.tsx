"use client";
import Image from "next/image";

export default function Nosotros() {
  return (
    <section id="nosotros" className="content">
      <div className="about-section">
        <Image src="/images/about.png" alt="Sobre Nosotros" width={480} height={320} className="about-image" />
        <div className="about-content">
          <h2>Sobre Nosotros</h2>
          <p>
            Plataforma dedicada al intercambio de criptomonedas de forma segura y eficiente. Brindamos herramientas para operar
            con confianza en mercados P2P y custodia no-custodial.
          </p>
        </div>
      </div>

      <div className="vision-section">
        <div className="about-content">
          <h2>Nuestra visión</h2>
          <p>
            Ser la plataforma P2P líder en LATAM, reconocida por seguridad, facilidad de uso y compromiso con la libertad
            financiera, conectando personas de forma directa en un entorno confiable.
          </p>
        </div>
        <Image src="/images/vision.png" alt="Visión" width={480} height={320} className="about-image" />
      </div>
    </section>
  );
}
