import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTaskStats, useAssignedTasks, useCreatedTasks, useOverdueTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Task } from '../types';
import { taskAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useSWRConfig } from 'swr';
import { ListTodo, UserCheck, FileText, AlertTriangle, Plus, ArrowRight } from 'lucide-react';

export const DashboardPage = () => {
  const { stats, isLoading: statsLoading } = useTaskStats();
  const { tasks: assignedTasks, isLoading: assignedLoading } = useAssignedTasks();
  const { tasks: createdTasks, isLoading: createdLoading } = useCreatedTasks();
  const { tasks: overdueTasks, isLoading: overdueLoading } = useOverdueTasks();

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
      mutate('/tasks');
      mutate('/tasks/stats');
      mutate('/tasks/assigned');
      mutate('/tasks/created');
      mutate('/tasks/overdue');
    } catch {
      showToast('Failed to delete task', 'error');
    } finally {
      setDeletingTask(null);
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'bg-blue-500' },
    { label: 'Assigned to Me', value: stats.assigned, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Created by Me', value: stats.created, icon: FileText, color: 'bg-purple-500' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '-' : stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {overdueTasks.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Overdue Tasks
            </h2>
          </div>
          <TaskList
            tasks={overdueTasks.slice(0, 3)}
            isLoading={overdueLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No overdue tasks"
          />
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Assigned to Me</h2>
          <Link
            to="/tasks?view=assigned"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <TaskList
          tasks={assignedTasks.slice(0, 3)}
          isLoading={assignedLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No tasks assigned to you"
        />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Created by Me</h2>
          <Link
            to="/tasks?view=created"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <TaskList
          tasks={createdTasks.slice(0, 3)}
          isLoading={createdLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No tasks created by you"
        />
      </section>

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
