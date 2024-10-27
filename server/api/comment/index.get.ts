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

  const commentsTree = buildTree(comments, {
    key: 'id',
    parentKey: 'parentId'
  }).sort((a, b) => {
    if (type === 'hot') return countTreeNodes(b.children) - countTreeNodes(a.children)
    if (type === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return {
    total: countTreeNodes(commentsTree),
    comments: commentsTree
  }
})
