import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { salesByDay, topDrinks } from '../data/mock.js';
import { useOrders } from '../context/OrdersContext.jsx';
import PageCard from '../components/PageCard.jsx';

const colors = ['#6F4E37', '#8B6244', '#A87A55', '#C79A72', '#D97706'];

export default function Analytics() {
  const { orders, dashboardStats } = useOrders();

  let weekTotal = 0;
  for (let i = 0; i < salesByDay.length; i++) {
    weekTotal = weekTotal + salesByDay[i].value;
  }
  const avg = Math.round(weekTotal / salesByDay.length);

  let best = salesByDay[0];
  for (let i = 1; i < salesByDay.length; i++) {
    if (salesByDay[i].value > best.value) best = salesByDay[i];
  }

  let orderCount = 0;
  let orderRev = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status !== 'cancelled') {
      orderCount++;
      orderRev = orderRev + orders[i].total;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-card">
          <p className="text-sm text-muted">Weekly revenue</p>
          <p className="mt-1 text-2xl font-bold text-ink">${weekTotal.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-card">
          <p className="text-sm text-muted">Orders today</p>
          <p className="mt-1 text-2xl font-bold text-ink">{dashboardStats.ordersToday}</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-5 shadow-card">
          <p className="text-sm text-muted">Sales today</p>
          <p className="mt-1 text-2xl font-bold text-ink">{dashboardStats.salesTodayFormatted}</p>
        </div>
      </div>

      <PageCard title="Revenue trend" subtitle={'Daily avg $' + avg.toLocaleString() + ' · Best ' + best.day}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByDay} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE2D0" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B6560', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B6560', fontSize: 12 }} tickFormatter={function (v) { return '$' + (v / 1000).toFixed(1) + 'k'; }} />
              <Tooltip formatter={function (v) { return ['$' + v.toLocaleString(), 'Revenue']; }} />
              <Bar dataKey="value" fill="#6F4E37" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PageCard>

      <PageCard title="Best-selling drinks" subtitle={'From ' + orderCount + ' orders · $' + orderRev.toFixed(0)}>
        {topDrinks.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topDrinks} margin={{ top: 4, right: 24, left: 24, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE2D0" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#6B6560', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} tick={{ fill: '#1C1917', fontSize: 12 }} />
                <Tooltip formatter={function (v) { return [v + ' cups', 'Sold']; }} />
                <Bar dataKey="sold" radius={[0, 8, 8, 0]} maxBarSize={28}>
                  {topDrinks.map(function (entry, i) {
                    return <Cell key={entry.name} fill={colors[i % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted">No order data yet.</p>
        )}
      </PageCard>
    </div>
  );
}
