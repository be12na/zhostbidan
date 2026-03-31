import type { ReactNode } from 'react'

export interface DataColumn<T> {
  header: string
  cell: (row: T) => ReactNode
}

export function DataTable<T>({ columns, rows }: { columns: DataColumn<T>[]; rows: T[] }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => (
                <td key={`${column.header}-${idx}`}>{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
