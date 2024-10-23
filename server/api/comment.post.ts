import { literal, z } from 'zod'

const createCommentSchema = z.object({
  userId: z.number({ required_error: 'userId is required' }).int(),
  parentId: z.number().int().or(literal(null)),
  content: z.string({ required_error: 'content is required' }).min(1)
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, createCommentSchema.safeParse)
  if (error) throw createError(extractZodError(error))
  const { userId, parentId, content } = data

  return prisma.comment.create({
    data: {
      userId,
      parentId,
      content
    }
  })
})
