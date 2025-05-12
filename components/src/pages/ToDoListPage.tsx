import { useEffect, useState, useCallback } from 'react';
import { useFetch } from '../hooks/todolist/useFetch';
import { TaskFactory } from '../patterns/TaskFactory';
import { withReminder } from '../patterns/TaskDecorator';
import TaskManager from '../patterns/TaskManager';
import { TaskType, Task } from '../types/datatypes';
import { Notification } from '../components/midterms/tasks/Notification';
import { taskObserver } from '../patterns/TaskObserver';
import { useNavigate } from 'react-router-dom';

const EnhancedTask = withReminder(TaskFactory);

function formatLocalDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

const ToDoListPage = () => {
  const { data: tasks = [], loading, error, refetch } = useFetch<Task[]>('http://localhost:4000/todolist');
  const [sortMethod, setSortMethod] = useState<'date' | 'name' | 'id'>('date');
  const [taskType, setTaskType] = useState<TaskType>(() => {
    return (localStorage.getItem('taskType') as TaskType) || 'basic';
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [duedate, setduedate] = useState<Date>(new Date(Date.now()));
  const [isAdding, setIsAdding] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    if ((tasks ?? []).length > 0) {
      setLocalTasks(tasks ?? []);
    }
  }, [tasks]);

  useEffect(() => {
    if (localTasks.length > 0) {
      taskObserver.checkOverdue(localTasks);
    }
  }, [localTasks]);

  useEffect(() => {
    localStorage.setItem('taskType', taskType);
    setLocalTasks(tasks ?? []);
  }, [taskType, tasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (duedate < new Date(Date.now() - 5 * 60 * 1000)) {
      alert('Due date cannot be more than 5 minutes in the past');
      return;
    }

    const newTask = {
      title: newTaskTitle,
      description: taskDescription,
      duedate: duedate.toISOString(),
      completed: false
    };

    try {
      setIsAdding(true);
      const tempId = `temp-${Date.now()}`;
      const newTaskWithId = { ...newTask, id: tempId };

      setLocalTasks((prev) => [...prev, newTaskWithId]);
      setNewTaskTitle('');
      setTaskDescription('');

      const createdTask = await TaskManager.addTask(newTask);

      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === tempId ? { ...createdTask, id: task.id } : task
        )
      );
    } catch (err) {
      console.error('Error:', err);
      setLocalTasks((prev) => prev.filter((task) => !task.id.toString().startsWith('temp-')));
      alert(`Failed to add task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
  try {
    await TaskManager.deleteTask(taskId);
    const updatedTasks = localTasks.filter((task) => task.id !== taskId);
    setLocalTasks(updatedTasks);
    taskObserver.clearOverdue(taskId); 
    taskObserver.checkOverdue(updatedTasks); 
  } catch (err) {
    console.error('Error deleting task:', err);
    alert('Failed to delete task');
  }
};

 const handleCompleteTask = async (taskId: number) => {
  try {
    const updatedTask = await TaskManager.completeTask(taskId); 
    const updatedTasks = localTasks.map(task =>
      task.id === taskId ? updatedTask : task
    );
    setLocalTasks(updatedTasks);
    taskObserver.notify(updatedTask);
  } catch (err) {
    console.error('Error completing task:', err);
    alert('Failed to complete task');
  }
};

  const TaskList = useCallback(() => {
    const sortedTasks = [...localTasks].sort((a, b) => {
      if (sortMethod === 'date') {
        return new Date(a.duedate ?? 0).getTime() - new Date(b.duedate ?? 0).getTime();
      } else if (sortMethod === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortMethod === 'id') {
        return Number(a.id) - Number(b.id);
      }
      return 0;
    });

    return sortedTasks.map((task) => (
      <EnhancedTask
        key={task.id}
        type={taskType}
        task={task}
        onDelete={() => handleDeleteTask(Number(task.id))}
        onComplete={() => handleCompleteTask(Number(task.id))}
      />
    ));
  }, [localTasks, taskType, sortMethod]);

  if (loading && localTasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Tasks</h2>
        <p>{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleHome = () => { 
    navigate("/home")
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="container mx-auto p-4 max-w-3xl h-full flex flex-col">
        <h1 
          className="text-3xl font-bold mb-4 text-gray-800 text-center cursor-pointer"
          onClick={ handleHome }
          >
            To-Do List
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            disabled={isAdding}
          />
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Enter task description"
            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isAdding}
          />
          <input
            type="datetime-local"
            value={formatLocalDateTime(duedate)}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (!isNaN(selectedDate.getTime())) {
                setduedate(selectedDate);
              }
            }}
            min={formatLocalDateTime(new Date(Date.now() - 5 * 60 * 1000))}
            className="border p-2 rounded"
            disabled={isAdding}
          />
          <button
            onClick={handleAddTask}
            className={`px-4 py-2 rounded font-medium ${
              isAdding || !newTaskTitle.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-400 text-white cursor-pointer'
            }`}
            disabled={isAdding || !newTaskTitle.trim()}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {['basic', 'timed', 'checklist'].map((type) => (
            <label
              key={type}
              className={`flex items-center space-x-2 px-3 py-1 rounded cursor-pointer ${
                taskType === type ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <input
                type="radio"
                name="taskType"
                value={type}
                checked={taskType === type}
                onChange={() => {
                  localStorage.setItem('taskType', type);
                  window.location.reload();
                }}
                className="h-5 w-5 accent-green-600 text-green-600 focus:ring-green-600 cursor-pointer"
              />
              <span className="capitalize">{type} Task</span>
            </label>
          ))}
        </div>

        <div className="overflow-y-auto grid grid-cols-1 gap-4 pr-2 scrollbar-hidden">
          {localTasks.length > 0 ? (
            <TaskList />
          ) : (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg col-span-2">
              <p>No tasks available. Add a new task!</p>
            </div>
          )}
        </div>

        <Notification />
      </div>
    </div>
  );
};

export default ToDoListPage;
