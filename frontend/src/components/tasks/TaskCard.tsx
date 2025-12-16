import { useState } from 'react';
import { Task, Status } from '../../types';
import { formatDate, getPriorityColor, getStatusColor, isOverdue, priorityLabel, statusLabel } from '../../utils/helpers';
import { Calendar, User, Pencil, Trash2, AlertTriangle, ChevronDown } from 'lucide-react';
import { taskAPI } from '../../services/api';
import { useSWRConfig } from 'swr';
import { useToast } from '../../hooks/useToast';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);
  const { mutate } = useSWRConfig();
  const { showToast } = useToast();

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === task.status) {
      setStatusOpen(false);
      return;
    }
    
    try {
      setUpdating(true);
      await taskAPI.updateTask(task.id, { status: newStatus });
      mutate('/tasks');
      mutate('/tasks/stats');
      mutate('/tasks/assigned');
      mutate('/tasks/created');
      mutate('/tasks/overdue');
      showToast('Status updated successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      showToast(message, 'error');
    } finally {
      setUpdating(false);
      setStatusOpen(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 hover:shadow-lg transition-all duration-200 ${
        overdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100 hover:border-indigo-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getPriorityColor(task.priority)}`}
        >
          {priorityLabel[task.priority]}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            disabled={updating}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${getStatusColor(task.status)} ${updating ? 'opacity-50' : 'hover:opacity-80'}`}
          >
            {updating ? 'Updating...' : statusLabel[task.status]}
            <ChevronDown className={`w-3 h-3 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {statusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-100 rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden">
              {(Object.keys(statusLabel) as Status[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                    status === task.status 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {statusLabel[status]}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {overdue && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(task.dueDate)}
          </span>
          {task.assignedTo && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {task.assignedTo.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
