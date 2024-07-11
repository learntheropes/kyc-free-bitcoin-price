import { sendRedirect, getRequestURL } from 'h3';

export default defineEventHandler( async event => {
  const protocol = getRequestURL(event).protocol;
  const host = getRequestURL(event).host;
  const path = getRequestURL(event).pathname;
  if (!host.startsWith('www.') && !path.startsWith('/api/')) {
    await sendRedirect(event, `${protocol}//www.${host}${path}`);
  }
})