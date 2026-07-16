import { useState } from 'react';
import { equipment as startEq, branches } from '../data/mock.js';
import { updateById, removeById, nextId } from '../utils/list.js';
import StatusBadge from '../components/StatusBadge.jsx';
import StatCard from '../components/StatCard.jsx';
import PageCard from '../components/PageCard.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Button from '../components/Button.jsx';
import RowActions from '../components/RowActions.jsx';
import FormField, { TextInput, SelectInput } from '../components/FormField.jsx';

const statuses = ['online', 'maintenance', 'offline'];
const branchNames = branches.map(function (b) { return b.name; });
const empty = { name: '', branch: branchNames[0], status: 'online', lastService: '' };

export default function Equipment() {
  const [items, setItems] = useState(startEq);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');

  const editing = editId !== null;
  const counts = { online: 0, maintenance: 0, offline: 0 };
  items.forEach(function (e) { counts[e.status]++; });

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
    setForm({ name: item.name, branch: item.branch, status: item.status, lastService: item.lastService });
    setErr('');
    setShowModal(true);
  }

  function save(e) {
    e.preventDefault();
    const name = form.name.trim();
    const lastService = form.lastService.trim();

    if (!name) {
      setErr('Please enter a device name.');
      return;
    }
    if (!lastService) {
      setErr('Please enter the last service date.');
      return;
    }

    if (editing) {
      setItems(updateById(items, editId, {
        name: name,
        branch: form.branch,
        status: form.status,
        lastService: lastService,
      }));
    } else {
      setItems([
        { id: 'eq-' + nextId(items), name: name, branch: form.branch, status: form.status, lastService: lastService },
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
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Online" value={counts.online} valueClass="text-emerald-600" />
        <StatCard label="Maintenance" value={counts.maintenance} valueClass="text-amber" />
        <StatCard label="Offline" value={counts.offline} valueClass="text-rose-600" />
      </div>

      <PageCard title="Equipment" subtitle={items.length + ' device(s)'} actions={<Button onClick={openAdd}>+ Add device</Button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-muted">
                <th className="pb-3 font-semibold">Device</th>
                <th className="pb-3 font-semibold">Branch</th>
                <th className="pb-3 font-semibold">Last service</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(function (e) {
                return (
                  <tr key={e.id} className="border-b border-sand/60 last:border-0">
                    <td className="py-3 font-semibold text-ink">{e.name}</td>
                    <td className="py-3 text-muted">{e.branch}</td>
                    <td className="py-3 text-muted">{e.lastService}</td>
                    <td className="py-3"><StatusBadge status={e.status} /></td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        <RowActions onEdit={function () { openEdit(e); }} onDelete={function () { setToDelete(e); }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageCard>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editing ? 'Edit device' : 'Add device'}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="eq-form">{editing ? 'Save changes' : 'Add device'}</Button>
          </>
        }
      >
        <form id="eq-form" onSubmit={save} className="space-y-4">
          <FormField label="Device name">
            <TextInput value={form.name} onChange={function (e) { setField('name', e.target.value); }} placeholder="e.g. Espresso Machine" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Branch">
              <SelectInput value={form.branch} onChange={function (e) { setField('branch', e.target.value); }}>
                {branchNames.map(function (b) {
                  return <option key={b} value={b}>{b}</option>;
                })}
              </SelectInput>
            </FormField>
            <FormField label="Status">
              <SelectInput value={form.status} onChange={function (e) { setField('status', e.target.value); }}>
                {statuses.map(function (s) {
                  return <option key={s} value={s}>{s}</option>;
                })}
              </SelectInput>
            </FormField>
          </div>
          <FormField label="Last service">
            <TextInput value={form.lastService} onChange={function (e) { setField('lastService', e.target.value); }} placeholder="Jun 12" />
          </FormField>
          {err && <p className="text-sm font-medium text-rose-600">{err}</p>}
        </form>
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        onClose={function () { setToDelete(null); }}
        onConfirm={doDelete}
        title="Delete device"
        message={toDelete ? 'Remove "' + toDelete.name + '"?' : ''}
      />
    </div>
  );
}
