// English comments by request

import { ofetch } from 'ofetch'

export default defineEventHandler(async () => {
  // If Tor SOCKS is up, this should return something (or at least connect).
  // If Tor is missing, you'll get ECONNREFUSED / ETIMEDOUT.
  const res = await ofetch('http://127.0.0.1:9050', { timeout: 1500 }).catch(e => ({
    error: String(e?.message || e),
  }))

  return { ok: true, probe: res }
})
