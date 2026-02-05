import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexão MongoDB otimizada para Vercel
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      bufferCommands: false,
    });
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error);
  }
};

// Middleware para garantir conexão antes de cada requisição
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Rota teste
app.get("/", (req, res) => {
  res.json({ status: "API Kanban rodando 🚀" });
});

// Rotas
app.use("/tasks", taskRoutes);

export default app;