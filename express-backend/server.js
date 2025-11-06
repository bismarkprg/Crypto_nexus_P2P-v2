import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => res.json({ message: "API funcionando correctamente" }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`)
);
