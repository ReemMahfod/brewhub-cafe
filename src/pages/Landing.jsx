import { Link } from 'react-router-dom';
import { menu, heroImage } from '../data/mock.js';
import PublicLayout from '../components/PublicLayout.jsx';

const steps = [
  { num: '1', title: 'Pick your drink', text: 'Browse the menu and add what you like.' },
  { num: '2', title: 'Enter table number', text: 'Tell us where you are sitting.' },
  { num: '3', title: 'We bring it to you', text: 'Relax — your order comes to your table.' },
];

const tips = [
  {
    title: 'Order from your table',
    text: 'Open the menu, add drinks, and enter your table number.',
    to: '/menu',
    label: 'Browse menu',
  },
  {
    title: 'Find a branch',
    text: 'See addresses, hours, and photos on our branches page.',
    to: '/branches',
    label: 'View branches',
  },
  {
    title: 'Need help?',
    text: 'Ask any barista, or check your order after you place it.',
    to: '/order',
    label: 'Go to order',
  },
];

function getFeatured() {
  const list = [];
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].active) list.push(menu[i]);
    if (list.length === 3) break;
  }
  return list;
}

function countDrinks() {
  let n = 0;
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].active) n++;
  }
  return n;
}

export default function Landing() {
  const featured = getFeatured();
  const drinkCount = countDrinks();

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-cream via-warm to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-semibold text-coffee shadow-sm">
              Fresh coffee · Cozy cafe
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
              Welcome to<br />
              <span className="text-coffee">BrewHub Cafe</span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              Sit down, order from your phone, and we will bring your coffee to your table.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/menu" className="btn-amber">
                Order now
              </Link>
              <Link to="/branches" className="btn-outline">
                Find a branch
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-coffee">{drinkCount}+</p>
                <p className="text-xs text-muted">Drinks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-coffee">3</p>
                <p className="text-xs text-muted">Easy steps</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-coffee">4.8★</p>
                <p className="text-xs text-muted">Rating</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-card ring-1 ring-sand">
            <img src={heroImage} alt="BrewHub latte" className="aspect-[4/5] w-full object-cover md:aspect-square" />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-deep/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
              <p className="text-xs font-semibold uppercase tracking-widest text-cream/80">BrewHub Cafe</p>
              <p className="mt-1 text-lg font-bold">Crafted with care</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-center text-2xl font-bold text-ink">How to order</h2>
          <p className="mt-2 text-center text-muted">Three easy steps from your table</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(function (s) {
              return (
                <div key={s.num} className="rounded-2xl border border-sand bg-warm p-6 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coffee text-sm font-bold text-cream">
                    {s.num}
                  </span>
                  <p className="mt-4 font-bold text-ink">{s.title}</p>
                  <p className="mt-2 text-sm text-muted">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">Popular drinks</h2>
            <p className="mt-1 text-muted">Customer favorites this week</p>
          </div>
          <Link to="/menu" className="text-sm font-semibold text-amber hover:underline">
            See all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {featured.map(function (d) {
            return (
              <article key={d.id} className="overflow-hidden rounded-2xl border border-sand bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg">
                <div className="h-44 overflow-hidden bg-cream">
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-ink">{d.name}</p>
                    <p className="text-xs text-muted">{d.category}</p>
                  </div>
                  <span className="text-lg font-bold text-amber">${d.price.toFixed(2)}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-sand bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-ink">Quick help</h2>
            <p className="mt-2 text-muted">New here? Short guide to get your coffee faster.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tips.map(function (tip) {
              return (
                <article key={tip.title} className="flex flex-col rounded-2xl border border-sand bg-white p-6 shadow-card">
                  <h3 className="font-bold text-ink">{tip.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{tip.text}</p>
                  <Link to={tip.to} className="mt-4 inline-flex text-sm font-semibold text-amber hover:underline">
                    {tip.label} →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-coffee-deep text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-14 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Ready for your coffee?</h2>
          <p className="max-w-md text-cream/70">
            Open the menu, choose your drink, and enter your table number.
          </p>
          <Link to="/menu" className="btn-amber mt-2">
            Start ordering
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
