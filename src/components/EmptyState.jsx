import { Link } from 'react-router-dom';

export default function EmptyState({ text, links }) {
  return (
    <div className="rounded-xl border border-dashed border-sand bg-white p-10 text-center">
      <p className="text-muted">{text}</p>
      {links && links.map(function (l) {
        return (
          <Link key={l.to} to={l.to} className={'mt-3 block text-sm font-semibold ' + (l.className || 'text-amber')}>
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
