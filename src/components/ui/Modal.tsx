import type { ReactNode } from 'react'

export function Modal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation">
      <button aria-label="Tutup modal" className="modal-backdrop" onClick={onClose} type="button" />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            Tutup
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
