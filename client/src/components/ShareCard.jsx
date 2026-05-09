import { forwardRef } from 'react';

const ShareCard = forwardRef(({ report, userName }, ref) => {
  const { archetype, shareCardText, traits, consensus } = report;

  const topTraits = Object.entries(traits || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const traitLabels = {
    chaos: 'Chaos',
    trust: 'Trust',
    humor: 'Humor',
    mystery: 'Mystery',
    intelligence: 'Intelligence',
    emotionalUnpredictability: 'Emotional Chaos',
  };

  return (
    <div
      ref={ref}
      style={{
        width: '400px',
        height: '700px',
        background: 'linear-gradient(145deg, #020408 0%, #060c14 40%, #0a0818 100%)',
        padding: '40px 36px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Syne, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* BG decorations */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, #7b6ff020 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, #4af0c815 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <span style={{ fontSize: '18px' }}>🪞</span>
          <span style={{ color: '#4af0c8', fontSize: '14px', fontWeight: '600', letterSpacing: '0.1em' }}>MIRROR</span>
        </div>

        <div style={{
          fontSize: '11px', fontWeight: '600', color: '#4a6080',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Social Archetype
        </div>

        <div style={{
          fontSize: '38px', fontWeight: '800', lineHeight: '1.1',
          background: 'linear-gradient(135deg, #4af0c8, #7b6ff0, #f06090)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
        }}>
          {archetype}
        </div>

        <div style={{
          fontSize: '15px', color: '#c0d8f8', lineHeight: '1.6',
          fontFamily: 'DM Sans, sans-serif', fontWeight: '300',
          paddingBottom: '24px',
          borderBottom: '1px solid #1a2d4a',
          fontStyle: 'italic',
        }}>
          "{shareCardText}"
        </div>
      </div>

      {/* Traits */}
      <div style={{ flex: 1, padding: '24px 0' }}>
        {topTraits.map(([key, val]) => (
          <div key={key} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6080a0', fontFamily: 'DM Sans, sans-serif', fontWeight: '500' }}>
                {traitLabels[key] || key}
              </span>
              <span style={{ fontSize: '13px', color: '#4af0c8', fontFamily: 'JetBrains Mono, monospace' }}>
                {val}%
              </span>
            </div>
            <div style={{ height: '3px', background: '#0b1220', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${val}%`,
                background: 'linear-gradient(90deg, #4af0c8, #7b6ff0)',
                borderRadius: '2px',
                boxShadow: '0 0 8px #4af0c840',
              }} />
            </div>
          </div>
        ))}

        {consensus && consensus[0] && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(74, 240, 200, 0.05)',
            border: '1px solid rgba(74, 240, 200, 0.15)',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '12px', color: '#4af0c8', fontFamily: 'DM Sans, sans-serif' }}>
              {consensus[0]}
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid #1a2d4a', paddingTop: '20px',
      }}>
        <div style={{ fontSize: '12px', color: '#4a6080', fontFamily: 'DM Sans, sans-serif' }}>
          {userName}'s Mirror
        </div>
        <div style={{
          fontSize: '12px', color: '#4af0c8', fontWeight: '600',
          letterSpacing: '0.05em',
        }}>
          mirror.app
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
export default ShareCard;
