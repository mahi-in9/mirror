import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TRAIT_COLORS = {
  chaos: { from: '#f06090', to: '#ff8c69', label: 'Chaos' },
  trust: { from: '#4af0c8', to: '#00d4aa', label: 'Trust' },
  humor: { from: '#ffd700', to: '#ffa500', label: 'Humor' },
  mystery: { from: '#7b6ff0', to: '#9b59b6', label: 'Mystery' },
  intelligence: { from: '#4af0c8', to: '#7b6ff0', label: 'Intelligence' },
  emotionalUnpredictability: { from: '#f06090', to: '#7b6ff0', label: 'Emotional Chaos' },
};

export default function TraitBar({ trait, value, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const config = TRAIT_COLORS[trait] || { from: '#4af0c8', to: '#7b6ff0', label: trait };

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay + 300);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-display font-semibold text-bright tracking-wide">
          {config.label}
        </span>
        <span className="text-sm font-mono text-muted-2">{value}%</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full trait-bar"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${config.from}, ${config.to})`,
            boxShadow: `0 0 10px ${config.from}60`,
          }}
        />
      </div>
    </motion.div>
  );
}
