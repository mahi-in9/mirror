import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getFingerprint } from '../utils/fingerprint';
import ParticleField from '../components/ParticleField';

const CATEGORIES_EMOJI = {
  communication: '💬',
  social: '👥',
  personality: '🎭',
  emotional: '💫',
  situational: '⚡',
  perception: '🔮',
  archetype: '🌀',
  general: '✨',
};

export default function AnswerPage() {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, questionsRes] = await Promise.all([
          api.get(`/users/share/${shareCode}`),
          api.get('/questions/generate'),
        ]);
        setTargetUser(userRes.data);
        setQuestions(questionsRes.data.questions);
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Mirror not found');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [shareCode]);

  const selectAnswer = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    // Auto-advance
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
      }
    }, 300);
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < Math.min(5, questions.length)) {
      return toast.error(`Answer at least ${Math.min(5, questions.length)} questions`);
    }

    setSubmitting(true);
    const fingerprint = getFingerprint();

    const formattedAnswers = questions.map(q => ({
      questionText: q.text,
      answer: answers[q.id] || 'Skipped',
      category: q.category,
    }));

    try {
      await api.post(`/responses/${shareCode}`, {
        answers: formattedAnswers,
        fingerprint,
      });
      setDone(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setAlreadyAnswered(true);
      } else {
        toast.error(err.response?.data?.error || 'Failed to submit');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const progress = questions.length ? ((Object.keys(answers).length / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float inline-block">🪞</div>
          <p className="text-muted-2 font-display animate-pulse">Loading mirror...</p>
        </div>
      </div>
    );
  }

  if (alreadyAnswered) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <ParticleField count={20} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md relative z-10"
        >
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="font-display text-3xl font-bold text-bright mb-3">Already answered</h2>
          <p className="text-muted-2 mb-6">You've already given {targetUser?.name} your honest take.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-neon text-void font-display font-bold rounded-xl">
            Create Your Own Mirror
          </button>
        </motion.div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <ParticleField count={40} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center max-w-md relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl mb-6 inline-block"
          >
            ✨
          </motion.div>
          <h2 className="font-display text-3xl font-extrabold text-bright mb-3">
            Truth delivered.
          </h2>
          <p className="text-muted-2 mb-2 text-lg">
            {targetUser?.name} will see what you think — anonymously.
          </p>
          <p className="text-muted text-sm mb-8">No one can trace it back to you.</p>

          <div className="glass rounded-2xl p-6 border border-border mb-6">
            <p className="text-muted-2 text-sm mb-1">Curious what YOUR friends think of you?</p>
            <p className="text-bright font-display font-bold">Find out your own social archetype.</p>
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full py-4 bg-neon text-void font-display font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-neon/20 transition-all"
          >
            Generate My Mirror 🪞
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  const emoji = CATEGORIES_EMOJI[q?.category] || '✨';

  return (
    <div className="min-h-screen bg-void flex flex-col relative">
      <ParticleField count={25} />

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪞</span>
              <div>
                <p className="text-xs text-muted-2 font-mono uppercase tracking-widest">Mirror for</p>
                <p className="font-display font-bold text-bright">{targetUser?.name}</p>
              </div>
            </div>
            <div className="font-mono text-sm text-muted-2">
              {current + 1} / {questions.length}
            </div>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4af0c8, #7b6ff0)' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-lg mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="text-4xl mb-4 text-center">{emoji}</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-bright text-center mb-8 leading-snug">
                {q?.text}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {q?.options?.map((opt, i) => (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => selectAnswer(q.id, opt)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-5 py-4 rounded-2xl border text-sm md:text-base font-body transition-all ${
                      answers[q.id] === opt
                        ? 'bg-neon/10 border-neon text-neon neon-border'
                        : 'glass border-border text-bright hover:border-border-bright hover:bg-surface-2'
                    }`}
                  >
                    <span className="font-mono text-xs text-muted mr-3">
                      {['A', 'B', 'C', 'D'][i]}
                    </span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 gap-3">
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-5 py-3 glass border border-border rounded-xl text-sm font-display text-muted-2 hover:text-bright disabled:opacity-30 transition-all"
            >
              ← Back
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="flex-1 py-3 glass border border-border-bright rounded-xl text-sm font-display font-semibold text-bright hover:border-neon hover:text-neon transition-all"
              >
                Next →
              </button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < 5}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl text-sm font-display font-bold text-void disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #4af0c8, #7b6ff0)' }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                    Sending truth...
                  </span>
                ) : `Submit (${Object.keys(answers).length}/${questions.length})`}
              </motion.button>
            )}
          </div>

          {/* Answered indicator dots */}
          <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
            {questions.map((q2, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  answers[q2.id]
                    ? 'bg-neon'
                    : i === current
                    ? 'bg-muted-2'
                    : 'bg-surface-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
