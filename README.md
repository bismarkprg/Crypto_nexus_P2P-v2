# Crypto Nexus P2P (v2)
Plataforma P2P de intercambio de criptomonedas para Bolivia

Frontend: Next.js 15.3.2 · Backend: Express.js 4.18.3 · Base de datos: MySQL · Sesiones: express-session

# Descripción General del Proyecto

Crypto Nexus P2P v2 es una plataforma de intercambio de criptomonedas entre personas (P2P) enfocada en el mercado boliviano.
Su propósito es permitir transacciones seguras entre usuarios y proveedores utilizando un sistema de chat interno, temporizadores, órdenes con comisión, manejo de publicaciones y verificación mediante comprobantes (vouchers).

Este proyecto combina:

Frontend moderno con Next.js 15.3.2

Backend robusto con Express.js 4.18.3

Autenticación basada en sesiones

Intercambio P2P similar a Binance P2P

Chat en vivo con carga de vouchers

Gestión completa de órdenes y comisiones

Soporte para despliegue en red local (LAN / VirtualBox)

# Tecnologías principales
# Frontend (Next.js 15.3.2)

React 18.3

Next.js (App Router)

Axios

TailwindCSS 4

TypeScript

# Backend (Express 4.18.3)

Express.js

MySQL2

Multer (QR + vouchers)

express-session

CORS

Dotenv

Estructura modular de rutas (auth, user, p2p)

# Requisitos previos

Asegúrate de tener instalado:

Herramienta	Versión recomendada
Node.js	≥ 18.x
npm o yarn	Última versión
MySQL Server	8.x
Git	Opcional
VirtualBox + Host-only adapter (para ejecución en red interna)	Opcional
# Estructura del Proyecto
Crypto_nexus_P2P-v2/
│
├── frontend/               # Next.js 15.3.2
│   ├── app/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   └── package.json
│
├── express-backend/        # Backend Express 4.18.3
│   ├── routes/
│   ├── uploads_qr/
│   ├── uploads_vouchers/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
└── README.md

# Instalación y configuración
1 Clonar el repositorio
git clone https://github.com/bismarkprg/Crypto_nexus_P2P-v2.git
cd Crypto_nexus_P2P-v2

🔧 Backend – Express.js (API)
2️⃣ Instalar dependencias
cd express-backend
npm install

3️⃣ Crear archivo .env dentro de express-backend/
PORT=3001
SESSION_SECRET=clave_secreta
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cryptonexus

4️⃣ Importar la base de datos

En MySQL Workbench / phpMyAdmin:

Importar cryptonexus.sql

5️⃣ Iniciar backend
npm run dev


Servidor disponible en:

http://localhost:3001/api


o en red local:

http://TU_IP_LOCAL:3001/api

# Frontend – Next.js
6️⃣ Instalar dependencias
cd ../frontend
npm install

7️⃣ Crear archivo .env.local

FRONTEND_HOST=http://TU_IP_LOCAL:3000
PORT=3000
SESSION_SECRET=clave_secreta
NEXT_PUBLIC_BACKEND_URL=http://TU_IP_LOCAL:3001/api

⚠ Reemplaza TU_IP_LOCAL por tu IP real.

Solo si estás usando VirtualBox:

NEXT_PUBLIC_BACKEND_URL=http://TU_IP_LOCAL:3001/api

8️⃣ Iniciar frontend
npm run dev


Sitio disponible en:

http://localhost:3000


o en red local / VM:

http://TU_IP_LOCAL:3000

# Ejecución en red interna (VirtualBox)

Si deseas usar una VM como “Usuario B” para probar el chat:

Crear Host-Only Adapter en VirtualBox

Ver tu IP local del Host:

ipconfig   # Windows
ifconfig   # Linux/Mac


Ejemplo típico:

192.168.56.1


Configurar .env.local del frontend así:

NEXT_PUBLIC_BACKEND_URL=http://192.168.56.1:3001/api


Ejecutar Next.js con host abierto:

npm run dev -- -H 0.0.0.0


Ahora la VM puede ingresar a tu frontend:

http://192.168.56.1:3000


Y comunicarse con el backend:

http://192.168.56.1:3001/api

# Estado actual del proyecto

✔ Frontend Next.js completamente funcional
✔ Backend Express.js activo con rutas P2P
✔ Soporte para imágenes QR
✔ Subida de vouchers con Multer
✔ Chat en tiempo real por polling
✔ Temporizador de compras
✔ Confirmación doble comprador/vendedor
✔ Integración con MySQL
✔ Funcionando en red interna (VirtualBox)

📄 Licencia

Proyecto para fines académicos / de desarrollo.
Los derechos pueden ajustarse según la evolución del proyecto.

# Autor

Bismark
Desarrollo integral de plataforma P2P con enfoque en Bolivia.