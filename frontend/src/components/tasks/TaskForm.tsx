import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Task, Priority, Status, User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { taskAPI, userAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { priorityLabel, statusLabel } from '../../utils/helpers';
import { useSWRConfig } from 'swr';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  assignedToId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { showToast } = useToast();
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.slice(0, 16),
          priority: task.priority,
          status: task.status,
          assignedToId: task.assignedToId || '',
        }
      : {
          priority: 'MEDIUM',
          status: 'TODO',
        },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getUsers();
        if (response.data.success && response.data.data) {
          setUsers(response.data.data.users);
        }
      } catch {
        console.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
        assignedToId: data.assignedToId || null,
      };

      if (task) {
        await taskAPI.updateTask(task.id, payload);
        showToast('Task updated successfully', 'success');
      } else {
        await taskAPI.createTask(payload);
        showToast('Task created successfully', 'success');
      }

      mutate('/tasks');
      mutate('/tasks/stats');
      mutate('/tasks/assigned');
      mutate('/tasks/created');
      mutate('/tasks/overdue');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save task';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-200 ${
            errors.description ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
          }`}
          rows={3}
          placeholder="Task description"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description.message}
          </p>
        )}
      </div>

      <Input
        label="Due Date"
        type="datetime-local"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-200"
            {...register('priority')}
          >
            {(Object.keys(priorityLabel) as Priority[]).map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabel[priority]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-200"
            {...register('status')}
          >
            {(Object.keys(statusLabel) as Status[]).map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
        <select
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all duration-200 hover:border-gray-300"
          {...register('assignedToId')}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
