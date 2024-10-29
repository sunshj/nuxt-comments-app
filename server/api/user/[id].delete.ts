export default defineEventHandler(async event => {
  const { user } = await requireUserSession(event)
  if (user.role !== 'ADMIN') throw createForbiddenError('You are not authorized to delete user')

  const id = getRouterParam(event, 'id')
  return prisma.user.delete({
    where: {
      id: Number(id)
    }
  })
})
