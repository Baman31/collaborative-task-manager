import { Task } from '../../types';
import { formatDate, getPriorityColor, getStatusColor, isOverdue, priorityLabel, statusLabel } from '../../utils/helpers';
import { Calendar, User, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
        overdue ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 line-clamp-1">{task.title}</h3>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
        >
          {priorityLabel[task.priority]}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {statusLabel[task.status]}
        </span>
        {overdue && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(task.dueDate)}
          </span>
          {task.assignedTo && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {task.assignedTo.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
