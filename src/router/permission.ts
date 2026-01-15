import router from './index'
import { pinia } from '../stores'
import { useUserStore } from '../stores/user'
import { hasAnyRole } from '../utils/permission'

const whiteList = ['/login']

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore(pinia)

  if (userStore.hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      return
    }

    if (!userStore.loaded) {
      try {
        await userStore.fetchUserInfo()
      } catch {
        userStore.reset()
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
    }

    const roles = (to.meta?.roles || []) as string[]
    if (roles.length > 0) {
      if (!hasAnyRole(userStore.roles, roles)) {
        next({ path: '/401' })
        return
      }
    }

    next()
    return
  }

  if (whiteList.includes(to.path)) {
    next()
    return
  }

  next({ path: '/login', query: { redirect: to.fullPath } })
})
