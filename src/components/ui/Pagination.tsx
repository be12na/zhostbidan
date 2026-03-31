export function Pagination({
  totalItems,
  page,
  pageSize,
  onPageChange,
}: {
  totalItems: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (totalItems <= pageSize) return null

  return (
    <div className="pagination">
      <button className="btn btn-secondary" type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
        Sebelumnya
      </button>
      <span>
        Halaman {page} / {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Berikutnya
      </button>
    </div>
  )
}
