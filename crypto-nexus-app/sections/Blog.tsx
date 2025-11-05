"use client";
import Image from "next/image";

export default function Blog() {
  const videos = [
    { href: "https://www.youtube.com/watch?v=dsTDTa1aP7M&t=3s", src: "/images/yt1.png", text: "Qué es BITCOIN y Cómo FUNCIONA" },
    { href: "https://www.youtube.com/watch?v=bVZGmjbOKRw", src: "/images/yt2.png", text: "Stablecoins: ¿Qué son?" },
    { href: "https://www.youtube.com/watch?v=Ap-RDyUlAuk", src: "/images/yt3.png", text: "Ahorrar en Criptomonedas" },
  ];
  const news = [
    { href: "https://www.youtube.com/watch?v=EmXApvzn27Q", src: "/images/yt4.png", text: "Criptos legales en Bolivia" },
    { href: "https://www.youtube.com/watch?v=O1Lg_hk4u_s", src: "/images/yt5.png", text: "Se oficializa uso de cripto" },
    { href: "https://www.youtube.com/watch?v=LQvnTmVdIy4&t=1s", src: "/images/yt6.png", text: "LATAM potencia cripto" },
  ];

  return (
    <section id="blog" className="content">
      <h1>Videos Informativos</h1>
      <div className="blog-videos">
        {videos.map((v, i) => (
          <a key={i} href={v.href} target="_blank" rel="noreferrer" className="video-block">
            <Image src={v.src} alt={`Miniatura ${i + 1}`} width={300} height={170} />
            <p>{v.text}</p>
          </a>
        ))}
      </div>

      <h1>Noticias en Bolivia</h1>
      <div className="blog-videos">
        {news.map((v, i) => (
          <a key={i} href={v.href} target="_blank" rel="noreferrer" className="video-block">
            <Image src={v.src} alt={`Miniatura Noticias ${i + 1}`} width={300} height={170} />
            <p>{v.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
