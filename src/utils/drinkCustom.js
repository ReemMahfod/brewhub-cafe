export const sizes = [
  { id: 'Small', label: 'Small', extra: 0 },
  { id: 'Medium', label: 'Medium', extra: 0.5 },
  { id: 'Large', label: 'Large', extra: 1 },
];

export const milkTypes = [
  { id: 'Regular', label: 'Regular milk', extra: 0 },
  { id: 'Oat', label: 'Oat milk', extra: 0.6 },
  { id: 'Almond', label: 'Almond milk', extra: 0.6 },
  { id: 'Soy', label: 'Soy milk', extra: 0.5 },
  { id: 'None', label: 'No milk', extra: 0 },
];

export const sweetnessLevels = [
  { id: 'None', label: 'No sugar', extra: 0 },
  { id: 'Light', label: 'Light', extra: 0 },
  { id: 'Regular', label: 'Regular', extra: 0 },
  { id: 'Extra', label: 'Extra sweet', extra: 0.3 },
];

export const extraAddons = [
  { id: 'shot', label: 'Extra espresso shot', extra: 0.8 },
  { id: 'cream', label: 'Whipped cream', extra: 0.5 },
  { id: 'caramel', label: 'Caramel drizzle', extra: 0.4 },
  { id: 'vanilla', label: 'Vanilla syrup', extra: 0.3 },
];

export function defaultCustom() {
  return { size: 'Medium', milk: 'Regular', sweetness: 'Regular', extras: [] };
}

function findOpt(list, id) {
  return list.find(function (o) { return o.id === id; }) || null;
}

function extraOf(list, id) {
  const o = findOpt(list, id);
  return o ? o.extra : 0;
}

export function canCustomize(item) {
  return item.category === 'Hot' || item.category === 'Iced';
}

export function getCustomPrice(basePrice, custom) {
  let total = basePrice;
  total += extraOf(sizes, custom.size);
  total += extraOf(milkTypes, custom.milk);
  total += extraOf(sweetnessLevels, custom.sweetness);
  custom.extras.forEach(function (id) {
    total += extraOf(extraAddons, id);
  });
  return Math.round(total * 100) / 100;
}

export function getLineId(menuId, custom) {
  return menuId + '-' + custom.size + '-' + custom.milk + '-' + custom.sweetness + '-' + custom.extras.slice().sort().join(',');
}

export function getDisplayName(name, custom) {
  let details = custom.size;
  if (custom.milk === 'None') details += ', no milk';
  else if (custom.milk !== 'Regular') details += ', ' + custom.milk + ' milk';
  if (custom.sweetness === 'None') details += ', no sugar';
  else if (custom.sweetness !== 'Regular') details += ', ' + custom.sweetness.toLowerCase() + ' sugar';
  custom.extras.forEach(function (id) {
    const add = findOpt(extraAddons, id);
    if (add) details += ', +' + add.label.toLowerCase();
  });
  return name + ' (' + details + ')';
}

export function getCustomSummary(custom) {
  const bits = [custom.size, custom.milk + ' milk', custom.sweetness + ' sugar'];
  custom.extras.forEach(function (id) {
    const add = findOpt(extraAddons, id);
    if (add) bits.push(add.label);
  });
  return bits.join(' · ');
}

export function getPriceBreakdown(basePrice, custom) {
  const lines = [{ label: 'Base drink', amount: basePrice }];
  const size = findOpt(sizes, custom.size);
  if (size && size.extra > 0) lines.push({ label: size.label + ' size', amount: size.extra });
  const milk = findOpt(milkTypes, custom.milk);
  if (milk && milk.extra > 0) lines.push({ label: milk.label, amount: milk.extra });
  const sweet = findOpt(sweetnessLevels, custom.sweetness);
  if (sweet && sweet.extra > 0) lines.push({ label: sweet.label, amount: sweet.extra });
  custom.extras.forEach(function (id) {
    const add = findOpt(extraAddons, id);
    if (add) lines.push({ label: add.label, amount: add.extra });
  });
  return lines;
}

export function estimateWaitMinutes(cartItems) {
  let mins = 8;
  cartItems.forEach(function (item) {
    const qty = item.qty || 1;
    mins += (qty - 1) * 2;
    if (item.custom) {
      if (item.custom.size === 'Large') mins += 2 * qty;
      if (item.custom.size === 'Medium') mins += 1 * qty;
      mins += item.custom.extras.length * qty;
    }
  });
  if (mins < 5) return 5;
  if (mins > 25) return 25;
  return mins;
}
