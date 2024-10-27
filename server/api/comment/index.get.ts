import { z } from 'zod'

const schema = z.object({
  type: z.enum(['hot', 'recent', 'oldest']).optional().default('recent')
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { type } = await getValidatedQuery(event, schema.parse)

  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true
        }
      },
      reply: {
        select: {
          name: true
        }
      }
    }
  })

  const total = comments.length
  const commentsTree = buildTree(comments, {
    key: 'id',
    parentKey: 'parentId'
  }).sort((a, b) => {
    return type === 'hot'
      ? countTreeItems(b.children, 'children') - countTreeItems(a.children, 'children')
      : type === 'oldest'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
  })

  return {
    total,
    comments: commentsTree
  }
})
