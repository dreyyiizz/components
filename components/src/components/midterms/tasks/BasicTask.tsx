import { useState } from "react";
import { Task } from "../../../types/datatypes";
import TaskCard from "./TaskCard";
import { updateTask } from "../../../hooks/todolist/useToDo";
import { taskObserver } from "../../../patterns/TaskObserver";

export default function BasicTask({ task, onDelete }: { task: Task; onDelete: (taskId: number) => void }) {
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

  return (
    <TaskCard task={currentTask} type="basic" onToggleCompletion={onToggleCompletion}>
      <div className="flex justify-between items-center">
        <span className="text-sm ml-4"
        >
          {currentTask.description}
          </span>
        <button
          onClick={() => onDelete(Number(currentTask.id))}
          className="text-white bg-red-500 p-2 rounded cursor-pointer hover:bg-gray-500 transition duration-200 ease-in-out mt-6"
          
        >
          Delete
        </button>
      </div>
    </TaskCard>
  );
}
