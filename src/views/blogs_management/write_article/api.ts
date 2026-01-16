import { request } from '@/utils/request'

export type ArticleCategory = {
  id: number
  name: string
}

export type ArticleTag = {
  id: number
  name: string
  color: string
}

export type ArticleCategoryAndTag = {
  categories: ArticleCategory[]
  tags: ArticleTag[]
}

export type Article = {
  id: number
  title: string
  description: string
  content: string
  cover: string
  categoryId: number
  categoryName?: string
  labelIds: number[] // Backend might return tags list, but for form we need IDs
  createTime: string
  updateTime: string
}

export type ArticleListResponse = {
  list: Article[]
  total: number
  page: number
  pageSize: number
}

export const getArticleCategoryAndTag = () => {
  return request.get<ArticleCategoryAndTag>('/article/categoryAndTag')
}

export const addArticle = (data: FormData) => {
  return request.post('/article/save', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateArticle = (data: FormData) => {
  return request.post('/article/update', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getArticleList = (params: any) => {
  return request.get<ArticleListResponse>('/article/list', { params })
}

export const deleteArticle = (id: number) => {
  return request.delete(`/article/delete/${id}`)
}
