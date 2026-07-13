import { branches } from '../data/mock.js';
import PublicLayout from '../components/PublicLayout.jsx';

function getOpen() {
  const list = [];
  for (let i = 0; i < branches.length; i++) {
    if (branches[i].active) list.push(branches[i]);
  }
  return list;
}

export default function PublicBranches() {
  const openList = getOpen();

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-ink">Our branches</h1>
          <p className="mt-2 text-lg text-muted">
            All locations — addresses, hours, and photos.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {openList.map(function (b) {
            return (
              <article key={b.id} className="group overflow-hidden rounded-2xl border border-sand bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Open now
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xl font-bold text-ink">{b.name}</p>
                  <p className="mt-1 text-sm text-muted">{b.address}</p>
                  <p className="mt-4 flex items-center gap-2 border-t border-sand pt-4 text-sm text-coffee">
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {b.hours}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
