# Express Backend API

Servidor backend basado en Express.js y MySQL para integrarse con tu frontend Next.js.

## 🚀 Instrucciones de uso

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar las variables de entorno
Copia el archivo `.env` y ajusta tus credenciales de base de datos:

```
PORT=5000
SESSION_SECRET=clave_secreta
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cryptonexus
```

### 3️⃣ Ejecutar el servidor
```bash
npm run dev
```

### 4️⃣ Endpoints disponibles
| Método | Endpoint | Descripción |
|---------|-----------|-------------|
| POST | `/api/register` | Registrar nuevo usuario |
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/register_form` | Completar datos del usuario |
| GET  | `/api/dashboard` | Datos del usuario autenticado |
| GET  | `/api/logout` | Cerrar sesión |

### 🔗 URL base
El backend se ejecutará en:
```
http://localhost:5000/api
```
