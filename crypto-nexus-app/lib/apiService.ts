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
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener dashboard:", error.response?.data || error.message);
    throw error;
  }
}
