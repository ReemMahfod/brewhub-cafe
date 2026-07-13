export default function PageCard({ title, subtitle, actions, children }) {
  return (
    <section className="rounded-2xl border border-sand bg-white shadow-card">
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-sand px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-bold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
