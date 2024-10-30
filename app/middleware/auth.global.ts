export default defineNuxtRouteMiddleware(to => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (loggedIn.value) {
    if (to.path === '/login') return navigateTo('/')

    if (to.meta.roles && !to.meta.roles.includes(user.value!.role!)) {
      return abortNavigation({
        statusCode: 403,
        message: 'Forbidden',
        fatal: true,
        statusMessage: 'You are not authorized to access this page'
      })
    }
  }
})
