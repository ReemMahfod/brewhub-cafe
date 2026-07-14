import { createContext, useContext, useEffect, useState } from 'react';
import { orders as startOrders } from '../data/mock.js';

const SAVE_KEY = 'brewhub_orders_v1';
const OrdersCtx = createContext(null);

function showTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function addMins(date, mins) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + mins);
  return d;
}

function sameDay(iso) {
  const d = new Date(iso);
  const now = new Date();
  if (d.getFullYear() !== now.getFullYear()) return false;
  if (d.getMonth() !== now.getMonth()) return false;
  if (d.getDate() !== now.getDate()) return false;
  return true;
}

function getReadyInfo(placedAt, mins) {
  const wait = mins < 5 ? 5 : mins;
  const readyDate = addMins(placedAt, wait);
  return {
    readyInMinutes: wait,
    readyAt: showTime(readyDate),
    readyAtISO: readyDate.toISOString(),
  };
}

function loadOrders() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const list = JSON.parse(saved);
      if (list && list.length > 0) return list;
    } catch (e) {
      // bad data in storage, load defaults below
    }
  }

  const list = [];
  for (let i = 0; i < startOrders.length; i++) {
    const o = startOrders[i];
    const placed = new Date();
    placed.setMinutes(placed.getMinutes() - (i + 1) * 8);
    list.push({
      ...o,
      placedAt: placed.toISOString(),
      time: showTime(placed),
      ...getReadyInfo(placed, o.readyInMinutes || 10),
    });
  }
  return list;
}

export function minsLeft(readyAtISO) {
  if (!readyAtISO) return 0;
  const diff = new Date(readyAtISO).getTime() - Date.now();
  const mins = Math.ceil(diff / 60000);
  if (mins < 0) return 0;
  return mins;
}

export function getReadyLabel(order) {
  if (!order.readyAtISO) return order.readyAt || '-';
  if (order.status === 'completed' || order.status === 'cancelled') {
    return order.readyAt;
  }
  const left = minsLeft(order.readyAtISO);
  if (left === 0) return 'Ready now';
  return left + ' min';
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(function () {
    localStorage.setItem(SAVE_KEY, JSON.stringify(orders));
  }, [orders]);

  function placeOrder(data) {
    const placedAt = new Date();
    const names = [];
    for (let i = 0; i < data.cartItems.length; i++) {
      const c = data.cartItems[i];
      const label = c.name;
      for (let j = 0; j < c.qty; j++) {
        names.push(label);
      }
    }

    let total = 0;
    for (let i = 0; i < data.cartItems.length; i++) {
      total = total + data.cartItems[i].price * data.cartItems[i].qty;
    }

    let wait = parseInt(data.readyInMinutes, 10);
    if (isNaN(wait) || wait < 5) wait = 5;

    let newOrder = null;

    setOrders(function (old) {
      let maxId = 0;
      for (let i = 0; i < old.length; i++) {
        if (old[i].id > maxId) maxId = old[i].id;
      }

      newOrder = {
        id: maxId + 1,
        customer: data.customer.trim(),
        tableNumber: String(data.tableNumber).trim(),
        items: names,
        cartItems: data.cartItems,
        total: Math.round(total * 100) / 100,
        status: 'new',
        branch: data.branch,
        time: showTime(placedAt),
        placedAt: placedAt.toISOString(),
        ...getReadyInfo(placedAt, wait),
      };

      const next = [newOrder, ...old];
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      return next;
    });

    return newOrder;
  }

  function updateStatus(id, status) {
    setOrders(function (old) {
      const next = [];
      for (let i = 0; i < old.length; i++) {
        if (old[i].id === id) {
          next.push({ ...old[i], status: status });
        } else {
          next.push(old[i]);
        }
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      return next;
    });
  }

  // stats for dashboard
  let ordersToday = 0;
  let salesToday = 0;
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    if (sameDay(o.placedAt) && o.status !== 'cancelled') {
      ordersToday++;
      salesToday = salesToday + o.total;
    }
  }

  const val = {
    orders,
    placeOrder,
    updateOrderStatus: updateStatus,
    dashboardStats: {
      ordersToday,
      salesToday,
      salesTodayFormatted: '$' + salesToday.toFixed(0),
    },
  };

  return <OrdersCtx.Provider value={val}>{children}</OrdersCtx.Provider>;
}

export function useOrders() {
  return useContext(OrdersCtx);
}
