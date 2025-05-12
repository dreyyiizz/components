// src/services/checklist.service.ts
import { getPool } from '../../database';

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  task_id: number;
}

export const getChecklistItems = async (taskId: number): Promise<ChecklistItem[]> => {
  const db = getPool();
  const results = await db.query(
    `SELECT id, text, completed FROM checklist_items WHERE task_id = $1 ORDER BY id`,
    [taskId]
  );
  return results.rows;
};

export const addChecklistItem = async (
  taskId: number,
  text: string
): Promise<ChecklistItem> => {
  const db = getPool();
  const results = await db.query(
    `INSERT INTO checklist_items (task_id, text) 
     VALUES ($1, $2) 
     RETURNING id, text, completed`,
    [taskId, text]
  );
  return results.rows[0];
};

export const updateChecklistItem = async (
  id: number,
  updates: { text?: string; completed?: boolean }
): Promise<ChecklistItem> => {
  const db = getPool();
  const results = await db.query(
    `UPDATE checklist_items SET
      text = COALESCE($2, text),
      completed = COALESCE($3, completed)
     WHERE id = $1
     RETURNING id, text, completed`,
    [id, updates.text, updates.completed]
  );
  return results.rows[0];
};

export const deleteChecklistItem = async (id: number): Promise<void> => {
  const db = getPool();
  await db.query(`DELETE FROM checklist_items WHERE id = $1`, [id]);
};