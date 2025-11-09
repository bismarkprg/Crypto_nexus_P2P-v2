"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import { loginUser } from "@/lib/apiService";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await loginUser(username, password);
      if (res?.message) {
        alert(res.message || "Inicio de sesión exitoso");
        router.push("/dashboard"); // 🔹 Redirección al Dashboard
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error de conexión con el servidor");
    }
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
        <button
          type="button"
          id="register-button"
          onClick={() => router.push("/register")}
        >
          Regístrate
        </button>
        <button type="submit" id="login-button">
          Iniciar sesión
        </button>
      </div>
    </form>
  );
}
