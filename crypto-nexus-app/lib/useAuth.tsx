"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginUser, logoutUser, getDashboard } from "./apiService";

// 🔹 Tipos para TypeScript
interface User {
  id?: number;
  nombre?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar usuario actual al montar el provider
  useEffect(() => {
    (async () => {
      try {
        const data = await getDashboard();
        if (data.user) setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Iniciar sesión
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      if (data.user) setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cerrar sesión
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // 🔹 Refrescar usuario manualmente
  const refreshUser = async () => {
    try {
      const data = await getDashboard();
      if (data.user) setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const value = { user, loading, login, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar en componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
