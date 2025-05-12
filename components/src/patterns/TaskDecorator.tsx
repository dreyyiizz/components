import { Task } from '../types/datatypes';
import { TaskType } from '../types/datatypes';

export const withReminder = <P extends { task: Task; type?: TaskType }>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <div className="relative">
      <Component {...props} />
      {props.task.dueDate && (
        <span className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
          Reminder
        </span>
      )}
    </div>
  );
};