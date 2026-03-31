function escapeCSV(value: string | number | undefined | null) {
  const text = `${value ?? ''}`
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function exportToCSV<T>(filename: string, rows: T[]) {
  if (!rows.length) return

  const keys = Object.keys(rows[0] as Record<string, unknown>)
  const header = keys.map(escapeCSV).join(',')
  const body = rows
    .map((row) => keys.map((key) => escapeCSV((row as Record<string, unknown>)[key] as string | number)).join(','))
    .join('\n')

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
