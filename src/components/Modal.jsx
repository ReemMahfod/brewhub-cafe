export default function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;

  const boxCls = wide ? 'max-w-lg' : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={'max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ' + boxCls}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between">
          <h3 id="modal-title" className="text-lg font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-sand"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {footer && <div className="mt-8 flex flex-wrap justify-end gap-4">{footer}</div>}
      </div>
    </div>
  );
}
