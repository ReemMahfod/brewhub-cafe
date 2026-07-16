function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.3l-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" />
    </svg>
  );
}

export default function StarRating({ value, count, onRate, size = 'md', readOnly }) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';
  const avg = value || 0;
  const filled = Math.round(avg);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(function (n) {
          if (readOnly) {
            return (
              <span key={n} className={n <= filled ? 'text-amber' : 'text-sand'}>
                <StarIcon className={starSize} />
              </span>
            );
          }
          return (
            <button
              key={n}
              type="button"
              onClick={function () { onRate(n); }}
              className={'transition hover:scale-110 ' + (n <= avg ? 'text-amber' : 'text-sand hover:text-amber/70')}
              aria-label={n + ' stars'}
            >
              <StarIcon className={starSize} />
            </button>
          );
        })}
      </div>
      {readOnly && (
        <span className="text-xs text-muted">
          {count > 0 ? avg.toFixed(1) + ' (' + count + ')' : 'No ratings yet'}
        </span>
      )}
    </div>
  );
}
