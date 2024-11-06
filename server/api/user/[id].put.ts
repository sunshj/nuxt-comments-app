import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional()
})

export default defineEventHandler(async event => {
  await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const { error, data } = await readValidatedBody(event, updateUserSchema.safeParse)
  if (error) throw createBadRequestError(error)
  const prisma = usePrisma(event)

  const user = await prisma.user
    .update({
      where: {
        id: Number(id)
      },

      data
    })
    .catch(error => {
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 500,
          statusMessage: 'name/email already exists'
        })
      }

      throw error
    })

  await replaceUserSession(event, {
    user: {
      id: user.id,
      role: user.role
    },
    loggedInAt: new Date()
  })

  return user
})
