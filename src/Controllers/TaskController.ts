import { Request, Response } from "express";
import Task from "../Models/Task";

/* =========================
   CREATE TASK
========================= */
export async function createTask(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return res.status(500).json({ 
      error: "Erro ao criar tarefa",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}

/* =========================
   LIST TASKS
========================= */
export async function listTasks(req: Request, res: Response) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    console.error("Erro ao listar tasks:", error);
    return res.status(500).json({ 
      error: "Erro ao buscar tarefas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}

/* =========================
   UPDATE TASK
========================= */
export async function updateTask(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error("Erro ao atualizar task:", error);
    return res.status(500).json({ 
      error: "Erro ao atualizar tarefa",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}

/* =========================
   DELETE TASK
========================= */
export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar task:", error);
    return res.status(500).json({ 
      error: "Erro ao deletar tarefa",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}