import Vue from 'vue'
import Router from 'vue-router'

import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'
import userRouter from './modules/user'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 静态路由
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout, // 布局, 一级路由作为布局。
    redirect: '/dashboard',
    children: [
      // 真正的 内容区 作为二级路由
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 不显示在左侧菜单中
    children: [
      {
        path: '', // 二级路由path什么都不写 表示二级默认路由
        component: () => import('@/views/import'),
      },
    ],
  },
  userRouter,
  // 404 page must be placed at the end !!!
  // [...静态, ...动态] 之后, 404 不能再兜底啦(放在静态最后面, 只能兜底静态)
  // { path: '*', redirect: '/404', hidden: true },
]
/**
 * 动态路由
 */
export const asyncRoutes = [
  departmentsRouter,
  employeesRouter,
  settingRouter,
  permissionRouter,
  socialRouter,
  attendancesRouter,
  salarysRouter,
  approvalsRouter,
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    // 动态路由需要权限, 所以, 需要据权限动态添加
    routes: [...constantRoutes],
  })

const router = createRouter() // 实例化路由

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  // 干掉旧的(静态路由 + 动态路由) => 新(只有静态路由)
  router.matcher = newRouter.matcher // reset router
}

export default router
