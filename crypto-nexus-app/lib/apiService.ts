import api from "./api";

// ✅ Registro de usuario
export async function registerUser(
  email: string,
  username: string,
  password: string,
  repeat_password: string
) {
  try {
    const res = await api.post("/register", {
      email,
      username,
      password,
      repeat_password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Error en registro:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Inicio de sesión
export async function loginUser(username: string, password: string) {
  try {
    const res = await api.post("/login", { username, password });
    if (res.data?.user) {
      console.log("Usuario autenticado:", res.data.user);
    }
    return res.data;
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Cierre de sesión
export async function logoutUser() {
  try {
    const res = await api.get("/logout");
    return res.data;
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Actualización de perfil
export async function updateUserProfile(data: {
  nombre_completo: string;
  fecha_nacimiento: string;
  pais_residencia: string;
  ciudad_residencia: string;
  nacionalidad: string;
  tipo_documento: string;
  documento_identidad: string;
  numero_telefono: string;
}) {
  try {
    const res = await api.post("/register_form", data);
    return res.data;
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Dashboard (datos del usuario autenticado)
export async function getDashboard() {
  try {
    const res = await api.get("/dashboard");
    return res.data; // 🔹 Retorna el objeto directo (no res.data.user)
  } catch (error: any) {
    console.error("Error al obtener dashboard:", error);
    throw error;
  }
}

//Pestana P2P ventas
export async function getP2P() {
  const res = await api.get("/p2p/listar");
  return res.data;
}




// Parámetros financieros (último registro)
export async function getParametros() {
  const res = await api.get("/p2p/parametros");
  return res.data;
}

// Crear compra P2P
export async function crearCompraP2P(id_publicacion: number, monto_bob: number) {
  const res = await api.post("/p2p/comprar", { id_publicacion, monto_bob });
  return res.data;
}

// Solicitudes pendientes para el proveedor
export async function getSolicitudesP2P() {
  const res = await api.get("/p2p/solicitudes");
  return res.data;
}

export async function aceptarCompra(id_compra: number) {
  const res = await api.post(`/p2p/compras/${id_compra}/aceptar`);
  return res.data;
}

export async function cancelarCompra(id_compra: number) {
  const res = await api.post(`/p2p/compras/${id_compra}/cancelar`);
  return res.data;
}

export async function getDetalleCompra(id_compra: number) {
  const res = await api.get(`/p2p/compras/${id_compra}/detalle`);
  return res.data;
}

// Chat
export async function getChatMensajes(id_compra: number) {
  const res = await api.get(`/p2p/chat/${id_compra}`);
  return res.data;
}

export async function enviarChatMensaje(id_compra: number, mensaje: string) {
  const res = await api.post(`/p2p/chat/${id_compra}`, { mensaje });
  return res.data;
}

export async function completarCompra(id_compra: number) {
  const res = await api.post(`/p2p/compras/${id_compra}/completar`);
  return res.data;
}


