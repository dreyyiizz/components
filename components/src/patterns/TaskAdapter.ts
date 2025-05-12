import { Task } from "../types/datatypes";

export class TaskAdapter {
  static adaptFromApi(data: any): Task {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate || undefined,
      completed: data.completed || false,
    };
  }

  static adaptToApi(task: Partial<Task>): any {
    return {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
    };
  }
}