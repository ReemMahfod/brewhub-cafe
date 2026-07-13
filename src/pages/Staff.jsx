import { useState } from 'react';
import { staff as startStaff, branches, roleColors } from '../data/mock.js';
import PageCard from '../components/PageCard.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Button from '../components/Button.jsx';
import SearchInput from '../components/SearchInput.jsx';
import RowActions from '../components/RowActions.jsx';
import FormField, { TextInput, SelectInput } from '../components/FormField.jsx';

const roles = ['Owner', 'Branch Manager', 'Barista'];
const branchOpts = ['All branches'];
for (let i = 0; i < branches.length; i++) {
  branchOpts.push(branches[i].name);
}

const empty = { name: '', role: 'Barista', branch: branchOpts[1], active: true };

function filterStaff(list, search) {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    if (s.name.toLowerCase().indexOf(q) !== -1 || s.role.toLowerCase().indexOf(q) !== -1) {
      out.push(s);
    }
  }
  return out;
}

function getInitials(name) {
  const parts = name.split(' ');
  let txt = '';
  for (let i = 0; i < parts.length; i++) {
    if (parts[i][0]) txt = txt + parts[i][0];
  }
  return txt;
}

export default function Staff() {
  const [items, setItems] = useState(startStaff);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');

  const list = filterStaff(items, search);
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

  function openEdit(s) {
    setEditId(s.id);
    setForm({ name: s.name, role: s.role, branch: s.branch, active: s.active });
    setErr('');
    setShowModal(true);
  }

  function save(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setErr('Please enter a name.');
      return;
    }

    if (editing) {
      const next = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === editId) {
          next.push({ ...items[i], name: name, role: form.role, branch: form.branch, active: form.active });
        } else {
          next.push(items[i]);
        }
      }
      setItems(next);
    } else {
      let maxId = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id > maxId) maxId = items[i].id;
      }
      setItems([
        { id: maxId + 1, name: name, role: form.role, branch: form.branch, active: form.active },
        ...items,
      ]);
    }
    closeModal();
  }

  function doDelete() {
    if (!toDelete) return;
    const next = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].id !== toDelete.id) next.push(items[i]);
    }
    setItems(next);
    setToDelete(null);
  }

  return (
    <>
      <PageCard
        title="Staff"
        subtitle={list.length + ' member(s)'}
        actions={
          <>
            <SearchInput value={search} onChange={function (e) { setSearch(e.target.value); }} placeholder="Search staff…" className="w-48" />
            <Button onClick={openAdd}>+ Add member</Button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-muted">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Branch</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(function (s) {
                const roleCls = roleColors[s.role] || 'bg-gray-100 text-gray-600';
                return (
                  <tr key={s.id} className="border-b border-sand/60 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coffee text-xs font-semibold text-cream">
                          {getInitials(s.name)}
                        </span>
                        <span className="font-semibold text-ink">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={'rounded-full px-2.5 py-0.5 text-xs font-semibold ' + roleCls}>{s.role}</span>
                    </td>
                    <td className="py-3 text-muted">{s.branch}</td>
                    <td className="py-3">
                      <span className={'inline-flex items-center gap-1.5 text-xs font-semibold ' + (s.active ? 'text-emerald-600' : 'text-muted')}>
                        <span className={'h-2 w-2 rounded-full ' + (s.active ? 'bg-emerald-500' : 'bg-gray-300')} />
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        <RowActions onEdit={function () { openEdit(s); }} onDelete={function () { setToDelete(s); }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No staff members found.</p>
        )}
      </PageCard>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editing ? 'Edit staff member' : 'Add staff member'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="staff-form">{editing ? 'Save changes' : 'Add member'}</Button>
          </>
        }
      >
        <form id="staff-form" onSubmit={save} className="space-y-4">
          <FormField label="Full name">
            <TextInput value={form.name} onChange={function (e) { setField('name', e.target.value); }} placeholder="e.g. Sarah Ahmed" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Role">
              <SelectInput value={form.role} onChange={function (e) { setField('role', e.target.value); }}>
                {roles.map(function (r) {
                  return <option key={r} value={r}>{r}</option>;
                })}
              </SelectInput>
            </FormField>
            <FormField label="Branch">
              <SelectInput value={form.branch} onChange={function (e) { setField('branch', e.target.value); }}>
                {branchOpts.map(function (b) {
                  return <option key={b} value={b}>{b}</option>;
                })}
              </SelectInput>
            </FormField>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.active} onChange={function (e) { setField('active', e.target.checked); }} className="h-4 w-4 rounded border-sand text-amber" />
            <span className="text-sm font-medium text-ink">Active employee</span>
          </label>
          {err && <p className="text-sm font-medium text-rose-600">{err}</p>}
        </form>
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        onClose={function () { setToDelete(null); }}
        onConfirm={doDelete}
        title="Remove staff member"
        message={toDelete ? 'Remove "' + toDelete.name + '"?' : ''}
      />
    </>
  );
}
