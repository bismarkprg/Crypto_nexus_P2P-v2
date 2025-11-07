"use client";
import { useState } from "react";
import PasswordField from "./PasswordField";
import { registerUser } from "@/lib/apiService";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!terms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(email, username, password, repeatPassword);
      alert(res.message || "Registro exitoso");

      //  Loader durante la redirección
      setTimeout(() => {
        router.push("/register_form");
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="register-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Dirección de correo electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (!e.target.value.includes("@")) {
              setEmailError("El correo debe contener @");
            } else {
              setEmailError("");
            }
          }}
          required
        />
        <span id="email-error" className="error-message">
          {emailError}
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          placeholder="Ingresa tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <PasswordField id="password" value={password} onChange={setPassword} />
      </div>

      {password && (
        <div className="form-group" id="repeat-password-group">
          <label htmlFor="repeat-password">Repetir contraseña</label>
          <input
            type="password"
            id="repeat-password"
            placeholder="Repite tu contraseña"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group">
        <input
          type="checkbox"
          id="terms"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          required
        />
        <label htmlFor="terms">Acepto los términos y condiciones</label>
      </div>

      <div className="form-buttons">
        <button
          type="button"
          id="login-button"
          onClick={() => router.push("/login")}
        >
          Iniciar sesión
        </button>
        <button type="submit" id="register-button" disabled={loading}>
          {loading ? "Cargando..." : "Regístrate"}
        </button>
      </div>
    </form>
  );
}
