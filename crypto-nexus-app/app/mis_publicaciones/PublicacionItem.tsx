
"use client";

import api from "@/lib/api";
import Image from "next/image";

export default function PublicacionItem({ data, onCancel }: any) {

  const cancelarPublicacion = async () => {
    if (!confirm("¿Cancelar esta publicación?")) return;

    try {
      await api.put(`/p2p/cancelar_publicacion/${data.id_publicacion}`);
      onCancel();
    } catch (error) {
      console.error("Error cancelando publicación:", error);
    }
  };

  return (
    <tr>
      <td>
        {data.fecha_publicacion 
          ? data.fecha_publicacion.split("T")[0] 
          : "—"}
      </td>

      <td>Bs. {Number(data.precio_venta_bob).toFixed(2)}</td>

      <td>
        {data.minimo_compra} – <br></br>{data.maximo_compra}
      </td>

      <td>
        <button className="btn-eliminar" onClick={cancelarPublicacion}>
          <Image src="/images/icon/trash.png" alt="trash" width={25} height={25} />
        </button>
      </td>
    </tr>
  );
}
