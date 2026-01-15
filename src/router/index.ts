import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 *    roles: ['admin','editor']    control the page roles (you can set multiple roles)
 *    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 *    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 *    noCache: true                if set true, the page will no be cached(default is false)
 *    affix: true                  if set true, the tag will affix in the tags-view
 *    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 *    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 * }
 */

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: 'Login', hidden: true }
  },
  {
    path: '/401',
    name: 'NoPermission',
    component: () => import('../views/401/index.vue'),
    meta: { title: '401', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'Odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'UserManagement',
    meta: { title: 'User Management', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('../views/dashboard/index.vue'), // Temporary using dashboard component
        meta: { title: 'User List', icon: 'List' }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('../views/dashboard/index.vue'), // Temporary using dashboard component
        meta: { title: 'Role Management', icon: 'UserFilled' }
      }
    ]
  },
  {
    path: '/sub-react',
    component: Layout,
    redirect: '/sub-react/setting',
    name: 'subReact',
    meta: { title: 'React Sub App', icon: 'Setting' },
    children: [
      {
        path: 'setting',
        name: 'ReactSetting',
        component: () => import('../views/empty/index.vue'),
        meta: { title: '微设置', icon: 'Tools' }
      }
    ]
  },
    {
    path: '/sub-vue3',
    component: Layout,
    redirect: '/sub-vue3/project',
    name: 'subVue3',
    meta: { title: 'B端项目管理', icon: 'List' },
    children: [
      {
        path: 'project',
        name: 'Vue3Project',
        component: () => import('../views/empty/index.vue'),
        meta: { title: '项目列表', icon: 'List' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
