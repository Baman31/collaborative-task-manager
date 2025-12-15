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
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          placeholder="Task description"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('priority')}
          >
            {(Object.keys(priorityLabel) as Priority[]).map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabel[priority]}
              </option>
            ))}
          </select>
        </div>

        {task && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('status')}
            >
              {(Object.keys(statusLabel) as Status[]).map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
