import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { branches } from '../data/mock.js';
import { useCart } from '../context/CartContext.jsx';
import { useOrders, getReadyLabel } from '../context/OrdersContext.jsx';
import { useRatings } from '../context/RatingsContext.jsx';
import { getCustomSummary, estimateWaitMinutes } from '../utils/drinkCustom.js';
import { activeOnly } from '../utils/list.js';
import PublicLayout from '../components/PublicLayout.jsx';
import EmptyState from '../components/EmptyState.jsx';
import OrderReceiptCard from '../components/OrderReceiptCard.jsx';
import DrinkRatingPanel from '../components/DrinkRatingPanel.jsx';
import FormField, { TextInput, SelectInput } from '../components/FormField.jsx';

function uniqueDrinks(cartItems) {
  const seen = {};
  const out = [];
  (cartItems || []).forEach(function (it) {
    if (seen[it.id]) return;
    seen[it.id] = true;
    out.push({ id: it.id, name: it.menuName || it.name });
  });
  return out;
}

export default function OrderCheckout() {
  const nav = useNavigate();
  const cart = useCart();
  const { orders, placeOrder } = useOrders();
  const ratings = useRatings();
  const openBranches = activeOnly(branches);

  const suggestedWait = estimateWaitMinutes(cart.items);
  const waitChoices = [5, 8, 10, 12, 15, 20, 25];
  if (waitChoices.indexOf(suggestedWait) === -1) {
    waitChoices.push(suggestedWait);
    waitChoices.sort(function (a, b) { return a - b; });
  }

  const [name, setName] = useState('');
  const [table, setTable] = useState('');
  const [branch, setBranch] = useState(openBranches[0] ? openBranches[0].name : '');
  const [wait, setWait] = useState(String(suggestedWait));
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const [myRates, setMyRates] = useState({});
  const [ratedDone, setRatedDone] = useState(false);

  useEffect(function () {
    if (!done) setWait(String(estimateWaitMinutes(cart.items)));
  }, [cart.items, done]);

  function submit(e) {
    e.preventDefault();
    setErr('');
    if (!name.trim()) return setErr('Please enter your name.');
    if (!table.trim()) return setErr('Please enter your table number.');
    if (cart.items.length === 0) return setErr('Your cart is empty.');

    const cartCopy = cart.items.map(function (it) {
      return {
        cartLineId: it.cartLineId,
        id: it.id,
        menuName: it.name,
        name: it.displayName || it.name,
        price: it.price,
        qty: it.qty,
        custom: it.custom,
      };
    });

    const order = placeOrder({
      customer: name,
      tableNumber: table,
      branch: branch,
      cartItems: cartCopy,
      readyInMinutes: wait,
    });

    cart.clearCart();
    setMyRates({});
    setRatedDone(false);
    setDone(order);
  }

  function rateDrink(menuId, stars) {
    if (myRates[menuId]) return;
    ratings.addRating(menuId, stars);
    setMyRates(function (old) { return { ...old, [menuId]: stars }; });
  }

  if (done) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber">Order confirmed</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">We got your order</h1>
          <p className="mt-3 text-muted">
            Thanks {done.customer}. Your drinks are coming to table <strong className="text-ink">{done.tableNumber}</strong>.
          </p>

          <div className="mt-8">
            <OrderReceiptCard order={done} showPayNote />
          </div>

          <DrinkRatingPanel
            drinks={uniqueDrinks(done.cartItems)}
            myRates={myRates}
            onRate={rateDrink}
            onSkip={function () { setRatedDone(true); }}
            done={ratedDone}
          />

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={'/track?q=' + done.id} className="btn-amber">Track my order</Link>
            <Link to="/menu" className="btn-outline-muted">Order more</Link>
            <Link to="/" className="btn-outline-muted">Home</Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold text-ink">Place your order</h1>
        <p className="mt-2 text-muted">Enter your table number and we will bring the drinks.</p>

        {cart.items.length === 0 ? (
          <div className="mt-10 space-y-6">
            <EmptyState
              text="Your cart is empty."
              links={[
                { to: '/menu', label: 'Go to menu', className: 'text-amber' },
                { to: '/track', label: 'Track an order →', className: 'text-coffee' },
              ]}
            />

            {orders.length > 0 && (
              <div className="rounded-xl border border-sand bg-white p-5">
                <h2 className="font-bold text-ink">Your recent orders</h2>
                <ul className="mt-3 space-y-3">
                  {orders.slice(0, 5).map(function (o) {
                    return (
                      <li key={o.id} className="border-b border-sand pb-3 text-sm last:border-0 last:pb-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-ink">Order #{o.id} · Table {o.tableNumber}</p>
                          <Link to={'/track?q=' + o.id} className="text-xs font-semibold text-amber hover:underline">Track</Link>
                        </div>
                        <p className="mt-1 text-muted">{o.items.join(', ')}</p>
                        <p className="mt-1 text-amber">${o.total.toFixed(2)} · {getReadyLabel(o)}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="rounded-xl border border-sand bg-white p-5">
              <h2 className="font-bold">Cart ({cart.count})</h2>
              <ul className="mt-3 space-y-3">
                {cart.items.map(function (item) {
                  return (
                    <li key={item.cartLineId} className="flex items-center justify-between gap-3 border-b border-sand pb-3 last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.displayName || item.name}</p>
                        {item.custom && <p className="mt-0.5 text-xs text-muted">{getCustomSummary(item.custom)}</p>}
                        <p className="text-sm text-muted">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <button type="button" onClick={function () { cart.updateQty(item.cartLineId, item.qty - 1); }} className="rounded-lg border border-sand px-3 py-1.5 font-medium hover:bg-warm">Less</button>
                        <span className="min-w-[3rem] text-center font-semibold">Qty {item.qty}</span>
                        <button type="button" onClick={function () { cart.updateQty(item.cartLineId, item.qty + 1); }} className="rounded-lg border border-sand px-3 py-1.5 font-medium hover:bg-warm">More</button>
                        <button type="button" onClick={function () { cart.removeItem(item.cartLineId); }} className="px-2 py-1.5 font-medium text-rose-500 hover:text-rose-600">Remove</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-right font-bold text-amber">Total: ${cart.total.toFixed(2)}</p>
              <p className="mt-1 text-right text-xs text-muted">Payment at table · Est. ready ~{suggestedWait} min</p>
            </div>

            <div className="space-y-4 rounded-xl border border-sand bg-white p-5">
              <FormField label="Table number *">
                <TextInput type="number" min="1" value={table} onChange={function (e) { setTable(e.target.value); }} placeholder="12" />
              </FormField>
              <FormField label="Your name">
                <TextInput value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Sara" />
              </FormField>
              <FormField label="Branch">
                <SelectInput value={branch} onChange={function (e) { setBranch(e.target.value); }}>
                  {openBranches.map(function (b) {
                    return <option key={b.id} value={b.name}>{b.name}</option>;
                  })}
                </SelectInput>
              </FormField>
              <FormField label={'Ready in (suggested ' + suggestedWait + ' min)'} hint="Based on size, extras, and how many drinks you ordered.">
                <SelectInput value={wait} onChange={function (e) { setWait(e.target.value); }}>
                  {waitChoices.map(function (m) {
                    return <option key={m} value={String(m)}>{m} minutes</option>;
                  })}
                </SelectInput>
              </FormField>
            </div>

            {err && <p className="text-sm text-rose-600">{err}</p>}

            <div className="flex flex-wrap gap-4">
              <button type="submit" className="btn-amber">Send order</button>
              <button type="button" onClick={function () { nav('/menu'); }} className="btn-outline-muted">Add more</button>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
