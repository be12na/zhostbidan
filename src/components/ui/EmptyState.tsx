export function EmptyState({ message = 'Belum ada data' }: { message?: string }) {
  return <div className="card subtle">{message}</div>
}
