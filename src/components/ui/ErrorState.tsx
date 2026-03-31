export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card danger">
      <p>{message}</p>
      {onRetry ? (
        <button className="btn btn-secondary" onClick={onRetry} type="button">
          Coba Lagi
        </button>
      ) : null}
    </div>
  )
}
