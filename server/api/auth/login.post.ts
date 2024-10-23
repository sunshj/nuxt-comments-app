import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  email: z.string({ required_error: 'Email is required' }).email()
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, createUserSchema.safeParse)

  if (error) throw createError(extractZodError(error))
  const { name, email } = data

  const user = await prisma.user
    .upsert({
      where: { email },
      update: {},
      create: { name, email }
    })
    .catch(() => {
      throw createError({
        statusCode: 500,
        statusMessage: 'user is existed'
      })
    })

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    loggedInAt: new Date()
  })

  return user
})
