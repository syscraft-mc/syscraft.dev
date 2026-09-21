export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  if (path !== '/en' && path !== '/en/' && !path.startsWith('/en/')) {
    return
  }

  let target = '/'
  if (path.startsWith('/en/')) {
    const rest = path.slice('/en'.length)
    target = rest.endsWith('/') ? rest : `${rest}/`
  }

  return sendRedirect(event, `${target}${url.search}`, 301)
})
