import { literal, z } from 'zod'

const schema = z.object({
  url: z.string({ required_error: 'url is required' }).min(1),
  userId: z.number({ required_error: 'userId is required' }).int(),
  parentId: z.number().int().or(literal(null)).default(null),
  content: z.string({ required_error: 'content is required' }).min(1).max(512)
})

export default defineEventHandler(async event => {
  await requireUserSession(event)

  const { error, data } = await readValidatedBody(event, schema.safeParse)
  if (error) throw createBadRequestError(error)
  const prisma = usePrisma(event)

  return prisma.comment.create({ data })
})
