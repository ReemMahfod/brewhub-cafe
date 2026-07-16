import { useState } from 'react';
import { drinkImages } from '../data/mock.js';
import { useMenu } from '../context/MenuContext.jsx';
import { updateById, removeById, nextId } from '../utils/list.js';
import PageCard from '../components/PageCard.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Button from '../components/Button.jsx';
import FilterPills from '../components/FilterPills.jsx';
import SearchInput from '../components/SearchInput.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import FormField, { TextInput, SelectInput } from '../components/FormField.jsx';

const cats = ['All', 'Hot', 'Iced', 'Bakery'];
const formCats = ['Hot', 'Iced', 'Bakery'];

const defImg = {
  Hot: drinkImages.Hot,
  Iced: drinkImages.Iced,
  Bakery: drinkImages.Bakery,
};

const empty = { name: '', category: 'Hot', price: '', image: '', active: true };

function filterMenu(list, cat, search) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const m = list[i];
    if (cat !== 'All' && m.category !== cat) continue;
    if (q && m.name.toLowerCase().indexOf(q) === -1) continue;
    out.push(m);
  }
  return out;
}

export default function Menu() {
  const { items, setMenu } = useMenu();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');

  const list = filterMenu(items, cat, search);
  const editing = editId !== null;

  function setField(key, val) {
    setForm({ ...form, [key]: val });
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm(empty);
    setErr('');
  }

  function openAdd() {
    setEditId(null);
    setForm(empty);
    setErr('');
    setShowModal(true);
  }

  function openEdit(item) {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      image: item.image.startsWith('http') ? item.image : '',
      active: item.active,
    });
    setErr('');
    setShowModal(true);
  }

  function save(e) {
    e.preventDefault();
    const name = form.name.trim();
    const price = parseFloat(form.price);

    if (!name) {
      setErr('Please enter a product name.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setErr('Please enter a valid price.');
      return;
    }

    if (editing) {
      const current = items.find(function (m) { return m.id === editId; });
      setMenu(updateById(items, editId, {
        name: name,
        category: form.category,
        price: price,
        active: form.active,
        image: form.image.trim() || defImg[form.category] || (current && current.image),
      }));
    } else {
      setMenu([
        {
          id: nextId(items),
          name: name,
          category: form.category,
          price: price,
          active: form.active,
          image: form.image.trim() || defImg[form.category],
        },
        ...items,
      ]);
    }
    closeModal();
  }

  function doDelete() {
    if (!toDelete) return;
    setMenu(removeById(items, toDelete.id));
    setToDelete(null);
  }

  return (
    <>
      <PageCard
        title="Menu"
        subtitle={list.length + ' item(s) · sold out shows on customer menu'}
        actions={
          <>
            <SearchInput value={search} onChange={function (e) { setSearch(e.target.value); }} placeholder="Search menu…" className="w-48" />
            <Button onClick={openAdd}>+ Add item</Button>
          </>
        }
      >
        <FilterPills items={cats} value={cat} onChange={setCat} />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(function (m) {
            return (
              <MenuItemCard
                key={m.id}
                item={m}
                soldOut={!m.active}
                onEdit={function () { openEdit(m); }}
                onDelete={function () { setToDelete(m); }}
                action={
                  <span className={'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (m.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                    {m.active ? 'Available' : 'Sold out'}
                  </span>
                }
              />
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No items match your search.</p>
        )}
      </PageCard>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editing ? 'Edit product' : 'Add product'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="menu-form">{editing ? 'Save changes' : 'Add product'}</Button>
          </>
        }
      >
        <form id="menu-form" onSubmit={save} className="space-y-4">
          <FormField label="Name">
            <TextInput value={form.name} onChange={function (e) { setField('name', e.target.value); }} placeholder="e.g. Vanilla Latte" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <SelectInput value={form.category} onChange={function (e) { setField('category', e.target.value); }}>
                {formCats.map(function (c) {
                  return <option key={c} value={c}>{c}</option>;
                })}
              </SelectInput>
            </FormField>
            <FormField label="Price ($)">
              <TextInput type="number" step="0.1" min="0" value={form.price} onChange={function (e) { setField('price', e.target.value); }} placeholder="4.50" />
            </FormField>
          </div>

          <FormField label="Image URL" optional>
            <TextInput value={form.image} onChange={function (e) { setField('image', e.target.value); }} placeholder="https://…" />
          </FormField>

          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={function (e) { setField('active', e.target.checked); }} className="h-4 w-4 rounded border-sand text-amber" />
            <span className="text-sm font-medium text-ink">Available for ordering</span>
          </label>
          <p className="text-xs text-muted">If unchecked, customers see this item as Sold out.</p>

          {err && <p className="text-sm font-medium text-rose-600">{err}</p>}
        </form>
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        onClose={function () { setToDelete(null); }}
        onConfirm={doDelete}
        title="Delete product"
        message={toDelete ? 'Remove "' + toDelete.name + '" from the menu?' : ''}
      />
    </>
  );
}
