import { useNavigate, Link, useLocation } from 'react-router-dom';
import { doLogin, isLoggedIn } from '../utils/auth.js';
import { useEffect } from 'react';

const features = [
  'View and manage cafe orders',
  'Update menu and branches',
  'Track sales and analytics',
];

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const backTo = loc.state?.from || '/dashboard';

  useEffect(function () {
    if (isLoggedIn()) nav(backTo, { replace: true });
  }, [backTo, nav]);

  function onSubmit(e) {
    e.preventDefault();
    doLogin();
    nav(backTo, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-deep via-coffee to-coffee-deep">
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="hidden text-cream lg:block">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber text-lg font-bold text-white">B</span>
            <span className="text-2xl font-bold">BrewHub</span>
          </Link>

          <span className="mt-8 inline-block rounded-full bg-amber/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-amber">
            Staff only
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight">
            Employee &amp; manager portal
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            For BrewHub team members. Customers order from the menu — staff sign in here.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map(function (item) {
              return (
                <li key={item} className="flex items-center gap-3 text-sm text-cream/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">✓</span>
                  {item}
                </li>
              );
            })}
          </ul>

          <Link to="/" className="mt-10 inline-block text-sm text-cream/50 hover:text-cream">
            ← Back to customer site
          </Link>
        </div>

        <form onSubmit={onSubmit} className="w-full rounded-3xl border border-sand bg-white p-8 shadow-2xl lg:p-10">
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-coffee">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coffee text-sm font-bold text-cream">B</span>
              <span className="font-bold">BrewHub</span>
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-2 lg:mt-0">
            <span className="rounded-full bg-coffee/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-coffee">
              Staff login
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-bold text-ink">Sign in to dashboard</h2>
          <p className="mt-1 text-sm text-muted">For baristas, managers, and owners.</p>

          <label className="mt-6 block text-sm font-medium text-ink">Work email</label>
          <input
            type="email"
            placeholder="you@brewhub.com"
            className="mt-1.5 h-11 w-full rounded-xl border border-sand bg-warm px-4 text-sm outline-none focus:border-amber"
          />

          <label className="mt-4 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1.5 h-11 w-full rounded-xl border border-sand bg-warm px-4 text-sm outline-none focus:border-amber"
          />

          <button type="submit" className="btn-coffee mt-6 w-full">
            Enter staff dashboard
          </button>

          <p className="mt-4 text-center text-xs text-muted">Staff accounts are managed by the cafe owner.</p>

          <Link to="/" className="mt-4 block text-center text-sm text-muted hover:text-coffee lg:hidden">
            ← Back to customer site
          </Link>
        </form>
      </div>
    </div>
  );
}
