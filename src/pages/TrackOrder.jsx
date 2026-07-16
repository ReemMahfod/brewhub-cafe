import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders, getReadyLabel } from '../context/OrdersContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import Button from '../components/Button.jsx';
import OrderProgress, { statusMessage } from '../components/OrderProgress.jsx';

function findOrder(orders, q) {
  if (!q) return null;
  const key = String(q).trim().toLowerCase();
  return (
    orders.find(function (o) { return String(o.id) === key; }) ||
    orders.find(function (o) { return String(o.tableNumber) === key; }) ||
    null
  );
}

export default function TrackOrder() {
  const { orders } = useOrders();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [found, setFound] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(function () {
    const q = params.get('q');
    if (!q) return;
    setQuery(q);
    const match = findOrder(orders, q);
    if (match) {
      setFound(match);
      setMsg('');
    }
  }, [params, orders]);

  const foundId = found ? found.id : null;
  useEffect(function () {
    if (!foundId) return;
    const fresh = findOrder(orders, String(foundId));
    if (fresh) setFound(fresh);
  }, [orders, foundId]);

  function search(e) {
    e.preventDefault();
    setMsg('');
    setFound(null);
    const q = query.trim();
    if (!q) {
      setMsg('Enter your order number or table number.');
      return;
    }
    const match = findOrder(orders, q);
    if (!match) {
      setMsg('No order found. Check the number and try again.');
      return;
    }
    setFound(match);
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-lg px-6 py-12">
        <h1 className="text-3xl font-bold text-ink">Track your order</h1>
        <p className="mt-2 text-muted">
          Enter your order number or your table number.
        </p>

        <form onSubmit={search} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={function (e) { setQuery(e.target.value); }}
            placeholder="Order # or table number"
            className="h-11 flex-1 rounded-xl border border-sand bg-white px-4 text-sm outline-none focus:border-amber"
          />
          <Button type="submit">Check status</Button>
        </form>

        {msg && <p className="mt-4 text-sm text-rose-600">{msg}</p>}

        {found && (
          <div className="mt-8 rounded-2xl border border-sand bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink">Order #{found.id}</p>
                <p className="text-sm text-muted">Table {found.tableNumber} · {found.branch}</p>
              </div>
              <StatusBadge status={found.status} />
            </div>

            <p className="mt-4 rounded-xl bg-warm px-4 py-3 text-sm text-coffee">
              {statusMessage(found.status)}
            </p>

            <OrderProgress status={found.status} />

            <div className="mt-6 space-y-2 text-sm">
              <p><span className="text-muted">Items:</span> {(found.items || []).join(', ')}</p>
              <p>
                <span className="text-muted">Ready:</span>{' '}
                <span className="font-semibold text-amber">{getReadyLabel(found)}</span>
              </p>
              <p>
                <span className="text-muted">Total:</span>{' '}
                <span className="font-bold text-ink">${found.total.toFixed(2)}</span>
                <span className="text-muted"> · pay at table</span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-amber">Back to menu</Link>
              <Link to="/order" className="btn-outline-muted">My orders</Link>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
