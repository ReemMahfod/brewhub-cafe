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
  return {
    size: 'Medium',
    milk: 'Regular',
    sweetness: 'Regular',
    extras: [],
  };
}

function findExtra(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i].extra;
  }
  return 0;
}

export function canCustomize(item) {
  return item.category === 'Hot' || item.category === 'Iced';
}

export function getCustomPrice(basePrice, custom) {
  let total = basePrice;
  total = total + findExtra(sizes, custom.size);
  total = total + findExtra(milkTypes, custom.milk);
  total = total + findExtra(sweetnessLevels, custom.sweetness);

  for (let i = 0; i < custom.extras.length; i++) {
    total = total + findExtra(extraAddons, custom.extras[i]);
  }

  return Math.round(total * 100) / 100;
}

export function getLineId(menuId, custom) {
  const extras = custom.extras.slice().sort().join(',');
  return menuId + '-' + custom.size + '-' + custom.milk + '-' + custom.sweetness + '-' + extras;
}

export function getDisplayName(name, custom) {
  let parts = [name];
  let details = custom.size;

  if (custom.milk !== 'Regular') {
    if (custom.milk === 'None') details = details + ', no milk';
    else details = details + ', ' + custom.milk + ' milk';
  }
  if (custom.sweetness !== 'Regular') {
    if (custom.sweetness === 'None') details = details + ', no sugar';
    else details = details + ', ' + custom.sweetness.toLowerCase() + ' sugar';
  }
  for (let i = 0; i < custom.extras.length; i++) {
    for (let j = 0; j < extraAddons.length; j++) {
      if (extraAddons[j].id === custom.extras[i]) {
        details = details + ', +' + extraAddons[j].label.toLowerCase();
      }
    }
  }

  return parts[0] + ' (' + details + ')';
}

export function getCustomSummary(custom) {
  const bits = [custom.size, custom.milk + ' milk', custom.sweetness + ' sugar'];
  for (let i = 0; i < custom.extras.length; i++) {
    for (let j = 0; j < extraAddons.length; j++) {
      if (extraAddons[j].id === custom.extras[i]) {
        bits.push(extraAddons[j].label);
      }
    }
  }
  return bits.join(' · ');
}
