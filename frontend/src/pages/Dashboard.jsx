import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { authService } from '../services/authService';
import { formatDate } from '../utils/date';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUser(data.user);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load profile');
        logout();
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, logout, setUser]);

  return (
    <section className="glass-panel p-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-brand-300" />
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
      </div>
      {loading ? (
        <p className="mt-4 text-slate-300">Loading your profile...</p>
      ) : (
        <>
          <p className="mt-4 text-slate-300">You are viewing a protected route.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="mt-1 text-xl font-semibold text-white">{user?.name || 'User'}</p>
            <p className="mt-1 text-sm text-slate-300">{user?.email || 'No email available'}</p>
            <p className="mt-4 text-sm text-slate-400">Email verified: {user?.isEmailVerified ? 'Yes' : 'No'}</p>
          </div>
          <p className="mt-4 text-sm text-slate-400">Today is {formatDate(new Date())}.</p>
          <Button
            className="mt-6"
            variant="secondary"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </>
      )}
    </section>
  );
}
