export default defineEventHandler(async event => {
  const { auth = false } = getRouteRules(event)

  if (auth) await requireUserSession(event)
})
