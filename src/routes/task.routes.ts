import { Router } from "express";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../Controllers/TaskController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
