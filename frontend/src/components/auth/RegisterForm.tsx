import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../hooks/useToast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data.email, data.password, data.name);
      await login(data.email, data.password);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
          <User className="w-5 h-5" />
        </div>
        <Input
          label="Name"
          placeholder="Your name"
          error={errors.name?.message}
          className="pl-12"
          autoComplete="name"
          {...register('name')}
        />
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
          <Mail className="w-5 h-5" />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          className="pl-12"
          autoComplete="email"
          {...register('email')}
        />
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
          <Lock className="w-5 h-5" />
        </div>
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          className="pl-12"
          autoComplete="new-password"
          {...register('password')}
        />
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none mt-3">
          <Lock className="w-5 h-5" />
        </div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          className="pl-12"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full mt-6" size="lg">
        Create Account
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
};
