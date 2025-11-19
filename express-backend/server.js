import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cryptoRoutes from "./routes/crypto.js";
import p2pRoutes from "./routes/p2p.js";
import inversionRoutes from "./routes/inversion.js";

dotenv.config();
const app = express();

// 🔥 Middleware de sesión (DEBE IR ANTES DE CORS)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,        // true SOLO si estás en HTTPS
      sameSite: "lax"       // Permite enviar cookies entre puertos
    }
  })
);

// 🔥 CORS PARA HOST + VM + LOCALHOST
const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost:3000";

app.use(
  cors({
    origin: [
      "http://192.168.56.1:3000",             // IP real del host (LAN)
      "http://localhost:3000",   // Para desarrollo normal
      ],  // Frontend Next.js
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true                // <-- PERMITE COOKIES
  })
);

// Middlewares normales
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//    Servir imágenes QR subidas
app.use("/uploads_qr", express.static("uploads_qr"));

// Servir comprobantes
app.use("/uploads_vouchers", express.static("uploads_vouchers"));

// 🔥 RUTAS
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", cryptoRoutes);
app.use("/api", p2pRoutes);
app.use("/api", inversionRoutes);

// Test
app.get("/", (req, res) => res.json({ message: "API funcionando correctamente" }));


//LEVANTAR SERVIDOR EN 0.0.0.0 para acceso LAN
const PORT = process.env.PORT || 3001;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Backend escuchando en:
  → Local:   http://localhost:${PORT}
  → Red LAN: http://192.168.56.1:${PORT}

  Corriendo`);
});
