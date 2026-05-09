import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'linear-gradient(180deg, rgba(2,4,8,0.95) 0%, transparent 100%)' }}
    >
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl">🪞</span>
        <span className="font-display font-bold text-xl neon-text tracking-tight">Mirror</span>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/dashboard">
              <button className="px-4 py-2 text-sm font-medium text-muted-2 hover:text-bright transition-colors">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium glass rounded-xl border border-border hover:border-border-bright text-muted-2 hover:text-bright transition-all"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-medium text-muted-2 hover:text-bright transition-colors">
                Sign in
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 text-sm font-semibold bg-neon text-void rounded-xl hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-neon/20 font-display">
                Get Started
              </button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
