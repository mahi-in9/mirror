export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-surface-2 relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(90deg, #0b1220 25%, #111d30 50%, #0b1220 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-1/2" />
    </div>
  );
}
