"use client";
import { useEffect, useState } from "react";

interface Plataforma {
  plataforma: string;
  precio: number;
}

export default function QuoteCard() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cotizacion-usdt`, {
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok || !data.plataformas) {
          setError(true);
          return;
        }

        setPlataformas(data.plataformas);
      } catch (err) {
        setError(true);
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="quote-card">
      <h3>Cotización USDT/BOB</h3>

      {error && (
        <p className="quote-loading">No se pudieron obtener las cotizaciones</p>
      )}

      {!error && plataformas.length === 0 && (
        <p className="quote-loading">Cargando cotizaciones...</p>
      )}

      {!error && plataformas.length > 0 && (
        <table className="cotizacion-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Cotización (BOB)</th>
            </tr>
          </thead>
          <tbody>
            {plataformas.map((p, index) => (
              <tr key={index}>
                <td>{p.plataforma}</td>
                <td>{p.precio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
