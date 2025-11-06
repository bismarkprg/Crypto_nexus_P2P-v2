"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function PasswordInput({ value, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-container">
      <input
        type={show ? "text" : "password"}
        id="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ingresa tu contraseña"
        required
      />
      <button type="button" id="toggle-password" onClick={() => setShow(!show)}>
        <Image
          src={show ? "/images/icon/eye-off.png" : "/images/icon/eye.png"}
          alt="Toggle visibility"
          width={22}
          height={22}
          className="btn-eye"
        />
      </button>
    </div>
  );
}
