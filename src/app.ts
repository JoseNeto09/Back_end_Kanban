import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota teste
app.get("/", (req, res) => {
  res.json({ status: "API Kanban rodando 🚀" });
});

// Rotas
app.use("/tasks", taskRoutes);

// MongoDB (compatível com Vercel)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URL!)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(console.error);
}

export default app;
