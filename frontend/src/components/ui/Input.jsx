import { cn } from '../../utils/cn';

export default function Input({ label, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      {label && <span>{label}</span>}
      <input
        className={cn(
          'rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/30',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
