import { cn } from '../../utils/cn';

export default function Button({ className, variant = 'primary', as: Component = 'button', ...props }) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/10'
  };

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
