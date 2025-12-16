import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Sparkles } from 'lucide-react';

export const RegisterPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="font-extrabold text-4xl text-white tracking-tight">Colyx</span>
          </div>
        </div>
        
        <div className="glass-card rounded-3xl shadow-2xl p-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-500 mb-8">Join Colyx and boost your productivity</p>
          <RegisterForm />
        </div>

        <p className="text-center text-white/80 mt-8 text-sm">
          Designed & Developed by{' '}
          <a 
            href="https://www.linkedin.com/in/manishsharma31/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-white/90 underline underline-offset-2 transition-colors"
          >
            Manish Sharma
          </a>
        </p>
      </div>
    </div>
  );
};
