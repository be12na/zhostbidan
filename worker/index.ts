interface AssetsBinding {
  fetch: (request: Request) => Promise<Response>
}

interface Env {
  ASSETS: AssetsBinding
  APP_ENV: string
  GAS_BASE_URL: string
  GAS_API_KEY?: string
  ALLOWED_ORIGIN?: string
  API_TIMEOUT_MS?: string
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/proxy')) {
      return handleApiProxy(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}

async function handleApiProxy(request: Request, env: Env) {
  if (!isAllowedOrigin(request, env)) {
    return withCors(
      new Response(JSON.stringify({ success: false, message: 'Origin tidak diizinkan', data: null }), {
        status: 403,
        headers: JSON_HEADERS,
      }),
      request,
      env,
    )
  }

  if (request.method === 'OPTIONS') {
    return withCors(new Response(null, { status: 204 }), request, env)
  }

  if (request.method !== 'GET' && request.method !== 'POST') {
    return withCors(
      new Response(JSON.stringify({ success: false, message: 'Method not allowed', data: null }), {
        status: 405,
        headers: JSON_HEADERS,
      }),
      request,
      env,
    )
  }

  if (!env.GAS_BASE_URL || env.GAS_BASE_URL.includes('REPLACE_WITH')) {
    return withCors(
      new Response(JSON.stringify({ success: false, message: 'GAS_BASE_URL belum dikonfigurasi', data: null }), {
        status: 500,
        headers: JSON_HEADERS,
      }),
      request,
      env,
    )
  }

  const upstreamURL = buildUpstreamURL(request, env)
  const timeoutMs = Number(env.API_TIMEOUT_MS || '30000')
  const abortController = new AbortController()
  const timer = setTimeout(() => abortController.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 30000)

  try {
    const forwardedHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (env.GAS_API_KEY) {
      forwardedHeaders.Authorization = `Bearer ${env.GAS_API_KEY}`
    }

    const init: RequestInit = {
      method: request.method,
      headers: forwardedHeaders,
      signal: abortController.signal,
    }

    if (request.method === 'POST') {
      init.body = await request.text()
    }

    const upstream = await fetch(upstreamURL, init)
    const responseBody = await upstream.text()

    return withCors(
      new Response(responseBody, {
        status: upstream.status,
        headers: {
          ...JSON_HEADERS,
          'Cache-Control': 'no-store',
        },
      }),
      request,
      env,
    )
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Upstream timeout saat mengakses Google Apps Script'
        : 'Gagal mengakses upstream API'

    return withCors(
      new Response(JSON.stringify({ success: false, message, data: null }), {
        status: 504,
        headers: JSON_HEADERS,
      }),
      request,
      env,
    )
  } finally {
    clearTimeout(timer)
  }
}

function buildUpstreamURL(request: Request, env: Env) {
  const incoming = new URL(request.url)
  const upstream = new URL(env.GAS_BASE_URL)

  if (request.method === 'GET') {
    upstream.search = incoming.search
  }

  return upstream.toString()
}

function withCors(response: Response, request: Request, env: Env) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', resolveAllowedOrigin(request, env))
  headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  headers.set('Vary', 'Origin')
  return new Response(response.body, { status: response.status, headers })
}

function isAllowedOrigin(request: Request, env: Env) {
  const configured = (env.ALLOWED_ORIGIN || '*').trim()
  if (configured === '*') return true

  const origin = request.headers.get('Origin')
  if (!origin) return true

  try {
    const incomingOrigin = new URL(origin)
    const requestOrigin = new URL(request.url)
    if (incomingOrigin.origin === requestOrigin.origin) {
      return true
    }
  } catch {
    return false
  }

  const allowedList = configured
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return allowedList.some((entry) => {
    if (entry.startsWith('http://') || entry.startsWith('https://')) {
      return origin === entry
    }

    try {
      const parsed = new URL(origin)
      return parsed.hostname === entry
    } catch {
      return false
    }
  })
}

function resolveAllowedOrigin(request: Request, env: Env) {
  const configured = (env.ALLOWED_ORIGIN || '*').trim()
  if (configured === '*') return '*'

  const origin = request.headers.get('Origin')
  if (origin && isAllowedOrigin(request, env)) {
    return origin
  }

  const first = configured.split(',').map((item) => item.trim()).find(Boolean)
  if (!first) return '*'
  if (first.startsWith('http://') || first.startsWith('https://')) {
    return first
  }
  return `https://${first}`
}
