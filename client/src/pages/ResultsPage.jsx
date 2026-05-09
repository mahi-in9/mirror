import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ParticleField from '../components/ParticleField';
import TraitBar from '../components/TraitBar';
import ShareCard from '../components/ShareCard';
import Navbar from '../components/Navbar';

const ARCHETYPE_COLORS = {
  chaos: { bg: 'from-red-900/30 to-orange-900/20', accent: '#f06090', glow: '#f0609040' },
  trust: { bg: 'from-teal-900/30 to-cyan-900/20', accent: '#4af0c8', glow: '#4af0c840' },
  mystery: { bg: 'from-purple-900/30 to-indigo-900/20', accent: '#7b6ff0', glow: '#7b6ff040' },
  default: { bg: 'from-blue-900/30 to-purple-900/20', accent: '#4af0c8', glow: '#4af0c840' },
};

const getArchetypeStyle = (archetype = '') => {
  const lower = archetype.toLowerCase();
  if (lower.includes('chaos') || lower.includes('villain') || lower.includes('menace'))
    return ARCHETYPE_COLORS.chaos;
  if (lower.includes('trust') || lower.includes('support') || lower.includes('wholesome'))
    return ARCHETYPE_COLORS.trust;
  if (lower.includes('mystery') || lower.includes('cryptid') || lower.includes('silent'))
    return ARCHETYPE_COLORS.mystery;
  return ARCHETYPE_COLORS.default;
};

export default function ResultsPage() {
  const { shareCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shareCardRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenshotting, setScreenshotting] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isOwner = user?.shareCode === shareCode;

  useEffect(() => {
    api.get(`/reports/${shareCode}`)
      .then(res => {
        setData(res.data);
        setTimeout(() => setRevealed(true), 500);
      })
      .catch(err => {
        const msg = err.response?.data;
        if (msg?.error === 'no_responses') {
          setError({ type: 'empty', message: msg.message });
        } else if (err.response?.status === 404) {
          setError({ type: 'not_found', message: 'Mirror not found' });
        } else {
          setError({ type: 'server', message: 'Something went wrong' });
        }
      })
      .finally(() => setLoading(false));
  }, [shareCode]);

  const takeScreenshot = async () => {
    if (!shareCardRef.current) return;
    setScreenshotting(true);
    setShowShareCard(true);

    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#020408',
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `mirror-${shareCode}.png`;
      a.click();
      toast.success('Share card saved! 📸');
    } catch {
      toast.error('Screenshot failed');
    } finally {
      setScreenshotting(false);
      setShowShareCard(false);
    }
  };

  const shareLink = `${window.location.origin}/u/${shareCode}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center gap-4">
        <ParticleField count={30} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🪞
        </motion.div>
        <p className="font-display text-bright text-lg">Revealing your reflection...</p>
        <p className="text-muted-2 text-sm font-mono animate-pulse">AI is analyzing your social archetype</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <ParticleField count={20} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md relative z-10"
        >
          <div className="text-6xl mb-6">{error.type === 'empty' ? '⏳' : '🔍'}</div>
          <h2 className="font-display text-2xl font-bold text-bright mb-3">
            {error.type === 'empty' ? 'No responses yet' : 'Mirror not found'}
          </h2>
          <p className="text-muted-2 mb-6">{error.message}</p>
          {isOwner && (
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-neon text-void font-display font-bold rounded-xl mr-3">
                Go to Dashboard
              </button>
            </Link>
          )}
          <Link to="/">
            <button className="px-6 py-3 glass border border-border rounded-xl font-display text-bright">
              Home
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { report, user: targetUser, responseCount } = data;
  const style = getArchetypeStyle(report.archetype);

  const radarData = [
    { trait: 'Chaos', value: report.traits?.chaos || 0 },
    { trait: 'Trust', value: report.traits?.trust || 0 },
    { trait: 'Humor', value: report.traits?.humor || 0 },
    { trait: 'Mystery', value: report.traits?.mystery || 0 },
    { trait: 'Intelligence', value: report.traits?.intelligence || 0 },
    { trait: 'Emotional', value: report.traits?.emotionalUnpredictability || 0 },
  ];

  return (
    <div className="min-h-screen bg-void relative">
      <ParticleField count={30} />
      {isOwner && <Navbar />}

      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${style.accent}, transparent)` }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-20">

        {/* Archetype Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className={`rounded-3xl p-8 md:p-12 mb-6 border relative overflow-hidden`}
          style={{
            background: `linear-gradient(145deg, #060c14, #0b1220)`,
            borderColor: `${style.accent}40`,
            boxShadow: `0 0 60px ${style.glow}, inset 0 0 60px ${style.glow}20`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-20"
            style={{ backgroundImage: `radial-gradient(ellipse at top right, ${style.accent}30, transparent 60%)` }}
          />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border"
                style={{ borderColor: `${style.accent}40`, background: `${style.accent}10` }}>
                🪞
              </div>
              <div>
                <p className="text-xs font-mono text-muted-2 uppercase tracking-widest">Mirror for</p>
                <p className="font-display font-bold text-bright">{targetUser?.name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs font-mono text-muted-2">{responseCount} response{responseCount !== 1 ? 's' : ''}</p>
              </div>
            </motion.div>

            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: style.accent }}>
              Social Archetype
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-display text-4xl md:text-6xl font-extrabold leading-none mb-6"
              style={{
                background: `linear-gradient(135deg, ${style.accent}, #7b6ff0, #f06090)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {report.archetype}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-muted-2 text-base md:text-lg leading-relaxed max-w-xl"
            >
              {report.summary}
            </motion.p>

            {targetUser?.vibeTags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {targetUser.vibeTags.map(tag => (
                  <span key={tag}
                    className="px-3 py-1 rounded-full text-xs font-display border"
                    style={{ borderColor: `${style.accent}30`, color: style.accent, background: `${style.accent}08` }}>
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Consensus Statements */}
        {report.consensus?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-border mb-6"
          >
            <h3 className="font-display font-bold text-bright mb-4 flex items-center gap-2">
              <span>👥</span> Friend Consensus
            </h3>
            <div className="space-y-3">
              {report.consensus.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border"
                >
                  <span className="text-neon font-mono text-sm mt-0.5">→</span>
                  <p className="text-bright text-sm leading-relaxed">{c}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trait Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 border border-border mb-6"
        >
          <h3 className="font-display font-bold text-bright mb-6 flex items-center gap-2">
            <span>⚡</span> Personality Breakdown
          </h3>
          <div className="space-y-5">
            {Object.entries(report.traits || {}).map(([key, val], i) => (
              <TraitBar key={key} trait={key} value={val} delay={i * 100} />
            ))}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 border border-border mb-6"
        >
          <h3 className="font-display font-bold text-bright mb-4 flex items-center gap-2">
            <span>🔮</span> Social Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1a2d4a" />
              <PolarAngleAxis
                dataKey="trait"
                tick={{ fill: '#6080a0', fontSize: 11, fontFamily: 'Syne' }}
              />
              <Radar
                name="Traits"
                dataKey="value"
                stroke={style.accent}
                fill={style.accent}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Social Energy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="glass rounded-2xl p-6 border border-border mb-6"
        >
          <h3 className="font-display font-bold text-bright mb-4 flex items-center gap-2">
            <span>⚡</span> Social Energy Meter
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs text-muted-2 font-mono w-16">Hermit</span>
            <div className="flex-1 h-4 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.socialEnergy || 50}%` }}
                transition={{ delay: 0.8, duration: 1.2, type: 'spring' }}
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #4af0c8, #7b6ff0, #f06090)',
                  boxShadow: '0 0 20px #4af0c840',
                }}
              />
            </div>
            <span className="text-xs text-muted-2 font-mono w-16 text-right">Social ⚡</span>
          </div>
          <p className="text-center font-mono text-2xl font-bold" style={{ color: style.accent }}>
            {report.socialEnergy || 50}%
          </p>
          {report.mostCommonPerception && (
            <p className="text-center text-sm text-muted-2 mt-2 italic">
              "{report.mostCommonPerception}"
            </p>
          )}
        </motion.div>

        {/* Anonymous Quotes */}
        {report.quotes?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6 border border-border mb-6"
          >
            <h3 className="font-display font-bold text-bright mb-4 flex items-center gap-2">
              <span>💬</span> Anonymous Quotes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.quotes.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="p-4 rounded-xl bg-surface-2 border border-border relative"
                  style={{ borderColor: `${style.accent}20` }}
                >
                  <span className="text-3xl text-muted absolute -top-1 -left-1 opacity-30">"</span>
                  <p className="text-bright text-sm leading-relaxed pt-3 italic">{q}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6 border border-border"
          style={{ borderColor: `${style.accent}30` }}
        >
          <h3 className="font-display font-bold text-bright mb-2 flex items-center gap-2">
            <span>📸</span> Share Your Reflection
          </h3>
          <p className="text-sm text-muted-2 mb-5">Download your share card for Instagram stories & WhatsApp.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={takeScreenshot}
              disabled={screenshotting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 rounded-xl font-display font-bold text-void disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${style.accent}, #7b6ff0)` }}
            >
              {screenshotting ? (
                <>
                  <span className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : '📸 Download Share Card'}
            </motion.button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success('Link copied!');
              }}
              className="px-6 py-4 glass border border-border rounded-xl font-display font-semibold text-bright hover:border-border-bright transition-all"
            >
              🔗 Copy Link
            </button>
          </div>

          {isOwner && (
            <Link to="/dashboard" className="block mt-4 text-center text-sm text-muted-2 hover:text-bright transition-colors">
              ← Back to Dashboard
            </Link>
          )}

          {!isOwner && (
            <div className="mt-5 p-4 rounded-xl bg-surface-2 border border-border text-center">
              <p className="text-muted-2 text-sm mb-3">Curious what YOUR people think about you?</p>
              <Link to="/register">
                <button className="px-6 py-2.5 bg-neon text-void font-display font-bold rounded-xl text-sm">
                  Get My Mirror 🪞
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hidden share card for screenshot */}
      <div
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          zIndex: -1,
          opacity: showShareCard ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <ShareCard
          ref={shareCardRef}
          report={report}
          userName={targetUser?.name || ''}
        />
      </div>
    </div>
  );
}
