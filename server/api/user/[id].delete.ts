export default defineEventHandler(async event => {
  const user = await requireRoles(event, ['ADMIN'])

  const id = getRouterParam(event, 'id')
  if (user.id === Number(id)) throw createForbiddenError('You cannot delete yourself')
  const prisma = usePrisma(event)

  return prisma.user.delete({
    where: {
      id: Number(id)
    }
  })
})
