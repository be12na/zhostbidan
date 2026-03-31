import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onCancel,
  onConfirm,
  busy = false,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onCancel: () => void
  onConfirm: () => void
  busy?: boolean
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="form-stack">
        <p>{message}</p>
        <div className="row">
          <button className="btn btn-secondary" onClick={onCancel} type="button" disabled={busy}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} type="button" disabled={busy}>
            {busy ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
