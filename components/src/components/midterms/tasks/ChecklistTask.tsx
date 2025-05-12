import { useEffect, useState } from "react";
import { Task } from "../../../types/datatypes";
import TaskCard from "./TaskCard";
import { useChecklist } from "../../../hooks/todolist/useChecklist";
import { updateTask } from "../../../hooks/todolist/useToDo";
import { taskObserver } from "../../../patterns/TaskObserver";

export default function ChecklistTask({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (taskId: number) => void;
}) {
  const {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  } = useChecklist(Number(task.id));

  const [newItemText, setNewItemText] = useState("");
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(task);

  useEffect(() => {
    if (open) fetchItems();
  }, [fetchItems, open]);

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try {
      await addItem(newItemText.trim());
      setNewItemText("");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleToggleItem = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    await updateItem(id, { completed: !item.completed });
  };

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
    <>
      <TaskCard task={task} type="checklist" onToggleCompletion={onToggleCompletion}>
         <h1 className="text-sm ml-4">
           { task.description }
         </h1>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setOpen(true)}
            className="text-sm px-3 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition cursor-pointer"
          >
            View Checklist
          </button>
          <button
            onClick={() => onDelete(Number(task.id))}
          className="text-white bg-red-500 p-2 rounded cursor-pointer hover:bg-gray-500 transition duration-200 ease-in-out mt-2"
          >
            Delete
          </button>
        </div>
      </TaskCard>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold"
              >
                {task.title}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleItem(item.id)}
                      className="mr-2 h-4 w-4 cursor-pointer"
                    />
                    <span className={`flex-grow text-sm ${item.completed ? "line-through text-green-600 decoration-green-600 decoration-2" : "text-gray-700"}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-2 text-md text-gray-400 hover:text-red-600 cursor-pointer font-bold"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="flex mt-4">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    placeholder="Add new item"
                    className="flex-grow border p-2 rounded-l text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-gray-400 transition cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={() => {
                  if (!newItemText.trim()) return;
                  handleAddItem();
                }}
                disabled={!newItemText.trim()}
                className={`px-4 py-2 rounded text-sm ${!newItemText.trim() 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-400 text-white cursor-pointer"}`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
