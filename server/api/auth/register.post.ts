import { z } from 'zod'

const schema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1),
  password: z.string({ required_error: 'Password is required' }).min(6),
  email: z.string({ required_error: 'Email is required' }).email()
})

export default defineEventHandler(async event => {
  const { error, data } = await readValidatedBody(event, schema.safeParse)
  if (error) throw createBadRequestError(error)

  const { name, email, password } = data
  const hashedPassword = await hashPassword(password)
  const avatarUrl = getGravatarUrl(email)

  const user = await prisma.user
    .create({
      data: { name, email, password: hashedPassword, avatarUrl }
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

  return user
})
