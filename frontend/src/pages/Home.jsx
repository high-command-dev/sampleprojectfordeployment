import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8">
      <p className="mb-3 text-sm uppercase tracking-[0.25em] text-brand-300">Production-ready frontend</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        A modular React frontend scaffold built for scale.
      </h1>
      <p className="mt-4 max-w-2xl text-slate-300">
        This starter includes routing, auth guards, reusable UI, service layering, Tailwind styling, and clean structure.
      </p>
      <div className="mt-8 flex gap-3">
        <Button as="a" href="/register">Create Account</Button>
        <Button as="a" href="/login" variant="secondary">Sign In</Button>
      </div>
    </motion.section>
  );
}
