// src/controllers/checklist.controller.ts
import { Request, Response } from 'express';
import { getChecklistItems, updateChecklistItem, deleteChecklistItem, addChecklistItem } from './checklist.service';

export const handleGetChecklistItems = async (req: Request<{ taskId: string }>, res: Response) => {
  try {
    const items = await getChecklistItems(Number(req.params.taskId));
    res.json(items);
  } catch (error) {
    console.error("Error getting checklist items:", error);
    res.status(500).json({ error: "Failed to get checklist items" });
  }
};

export const handleAddChecklistItem = async (
  req: Request<{ taskId: string }, {}, { text: string }>,
  res: Response
) => {
  try {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ error: "Text is required" });
    }
    
    const newItem = await addChecklistItem(
      Number(req.params.taskId),
      text
    );
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding checklist item:", error);
    res.status(500).json({ error: "Failed to add checklist item" });
  }
};

export const handleUpdateChecklistItem = async (
  req: Request<{ id: string }, {}, { text?: string; completed?: boolean }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedItem = await updateChecklistItem(
      Number(id),
      updates
    );
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    res.status(500).json({ error: "Failed to update checklist item" });
  }
};

export const handleDeleteChecklistItem = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteChecklistItem(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    res.status(500).json({ error: "Failed to delete checklist item" });
  }
};