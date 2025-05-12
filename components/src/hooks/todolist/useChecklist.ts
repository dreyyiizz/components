import { useState, useCallback } from 'react';

export const useChecklist = (taskId: number) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/todolist/${taskId}/items`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const addItem = useCallback(async (text: string) => {
    try {
      const response = await fetch(`http://localhost:4000/todolist/${taskId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      setItems(prev => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  }, [taskId]);

  const updateItem = useCallback(async (id: number, updates: { text?: string; completed?: boolean }) => {
    try {
      const response = await fetch(`http://localhost:4000/todolist/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update item');
      const updatedItem = await response.json();
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/todolist/items/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item');
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
};

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}