import { createContext, useContext, useState } from 'react';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item) {
    setItems(function (old) {
      let found = null;
      for (let i = 0; i < old.length; i++) {
        if (old[i].id === item.id) {
          found = old[i];
          break;
        }
      }

      if (found) {
        const next = [];
        for (let i = 0; i < old.length; i++) {
          if (old[i].id === item.id) {
            next.push({ ...old[i], qty: old[i].qty + 1 });
          } else {
            next.push(old[i]);
          }
        }
        return next;
      }

      return [...old, { ...item, qty: 1 }];
    });
  }

  function removeItem(id) {
    setItems(function (old) {
      const next = [];
      for (let i = 0; i < old.length; i++) {
        if (old[i].id !== id) next.push(old[i]);
      }
      return next;
    });
  }

  function updateQty(id, qty) {
    if (qty < 1) {
      removeItem(id);
      return;
    }
    setItems(function (old) {
      const next = [];
      for (let i = 0; i < old.length; i++) {
        if (old[i].id === id) {
          next.push({ ...old[i], qty: qty });
        } else {
          next.push(old[i]);
        }
      }
      return next;
    });
  }

  function clearCart() {
    setItems([]);
  }

  let total = 0;
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].qty;
    count = count + items[i].qty;
  }

  const val = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    total,
    count,
  };

  return <CartCtx.Provider value={val}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}
