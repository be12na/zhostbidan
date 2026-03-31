/**
 * Entry points for Google Apps Script Web App.
 */
function doGet(e) {
  return handleRequest('GET', e)
}

function doPost(e) {
  return handleRequest('POST', e)
}

function doOptions() {
  return Response.toTextOutput({ success: true, message: 'ok', data: null })
}

function handleRequest(method, e) {
  try {
    const request = parseRequest(method, e)
    if (!request.resource) {
      return Response.failure('Parameter resource wajib diisi')
    }

    const routeResult = Router.dispatch(request)
    return Response.wrapResult(routeResult)
  } catch (error) {
    return Response.failure(error && error.message ? error.message : 'Terjadi kesalahan server')
  }
}

function parseRequest(method, e) {
  const params = (e && e.parameter) || {}
  const body = parseRequestBody(e)

  const resource = String(body.resource || params.resource || '').toLowerCase()
  const action = String(body.action || params.action || (method === 'GET' ? 'list' : 'create')).toLowerCase()
  const payload = body.payload || {}

  return {
    method: method,
    resource: resource,
    action: action,
    params: params,
    payload: payload,
  }
}

function parseRequestBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {}
  }

  try {
    return JSON.parse(e.postData.contents)
  } catch (error) {
    return {}
  }
}
