import { format, isPast, parseISO } from 'date-fns';
import { Priority, Status } from '../types';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy');
};

export const formatDateTime = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy h:mm a');
};

export const isOverdue = (dueDate: string, status: Status): boolean => {
  return isPast(parseISO(dueDate)) && status !== 'COMPLETED';
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100 text-gray-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'REVIEW':
      return 'bg-purple-100 text-purple-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const priorityLabel: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const statusLabel: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
};
