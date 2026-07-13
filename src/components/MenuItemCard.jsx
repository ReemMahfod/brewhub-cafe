import RowActions from './RowActions.jsx';

export default function MenuItemCard({ item, action, onEdit, onDelete }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-cream sm:h-44">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">{item.name}</p>
            <p className="text-xs text-muted">{item.category}</p>
          </div>
          <span className="shrink-0 text-lg font-bold text-amber sm:text-xl">
            ${item.price.toFixed(2)}
          </span>
        </div>
        {(action || onEdit || onDelete) && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            {action ? <div>{action}</div> : <span />}
            {(onEdit || onDelete) && (
              <RowActions onEdit={onEdit} onDelete={onDelete} className="shrink-0" />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
