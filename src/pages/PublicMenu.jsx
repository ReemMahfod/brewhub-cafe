import { useState } from 'react';
import { Link } from 'react-router-dom';
import { topDrinks } from '../data/mock.js';
import { useCart } from '../context/CartContext.jsx';
import { useMenu } from '../context/MenuContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useRatings } from '../context/RatingsContext.jsx';
import { canCustomize, getCustomPrice, getCustomSummary } from '../utils/drinkCustom.js';
import PublicLayout from '../components/PublicLayout.jsx';
import FilterPills from '../components/FilterPills.jsx';
import SearchInput from '../components/SearchInput.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import CustomizeDrinkModal from '../components/CustomizeDrinkModal.jsx';
import Button from '../components/Button.jsx';

const cats = ['All', 'Hot', 'Iced', 'Bakery', 'Favorites'];

function isPopular(name) {
  for (let i = 0; i < topDrinks.length; i++) {
    if (topDrinks[i].name === name) return true;
  }
  return false;
}

function filterList(all, cat, search, favIds) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    const m = all[i];
    if (cat === 'Favorites' && favIds.indexOf(m.id) === -1) continue;
    if (cat !== 'All' && cat !== 'Favorites' && m.category !== cat) continue;
    if (q && m.name.toLowerCase().indexOf(q) === -1) continue;
    out.push(m);
  }
  return out;
}

export default function PublicMenu() {
  const cart = useCart();
  const { items } = useMenu();
  const favs = useFavorites();
  const ratings = useRatings();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [pick, setPick] = useState(null);
  const [showCustom, setShowCustom] = useState(false);

  const list = filterList(items, cat, search, favs.ids);

  function flashAdded(id) {
    setAddedId(id);
    setTimeout(function () {
      setAddedId(null);
    }, 1200);
  }

  // heart only saves / removes — does not change the page
  function onHeart(menuId) {
    favs.toggleFavorite(menuId);
  }

  function addSimple(item) {
    if (!item.active) return;
    cart.addItem(item);
    flashAdded(item.id);
  }

  function openCustom(item) {
    if (!item.active) return;
    setPick(item);
    setShowCustom(true);
  }

  function addCustom(drink, custom, price) {
    cart.addItem(drink, custom, price);
    favs.saveLastCustom(drink.id, custom, price);
    flashAdded(drink.id);
  }

  function orderAgain(item) {
    if (!item.active) return;
    const saved = favs.getLastCustom(item.id);
    if (saved && saved.custom && canCustomize(item)) {
      const price = getCustomPrice(item.price, saved.custom);
      cart.addItem(item, saved.custom, price);
      flashAdded(item.id);
      return;
    }
    if (canCustomize(item)) openCustom(item);
    else addSimple(item);
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-ink">Our menu</h1>
            <p className="mt-2 text-lg text-muted">
              Tap ♥ to save or remove a favorite. Open the Favorites tab to see them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/track">
              <Button variant="secondary">Track order</Button>
            </Link>
            {cart.count > 0 && (
              <Link to="/order">
                <Button>Place order ({cart.count})</Button>
              </Link>
            )}
          </div>
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

        {cat === 'Favorites' && (
          <p className="mt-4 text-sm text-muted">
            {favs.count === 0
              ? 'No favorites yet. Go back to All and tap the heart on a drink.'
              : favs.count + ' favorite' + (favs.count > 1 ? 's' : '') + ' — tap the heart again to remove.'}
          </p>
        )}

        {cat !== 'Favorites' && favs.count > 0 && (
          <p className="mt-4 text-sm text-muted">
            You have {favs.count} favorite{favs.count > 1 ? 's' : ''}. Open the <button type="button" onClick={function () { setCat('Favorites'); }} className="font-semibold text-amber hover:underline">Favorites</button> tab to view them.
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(function (m) {
            const isDrink = canCustomize(m);
            const sold = !m.active;
            const saved = favs.getLastCustom(m.id);
            const showAgain = cat === 'Favorites' && saved && saved.custom && isDrink;
            const liked = favs.isFavorite(m.id);

            return (
              <MenuItemCard
                key={m.id}
                item={m}
                popular={isPopular(m.name)}
                soldOut={sold}
                favorited={liked}
                onToggleFavorite={onHeart}
                rating={ratings.getStats(m.id)}
                action={
                  <div className="w-full space-y-2">
                    {showAgain && (
                      <p className="line-clamp-1 text-xs text-muted">
                        Last: {getCustomSummary(saved.custom)}
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={sold}
                      onClick={function () {
                        if (showAgain) orderAgain(m);
                        else if (isDrink) openCustom(m);
                        else addSimple(m);
                      }}
                      className={'btn w-full ' + (
                        sold
                          ? 'cursor-not-allowed bg-sand text-muted'
                          : addedId === m.id
                            ? 'bg-emerald-500 text-white'
                            : (showAgain ? 'btn-amber' : 'btn-coffee')
                      )}
                    >
                      {sold
                        ? 'Sold out'
                        : addedId === m.id
                          ? 'Added ✓'
                          : showAgain
                            ? 'Order again'
                            : (isDrink ? 'Customize' : 'Add item')}
                    </button>
                    {showAgain && (
                      <button
                        type="button"
                        disabled={sold}
                        onClick={function () { openCustom(m); }}
                        className="w-full text-center text-xs font-semibold text-coffee hover:underline"
                      >
                        Change options
                      </button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-16 text-center text-muted">
            {cat === 'Favorites'
              ? 'No favorites yet. Tap the heart on a drink first, then open this tab.'
              : 'No items found. Try another category.'}
          </p>
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
