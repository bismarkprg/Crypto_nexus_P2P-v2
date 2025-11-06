"use client";
import Image from "next/image";
import RegisterForm from "./RegisterForm";
import "./register.css";

export default function RegisterPage() {
  return (
    <div className="register-wrapper">
      <div className="register-container">
        <Image
          src="/images/logo.png"
          alt="Logo de la empresa"
          width={200}
          height={80}
          className="logo"
        />
        <RegisterForm />
      </div>
    </div>
  );
}
