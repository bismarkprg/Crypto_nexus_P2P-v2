"use client";
import Image from "next/image";

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="user-info">
        <h2>Bienvenido de nuevo, <span className="highlight">{userName}</span></h2>
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
