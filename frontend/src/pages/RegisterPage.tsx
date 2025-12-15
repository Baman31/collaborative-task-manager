import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ListTodo } from 'lucide-react';

export const RegisterPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">TaskManager</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Create Account
          </h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
