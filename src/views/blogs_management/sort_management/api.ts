import { request } from '@/utils/request'

export type SortItem = {
  id: number
  sort_name: string
  create_time?: string
}

export const addSort = (sort_name: string) => {
  return request.post<SortItem>('/sort/add', { sort_name })
}

export const listSort = () => {
  return request.get<SortItem[]>('/sort/list')
}

export const updateSort = (id: number, sort_name: string) => {
  return request.post<SortItem | null>('/sort/update', { id, sort_name })
}

export const deleteSort = (id: number) => {
  return request.post<null>('/sort/delete', { id })
}
