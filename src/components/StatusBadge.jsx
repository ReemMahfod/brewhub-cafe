import { statusStyles } from '../data/mock.js';

export default function StatusBadge({ status }) {
  const cls = statusStyles[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {status}
    </span>
  );
}
