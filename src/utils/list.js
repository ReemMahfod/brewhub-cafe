// small helpers used in CRUD pages
export function updateById(list, id, data) {
  return list.map(function (item) {
    if (item.id === id) return { ...item, ...data };
    return item;
  });
}

export function removeById(list, id) {
  return list.filter(function (item) {
    return item.id !== id;
  });
}

export function nextId(list) {
  let max = 0;
  list.forEach(function (item) {
    const n = typeof item.id === 'number' ? item.id : parseInt(String(item.id).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return max + 1;
}

export function activeOnly(list) {
  return list.filter(function (item) {
    return item.active;
  });
}
