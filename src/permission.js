// 权限拦截 => 跳转路由前查验 token => 前置导航守卫
/*
  登录权限 token 控制
    登录(有 token)才能可访问页面
    无需登录即可访问的页面 白名单中的页面无需 token 即可访问
*/
import router from '@/router'
import store from '@/store' // 此处的 store 和 组件中的 this.$store 一样
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单, 无需 token 即可访问的页面列表
const whiteList = ['/login', '/404']
// #region
// 前置守卫
// router.beforeEach(async (to, from, next) => {
//   /*
//     to 目的地
//     from 当前路由
//     next 必须执行
//       next() 放行
//       next(false) 终止跳转
//       next('/xxx') 跳转特定路由
//   */
//   //  开启进度条
//   NProgress.start()
//   //  是否有 token
//   if (store.getters.token) {
//     // 只有在有 token 的情况下, 才能获取用户基本资料
//     // 是否登录页
//     if (to.path === '/login') {
//       // 跳转到 主页
//       next('/')
//       // 跳转到 /login 失败, 需要关闭进度条
//     } else {
//       // 放行
//       // 获取资料, 一次就行, 无需重复执行, 因此需要判断, 是否已经获取过了用户资料
//       if (!store.getters.userId) {
//         // 没有用户 id, 那就表示还没有获取过用户资料
//         // dispatch Action
//         await store.dispatch('user/getUserInfo')
//       }
//       next()
//     }
//   } else {
//     // 是否在白名单
//     if (whiteList.includes(to.path)) {
//       next()
//     } else {
//       // 没有token, 且不在 白名单里, 跳转至登录页
//       next('/login')
//     }
//   }
//   // 无论如何, 判断完, 关闭进度条
//   NProgress.done()
// })
// #endregion
router.beforeEach(async (to, from, next) => {
  // to and from are both route objects. must call `next`.
  // 开启进度条
  NProgress.start()
  // 是否有 token
  if (store.getters.token) {
    // 是否跳转登录页
    if (to.path === '/login') {
      // 已经有 token 了, 无需去 login 页, 直接导航至 主页
      next('/')
      return NProgress.done()
      // return NProgress.done()
    }
    // 有 token 那么还需要 userInfo 获取用户资料, 渲染页面使用
    // 获取用户资料, 只需要一次, 重复获取, 浪费带宽
    if (!store.getters.userId) {
      try {
        const {
          roles: { menus },
        } = await store.dispatch('user/getUserInfo')
        // 筛选用户有权限的路由, 进行显示
        const routes = await store.dispatch('permission/filterRoutes', menus)
        // (有访问权)动态路由添加到路由表中
        // 404 页, 放最后, 兜底，解决动态路由重复刷新 跳转 404页的问题。
        router.addRoutes([
          ...routes,
          { path: '*', redirect: '/404', hidden: true },
        ]) // 添加到动态路由。
        next(to.path) // 必须!!!
      } catch (error) {
        console.log(error)
      }
    } else {
      // 有 token 放行
      next()
    }
  } else {
    // 是否在白名单
    if (whiteList.includes(to.path)) {
      return next()
    }
    // 没有 token 且不在白名单, 跳转至登录页
    next('/login')
  }
})

router.afterEach((to, from) => {
  // 跳转结束后, 关闭进度条
  NProgress.done()
})
/*
  没有跳转成功, 不会触发 afterEach
  dashboard => login => dashboard
*/
