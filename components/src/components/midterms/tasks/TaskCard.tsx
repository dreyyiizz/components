import { useState, useEffect } from "react";
import { Task } from "../../../types/datatypes";

interface TaskCardProps {
  task: Task;
  type: string;
  children?: React.ReactNode;
  onToggleCompletion: (id: number) => void;
}

export default function TaskCard({ task, type, children, onToggleCompletion }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  useEffect(() => {
    setIsCompleted(task.completed);
  }, [task.completed]);

  const handleToggleCompletion = () => {
    setIsCompleted((prev) => !prev);  
    onToggleCompletion(Number(task.id));  
  };

  return (
    <div className={`border rounded-lg p-4 ${isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <h3
            className={`font-medium cursor-pointer ${isCompleted ? 'line-through text-green-600' : 'text-gray-900'}`}
            onClick={handleToggleCompletion}
          >
            {task.title} 
          </h3>
          {!isCompleted && (
            <span
              className="text-xs text-blue-600 hover:text-blue-900 cursor-pointer"
              onClick={handleToggleCompletion}
              aria-label="Mark as complete"
            >
            </span>
          )}
        </div>
        <span
          className={`text-xs px-4 py-1 rounded-md text-white text-center ${isCompleted ? 'bg-green-600' : 'bg-blue-900'}`}
        >
          {type.toUpperCase()}
        </span>
      </div>

      {children}
    </div>
  );
}
