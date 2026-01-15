import { defineStore } from 'pinia'
import { authCache, type CachedUserInfo } from '../utils/auth'
import * as authApi from '../api/auth'

type UserState = {
  token: string
  name: string
  roles: string[]
  avatar: string
  loaded: boolean
}

const createRandomAvatar = () => {
  return `https://q1.qlogo.cn/g?b=qq&s=100&nk=${10000 + Math.floor(Math.random() * 100)}`
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const cached = authCache.getUserInfo()
    const token = authCache.getToken()
    return {
      token,
      name: cached?.name || 'Admin',
      roles: cached?.roles || [],
      avatar: cached?.avatar || createRandomAvatar(),
      loaded: Boolean(cached)
    }
  },
  getters: {
    hasToken: state => Boolean(state.token),
    hasRoles: state => state.roles.length > 0
  },
  actions: {
    async login(username: string, password: string) {
      const res = await authApi.login({ username, password })
      const token = res.data.token
      this.token = token
      authCache.setToken(token)
      this.loaded = false
    },
    async fetchUserInfo() {
      const res = await authApi.getUserInfo()
      const info: CachedUserInfo = res.data
      this.name = info.name
      this.roles = info.roles
      this.avatar = info.avatar || this.avatar
      this.loaded = true
      authCache.setUserInfo({ name: this.name, roles: this.roles, avatar: this.avatar })
    },
    async logout() {
      try {
        await authApi.logout()
      } finally {
        this.reset()
      }
    },
    reset() {
      this.token = ''
      this.name = 'Admin'
      this.roles = []
      this.avatar = createRandomAvatar()
      this.loaded = false
      authCache.clear()
    }
  }
})

