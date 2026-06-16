import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';
import useAuth from '../hooks/useAuth';

export default function VerifyLoginOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const defaultEmail = location.state?.email || '';

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: defaultEmail, otp: '' },
  });

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const onSubmit = async (values) => {
    try {
      const { data } = await authService.verifyLoginOtp(values);
      login(data.token, data.user);
      toast.success(data.message || 'Login verified successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <section className="mx-auto max-w-md glass-panel p-8">
      <h2 className="text-2xl font-semibold text-white">Verify Login OTP</h2>
      <p className="mt-2 text-sm text-slate-300">Enter the email used during login and the code sent to your inbox.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="OTP" inputMode="numeric" placeholder="123456" error={errors.otp?.message} {...register('otp', { required: 'OTP is required' })} />
        <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</Button>
      </form>
    </section>
  );
}