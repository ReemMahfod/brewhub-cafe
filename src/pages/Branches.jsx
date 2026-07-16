import { useState } from 'react';
import { branches as startBranches, branchImages } from '../data/mock.js';
import { updateById, removeById, nextId } from '../utils/list.js';
import PageCard from '../components/PageCard.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Button from '../components/Button.jsx';
import FilterPills from '../components/FilterPills.jsx';
import SearchInput from '../components/SearchInput.jsx';
import StatCard from '../components/StatCard.jsx';
import RowActions from '../components/RowActions.jsx';
import FormField, { TextInput } from '../components/FormField.jsx';

const filters = ['All', 'Open', 'Closed'];
const empty = { name: '', address: '', hours: '8:00 AM – 9:00 PM', staff: '4', active: true, image: '' };

function filterBranches(list, filter, search) {
  const q = search.trim().toLowerCase();
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    if (filter === 'Open' && !b.active) continue;
    if (filter === 'Closed' && b.active) continue;
    if (q) {
      if (b.name.toLowerCase().indexOf(q) === -1 && b.address.toLowerCase().indexOf(q) === -1) continue;
    }
    out.push(b);
  }
  return out;
}

export default function Branches() {
  const [items, setItems] = useState(startBranches);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');

  const list = filterBranches(items, filter, search);
  const editing = editId !== null;

  let openCount = 0;
  let staffTotal = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].active) openCount++;
    staffTotal = staffTotal + items[i].staff;
  }

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

  function openEdit(b) {
    setEditId(b.id);
    setForm({
      name: b.name,
      address: b.address,
      hours: b.hours,
      staff: String(b.staff),
      active: b.active,
      image: b.image.startsWith('http') ? b.image : '',
    });
    setErr('');
    setShowModal(true);
  }

  function save(e) {
    e.preventDefault();
    const name = form.name.trim();
    const address = form.address.trim();
    const hours = form.hours.trim();
    const staff = parseInt(form.staff, 10);

    if (!name) {
      setErr('Please enter a branch name.');
      return;
    }
    if (!address) {
      setErr('Please enter an address.');
      return;
    }

    if (editing) {
      const current = items.find(function (b) { return b.id === editId; });
      setItems(updateById(items, editId, {
        name: name,
        address: address,
        hours: hours,
        staff: staff,
        active: form.active,
        image: form.image.trim() || branchImages.default || (current && current.image),
      }));
    } else {
      setItems([
        {
          id: nextId(items),
          name: name,
          address: address,
          hours: hours,
          staff: staff,
          active: form.active,
          image: form.image.trim() || branchImages.default,
        },
        ...items,
      ]);
    }
    closeModal();
  }

  function doDelete() {
    if (!toDelete) return;
    setItems(removeById(items, toDelete.id));
    setToDelete(null);
  }

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Open branches" value={openCount} />
        <StatCard label="Closed" value={items.length - openCount} />
        <StatCard label="Total staff" value={staffTotal} />
      </div>

      <PageCard
        title="Branches"
        subtitle={list.length + ' location(s)'}
        actions={
          <>
            <SearchInput value={search} onChange={function (e) { setSearch(e.target.value); }} placeholder="Search branches…" className="w-48" />
            <Button onClick={openAdd}>+ Add branch</Button>
          </>
        }
      >
        <FilterPills items={filters} value={filter} onChange={setFilter} />

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {list.map(function (b) {
            return (
              <article key={b.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand bg-white shadow-card">
                <div className="relative h-36 overflow-hidden bg-cream">
                  <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
                  <span className={'absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ' + (b.active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                    {b.active ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-lg font-bold text-ink">{b.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{b.address}</p>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-sand pt-4">
                    <div className="text-sm">
                      <p className="text-muted">{b.hours}</p>
                      <p className="mt-1 font-medium text-coffee">{b.staff} staff</p>
                    </div>
                    <RowActions onEdit={function () { openEdit(b); }} onDelete={function () { setToDelete(b); }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No branches match your search.</p>
        )}
      </PageCard>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editing ? 'Edit branch' : 'Add branch'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="branch-form">{editing ? 'Save changes' : 'Add branch'}</Button>
          </>
        }
      >
        <form id="branch-form" onSubmit={save} className="space-y-4">
          <FormField label="Branch name">
            <TextInput value={form.name} onChange={function (e) { setField('name', e.target.value); }} placeholder="e.g. Marina Brew" />
          </FormField>
          <FormField label="Address">
            <TextInput value={form.address} onChange={function (e) { setField('address', e.target.value); }} placeholder="e.g. Sea Blvd 24" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Opening hours">
              <TextInput value={form.hours} onChange={function (e) { setField('hours', e.target.value); }} />
            </FormField>
            <FormField label="Staff count">
              <TextInput type="number" min="0" value={form.staff} onChange={function (e) { setField('staff', e.target.value); }} />
            </FormField>
          </div>
          <FormField label="Image URL" optional>
            <TextInput value={form.image} onChange={function (e) { setField('image', e.target.value); }} placeholder="https://…" />
          </FormField>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={function (e) { setField('active', e.target.checked); }} className="h-4 w-4 rounded border-sand text-amber" />
            <span className="text-sm font-medium text-ink">Open for business</span>
          </label>
          {err && <p className="text-sm font-medium text-rose-600">{err}</p>}
        </form>
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        onClose={function () { setToDelete(null); }}
        onConfirm={doDelete}
        title="Delete branch"
        message={toDelete ? 'Remove "' + toDelete.name + '"?' : ''}
      />
    </>
  );
}
