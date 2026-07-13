import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirm delete',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Delete',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">{message}</p>
    </Modal>
  );
}
