import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const { data } = await authService.login(values);
      toast.success(data.message || 'OTP sent to your email');
      navigate('/verify-login-otp', { state: { email: values.email } });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="mx-auto max-w-md glass-panel p-8">
      <h2 className="text-2xl font-semibold text-white">Login</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
        <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Button>
      </form>
    </section>
  );
}
