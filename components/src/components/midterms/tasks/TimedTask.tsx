import { useEffect, useState } from 'react';
import { Task } from "../../../types/datatypes";
import TaskCard from "./TaskCard";
import { formatDistanceToNow, format } from 'date-fns';
import { updateTask } from '../../../hooks/todolist/useToDo';
import { taskObserver } from '../../../patterns/TaskObserver';

export default function TimedTask({ task, onDelete }: { task: Task; onDelete: (taskId: number) => void }) {
  const [now, setNow] = useState(new Date());
  const [currentTask, setCurrentTask] = useState<Task>(task);

  const onToggleCompletion = async (taskId: number) => {
    try {
      const newCompleted = !currentTask.completed;

      const updatedTask: Task = { ...currentTask, completed: newCompleted };
      setCurrentTask(updatedTask); 

      const persisted = await updateTask(taskId, { completed: newCompleted });

      setCurrentTask(persisted);

      taskObserver.notify(persisted);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000); 

    return () => clearInterval(interval);
  }, []);

  const getTimeStatus = () => {
    if (!task.duedate || task.duedate === '') {
      return <div className="mt-2 text-xs text-gray-500">No due date</div>;
    }

    const duedate = new Date(task.duedate);
    if (isNaN(duedate.getTime())) {
      return <div className="mt-2 text-xs text-red-500">Invalid due date format</div>;
    }

    const formattedDate = format(duedate, 'MMM dd, h:mm a');

    if (duedate < now) {
      return (
        <div className="mt-2 text-xs text-white font-semibold bg-red-500 w-2/5 rounded-sm p-2 text-center">
          Overdue since {formattedDate}
        </div>
      );
    }

    return (
      <div className="mt-2 text-xs text-white font-semibold bg-blue-900 w-2/5 rounded-sm p-2 text-center">
        Due {formattedDate} (in {formatDistanceToNow(duedate)})
      </div>
    );
  };

  return (
    <TaskCard task={task} type="timed" onToggleCompletion={onToggleCompletion}>
      <span className="text-sm ml-4">{task.description}</span>
      <div className="flex justify-between items-center">
        {getTimeStatus()}
        <button 
          onClick={() => onDelete(Number(task.id))} 
          className="text-white bg-red-500 p-2 rounded cursor-pointer hover:bg-gray-500 transition duration-200 ease-in-out"
        >
          Delete
        </button>
      </div>
    </TaskCard>
  );
}
