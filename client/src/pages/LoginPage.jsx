import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ParticleField from '../components/ParticleField';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success('Welcome back 🪞');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col relative">
      <ParticleField count={25} />
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🪞</div>
            <h1 className="font-display text-3xl font-extrabold text-bright mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-2">Your reflection is waiting.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-border space-y-5">
            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-2 border border-border focus:border-neon rounded-xl px-4 py-3 text-bright placeholder-muted outline-none transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-2 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface-2 border border-border focus:border-neon rounded-xl px-4 py-3 text-bright placeholder-muted outline-none transition-colors font-body"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-neon text-void font-display font-bold text-lg rounded-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Enter My Mirror →'}
            </motion.button>

            <p className="text-center text-sm text-muted-2">
              New here?{' '}
              <Link to="/register" className="text-neon hover:underline">Create your mirror</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
