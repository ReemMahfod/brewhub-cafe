export default function OptionPills({ label, options, value, onChange }) {
  return (
    <div>
      {label && <p className="mb-2 text-sm font-semibold text-ink">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map(function (opt) {
          const id = typeof opt === 'string' ? opt : opt.id;
          const text = typeof opt === 'string' ? opt : opt.label;
          const extra = typeof opt === 'object' ? opt.extra : 0;
          const active = value === id;

          return (
            <button
              key={id}
              type="button"
              onClick={function () { onChange(id); }}
              className={
                'rounded-full px-4 py-2 text-sm font-medium transition ' +
                (active ? 'bg-coffee text-cream' : 'bg-warm text-muted hover:bg-sand')
              }
            >
              {text}
              {extra > 0 && <span className="ml-1 text-xs opacity-80">+${extra.toFixed(2)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
