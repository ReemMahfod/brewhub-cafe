import RowActions from './RowActions.jsx';
import StarRating from './StarRating.jsx';

export default function MenuItemCard({
  item,
  action,
  onEdit,
  onDelete,
  popular,
  soldOut,
  favorited,
  onToggleFavorite,
  rating,
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-cream sm:h-44">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={'h-full w-full object-cover transition duration-500 group-hover:scale-105 ' + (soldOut ? 'opacity-50 grayscale' : '')}
        />
        {popular && !soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Popular
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={function (e) {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ' +
              (favorited ? 'bg-rose-500 text-white' : 'bg-white/95 text-rose-500 hover:bg-white')
            }
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"
              />
            </svg>
          </button>
        )}
        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Sold out
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">{item.name}</p>
            <p className="text-xs text-muted">{item.category}</p>
            {rating && (
              <div className="mt-1.5">
                <StarRating value={rating.avg} count={rating.count} readOnly size="sm" />
              </div>
            )}
          </div>
          <span className="shrink-0 text-lg font-bold text-amber sm:text-xl">
            ${item.price.toFixed(2)}
          </span>
        </div>
        {(action || onEdit || onDelete) && (
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            {action ? <div className="min-w-0 flex-1">{action}</div> : <span />}
            {(onEdit || onDelete) && (
              <RowActions onEdit={onEdit} onDelete={onDelete} className="shrink-0" />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
