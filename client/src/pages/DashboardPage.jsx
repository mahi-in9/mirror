import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ParticleField from '../components/ParticleField';
import api from '../services/api';

const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareLink = `${BASE_URL}/u/${user?.shareCode}`;

  useEffect(() => {
    if (!user?.shareCode) return;
    api.get(`/reports/${user.shareCode}`)
      .then(res => setReport(res.data))
      .catch(() => {}) // no report yet is fine
      .finally(() => setLoading(false));
  }, [user]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied! 🔗');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy');
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`How do you actually see me? Answer anonymously 👀\n${shareLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`I just made a Mirror — answer anonymously and tell me how you really see me 👀`);
    const url = encodeURIComponent(shareLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-void relative">
      <ParticleField count={25} />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-extrabold text-bright mb-2">
            Hey, <span className="neon-text">{user?.name}</span> 👋
          </h1>
          <p className="text-muted-2 text-lg">
            {user?.responseCount > 0
              ? `${user.responseCount} friend${user.responseCount !== 1 ? 's have' : ' has'} answered your mirror.`
              : 'Share your link. The truth is out there.'}
          </p>
        </motion.div>

        {/* Share Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8 border border-border mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-xl">
              🔗
            </div>
            <div>
              <h2 className="font-display font-bold text-bright text-xl">Your Mirror Link</h2>
              <p className="text-sm text-muted-2">Share this with everyone you dare to.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-2xl p-4 mb-5">
            <span className="flex-1 font-mono text-sm text-neon truncate">{shareLink}</span>
            <button
              onClick={copyLink}
              className={`px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
                copied
                  ? 'bg-neon text-void'
                  : 'bg-surface border border-border-bright text-bright hover:border-neon hover:text-neon'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-2 py-3 glass border border-border rounded-xl text-sm font-display font-semibold text-bright hover:border-green-500 hover:text-green-400 transition-all"
            >
              <span>💬</span> WhatsApp
            </button>
            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 py-3 glass border border-border rounded-xl text-sm font-display font-semibold text-bright hover:border-blue-400 hover:text-blue-400 transition-all"
            >
              <span>🐦</span> Twitter / X
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Responses', value: user?.responseCount || 0, color: '#4af0c8' },
            { label: 'Archetype', value: report?.report?.archetype?.split(' ')[0] || '—', color: '#7b6ff0', small: true },
            { label: 'Status', value: (user?.responseCount || 0) >= 1 ? 'Active' : 'Waiting', color: '#f06090' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="glass rounded-2xl p-4 border border-border text-center"
            >
              <div className={`font-display font-extrabold ${stat.small ? 'text-lg' : 'text-3xl'} mb-1`}
                style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-2 font-mono uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* View Results */}
        {(user?.responseCount || 0) >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => navigate(`/results/${user.shareCode}`)}
              className="w-full py-5 rounded-2xl font-display font-bold text-lg text-void transition-all hover:shadow-2xl hover:shadow-neon/20"
              style={{ background: 'linear-gradient(135deg, #4af0c8, #7b6ff0)' }}
            >
              🪞 View My Reflection →
            </button>
          </motion.div>
        )}

        {(user?.responseCount || 0) === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 border border-border text-center"
          >
            <div className="text-5xl mb-4 animate-float inline-block">🕐</div>
            <h3 className="font-display font-bold text-xl text-bright mb-2">Waiting for responses...</h3>
            <p className="text-muted-2 text-sm">
              Share your link above. Once friends answer, your archetype will appear here.
            </p>
          </motion.div>
        )}

        {/* Vibe tags */}
        {user?.vibeTags?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {user.vibeTags.map(tag => (
              <span key={tag} className="px-3 py-1 glass border border-border rounded-full text-xs font-display text-muted-2">
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
