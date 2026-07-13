const iconClass = 'h-4 w-4';

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClass} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397 12.134 12.134 0 0 0-2.19 0 12.134 12.134 0 0 0-3.478.397m0 0V4.284A2.25 2.25 0 0 0 15.75 2h-2.5a2.25 2.25 0 0 0-2.25 2.25V5.9" />
    </svg>
  );
}

const btnBase =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-amber/40';

export default function RowActions({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete', className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
          className={`${btnBase} text-coffee hover:bg-coffee/10`}
        >
          <EditIcon />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={deleteLabel}
          title={deleteLabel}
          className={`${btnBase} text-rose-600 hover:bg-rose-50`}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}
