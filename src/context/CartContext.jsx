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

    setItems(function (old) {
      const found = old.find(function (x) { return x.cartLineId === cartLineId; });
      if (found) {
        return old.map(function (x) {
          if (x.cartLineId === cartLineId) return { ...x, qty: x.qty + 1 };
          return x;
        });
      }
      return [
        ...old,
        {
          cartLineId,
          menuId: item.id,
          id: item.id,
          name: item.name,
          displayName,
          price,
          basePrice: item.price,
          custom: custom || null,
          image: item.image,
          category: item.category,
          qty: 1,
        },
      ];
    });
  }

  function removeItem(cartLineId) {
    setItems(function (old) {
      return old.filter(function (x) { return x.cartLineId !== cartLineId; });
    });
  }

  function updateQty(cartLineId, qty) {
    if (qty < 1) {
      removeItem(cartLineId);
      return;
    }
    setItems(function (old) {
      return old.map(function (x) {
        if (x.cartLineId === cartLineId) return { ...x, qty: qty };
        return x;
      });
    });
  }

  function clearCart() {
    setItems([]);
  }

  let total = 0;
  let count = 0;
  items.forEach(function (x) {
    total += x.price * x.qty;
    count += x.qty;
  });

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  return useContext(CartCtx);
}
