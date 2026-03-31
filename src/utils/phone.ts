export function normalizeIndonesianPhone(input: string) {
  const raw = input.replace(/\D/g, '')
  if (!raw) return ''
  if (raw.startsWith('62')) return raw
  if (raw.startsWith('0')) return `62${raw.slice(1)}`
  return `62${raw}`
}
