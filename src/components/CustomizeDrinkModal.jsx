import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import {
  sizes,
  milkTypes,
  sweetnessLevels,
  extraAddons,
  defaultCustom,
  getCustomPrice,
  getDisplayName,
} from '../utils/drinkCustom.js';

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(function (opt) {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={function () { onChange(opt.id); }}
              className={'rounded-full px-4 py-2 text-sm font-medium transition ' + (
                active ? 'bg-coffee text-cream' : 'bg-warm text-muted hover:bg-sand'
              )}
            >
              {opt.label}
              {opt.extra > 0 && <span className="ml-1 text-xs opacity-80">+${opt.extra.toFixed(2)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomizeDrinkModal({ drink, open, onClose, onAdd }) {
  const [custom, setCustom] = useState(defaultCustom());

  if (!drink) return null;

  const price = getCustomPrice(drink.price, custom);

  function setField(key, val) {
    setCustom({ ...custom, [key]: val });
  }

  function toggleExtra(id) {
    const list = custom.extras.slice();
    let found = false;
    const next = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] === id) found = true;
      else next.push(list[i]);
    }
    if (!found) next.push(id);
    setCustom({ ...custom, extras: next });
  }

  function handleAdd() {
    onAdd(drink, custom, price);
    setCustom(defaultCustom());
    onClose();
  }

  function handleClose() {
    setCustom(defaultCustom());
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      wide
      title={'Customize ' + drink.name}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add to cart · ${price.toFixed(2)}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl bg-warm p-3">
          <img src={drink.image} alt={drink.name} className="h-16 w-16 rounded-lg object-cover" />
          <div>
            <p className="font-semibold text-ink">{drink.name}</p>
            <p className="text-sm text-muted">Base price ${drink.price.toFixed(2)}</p>
          </div>
        </div>

        <OptionGroup label="Size" options={sizes} value={custom.size} onChange={function (v) { setField('size', v); }} />
        <OptionGroup label="Milk" options={milkTypes} value={custom.milk} onChange={function (v) { setField('milk', v); }} />
        <OptionGroup label="Sweetness" options={sweetnessLevels} value={custom.sweetness} onChange={function (v) { setField('sweetness', v); }} />

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Extra add-ons</p>
          <div className="space-y-2">
            {extraAddons.map(function (opt) {
              const checked = custom.extras.indexOf(opt.id) !== -1;
              return (
                <label key={opt.id} className="flex cursor-pointer items-center justify-between rounded-lg border border-sand px-3 py-2.5 hover:bg-warm">
                  <span className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={function () { toggleExtra(opt.id); }}
                      className="h-4 w-4 rounded border-sand text-amber"
                    />
                    {opt.label}
                  </span>
                  <span className="text-sm font-medium text-amber">+${opt.extra.toFixed(2)}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-cream px-4 py-3 text-sm">
          <p className="font-medium text-ink">{getDisplayName(drink.name, custom)}</p>
          <p className="mt-1 text-lg font-bold text-amber">Total: ${price.toFixed(2)}</p>
        </div>
      </div>
    </Modal>
  );
}
