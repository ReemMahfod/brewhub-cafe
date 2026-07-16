import { createContext, useContext, useEffect, useState } from 'react';

const SAVE_KEY = 'brewhub_ratings_v1';
const RatingsCtx = createContext(null);

function loadRatings() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data && typeof data === 'object') return data;
    } catch (e) {
      // empty
    }
  }
  // small demo start so menu is not empty of stars
  return {
    1: { sum: 18, count: 4 },
    2: { sum: 14, count: 3 },
    4: { sum: 9, count: 2 },
  };
}

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState(loadRatings);

  useEffect(function () {
    localStorage.setItem(SAVE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  function getStats(menuId) {
    const row = ratings[menuId];
    if (!row || row.count === 0) {
      return { avg: 0, count: 0 };
    }
    return {
      avg: Math.round((row.sum / row.count) * 10) / 10,
      count: row.count,
    };
  }

  function addRating(menuId, stars) {
    const value = parseInt(stars, 10);
    if (isNaN(value) || value < 1 || value > 5) return;

    setRatings(function (old) {
      const prev = old[menuId] || { sum: 0, count: 0 };
      const next = {
        ...old,
        [menuId]: {
          sum: prev.sum + value,
          count: prev.count + 1,
        },
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <RatingsCtx.Provider value={{ getStats, addRating }}>
      {children}
    </RatingsCtx.Provider>
  );
}

export function useRatings() {
  return useContext(RatingsCtx);
}
