const API_URL = 'http://localhost:4000/todolist';

export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addTask = async (task: { title: string; description?: string; duedate?: string }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, updates: Partial<{ title: string; description: string; duedate: string; completed: boolean }>) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return await response.json();
};

export const deleteTask = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task. Status: ${response.status}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
