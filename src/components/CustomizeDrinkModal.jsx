import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import OptionPills from './OptionPills.jsx';
import {
  sizes,
  milkTypes,
  sweetnessLevels,
  extraAddons,
  defaultCustom,
  getCustomPrice,
  getDisplayName,
  getPriceBreakdown,
} from '../utils/drinkCustom.js';

export default function CustomizeDrinkModal({ drink, open, onClose, onAdd }) {
  const [custom, setCustom] = useState(defaultCustom());

  if (!drink) return null;

  const price = getCustomPrice(drink.price, custom);
  const breakdown = getPriceBreakdown(drink.price, custom);

  function setField(key, val) {
    setCustom({ ...custom, [key]: val });
  }

  function toggleExtra(id) {
    const has = custom.extras.indexOf(id) !== -1;
    const extras = has
      ? custom.extras.filter(function (x) { return x !== id; })
      : custom.extras.concat([id]);
    setCustom({ ...custom, extras: extras });
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

        <OptionPills label="Size" options={sizes} value={custom.size} onChange={function (v) { setField('size', v); }} />
        <OptionPills label="Milk" options={milkTypes} value={custom.milk} onChange={function (v) { setField('milk', v); }} />
        <OptionPills label="Sweetness" options={sweetnessLevels} value={custom.sweetness} onChange={function (v) { setField('sweetness', v); }} />

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
          <ul className="mt-3 space-y-1.5 border-t border-sand/80 pt-3">
            {breakdown.map(function (line, i) {
              return (
                <li key={i} className="flex justify-between text-muted">
                  <span>{line.label}</span>
                  <span>${line.amount.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-between border-t border-sand/80 pt-3 text-base font-bold text-ink">
            <span>Total</span>
            <span className="text-amber">${price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
