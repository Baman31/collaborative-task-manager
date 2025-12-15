import { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  emptyMessage?: string;
}

export const TaskList = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  emptyMessage = 'No tasks found',
}: TaskListProps) => {
  if (isLoading) {
    return <SkeletonLoader count={6} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <ClipboardList className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
