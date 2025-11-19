interface Props {
  data: any;
  onComprar: (data: any) => void;
}

export default function P2PBlock({ data, onComprar }: Props) {
  return (
    <div className="p2p-block">
      {/* ANUNCIANTE */}
      <div className="p2p-anunciante">
        <h3>{data.nombre}</h3>
        <p>
          {data.numero_ordenes_venta} órdenes |{" "}
          {data.porcentaje_ordenes_exitosas}% completado
        </p>
        <p>
          {data.pais_residencia} | ⭐ {data.puntuacion_usuario}
        </p>
      </div>

      {/* PRECIO */}
      <div className="p2p-precio">
        <h3>Bs. {Number(data.precio_venta_bob).toFixed(2)}</h3>
      </div>

      {/* DISPONIBLE */}
      <div className="p2p-disponible">
        <p>{Number(data.cantidad_venta).toFixed(2)} USDT </p>
      </div>

      {/* LIMITE */}
      <div className="p2p-limite">
        <p>
          {Number(data.minimo_compra).toFixed(2)} BOB -<br />
          {Number(data.maximo_compra).toFixed(2)} BOB
        </p>
      </div>

      {/* BOTÓN */}
      <div className="p2p-operacion">
        <button
          className="p2p-buy-btn"
          onClick={() => onComprar(data)}
        >
          Comprar USDT
        </button>
      </div>
    </div>
  );
}

