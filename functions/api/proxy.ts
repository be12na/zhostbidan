interface Env {
  GAS_BASE_URL: string
  GAS_API_KEY?: string
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json',
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const target = new URL(context.env.GAS_BASE_URL)
  target.search = url.search

  const upstream = await fetch(target.toString(), {
    method: 'GET',
    headers: buildHeaders(context.env),
  })

  return withCors(upstream)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.text()
  const upstream = await fetch(context.env.GAS_BASE_URL, {
    method: 'POST',
    headers: buildHeaders(context.env),
    body,
  })

  return withCors(upstream)
}

function buildHeaders(env: Env): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (env.GAS_API_KEY) {
    headers.Authorization = `Bearer ${env.GAS_API_KEY}`
  }

  return headers
}

async function withCors(response: Response) {
  const body = await response.text()
  return new Response(body, {
    status: response.status,
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': 'no-store',
    },
  })
}
