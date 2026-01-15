import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
    title?: string
    icon?: string
    hidden?: boolean
    alwaysShow?: boolean
    noCache?: boolean
    affix?: boolean
    breadcrumb?: boolean
    activeMenu?: string
  }
}
