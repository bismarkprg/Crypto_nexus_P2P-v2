interface Props {
  balance: number;
}

export default function BalanceCard({ balance }: Props) {
  return (
    <div className="balance-card">
      <h3>Balance Total Estimado</h3>
      <p className="balance-value">
        ${Number(balance || 0).toFixed(2)}
      </p>
      <p className="balance-subtext">Valor aproximado de todos tus activos en tiempo real</p>
      <div className="balance-buttons">
        <button className="btn-yellow">Depositar</button>
        <button className="btn-yellow">Retirar</button>
        <button className="btn-blue">Ver Historial</button>
      </div>
    </div>
  );
}
