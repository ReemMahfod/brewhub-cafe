import { useLocation, Link, useNavigate } from 'react-router-dom';
import { doLogout } from '../utils/auth.js';

const titles = {
  '/dashboard': 'Overview',
  '/dashboard/orders': 'Orders',
  '/dashboard/menu': 'Menu',
  '/dashboard/branches': 'Branches',
  '/dashboard/staff': 'Staff',
  '/dashboard/equipment': 'Equipment',
  '/dashboard/analytics': 'Analytics',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  let title = 'Dashboard';
  if (titles[pathname]) title = titles[pathname];

  function logout() {
    doLogout();
    nav('/');
  }

  return (
    <header className="flex items-center justify-between border-b border-sand bg-white px-8 py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        <p className="text-sm text-muted">Staff dashboard · Olivia Rhye</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input
            type="search"
            placeholder="Search…"
            className="h-10 w-56 rounded-full border border-sand bg-warm pl-4 pr-3 text-sm outline-none focus:border-amber"
          />
        </div>
        <Link to="/" className="text-sm font-medium text-coffee hover:underline">
          Customer site
        </Link>
        <button type="button" onClick={logout} className="text-sm font-medium text-muted hover:text-rose-600">
          Log out
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee text-sm font-semibold text-cream">
          OR
        </div>
      </div>
    </header>
  );
}
