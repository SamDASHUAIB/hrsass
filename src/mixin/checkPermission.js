import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      // userInfo.roles.points 存在且不为空
      if (userInfo.roles.points && userInfo.roles.points.length) {
        /*
          "points": [
            "point-user-delete",
            "POINT-USER-UPDATE",
            "POINT-USER-ADD"
          ]
          userInfo.roles.points 有类似的结构
        */
        //  key(用户的信息中的 key 是否匹配权限点) 就是要 check 的点, 是否有权限, 如果有 => 可以点击, 如果没有 => 不能点击
        return userInfo.roles.points.some((item) => key === item)
      }
      return false // false 表示没有权限
    },
  },
}
