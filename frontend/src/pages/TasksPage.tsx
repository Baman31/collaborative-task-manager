import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Task, TaskFilters as TaskFiltersType } from '../types';
import { taskAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useSWRConfig } from 'swr';
import { Plus } from 'lucide-react';

export const TasksPage = () => {
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const { tasks, isLoading } = useTasks(filters);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { showToast } = useToast();
  const { mutate } = useSWRConfig();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;
    try {
      await taskAPI.deleteTask(deletingTask.id);
      showToast('Task deleted successfully', 'success');
      mutate(['/tasks', filters]);
      mutate('/tasks/stats');
    } catch {
      showToast('Failed to delete task', 'error');
    } finally {
      setDeletingTask(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm task={editingTask} onClose={() => setIsFormOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deletingTask?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingTask(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
