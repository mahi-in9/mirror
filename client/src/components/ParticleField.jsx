import { useEffect, useRef } from 'react';

export default function ParticleField({ count = 40 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const colors = ['#4af0c8', '#7b6ff0', '#f06090', '#4af0c860', '#7b6ff060'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.6 + 0.1};
        animation: float ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 4}s infinite;
        box-shadow: 0 0 ${size * 3}px ${color};
        pointer-events: none;
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => particles.forEach(p => p.remove());
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
