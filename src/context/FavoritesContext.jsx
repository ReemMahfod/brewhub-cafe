import { createContext, useContext, useEffect, useState } from 'react';

const SAVE_KEY = 'brewhub_favs_v1';
const FavCtx = createContext(null);

function loadFavs() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      return {
        ids: data.ids || [],
        lastCustom: data.lastCustom || {},
      };
    } catch (e) {
      // use empty
    }
  }
  return { ids: [], lastCustom: {} };
}

export function FavoritesProvider({ children }) {
  const start = loadFavs();
  const [ids, setIds] = useState(start.ids);
  const [lastCustom, setLastCustom] = useState(start.lastCustom);

  useEffect(function () {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ids: ids, lastCustom: lastCustom }));
  }, [ids, lastCustom]);

  function isFavorite(menuId) {
    return ids.indexOf(menuId) !== -1;
  }

  function toggleFavorite(menuId) {
    setIds(function (old) {
      const next = [];
      let found = false;
      for (let i = 0; i < old.length; i++) {
        if (old[i] === menuId) found = true;
        else next.push(old[i]);
      }
      if (!found) next.push(menuId);
      return next;
    });
  }

  function saveLastCustom(menuId, custom, price) {
    setLastCustom(function (old) {
      return {
        ...old,
        [menuId]: { custom: custom, price: price },
      };
    });
  }

  function getLastCustom(menuId) {
    return lastCustom[menuId] || null;
  }

  const val = {
    ids,
    isFavorite,
    toggleFavorite,
    saveLastCustom,
    getLastCustom,
    count: ids.length,
  };

  return <FavCtx.Provider value={val}>{children}</FavCtx.Provider>;
}

export function useFavorites() {
  return useContext(FavCtx);
}
