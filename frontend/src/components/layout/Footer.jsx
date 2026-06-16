import { APP_NAME } from '../../constants';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="app-container flex flex-col gap-3 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p>Built with React 19, Vite, and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
