import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import Button from '../ui/Button';
import { APP_NAME, NAV_LINKS } from '../../constants';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="app-container flex h-16 items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-wide text-white">
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
                }
              >
                Dashboard
              </NavLink>
              <Button variant="secondary" className="ml-2 gap-2" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
                }
              >
                Login
              </NavLink>
              <Button as={Link} to="/register" className="ml-2">
                Register
              </Button>
            </>
          )}
        </nav>
        <button className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2 md:hidden" aria-label="Open menu">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
