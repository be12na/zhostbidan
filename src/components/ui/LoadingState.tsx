export function LoadingState({ message = 'Memuat data...' }: { message?: string }) {
  return <div className="card subtle">{message}</div>
}
