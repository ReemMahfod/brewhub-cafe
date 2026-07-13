import { useState } from 'react';
import { useOrders, getReadyLabel } from '../context/OrdersContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import PageCard from '../components/PageCard.jsx';
import FilterPills from '../components/FilterPills.jsx';
import SearchInput from '../components/SearchInput.jsx';
import Button from '../components/Button.jsx';

const tabs = ['all', 'new', 'preparing', 'completed', 'cancelled'];

const nextStep = {
  new: 'preparing',
  preparing: 'completed',
};

function filterOrders(all, tab, search) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    const o = all[i];
    if (tab !== 'all' && o.status !== tab) continue;
    if (q) {
      let ok = false;
      if (o.customer.toLowerCase().indexOf(q) !== -1) ok = true;
      if (String(o.id).indexOf(q) !== -1) ok = true;
      if (String(o.tableNumber || '').indexOf(q) !== -1) ok = true;
      if (o.items.join(' ').toLowerCase().indexOf(q) !== -1) ok = true;
      if (!ok) continue;
    }
    out.push(o);
  }
  return out;
}

export default function Orders() {
  const { orders, updateOrderStatus } = useOrders();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const list = filterOrders(orders, tab, search);

  return (
    <PageCard
      title="Orders"
      subtitle={list.length + ' table order(s)'}
      actions={
        <SearchInput
          value={search}
          onChange={function (e) { setSearch(e.target.value); }}
          placeholder="Search orders…"
          className="w-56"
        />
      }
    >
      <FilterPills items={tabs} value={tab} onChange={setTab} />

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand text-left text-muted">
              <th className="pb-3 font-semibold">Order</th>
              <th className="pb-3 font-semibold">Table</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Items</th>
              <th className="pb-3 font-semibold">Branch</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Ordered</th>
              <th className="pb-3 font-semibold">Ready in</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(function (o) {
              let actionBtn = null;
              if (nextStep[o.status]) {
                actionBtn = (
                  <Button variant="ghost" className="h-8 px-3 text-xs" onClick={function () { updateOrderStatus(o.id, nextStep[o.status]); }}>
                    Mark {nextStep[o.status]}
                  </Button>
                );
              } else if (o.status !== 'cancelled') {
                actionBtn = (
                  <Button variant="danger" className="h-8 px-3 text-xs" onClick={function () { updateOrderStatus(o.id, 'cancelled'); }}>
                    Cancel
                  </Button>
                );
              } else {
                actionBtn = <span className="text-xs text-muted">—</span>;
              }

              return (
                <tr key={o.id} className="border-b border-sand/60 last:border-0">
                  <td className="py-3 font-semibold text-ink">#{o.id}</td>
                  <td className="py-3">
                    <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-lg bg-coffee/10 px-2.5 py-1 text-sm font-bold text-coffee">
                      {o.tableNumber ? 'T' + o.tableNumber : '—'}
                    </span>
                  </td>
                  <td className="py-3 text-ink">{o.customer}</td>
                  <td className="max-w-[180px] truncate py-3 text-muted">{o.items.join(', ')}</td>
                  <td className="py-3 text-muted">{o.branch}</td>
                  <td className="py-3 font-medium text-ink">${o.total.toFixed(2)}</td>
                  <td className="py-3 text-muted">{o.time}</td>
                  <td className="py-3 font-medium text-amber">{getReadyLabel(o)}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3">{actionBtn}</td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={10} className="py-10 text-center text-muted">No orders match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageCard>
  );
}
