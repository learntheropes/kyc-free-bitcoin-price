import { sendRedirect, getRequestURL } from 'h3';

export default defineEventHandler(async event => {
  const url = getRequestURL(event)

  // Never redirect API calls
  if (url.pathname.startsWith('/api/')) return

  // Only redirect if host starts with www.
  if (url.host.startsWith('www.')) {
    const targetHost = url.host.replace(/^www\./, '')
    return sendRedirect(event, `${url.protocol}//${targetHost}${url.pathname}${url.search}`, 301)
  }
})