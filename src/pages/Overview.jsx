import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { stats, salesByDay, topDrinks, orders, menu } from '../data/mock.js';
import StatusBadge from '../components/StatusBadge.jsx';
import StatCard from '../components/StatCard.jsx';
import PageCard from '../components/PageCard.jsx';

function getImgMap() {
  const map = {};
  menu.forEach(function (m) { map[m.name] = m.image; });
  return map;
}

export default function Overview() {
  const imgs = getImgMap();
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(function (s) {
          return (
            <StatCard
              key={s.id}
              label={s.label}
              value={s.value}
              hint={s.delta + ' vs last week'}
              positive={s.up}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageCard title="Sales this week" subtitle="Revenue per day">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesByDay} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D97706" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#D97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE2D0" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6560', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6560', fontSize: 12 }} tickFormatter={function (v) { return '$' + (v / 1000).toFixed(1) + 'k'; }} />
                  <Tooltip formatter={function (v) { return ['$' + v.toLocaleString(), 'Revenue']; }} />
                  <Area type="monotone" dataKey="value" stroke="#D97706" strokeWidth={2.5} fill="url(#salesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PageCard>
        </div>

        <PageCard title="Top drinks" subtitle="By cups sold">
          <ul className="space-y-4">
            {topDrinks.map(function (d) {
              return (
                <li key={d.name} className="flex items-center gap-3">
                  {imgs[d.name] && (
                    <img src={imgs[d.name]} alt={d.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">{d.name}</span>
                      <span className="text-muted">{d.sold}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-sand">
                      <div className="h-2 rounded-full bg-coffee" style={{ width: d.share + '%' }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </PageCard>
      </div>

      <PageCard title="Recent orders" subtitle="Latest activity">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-muted">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(function (o) {
                return (
                  <tr key={o.id} className="border-b border-sand/60 last:border-0">
                    <td className="py-3 font-semibold text-ink">#{o.id}</td>
                    <td className="py-3 text-ink">{o.customer}</td>
                    <td className="py-3 text-muted">{o.items.join(', ')}</td>
                    <td className="py-3 font-medium text-ink">${o.total.toFixed(2)}</td>
                    <td className="py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageCard>
    </div>
  );
}
