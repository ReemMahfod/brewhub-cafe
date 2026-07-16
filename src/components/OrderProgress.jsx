const steps = [
  { id: 'new', label: 'Received' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'completed', label: 'Ready' },
];

function stepIndex(status) {
  if (status === 'new') return 0;
  if (status === 'preparing') return 1;
  if (status === 'completed') return 2;
  return -1;
}

export default function OrderProgress({ status }) {
  if (status === 'cancelled') return null;

  const active = stepIndex(status);

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        {steps.map(function (s, i) {
          const done = active >= i;
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center text-center">
              <span
                className={
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ' +
                  (done ? 'bg-coffee text-cream' : 'bg-sand text-muted')
                }
              >
                {i + 1}
              </span>
              <span className={'mt-2 text-xs font-semibold ' + (done ? 'text-ink' : 'text-muted')}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mx-6 h-1 overflow-hidden rounded-full bg-sand">
        <div
          className="h-1 rounded-full bg-coffee transition-all"
          style={{ width: active <= 0 ? '8%' : active === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  );
}

export function statusMessage(status) {
  if (status === 'new') return 'The cafe received your order and will start soon.';
  if (status === 'preparing') return 'Your drink is being prepared right now.';
  if (status === 'completed') return 'Your order is ready — we are bringing it to your table.';
  if (status === 'cancelled') return 'This order was cancelled. Ask a barista if you need help.';
  return '';
}
