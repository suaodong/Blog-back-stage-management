import { cache } from './cache'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user_info'

export type CachedUserInfo = {
  name: string
  roles: string[]
  avatar: string
}

export const authCache = {
  getToken() {
    return cache.get<string>(TOKEN_KEY) || ''
  },
  setToken(token: string) {
    cache.set(TOKEN_KEY, token)
  },
  removeToken() {
    cache.remove(TOKEN_KEY)
  },
  getUserInfo() {
    return cache.get<CachedUserInfo>(USER_INFO_KEY)
  },
  setUserInfo(info: CachedUserInfo) {
    cache.set(USER_INFO_KEY, info)
  },
  removeUserInfo() {
    cache.remove(USER_INFO_KEY)
  },
  clear() {
    authCache.removeToken()
    authCache.removeUserInfo()
  }
}

