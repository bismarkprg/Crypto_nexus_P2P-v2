import axios from "axios";

// ✅ Instancia base de Axios configurada
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Ej: http://localhost:5000/api
  withCredentials: true, // Para enviar cookies y mantener sesión
  headers: { "Content-Type": "application/json" },
});

// ✅ Interceptor para capturar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
