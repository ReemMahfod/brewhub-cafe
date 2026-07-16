export default function StatCard({ label, value, hint, positive, valueClass }) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5 shadow-card">
      <p className="text-sm text-muted">{label}</p>
      <p className={'mt-1 text-2xl font-bold ' + (valueClass || 'text-ink')}>{value}</p>
      {hint && (
        <p className={'mt-1 text-xs font-semibold ' + (positive ? 'text-emerald-600' : 'text-rose-600')}>
          {hint}
        </p>
      )}
    </div>
  );
}
