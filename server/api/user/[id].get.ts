export default defineEventHandler(async event => {
  await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const prisma = usePrisma(event)

  return await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  })
})
