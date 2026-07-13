import { NavLink } from 'react-router-dom';

const nav = [
  { to: '/dashboard', label: 'Overview', end: true, icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/dashboard/orders', label: 'Orders', icon: 'M4 6h16M4 12h16M4 18h10' },
  { to: '/dashboard/menu', label: 'Menu', icon: 'M6 4h12v16l-6-3-6 3V4Z' },
  { to: '/dashboard/branches', label: 'Branches', icon: 'M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z' },
  { to: '/dashboard/staff', label: 'Staff', icon: 'M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  { to: '/dashboard/equipment', label: 'Equipment', icon: 'M4 7h16v10H4zM9 17v3M15 17v3' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: 'M5 20V10M12 20V4M19 20v-7' },
];

function Icon({ path }) {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-coffee-deep text-cream">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber text-lg font-bold text-white">B</span>
        <div>
          <div className="text-lg font-bold leading-tight">BrewHub</div>
          <div className="text-xs text-cream/60">Coffee Admin</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber text-white shadow-sm'
                  : 'text-cream/75 hover:bg-white/5 hover:text-cream'
              }`
            }
          >
            <Icon path={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-cream/50">
        BrewHub · Staff dashboard
      </div>
    </aside>
  );
}
