import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  email: z.string({ required_error: 'Email is required' }).email()
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, createUserSchema.safeParse)

  if (error) throw createBadRequestError(error)
  const { name, email } = data
  const avatarUrl = getGravatarUrl(email)

  const user = await prisma.user
    .upsert({
      where: { email },
      update: {},
      create: { name, email, avatarUrl }
    })
    .catch(error => {
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 500,
          statusMessage: 'user/email already exists'
        })
      }

      throw error
    })

  await setUserSession(event, {
    user: {
      id: user.id,
      role: user.role
    },
    loggedInAt: new Date()
  })

  return user
})
