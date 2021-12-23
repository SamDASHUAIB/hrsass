<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 三个页签 -->
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userFormRef"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <user-info /> -->
            <!-- <el-button type="primary" @click="userComponent = 'el-button'">
              切换组件
            </el-button> -->
            <!-- 动态组件, 可以实现切换组件 -->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  components: { UserInfo, JobInfo },
  props: {},
  data() {
    return {
      userInfo: {
        username: '',
        password2: '', // 后端读取出来的 password 是密文, 不能直接保存(否则报错), 所以需要一个临时变量 password2 保存用户的输入, 最后将其赋值给 password 最终发起请求
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' },
        ],
      },
      userId: this.$route.params.id, // 来自于跳转路由的路径传参(params 参数, /:id)
      userComponent: 'user-info',
      jobComponent: 'job-info',
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUserInfo() {
      // 校检通过, 发起请求
      try {
        await this.$refs.userFormRef.validate()
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        })
        this.$message.success('保存用户信息成功!')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
<style scoped></style>
