"use client";
import Image from "next/image";
import { useState } from "react";

export default function Carousel({ items }: { items: { href: string; src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const go = (dir: number) => setIdx((p) => (p + dir + total) % total);
  const offset = -(100 / total) * idx;

  return (
    <div className="carousel-container">
      <div className="carousel" style={{ transform: `translateX(${offset}%)` }}>
        {items.map((it, i) => (
          <div key={i} className="carousel-item">
            <a href={it.href} target="_blank" rel="noreferrer">
              <Image src={it.src} alt={it.alt} width={1280} height={400} />
            </a>
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={() => go(-1)}>&#10094;</button>
      <button className="carousel-control next" onClick={() => go(1)}>&#10095;</button>
    </div>
  );
}
