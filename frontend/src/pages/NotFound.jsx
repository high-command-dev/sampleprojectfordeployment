import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="glass-panel mx-auto max-w-xl p-10 text-center">
      <h1 className="text-5xl font-semibold text-white">404</h1>
      <p className="mt-4 text-slate-300">The page you are looking for does not exist.</p>
      <Button as={Link} to="/" className="mt-6">Back to Home</Button>
    </section>
  );
}
