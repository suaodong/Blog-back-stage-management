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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '首页',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'Odometer', affix: true }
      }
    ]
  },
  {
    path: '/blogs_management',
    component: Layout,
    meta: { title: '博客管理', icon: 'Menu' },
    children: [
      {
        path: 'write_article',
        component: () => import('@/views/blogs_management/write_article/index.vue'),
        name: 'write_article',
        meta: { title: '写文章', icon: 'EditPen' }
      },
      // {
      //   path: 'write_dynamic_state',
      //   component: () => import('@/views/blogs_management/write_dynamic_state/index.vue'),
      //   name: 'write_dynamic_state',
      //   meta: { title: '写动态', icon: 'Edit' }
      // },
      {
        path: 'sort_management',
        component: () => import('@/views/blogs_management/sort_management/index.vue'),
        name: 'sort_management',
        meta: { title: '分类管理', icon: 'Operation' }
      },
      {
        path: 'label_management',
        component: () => import('@/views/blogs_management/label_management/index.vue'),
        name: 'label_management',
        meta: { title: '标签管理', icon: 'CollectionTag' }
      },
      // 文章管理-动态管理-分类管理-标签管理-评论管理
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
    path: '/401',
    name: 'NoPermission',
    component: () => import('../views/401/index.vue'),
    meta: { title: '401', hidden: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
