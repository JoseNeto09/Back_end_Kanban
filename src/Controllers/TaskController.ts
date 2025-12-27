import { Request, Response } from "express";
import Task from "../Models/Task";

/* =========================
   CREATE TASK
========================= */
export async function createTask(req: Request, res: Response) {
  const { title, description, status } = req.body;
  const userId = (req as any).userId;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof status !== "string"
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const task = await Task.create({
    title,
    description,
    status,
    user: userId,
  });

  return res.status(201).json(task);
}

/* =========================
   LIST TASKS
========================= */
export async function listTasks(req: Request, res: Response) {
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const tasks = await Task.find({ user: userId }).sort({
    createdAt: -1,
  });

  return res.json(tasks);
}

/* =========================
   UPDATE TASK
========================= */
export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const task = await Task.findOneAndUpdate(
    { _id: id, user: userId },
    { title, description, status },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  return res.json(task);
}

/* =========================
   DELETE TASK
========================= */
export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const task = await Task.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  return res.status(204).send();
}
