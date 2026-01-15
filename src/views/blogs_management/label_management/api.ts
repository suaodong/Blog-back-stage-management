import { request } from '@/utils/request'

export type labelItem = {
  id: number
  label_name: string
  color: string
}

export const addlabel = (label_name: string, color: string) => {
  return request.post<labelItem>('/label/add', { label_name, color })
}

export const listlabel = () => {
  return request.get<labelItem[]>('/label/list')
}

export const updatelabel = (id: number, label_name: string, color: string) => {
  return request.post<labelItem | null>('/label/update', { id, label_name, color })
}

export const deletelabel = (id: number) => {
  return request.post<null>('/label/delete', { id })
}
