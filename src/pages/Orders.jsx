import { useState } from 'react';
import { branches } from '../data/mock.js';
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

function filterOrders(all, tab, search, branch) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    const o = all[i];
    if (tab !== 'all' && o.status !== tab) continue;
    if (branch !== 'All' && o.branch !== branch) continue;
    if (q) {
      let ok = false;
      if (o.customer.toLowerCase().indexOf(q) !== -1) ok = true;
      if (String(o.id).indexOf(q) !== -1) ok = true;
      if (String(o.tableNumber || '').indexOf(q) !== -1) ok = true;
      if ((o.items || []).join(' ').toLowerCase().indexOf(q) !== -1) ok = true;
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
  const [branch, setBranch] = useState('All');

  const branchOpts = ['All'].concat(branches.map(function (b) { return b.name; }));
  const list = filterOrders(orders, tab, search, branch);
  const newInView = list.filter(function (o) { return o.status === 'new'; }).length;

  return (
    <PageCard
      title="Orders"
      subtitle={list.length + ' table order(s)' + (newInView > 0 ? ' · ' + newInView + ' new' : '')}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={branch}
            onChange={function (e) { setBranch(e.target.value); }}
            className="h-10 rounded-full border border-sand bg-warm px-4 text-sm outline-none focus:border-amber"
          >
            {branchOpts.map(function (b) {
              return <option key={b} value={b}>{b === 'All' ? 'All branches' : b}</option>;
            })}
          </select>
          <SearchInput
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            placeholder="Search orders…"
            className="w-48"
          />
        </div>
      }
    >
      <FilterPills items={tabs} value={tab} onChange={setTab} />

      {newInView > 0 && (
        <div className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm font-medium text-coffee">
          {newInView} new order{newInView > 1 ? 's' : ''} waiting — mark them as preparing when you start.
        </div>
      )}

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
                  <Button variant="ghost" size="sm" onClick={function () { updateOrderStatus(o.id, nextStep[o.status]); }}>
                    Mark {nextStep[o.status]}
                  </Button>
                );
              } else if (o.status !== 'cancelled') {
                actionBtn = (
                  <Button variant="danger" size="sm" onClick={function () { updateOrderStatus(o.id, 'cancelled'); }}>
                    Cancel
                  </Button>
                );
              } else {
                actionBtn = <span className="text-xs text-muted">—</span>;
              }

              const rowCls = o.status === 'new'
                ? 'border-b border-sand/60 bg-amber/5 last:border-0'
                : 'border-b border-sand/60 last:border-0';

              return (
                <tr key={o.id} className={rowCls}>
                  <td className="py-3 font-semibold text-ink">#{o.id}</td>
                  <td className="py-3">
                    <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-lg bg-coffee/10 px-2.5 py-1 text-sm font-bold text-coffee">
                      {o.tableNumber ? 'T' + o.tableNumber : '—'}
                    </span>
                  </td>
                  <td className="py-3 text-ink">{o.customer}</td>
                  <td className="max-w-[180px] truncate py-3 text-muted">{(o.items || []).join(', ')}</td>
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
