import { Task, TaskType } from "../types/datatypes";
import BasicTask from "../components/midterms/tasks/BasicTask";
import TimedTask from "../components/midterms/tasks/TimedTask";
import ChecklistTask from "../components/midterms/tasks/ChecklistTask";

interface TaskFactoryProps {
  type: TaskType;
  task: Task;
  onDelete?: () => void;
  onComplete? : () => void;
}

export const TaskFactory: React.FC<TaskFactoryProps> = ({ type, task, onDelete }) => {
  const handleDelete = () => { if (onDelete) onDelete(); }; 

  switch (type) {
    case "basic":
      return <BasicTask task={task} onDelete={handleDelete} />;
    case "timed":
      return <TimedTask task={task} onDelete={handleDelete} />;
    case "checklist":
      return <ChecklistTask task={task} onDelete={handleDelete} />;
    default:
      throw new Error(`Unknown task type: ${type}`);
  }
};