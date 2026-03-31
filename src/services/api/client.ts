import type { ApiEnvelope } from '../../types/domain'

const DEFAULT_TIMEOUT = 15000

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/proxy'

interface RequestOptions {
  method: 'GET' | 'POST'
  resource: string
  action: string
  filters?: Record<string, string | number | undefined>
  payload?: Record<string, string | number | boolean | undefined>
}

function toSearchParams(filters?: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()
  if (!filters) return params

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '') continue
    params.set(key, String(value))
  }

  return params
}

async function request<T>(options: RequestOptions): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    if (options.method === 'GET') {
      const query = toSearchParams({ resource: options.resource, action: options.action, ...options.filters })
      const res = await fetch(`${API_BASE_URL}?${query.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      })
      return await parseResponse<T>(res)
    }

    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        resource: options.resource,
        action: options.action,
        payload: options.payload ?? {},
      }),
    })

    return await parseResponse<T>(res)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Permintaan timeout. Coba ulangi lagi.')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Permintaan API gagal')
  }
  return json.data
}

export const apiClient = {
  get: <T>(resource: string, action = 'list', filters?: Record<string, string | number | undefined>) =>
    request<T>({ method: 'GET', resource, action, filters }),
  post: <T>(
    resource: string,
    action: string,
    payload?: Record<string, string | number | boolean | undefined>,
  ) => request<T>({ method: 'POST', resource, action, payload }),
}
