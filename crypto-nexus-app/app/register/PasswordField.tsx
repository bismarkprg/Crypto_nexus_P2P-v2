"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
}

export default function PasswordField({ id, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-container">
      <input
        type={show ? "text" : "password"}
        id={id}
        placeholder="Ingresa tu contraseña"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        id="toggle-password"
        onClick={() => setShow(!show)}
      >
        <Image
          src={show ? "/images/icon/eye-off.png" : "/images/icon/eye.png"}
          alt="Mostrar u ocultar contraseña"
          width={22}
          height={22}
          className="btn-eye"
        />
      </button>
    </div>
  );
}
