"use client";
import Accordion from "@/components/Accordion";

export default function Guia() {
  const faqs: { q: string; a: string }[] = [
    { q: "¿Cómo me registro?", a: "Haz clic en Registrarse y completa tu correo y contraseña. Revisa el correo de verificación." },
    { q: "¿Qué datos debo proporcionar a la plataforma?", a: "Nombre, fecha de nacimiento, dirección y documento para KYC." },
    { q: "¿Cómo funciona el P2P?", a: "Compra/venta entre usuarios con depósito en garantía (escrow) hasta confirmar pago." },
    { q: "¿Por qué debo poner mis datos auténticos?", a: "Para seguridad, recuperación de cuenta y cumplimiento AML/CFT." },
    { q: "¿Cómo evitar estafas?", a: "No compartas contraseñas; verifica reputación; libera cripto tras confirmar pago." },
    { q: "Comisiones", a: "Pequeña comisión por transacción, visible antes de confirmar." },
    { q: "Medios de pago", a: "Transferencias, billeteras móviles y métodos locales configurables en tu perfil." },
  ];

  return (
    <section id="guia" className="content">
      <h1>Guía de uso y preguntas frecuentes</h1>
      <div className="accordion-container">
        {faqs.map((f, i) => (
          <Accordion key={i} title={f.q}>
            <p>{f.a}</p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
