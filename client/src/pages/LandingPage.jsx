import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleField from '../components/ParticleField';
import Navbar from '../components/Navbar';

const archetypes = [
  'Chaos Philosopher',
  'Silent Menace',
  'Emotional Support Villain',
  'Corporate Survivor',
  'Midnight Thinker',
  'Dangerous Motivator',
  'Accidental Leader',
  'Certified Cryptid',
];

const features = [
  {
    icon: '🎭',
    title: 'Anonymous Perception',
    desc: 'Friends answer without you knowing what they said. Brutal honesty incoming.'
  },
  {
    icon: '🤖',
    title: 'AI Personality Analysis',
    desc: 'Gemini AI reads between the lines and generates your true social archetype.'
  },
  {
    icon: '📸',
    title: 'Viral Share Cards',
    desc: 'Screenshot-ready cards built for Instagram stories & WhatsApp sharing.'
  },
  {
    icon: '🔮',
    title: 'Social Radar',
    desc: 'Chaos, Trust, Humor, Mystery — visualised in a way that actually makes sense.'
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <ParticleField count={50} />
      <Navbar />

      {/* Ambient glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4af0c8, transparent)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7b6ff0, transparent)' }} />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-border">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-xs font-mono text-muted-2 tracking-widest uppercase">Social Perception Engine</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight mb-6">
            <span className="block text-bright">See yourself</span>
            <span className="block shimmer-text">through their eyes.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-2 max-w-xl mx-auto mb-12 font-body leading-relaxed">
            Share a link. Friends answer anonymous questions. AI reveals your social archetype. <span className="text-bright">The truth might surprise you.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px #4af0c840' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-neon text-void font-display font-bold text-lg rounded-2xl transition-all"
              >
                Generate My Mirror →
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 glass neon-border font-display font-semibold text-lg rounded-2xl text-bright"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Floating archetype pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-3 max-w-2xl"
        >
          {archetypes.map((a, i) => (
            <motion.div
              key={a}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="px-4 py-2 glass rounded-full text-sm font-display font-semibold border border-border hover:border-border-bright cursor-default transition-all"
              style={{
                color: ['#4af0c8', '#7b6ff0', '#f06090'][i % 3],
              }}
            >
              {a}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-bright mb-4">
            How Mirror works
          </h2>
          <p className="text-muted-2 text-lg">Four steps to your social truth.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', icon: '✨', title: 'Create your mirror', desc: 'Set up your profile in 30 seconds.' },
            { step: '02', icon: '🔗', title: 'Share your link', desc: 'Send to friends. They answer anonymously.' },
            { step: '03', icon: '🤫', title: 'They spill the truth', desc: '9 meme-worthy questions about you.' },
            { step: '04', icon: '🪞', title: 'See your reflection', desc: 'AI reveals your true social archetype.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-border hover:border-border-bright transition-all group"
            >
              <div className="font-mono text-xs text-muted mb-3 tracking-widest">{item.step}</div>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-display font-bold text-bright mb-2">{item.title}</h3>
              <p className="text-sm text-muted-2 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8 border border-border hover:border-border-bright transition-all"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display font-bold text-xl text-bright mb-2">{f.title}</h3>
              <p className="text-muted-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass neon-border rounded-3xl p-12">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-bright mb-4">
              Ready to see yourself?
            </h2>
            <p className="text-muted-2 mb-8 text-lg">
              Warning: your friends have been waiting to say this.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 60px #4af0c840' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-5 bg-neon text-void font-display font-bold text-xl rounded-2xl"
              >
                Generate My Mirror →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8 text-muted font-mono text-xs border-t border-border">
        <span>🪞 Mirror — Built for the terminally curious</span>
      </footer>
    </div>
  );
}
