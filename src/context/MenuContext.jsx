import { createContext, useContext, useEffect, useState } from 'react';
import { menu as startMenu } from '../data/mock.js';

const SAVE_KEY = 'brewhub_menu_v1';
const MenuCtx = createContext(null);

function loadMenu() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const list = JSON.parse(saved);
      if (list && list.length > 0) return list;
    } catch (e) {
      // use defaults
    }
  }
  return startMenu.slice();
}

export function MenuProvider({ children }) {
  const [items, setItems] = useState(loadMenu);

  useEffect(function () {
    localStorage.setItem(SAVE_KEY, JSON.stringify(items));
  }, [items]);

  function setMenu(next) {
    setItems(next);
    localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  }

  return (
    <MenuCtx.Provider value={{ items, setMenu }}>
      {children}
    </MenuCtx.Provider>
  );
}

export function useMenu() {
  return useContext(MenuCtx);
}
