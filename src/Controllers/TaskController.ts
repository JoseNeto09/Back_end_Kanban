import { Request, Response } from "express";
import Task from "../Models/Task";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar task:", error);
    return res.status(500).json({
      error: "Erro ao criar tarefa",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/* =========================
   LIST TASKS
========================= */
export const listTasks = async (req: Request, res: Response) => {
  try {
    console.log("📋 Iniciando listagem de tasks...");
    
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    console.log(`✅ ${tasks.length} tasks encontradas`);
    
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Erro ao listar tasks:", error);
    return res.status(500).json({
      error: "Erro ao buscar tarefas",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};

/* =========================
   UPDATE TASK
========================= */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
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
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    return res.status(200).json({ message: "Tarefa removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar task:", error);
    return res.status(500).json({
      error: "Erro ao deletar tarefa",
    });
  }
};