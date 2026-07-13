// demo data for the project
import caramelLatte from '../assets/drinks/caramel-latte.jpg';
import coldBrew from '../assets/drinks/cold-brew.jpg';
import espresso from '../assets/drinks/espresso.jpg';
import cappuccino from '../assets/drinks/cappuccino.jpg';
import icedMocha from '../assets/drinks/iced-mocha.jpg';
import croissant from '../assets/drinks/croissant.jpg';
import branchPhoto from '../assets/branches/campus.jpg';

export const heroImage = caramelLatte;

export const branchImages = {
  default: branchPhoto,
};

export const stats = [
  { id: 'sales', label: "Today's Sales", value: '$2,840', delta: '+12%', up: true },
  { id: 'orders', label: 'Orders Today', value: '24', delta: '+5%', up: true },
  { id: 'branches', label: 'Branches', value: '3', delta: 'Open', up: true },
  { id: 'equipment', label: 'Equipment', value: '4 / 4', delta: 'All online', up: true },
];

export const salesByDay = [
  { day: 'Mon', value: 1820 },
  { day: 'Tue', value: 2110 },
  { day: 'Wed', value: 1980 },
  { day: 'Thu', value: 2520 },
  { day: 'Fri', value: 3010 },
  { day: 'Sat', value: 3480 },
  { day: 'Sun', value: 2840 },
];

export const topDrinks = [
  { name: 'Caramel Latte', sold: 120, share: 100 },
  { name: 'Cappuccino', sold: 95, share: 79 },
  { name: 'Cold Brew', sold: 80, share: 67 },
];

export const branches = [
  { id: 1, name: 'Downtown Brew', address: 'Main St 12', staff: 5, active: true, hours: '7:00 AM – 10:00 PM', image: branchPhoto },
  { id: 2, name: 'Riverside Cafe', address: 'River Ave 8', staff: 4, active: true, hours: '8:00 AM – 9:00 PM', image: branchPhoto },
  { id: 3, name: 'Campus Corner', address: 'University Rd 3', staff: 3, active: true, hours: '7:30 AM – 8:00 PM', image: branchPhoto },
];

export const menu = [
  { id: 1, name: 'Caramel Latte', category: 'Hot', price: 4.5, active: true, image: caramelLatte },
  { id: 2, name: 'Cappuccino', category: 'Hot', price: 4.2, active: true, image: cappuccino },
  { id: 3, name: 'Espresso', category: 'Hot', price: 2.9, active: true, image: espresso },
  { id: 4, name: 'Cold Brew', category: 'Iced', price: 3.8, active: true, image: coldBrew },
  { id: 5, name: 'Iced Mocha', category: 'Iced', price: 4.8, active: true, image: icedMocha },
  { id: 6, name: 'Croissant', category: 'Bakery', price: 3.2, active: true, image: croissant },
];

export const drinkImages = {
  Hot: cappuccino,
  Iced: icedMocha,
  Bakery: croissant,
};

export const orders = [
  { id: 1042, customer: 'Olivia R.', tableNumber: '7', items: ['Caramel Latte', 'Croissant'], total: 7.7, status: 'preparing', branch: 'Downtown Brew', readyInMinutes: 10 },
  { id: 1041, customer: 'James P.', tableNumber: '3', items: ['Cold Brew'], total: 3.8, status: 'new', branch: 'Riverside Cafe', readyInMinutes: 5 },
  { id: 1040, customer: 'Mia K.', tableNumber: '12', items: ['Cappuccino'], total: 4.2, status: 'completed', branch: 'Campus Corner', readyInMinutes: 15 },
];

export const staff = [
  { id: 1, name: 'Olivia Rhye', role: 'Owner', branch: 'All branches', active: true },
  { id: 2, name: 'James Porter', role: 'Branch Manager', branch: 'Downtown Brew', active: true },
  { id: 3, name: 'Mia Klein', role: 'Barista', branch: 'Riverside Cafe', active: true },
];

export const equipment = [
  { id: 'eq-1', name: 'Espresso Machine', branch: 'Downtown Brew', status: 'online', lastService: 'Jun 12' },
  { id: 'eq-2', name: 'Coffee Grinder', branch: 'Downtown Brew', status: 'online', lastService: 'Jun 20' },
  { id: 'eq-3', name: 'Ice Maker', branch: 'Riverside Cafe', status: 'online', lastService: 'Jul 01' },
  { id: 'eq-4', name: 'POS Terminal', branch: 'Campus Corner', status: 'online', lastService: 'May 28' },
];

export const roleColors = {
  Owner: 'bg-amber/10 text-amber',
  'Branch Manager': 'bg-coffee/10 text-coffee',
  Barista: 'bg-emerald-100 text-emerald-700',
};

export const statusStyles = {
  new: 'bg-blue-100 text-blue-700',
  preparing: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  online: 'bg-emerald-100 text-emerald-700',
  maintenance: 'bg-amber-100 text-amber-700',
  offline: 'bg-rose-100 text-rose-700',
};
