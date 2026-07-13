import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { branches } from '../data/mock.js';
import { useCart } from '../context/CartContext.jsx';
import { useOrders, getReadyLabel } from '../context/OrdersContext.jsx';
import PublicLayout from '../components/PublicLayout.jsx';

function getOpenBranches() {
  const list = [];
  for (let i = 0; i < branches.length; i++) {
    if (branches[i].active) list.push(branches[i]);
  }
  return list;
}

export default function OrderCheckout() {
  const nav = useNavigate();
  const cart = useCart();
  const { placeOrder } = useOrders();
  const openBranches = getOpenBranches();

  const [name, setName] = useState('');
  const [table, setTable] = useState('');
  const [branch, setBranch] = useState(openBranches[0] ? openBranches[0].name : '');
  const [wait, setWait] = useState('10');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);

  function submit(e) {
    e.preventDefault();
    setErr('');

    if (!name.trim()) {
      setErr('Please enter your name.');
      return;
    }
    if (!table.trim()) {
      setErr('Please enter your table number.');
      return;
    }
    if (cart.items.length === 0) {
      setErr('Your cart is empty.');
      return;
    }

    const cartCopy = [];
    for (let i = 0; i < cart.items.length; i++) {
      const it = cart.items[i];
      cartCopy.push({ id: it.id, name: it.name, price: it.price, qty: it.qty });
    }

    const order = placeOrder({
      customer: name,
      tableNumber: table,
      branch: branch,
      cartItems: cartCopy,
      readyInMinutes: wait,
    });

    cart.clearCart();
    setDone(order);
  }

  if (done) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-lg px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-ink">Order sent</h1>
          <p className="mt-2 text-muted">
            Thanks {done.customer}. We will bring your order to table {done.tableNumber}.
          </p>

          <div className="mt-6 rounded-xl border border-sand bg-white p-5 text-left text-sm">
            <p><strong>Order:</strong> #{done.id}</p>
            <p className="mt-2"><strong>Table:</strong> {done.tableNumber}</p>
            <p className="mt-2"><strong>Branch:</strong> {done.branch}</p>
            <p className="mt-2"><strong>Ready in:</strong> {getReadyLabel(done)}</p>
            <p className="mt-2"><strong>Total:</strong> ${done.total.toFixed(2)}</p>
            <p className="mt-2"><strong>Items:</strong> {done.items.join(', ')}</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="btn-amber">
              Order more
            </Link>
            <Link to="/" className="btn-outline-muted">
              Home
            </Link>
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
          <div className="mt-10 rounded-xl border border-dashed border-sand bg-white p-10 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link to="/menu" className="mt-3 inline-block text-sm font-semibold text-amber">
              Go to menu
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="rounded-xl border border-sand bg-white p-5">
              <h2 className="font-bold">Cart ({cart.count})</h2>
              <ul className="mt-3 space-y-3">
                {cart.items.map(function (item) {
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-3 border-b border-sand pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <button type="button" onClick={function () { cart.updateQty(item.id, item.qty - 1); }} className="rounded-lg border border-sand px-3 py-1.5 font-medium hover:bg-warm">
                          Less
                        </button>
                        <span className="min-w-[3rem] text-center font-semibold">Qty {item.qty}</span>
                        <button type="button" onClick={function () { cart.updateQty(item.id, item.qty + 1); }} className="rounded-lg border border-sand px-3 py-1.5 font-medium hover:bg-warm">
                          More
                        </button>
                        <button type="button" onClick={function () { cart.removeItem(item.id); }} className="px-2 py-1.5 font-medium text-rose-500 hover:text-rose-600">
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-right font-bold text-amber">Total: ${cart.total.toFixed(2)}</p>
            </div>

            <div className="rounded-xl border border-sand bg-white p-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Table number *</label>
                <input type="number" min="1" value={table} onChange={function (e) { setTable(e.target.value); }} placeholder="12" className="h-10 w-full rounded-lg border border-sand px-3" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Your name</label>
                <input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Sara" className="h-10 w-full rounded-lg border border-sand px-3" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Branch</label>
                <select value={branch} onChange={function (e) { setBranch(e.target.value); }} className="h-10 w-full rounded-lg border border-sand px-3">
                  {openBranches.map(function (b) {
                    return <option key={b.id} value={b.name}>{b.name}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Ready in</label>
                <select value={wait} onChange={function (e) { setWait(e.target.value); }} className="h-10 w-full rounded-lg border border-sand px-3">
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                </select>
              </div>
            </div>

            {err && <p className="text-sm text-rose-600">{err}</p>}

            <div className="flex flex-wrap gap-4">
              <button type="submit" className="btn-amber">
                Send order
              </button>
              <button type="button" onClick={function () { nav('/menu'); }} className="btn-outline-muted">
                Add more
              </button>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
