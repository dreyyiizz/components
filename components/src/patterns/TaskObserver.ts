import { Task } from "../types/datatypes";

class TaskObserver {
  private observers: ((task: Task) => void)[] = [];

  public subscribe(observer: (task: Task) => void) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: (task: Task) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public notify(task: Task) {
    this.observers.forEach(observer => observer(task));
  }

  public checkOverdue(tasks: Task[]) {
    const now = new Date();
    tasks.forEach(task => {
      if (task.duedate && new Date(task.duedate) < now && !task.completed) {
        this.notify(task);
      }
    });
  }

  public clearOverdue(taskId: number | string) {
    this.notify({ id: taskId, title: '', completed: true });
  }
}

export const taskObserver = new TaskObserver();
