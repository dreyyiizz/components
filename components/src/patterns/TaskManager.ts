import { updateTask, deleteTask, fetchTasks } from '../hooks/todolist/useToDo';
import { Task } from '../types/datatypes';

class TaskManager {
  private static instance: TaskManager;
  private static API_URL = 'http://localhost:4000/todolist';

  private constructor() {}

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  public async addTask(task: Omit<Task, 'id'>) {
  try {
    const response = await fetch(TaskManager.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description || '',
        duedate: task.duedate, // Make sure this matches your backend expectation
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to add task');
    }

    // Ensure the returned task has the correct date format
    return {
      ...responseData,
      duedate: responseData.duedate || responseData.dueDate // Handle both cases
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Just rethrow the error
  }
}

  public async updateTask(id: number, updates: Partial<Task>) {
    try {
      const processedUpdates = {
        ...updates,
        duedate: updates.duedate instanceof Date
          ? updates.duedate.toISOString()
          : updates.duedate,
      };
      const response = await updateTask(id, processedUpdates);
      if (!response) {
        throw new Error('Failed to update task');
      }
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Network error. Please try again later.'
      );
    }
  }

  public async deleteTask(id: number) {
    try {
      const response = await deleteTask(id);
      if (!response) {
        throw new Error('Failed to delete task');
      }
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Network error. Please try again later.'
      );
    }
  }

  public async getTasks() {
    try {
      const tasks = await fetchTasks();
      console.log('Fetched tasks:', tasks); 
      return tasks;
  } catch (error) {
      console.error('API Error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Network error. Please try again later.'
      );
    }
  }

  public async completeTask(id: number) {
    try {
      const response = await updateTask(id, { completed: true });
      if (!response) {
        throw new Error('Failed to complete task');
      }
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Network error. Please try again later.'
      );
    }
  }
}


export default TaskManager.getInstance();
