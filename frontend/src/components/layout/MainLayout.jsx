import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(to_bottom,_#020617,_#0f172a)]">
      <Navbar />
      <main className="app-container py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
