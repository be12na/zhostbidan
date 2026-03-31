import type { ReactNode } from 'react'

export function PageHeader({ title, description, rightContent }: { title: string; description?: string; rightContent?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      <div>{rightContent}</div>
    </div>
  )
}
