export default defineEventHandler(async event => {
  await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  return prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  })
})
