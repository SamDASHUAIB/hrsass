// #region
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
// #endregion

// 权限拦截 => 跳转路由前 => 导航守卫
import router from '@/router'
import store from '@/store' // 此处的 store 和 组件中的 this.$store 一样
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单, 无需 token 即可访问的页面列表
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach(async (to, from, next) => {
  // to and from are both route objects. must call `next`.
  /*
    to 目的地
    from 当前路由
    next 必须执行
      next() 放行
      next(false) 终止跳转
      next('/xxx') 跳转特定路由
  */
  //  开启进度条
  NProgress.start()
  //  是否有 token
  if (store.getters.token) {
    // 只有在有 token 的情况下, 才能获取用户基本资料
    // 是否登录页
    if (to.path === '/login') {
      // 跳转到 主页
      next('/')
      // 跳转到 /login 失败, 需要关闭进度条
      // NProgress.done()
    } else {
      // 放行
      // 获取资料, 一次就行, 无需重复执行, 因此需要判断, 是否已经获取过了用户资料
      if (!store.getters.userId) {
        // 没有用户 id, 那就表示还没有获取过用户资料
        // dispatch Action
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 是否在白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 没有token, 且不在 白名单里, 跳转至登录页
      next('/login')
      // 跳转失败, 也需要关闭进度条
      // NProgress.done()
    }
  }
  // 无论如何, 判断完, 关闭进度条
  NProgress.done()
})

router.afterEach((to, from) => {
  // 跳转结束后, 关闭进度条
  NProgress.done()
})
