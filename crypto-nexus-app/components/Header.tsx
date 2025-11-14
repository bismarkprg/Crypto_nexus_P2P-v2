"use client";
import Image from "next/image";
 
interface HeaderProps {
  userName: string;
  message?: string; // 1. Hacemos la prop "message" opcional
}

export default function Header({ 
  userName, 
  message = "Bienvenido de nuevo," // 2. Le damos un valor por defecto
}: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="user-info">
        {/* 3. Usamos la prop en lugar del texto fijo */}
        <h2>{message} <span className="highlight">{userName}</span></h2>
      </div>
      <div className="user-icon">
        <Image
          src="/images/user_icon.png"
          alt="Icono de usuario"
          width={45}
          height={45}
          className="icon"
         />
      </div>
    </header>
  );
}
