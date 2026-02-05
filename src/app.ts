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
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URL!, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error);
    throw error;
  }
};

// Middleware para garantir conexão ANTES de processar requisições
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({ 
      error: "Erro ao conectar ao banco de dados",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
});

// Rota teste
app.get("/", (req, res) => {
  res.json({ status: "API Kanban rodando 🚀" });
});

// Rotas
app.use("/tasks", taskRoutes);

export default app;