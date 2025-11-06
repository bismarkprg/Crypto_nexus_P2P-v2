"use client";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inicio de sesión exitoso");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu nombre de usuario"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <PasswordInput value={password} onChange={setPassword} />
      </div>

      <div className="form-group recover">
        <a href="#" className="recover-link">¿Olvidaste tu contraseña?</a>
      </div>

      <div className="form-buttons">
        <button type="button" id="register-button" onClick={() => window.location.href='/register'}>
          Regístrate
        </button>
        <button type="submit" id="login-button">Iniciar sesión</button>
      </div>
    </form>
  );
}
