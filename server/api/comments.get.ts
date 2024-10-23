export default defineEventHandler(async () => {
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  const result = toTree(comments, 'id', 'parentId')
  return result
})
