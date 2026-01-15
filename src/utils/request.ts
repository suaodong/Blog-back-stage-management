import axios, { type AxiosRequestConfig } from 'axios'
import { authCache } from './auth'

export type ApiResponse<T> = {
  code: number
  data: T
  message?: string
}

const http = axios.create({
  baseURL: 'http://127.0.0.1:7001/', //mock：'/api'
  timeout: 15000
})

http.interceptors.request.use(config => {
  const token = authCache.getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  response => {
    const payload = response.data as ApiResponse<unknown>
    if (payload && typeof payload.code === 'number') {
      if (payload.code === 200 || payload.code === 0) return payload
      return Promise.reject(new Error(payload.message || 'Request Error'))
    }
    return response.data
  },
  error => Promise.reject(error)
)

export const request = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return http.get<ApiResponse<T>>(url, config) as unknown as Promise<ApiResponse<T>>
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return http.post<ApiResponse<T>>(url, data, config) as unknown as Promise<ApiResponse<T>>
  }
}
