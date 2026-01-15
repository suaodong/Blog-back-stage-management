import { request } from '../utils/request'
import { authCache, type CachedUserInfo } from '../utils/auth'

export type LoginParams = {
  username: string
  password: string
}

export type LoginResult = {
  token: string
}

export const login = (data: LoginParams) => {
  return request.post<LoginResult>('/login', data)
}

export const getUserInfo = () => {
  const token = authCache.getToken()
  return request.get<CachedUserInfo>('/user/info', { params: { token } })
}

export const logout = () => {
  return request.post<null>('/logout')
}
