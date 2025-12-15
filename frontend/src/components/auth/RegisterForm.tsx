import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../hooks/useToast';

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
      <Input
        label="Name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};
