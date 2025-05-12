// src/routes/checklist.router.ts
import { Router } from 'express';
import { handleAddChecklistItem, handleGetChecklistItems, handleUpdateChecklistItem, handleDeleteChecklistItem } from './components/checklist.controller';

const checklistRouter = Router();

// GET /api/todolist/:taskId/items
checklistRouter.get('/:taskId/items', handleGetChecklistItems);

// POST /api/todolist/:taskId/items
checklistRouter.post('/:taskId/items', handleAddChecklistItem);

// PATCH /api/todolist/items/:id
checklistRouter.patch('/items/:id', handleUpdateChecklistItem);

// DELETE /api/todolist/items/:id
checklistRouter.delete('/items/:id', handleDeleteChecklistItem);

export default checklistRouter;