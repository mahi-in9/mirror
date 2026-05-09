import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleField from '../components/ParticleField';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative">
      <ParticleField count={20} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md relative z-10"
      >
        <div className="text-8xl mb-6 animate-float inline-block">🪞</div>
        <h1 className="font-display text-6xl font-extrabold neon-text mb-3">404</h1>
        <h2 className="font-display text-2xl font-bold text-bright mb-3">Mirror not found</h2>
        <p className="text-muted-2 mb-8">This reflection doesn't exist — or was never real to begin with.</p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-neon text-void font-display font-bold rounded-2xl"
          >
            Go Home →
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
