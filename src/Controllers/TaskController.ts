import { Request, Response } from "express";
import Task from "../Models/Task";

/* =========================
   CREATE TASK
========================= */
export async function createTask(req: Request, res: Response) {
  const { title, description, status } = req.body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof status !== "string"
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const task = await Task.create({
    title,
    description,
    status,
  });

  return res.status(201).json(task);
}

/* =========================
   LIST TASKS
========================= */
export async function listTasks(req: Request, res: Response) {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res.json(tasks);
}

/* =========================
   UPDATE TASK
========================= */
export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
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

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  return res.status(204).send();
}
