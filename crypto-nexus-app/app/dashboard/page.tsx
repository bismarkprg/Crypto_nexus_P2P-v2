"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BalanceCard from "./BalanceCard";
import BalanceList from "./BalanceList";
import QuoteCard from "./QuoteCard";
import "./dashboard.css";
import { getDashboard } from "@/lib/apiService";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboard();
        setUserData(data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header userName={userData?.nombre || "Usuario"} />
        <BalanceCard balance={userData?.balance_total || 0} />
        <div className="dashboard-grid">
          <BalanceList
            saldoCripto={userData?.saldo_cripto || 0}
            saldoAhorro={userData?.saldo_fondo_ahorro || 0}
            saldoVenta={userData?.saldo_publicacion_venta || 0}
          />
          <QuoteCard />
        </div>
      </div>
    </div>
  );
}
