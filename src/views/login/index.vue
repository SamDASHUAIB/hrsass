<template>
  <div class="login-container">
    <!--
      model
      rules
     -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 放置标题图片 @ 是设置的别名-->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="" />
        </h3>
      </div>
      <!-- prop 属性, 指定要校验的字段名称 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- v-model 收集数据 -->
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 事件修饰符: enter 点击回车才触发, native 监听组件的DOM原生事件, 例如此处的 keyup -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        class="loginBtn"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
      <!-- 下方的提示文本 -->
      <div class="tips">
        <span style="margin-right: 20px">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    // 自定义校验规则函数
    /*
      成功
        callback()
      失败
        callback(new Error('...'))
      参数
        rule
        value 当前需要校验的值, 往往是用户的输入
        callback
    */
    const validateMobile = (rule, value, callback) => {
      validMobile(value)
        ? callback()
        : callback(new Error('手机号码格式不正确'))
    }

    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456',
      },
      loginRules: {
        // 校验的字段
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { trigger: 'blur', validator: validateMobile },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          {
            message: '密码的长度在6-16位之间',
            min: 6,
            max: 16,
            trigger: 'blur',
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    // 第一个参数: 模块名
    ...mapActions('user', ['login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // validate 表单的手动整体校验
      /*
        ref
          一个元素的 dom 对象
          一个组件的实例, 也就是 this
      */
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          // this.$store
          //   .dispatch('user/login', this.loginForm)
          //   .then(() => {
          //     this.$router.push({ path: this.redirect || '/' })
          //     this.loading = false
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
          // 校验通过, dispatch, 同时将 表单数据,传出
          // async 包裹的函数, 其实一个 Promise 对象, 因此可以使用 async/await 等待其执行成功
          try {
            this.loading = true
            /* 'user/login' 子模块下的名为 login 的 Action */
            await this.$store.dispatch('user/login', this.loginForm)
            // await 后面都是执行成功后的代码相当于是在 then 方法中执行
            // 跳转主页前, 已经设置好了 token
            this.$router.push('/')
          } catch (error) {
            // 打印 axios 响应拦截器中 Promise.reject(error)
            console.log(error)
          } finally {
            this.loading = false
          }
          // this.$store
          //   .dispatch('user/login', this.loginForm)
          //   .then(() => {
          //     this.$router.push('/')
          //   })
          //   .catch((error) => console.log(error))
          //   .finally(() => {
          //     this.loading = false
          //   })
        }
      })
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe; // 将输入框颜色改成蓝色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片 注意, 在 样式中使用 别名 @ 需要添加上 ~
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff;
  }
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
