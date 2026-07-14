import { createContext, useContext, useState } from 'react';
import { getLineId, getDisplayName } from '../utils/drinkCustom.js';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item, custom, finalPrice) {
    let cartLineId = String(item.id) + '-plain';
    let displayName = item.name;
    let price = item.price;

    if (custom) {
      cartLineId = getLineId(item.id, custom);
      displayName = getDisplayName(item.name, custom);
      price = finalPrice;
    }

    const line = {
      cartLineId: cartLineId,
      menuId: item.id,
      id: item.id,
      name: item.name,
      displayName: displayName,
      price: price,
      basePrice: item.price,
      custom: custom || null,
      image: item.image,
      category: item.category,
      qty: 1,
    };

    setItems(function (old) {
      let found = null;
      for (let i = 0; i < old.length; i++) {
        if (old[i].cartLineId === line.cartLineId) {
          found = old[i];
          break;
        }
      }

      if (found) {
        const next = [];
        for (let i = 0; i < old.length; i++) {
          if (old[i].cartLineId === line.cartLineId) {
            next.push({ ...old[i], qty: old[i].qty + 1 });
          } else {
            next.push(old[i]);
          }
        }
        return next;
      }

      return [...old, line];
    });
  }

  function removeItem(cartLineId) {
    setItems(function (old) {
      const next = [];
      for (let i = 0; i < old.length; i++) {
        if (old[i].cartLineId !== cartLineId) next.push(old[i]);
      }
      return next;
    });
  }

  function updateQty(cartLineId, qty) {
    if (qty < 1) {
      removeItem(cartLineId);
      return;
    }
    setItems(function (old) {
      const next = [];
      for (let i = 0; i < old.length; i++) {
        if (old[i].cartLineId === cartLineId) {
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
