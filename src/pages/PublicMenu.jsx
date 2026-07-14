import { useState } from 'react';
import { Link } from 'react-router-dom';
import { menu } from '../data/mock.js';
import { useCart } from '../context/CartContext.jsx';
import { canCustomize } from '../utils/drinkCustom.js';
import PublicLayout from '../components/PublicLayout.jsx';
import FilterPills from '../components/FilterPills.jsx';
import SearchInput from '../components/SearchInput.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import CustomizeDrinkModal from '../components/CustomizeDrinkModal.jsx';
import Button from '../components/Button.jsx';

const cats = ['All', 'Hot', 'Iced', 'Bakery'];

function filterList(all, cat, search) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    const m = all[i];
    if (!m.active) continue;
    if (cat !== 'All' && m.category !== cat) continue;
    if (q && m.name.toLowerCase().indexOf(q) === -1) continue;
    out.push(m);
  }
  return out;
}

export default function PublicMenu() {
  const cart = useCart();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [pick, setPick] = useState(null);
  const [showCustom, setShowCustom] = useState(false);

  const list = filterList(menu, cat, search);

  function flashAdded(id) {
    setAddedId(id);
    setTimeout(function () {
      setAddedId(null);
    }, 1200);
  }

  function addSimple(item) {
    cart.addItem(item);
    flashAdded(item.id);
  }

  function openCustom(item) {
    setPick(item);
    setShowCustom(true);
  }

  function addCustom(drink, custom, price) {
    cart.addItem(drink, custom, price);
    flashAdded(drink.id);
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-ink">Our menu</h1>
            <p className="mt-2 text-lg text-muted">
              Customize your drink — size, milk, sweetness, and extras.
            </p>
          </div>
          {cart.count > 0 && (
            <Link to="/order">
              <Button>Place order ({cart.count})</Button>
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterPills items={cats} value={cat} onChange={setCat} activeClass="bg-coffee text-cream" />
          <SearchInput
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            placeholder="Search drinks…"
            className="w-full bg-white sm:w-56"
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(function (m) {
            const isDrink = canCustomize(m);
            return (
              <MenuItemCard
                key={m.id}
                item={m}
                action={
                  <button
                    type="button"
                    onClick={function () {
                      if (isDrink) openCustom(m);
                      else addSimple(m);
                    }}
                    className={'btn w-full ' + (
                      addedId === m.id ? 'bg-emerald-500 text-white' : 'btn-coffee'
                    )}
                  >
                    {addedId === m.id ? 'Added ✓' : (isDrink ? 'Customize' : 'Add item')}
                  </button>
                }
              />
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-16 text-center text-muted">No items found. Try another category.</p>
        )}
      </div>

      <CustomizeDrinkModal
        key={pick ? pick.id : 'none'}
        drink={pick}
        open={showCustom}
        onClose={function () { setShowCustom(false); setPick(null); }}
        onAdd={addCustom}
      />
    </PublicLayout>
  );
}
