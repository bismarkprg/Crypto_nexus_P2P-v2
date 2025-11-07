"use client";
import { useRouter } from "next/navigation";
import RegisterFormSteps from "./RegisterFormSteps";
import "./register_form.css";

export default function RegisterFormPage() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="register-form-box">
        <div className="header-buttons">
          <button onClick={() => router.push("/register")}>Anterior</button>
          <button
            id="SupportButton"
            onClick={() =>
              alert("Soporte: Contacta con nosotros al correo soporte@example.com")
            }
          >
            <img
              src="/images/icon/customer-service.png"
              alt="Soporte"
              className="btn-customer-service"
            />
          </button>
        </div>
        <RegisterFormSteps />
      </div>
    </div>

  );
}
