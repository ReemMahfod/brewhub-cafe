import { getReadyLabel } from '../context/OrdersContext.jsx';

export default function OrderReceiptCard({ order, showPayNote }) {
  if (!order) return null;

  return (
    <div className="rounded-2xl border border-sand bg-white p-6 text-left shadow-card">
      <div className="rounded-xl bg-warm px-4 py-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Your order number</p>
        <p className="mt-1 text-4xl font-extrabold text-coffee">#{order.id}</p>
        <p className="mt-2 text-xs text-muted">Table {order.tableNumber} · {order.branch}</p>
      </div>

      <div className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted">Ready</span>
          <span className="font-semibold text-amber">{getReadyLabel(order)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Total</span>
          <span className="font-bold text-ink">${order.total.toFixed(2)}</span>
        </div>
        <div className="border-t border-sand pt-3">
          <p className="text-muted">Items</p>
          <p className="mt-1 font-medium text-ink">{(order.items || []).join(', ')}</p>
        </div>
      </div>

      {showPayNote && (
        <p className="mt-5 rounded-lg bg-cream px-3 py-2 text-center text-xs text-muted">
          Pay at your table when the order arrives.
        </p>
      )}
    </div>
  );
}
