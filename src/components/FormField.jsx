export default function FormField({ label, hint, optional, children }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-ink">
          {label}
          {optional && <span className="font-normal text-muted"> (optional)</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({ className = '', ...props }) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-sand bg-warm px-3 text-sm outline-none focus:border-amber ${className}`}
      {...props}
    />
  );
}

export function SelectInput({ className = '', children, ...props }) {
  return (
    <select
      className={`h-10 w-full rounded-lg border border-sand bg-warm px-3 text-sm outline-none focus:border-amber ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
