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

// 🔥 CORS CORRECTAMENTE CONFIGURADO
app.use(
  cors({
    origin: "http://localhost:3000",  // Frontend Next.js
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

// 🔥 RUTAS
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", cryptoRoutes);
app.use("/api", p2pRoutes);
app.use("/api", inversionRoutes);

// Test
app.get("/", (req, res) => res.json({ message: "API funcionando correctamente" }));

// Ejecutar servidor
app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`)
);

