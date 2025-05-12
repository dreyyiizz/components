import { Router } from "express";
import { handleAddTask, handleGetTasks, handleDeleteTask, handleUpdateTask } from "./components/todolist.controller";

const todolistRouter = Router();

todolistRouter.post("/", handleAddTask);
todolistRouter.get("/", handleGetTasks);
todolistRouter.patch("/:id", handleUpdateTask);
todolistRouter.delete("/:id", handleDeleteTask);

export default todolistRouter;
