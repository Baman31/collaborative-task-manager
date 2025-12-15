import { Priority, Status, TaskFilters as TaskFiltersType } from '../../types';
import { priorityLabel, statusLabel } from '../../utils/helpers';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters = ({ filters, onChange }: TaskFiltersProps) => {
  const handleChange = (key: keyof TaskFiltersType, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Status</option>
        {(Object.keys(statusLabel) as Status[]).map((status) => (
          <option key={status} value={status}>
            {statusLabel[status]}
          </option>
        ))}
      </select>

      <select
        value={filters.priority || ''}
        onChange={(e) => handleChange('priority', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Priority</option>
        {(Object.keys(priorityLabel) as Priority[]).map((priority) => (
          <option key={priority} value={priority}>
            {priorityLabel[priority]}
          </option>
        ))}
      </select>

      <select
        value={filters.sortBy || ''}
        onChange={(e) => handleChange('sortBy', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Sort By</option>
        <option value="dueDate">Due Date</option>
        <option value="createdAt">Created</option>
        <option value="priority">Priority</option>
      </select>

      <select
        value={filters.order || ''}
        onChange={(e) => handleChange('order', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};
