import {
  defineEventHandler,
  getQuery,
  getRequestHeaders,
  getMethod,
  readBody,
  setResponseStatus,
  setResponseHeaders
} from 'h3'

import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
])

// Response headers we should never forward back to the client.
const STRIP_RESPONSE_HEADERS = new Set([
  ...HOP_BY_HOP,
  'set-cookie',
  'content-encoding',
  'content-length'
])

function joinUrl(base, path) {
  const b = base.replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : '/' + path
  return b + p
}

function sanitizeOutgoingHeaders(incoming) {
  const headers = { ...incoming }

  for (const k of Object.keys(headers)) {
    const key = k.toLowerCase()
    if (HOP_BY_HOP.has(key)) delete headers[k]
  }

  delete headers.host
  delete headers['content-length']
  delete headers['accept-encoding']
  delete headers.origin
  delete headers.referer
  delete headers['x-tor-proxy-secret']

  return headers
}

function sanitizeIncomingResponseHeaders(inHeaders) {
  // got returns a plain object; normalize and strip risky ones
  const headers = {}

  for (const [k, v] of Object.entries(inHeaders || {})) {
    const key = String(k).toLowerCase()
    if (STRIP_RESPONSE_HEADERS.has(key)) continue

    // Do not forward "www-authenticate" from upstream unless you explicitly want it.
    // (Optional) If you want to keep it, remove this line.
    // if (key === 'www-authenticate') continue

    headers[key] = v
  }

  return headers
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const secret = config.torProxySecret
  const onionBase = config.robosatsCoordinatorOnionUrl
  const socksUrl = config.torSocksUrl || 'socks5h://127.0.0.1:9050'

  if (!secret || !onionBase) {
    setResponseStatus(event, 500)
    return { error: 'Proxy misconfigured' }
  }

  const method = getMethod(event)
  const params = event.context.params._ || ''
  const query = getQuery(event)
  const incomingHeaders = getRequestHeaders(event)

  if (incomingHeaders['x-tor-proxy-secret'] !== secret) {
    setResponseStatus(event, 403)
    return { error: 'Forbidden' }
  }

  const targetUrl = joinUrl(onionBase, `/${params}`)

  let body
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readBody(event)
  }

  const agent = new SocksProxyAgent(socksUrl)

  const resp = await got(targetUrl, {
    method,
    headers: sanitizeOutgoingHeaders(incomingHeaders),
    searchParams: query,
    json: body,
    responseType: 'buffer',
    timeout: { request: 30000 },
    retry: { limit: 0 },
    throwHttpErrors: false,
    agent: { http: agent, https: agent }
  })

  setResponseStatus(event, resp.statusCode)
  setResponseHeaders(event, sanitizeIncomingResponseHeaders(resp.headers))

  return resp.body
})
