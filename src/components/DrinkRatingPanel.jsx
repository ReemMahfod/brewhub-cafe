import StarRating from './StarRating.jsx';

export default function DrinkRatingPanel({ drinks, myRates, onRate, onSkip, done }) {
  if (!drinks || drinks.length === 0) return null;

  let allRated = drinks.length > 0;
  drinks.forEach(function (d) {
    if (!myRates[d.id]) allRated = false;
  });

  return (
    <div className="mt-6 rounded-2xl border border-sand bg-white p-6 text-left shadow-card">
      <h2 className="text-lg font-bold text-ink">Rate your drinks</h2>
      <p className="mt-1 text-sm text-muted">Tap 1 to 5 stars. This helps other customers.</p>

      {done || allRated ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Thanks for your feedback.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {drinks.map(function (d) {
            return (
              <li key={d.id} className="flex flex-col gap-2 border-b border-sand pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-ink">{d.name}</p>
                {myRates[d.id] ? (
                  <p className="text-sm text-amber">You gave {myRates[d.id]} ★</p>
                ) : (
                  <StarRating value={0} onRate={function (stars) { onRate(d.id, stars); }} />
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!done && !allRated && (
        <button type="button" onClick={onSkip} className="mt-4 text-sm font-semibold text-muted hover:text-coffee">
          Skip for now
        </button>
      )}
    </div>
  );
}
