import { useEffect, useState } from 'react';
import { Task } from '../../../types/datatypes';
import { taskObserver } from '../../../patterns/TaskObserver';

export const Notification = () => {
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  useEffect(() => {
    const handleOverdueTask = (task: Task) => {
      const due = new Date(task.duedate || '');
      const isOverdue = !task.completed && !isNaN(due.getTime()) && due < new Date();

      setOverdueTasks(prev => {
        const exists = prev.some(t => t.id === task.id);

        if (isOverdue && !exists) {
          return [...prev, task];
        } else if (!isOverdue && exists) {
          return prev.filter(t => t.id !== task.id); 
        }

        return prev; 
      });
    };

    taskObserver.subscribe(handleOverdueTask);
    return () => taskObserver.unsubscribe(handleOverdueTask);
  }, []);

  return (
    <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
      {overdueTasks.map(task => (
        <div
          key={task.id}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-xs"
        >
          Task "{task.title}" is overdue!
        </div>
      ))}
    </div>
  );
};
