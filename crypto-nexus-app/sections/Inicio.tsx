"use client";
import Image from "next/image";
import Carousel from "@/components/Carousel";

export default function Inicio() {
  const items = [
    { href: "https://example.com/link1", src: "/images/image1.jpg", alt: "Imagen 1" },
    { href: "https://example.com/link2", src: "/images/image2.jpg", alt: "Imagen 2" },
    { href: "https://example.com/link3", src: "/images/image3.jpg", alt: "Imagen 3" },
  ];
  return (
    <section id="inicio" className="content">
      <Image src="/images/logo.png" alt="Logo" width={240} height={150} className="logo" />
      <Carousel items={items} />

      <div className="crypto-info-section">
        <h2>¿Qué son las Criptomonedas?</h2>
        <div className="crypto-info-content">
          <Image src="/images/image5.png" alt="Imagen Criptomonedas" width={300} height={300} />
          <p>
            Las criptomonedas son monedas digitales o virtuales que utilizan criptografía para asegurar las transacciones y
            controlar la creación de nuevas unidades. A diferencia de las monedas tradicionales, no están controladas por una
            autoridad central; la mayoría usan blockchain como registro público y distribuido.
          </p>
        </div>
      </div>

      <div className="crypto-info-section">
        <h2>Uso de criptomonedas alivia demanda de dólares y abre nuevas posibilidades</h2>
        <div className="crypto-info-content">
          <p>
            Bolivia permite el uso de criptomonedas a través de entidades financieras en determinados casos; esta medida busca
            aliviar la demanda de dólares y abrir oportunidades de ahorro y empleo en mercados P2P y servicios cripto.
          </p>
          <Image src="/images/image6.png" alt="Imagen Criptomonedas" width={300} height={300} />
        </div>
      </div>
    </section>
  );
}
