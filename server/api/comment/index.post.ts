import { literal, z } from 'zod'

const createCommentSchema = z.object({
  userId: z.number({ required_error: 'userId is required' }).int(),
  parentId: z.number().int().or(literal(null)).default(null),
  replyToId: z.number().int().or(literal(null)).default(null),
  content: z.string({ required_error: 'content is required' }).min(1).max(140)
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { error, data } = await readValidatedBody(event, createCommentSchema.safeParse)
  if (error) throw createBadRequestError(error)

  return prisma.comment.create({ data })
})
