import { useAuth } from '../hooks/useAuth';
import { useTaskStats } from '../hooks/useTasks';
import { formatDateTime } from '../utils/helpers';
import { User, Mail, Calendar, ListTodo, UserCheck, FileText, AlertTriangle } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useTaskStats();

  if (!user) return null;

  const statItems = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'text-blue-500' },
    { label: 'Assigned', value: stats.assigned, icon: UserCheck, color: 'text-green-500' },
    { label: 'Created', value: stats.created, icon: FileText, color: 'text-purple-500' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary h-24" />
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-12 mb-4">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <User className="w-5 h-5" />
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>Joined {formatDateTime(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '-' : stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
