import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-coffee' : 'text-muted hover:text-coffee'
  }`;

function StaffIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function PublicLayout({ children }) {
  const { count } = useCart();

  return (
    <div className="min-h-screen bg-warm text-ink">
      <header className="sticky top-0 z-20 border-b border-sand bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coffee text-sm font-bold text-cream shadow-sm">
                B
              </span>
              <span className="text-lg font-bold text-coffee sm:text-xl">BrewHub</span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
              <NavLink to="/branches" className={navLinkClass}>Branches</NavLink>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/order"
                className="btn-amber relative px-5 py-2.5 sm:px-6"
              >
                Order here
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coffee px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                className="btn-coffee px-5 py-2.5 sm:px-6"
              >
                <StaffIcon />
                <span>Staff login</span>
              </Link>
            </div>
          </div>

          <nav className="mt-3 flex items-center justify-center gap-6 border-t border-sand/60 pt-3 lg:hidden">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
            <NavLink to="/branches" className={navLinkClass}>Branches</NavLink>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-sand bg-ink text-cream/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-cream/10 bg-coffee-deep/50 p-6 sm:flex-row sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-cream">BrewHub staff?</p>
              <p className="mt-1 text-xs text-cream/60">
                Managers and baristas — sign in here to open orders, menu, and the dashboard.
              </p>
            </div>
            <Link
              to="/login"
              className="btn-amber shrink-0"
            >
              <StaffIcon />
              Staff login →
            </Link>
          </div>

          <p className="mt-8 text-center text-sm">© 2026 BrewHub Coffee</p>
          <p className="mt-1 text-center text-xs text-cream/40">Fresh coffee, cozy spaces, every day.</p>
        </div>
      </footer>
    </div>
  );
}
