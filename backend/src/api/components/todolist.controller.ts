import { Request, Response } from "express";
import { addTask, getTasks, updateTask, deleteTask } from "./todolist.service";

export const handleAddTask = async (req: Request, res: Response) => {
    try {
      const { title, description, duedate } = req.body;
  
      if (!title || typeof title !== 'string') {
         res.status(400).json({ error: "Valid title is required" });
         return;
      }
      const validDueDate = duedate ? new Date(duedate).toISOString() : new Date(Date.now()).toISOString();

      const newTask = await addTask(
        title,
        description || '',  
        validDueDate
      );
      
      res.status(201).json(newTask);
      return
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Database operation failed" 
      });
      return
    }
};


export const handleGetTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await getTasks();

    tasks.forEach((task: any) => {
      task.duedate = task.duedate ? new Date(task.duedate).toISOString() : null;
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


export const handleUpdateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      res.status(400).json({ error: "Task ID is required" });
      return;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields provided for update" });
      return;
    }

    const updatedTask = await updateTask(Number(id), updates);

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const handleDeleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Task ID is required" });
      return;
    }

    const deletedTask = await deleteTask(Number(id));

    if (!deletedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
