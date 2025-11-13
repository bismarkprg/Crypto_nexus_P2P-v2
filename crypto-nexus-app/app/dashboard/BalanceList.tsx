interface Props {
  saldoCripto: number;
  saldoAhorro: number;
  saldoVenta: number;
}

export default function BalanceList({ saldoCripto, saldoAhorro, saldoVenta }: Props) {
  return (
    <div className="balance-list">
      <h3>Mis Balances</h3>
      <p className="balance-subtext">Gestiona tu portafolio y consulta tus saldos.</p>
      <table>
        <thead>
          <tr>
            <th>Activo</th>
            <th>Valor (USD)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Saldo Wallet</td>
            <td>{Number(saldoCripto || 0).toFixed(2)}</td>
            <td>
              <button className="btn-yellow">Depositar</button>
              <button className="btn-blue">Retirar</button>
            </td>
          </tr>
          <tr>
            <td>Saldo fondo de ahorros</td>
            <td>{Number(saldoAhorro || 0).toFixed(2)}</td>
            <td>
              <button className="btn-blue">Retirar</button>
            </td>
          </tr>
          <tr>
            <td>Saldo publicaciones venta</td>
            <td>{Number(saldoVenta || 0).toFixed(2)}
</td>
            <td>
              <button className="btn-blue">Cerrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
