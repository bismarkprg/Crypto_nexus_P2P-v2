"use client";
import Image from "next/image";
import LoginForm from "./LoginForm";
import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <Image src="/images/logo.png" alt="Logo" width={180} height={60} className="logo" />
        <LoginForm />
      </div>
    </div>
  );
}
