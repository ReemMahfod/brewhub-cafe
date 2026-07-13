export default function FilterPills({ items, value, onChange, activeClass = 'bg-coffee text-cream' }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const id = typeof item === 'string' ? item : item.id;
        const label = typeof item === 'string' ? item : item.label;
        const isActive = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors ${
              isActive ? activeClass : 'bg-warm text-muted hover:bg-sand'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
