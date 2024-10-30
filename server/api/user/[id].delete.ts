export default defineEventHandler(async event => {
  await requireRoles(event, ['ADMIN'])

  const id = getRouterParam(event, 'id')
  return prisma.user.delete({
    where: {
      id: Number(id)
    }
  })
})
