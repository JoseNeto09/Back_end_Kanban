import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "./routes/task.routes";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();

// CORS configurado para aceitar requisições do frontend
app.use(cors({
  origin: '*', // Em produção, especifique o domínio do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Kanban - Documentação'
}));

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
  res.json({ 
    status: "API Kanban rodando 🚀",
    documentation: "/api-docs",
    endpoints: {
      tasks: "/tasks",
      docs: "/api-docs",
      health: "/health"
    }
  });
});

// Rota de health check
app.get("/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1;
    let tasksCount = 0;
    
    if (dbStatus && mongoose.connection.db) {
      tasksCount = await mongoose.connection.db.collection('tasks').countDocuments();
    }
    
    res.json({ 
      status: "OK",
      database: dbStatus ? "conectado" : "desconectado",
      tasksCount 
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
});

// Rotas
app.use("/tasks", taskRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Rota não encontrada",
    path: req.path,
    method: req.method
  });
});

export default app;