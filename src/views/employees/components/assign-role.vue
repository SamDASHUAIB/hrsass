<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- el-checkbox 的 label 属性值是 checkList 中对应的值(有选中, 没有就不选中)  -->
    <!-- el-checkbox 如果没有标签体, 那么 label 属性也充当 checkbox 按钮后的介绍(框框后面的文本) -->
    <!-- 我们的需要: 存的的 id(label 指定)显示的是 name(标签体 指定) -->
    <el-checkbox-group v-model="checkedList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRole } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的 id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      list: [], // 所有的角色 id
      checkedList: [], // 用户当前拥有的 id
    }
  },
  created() {
    this.getRoleList()
  },
  beforeDestroy() {
    console.log('hhhh') // 没有输出说明, showRoleDialog 切换显示与隐藏的时候, 将不会销毁本组件, 也就是, created 只会运行一次
  },
  methods: {
    // 获取所有角色信息
    async getRoleList() {
      // 角色不会太多, 给 20 个就差不多了
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    // 根据 id 获取当前用户拥有的角色
    // 父组件, 一定可以拿到 userId, 所以通知父组件去执行这个函数
    async getUserDetailById(userId) {
      const { roleIds } = await getUserDetailById(userId)
      this.checkedList = roleIds
    },
    // this.userId 是 props 传值, 异步, 不一定有值, 不能使用
    // async getUserDetailById() {
    //   const { roleIds } = await getUserDetailById(this.userId)
    //   this.checkedList = roleIds
    // },
    async btnOk() {
      // 点击确定分配权限
      await assignRole({ id: this.userId, roleIds: this.checkedList })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
      // this.$parent.showRoleDialog = false
    },
    btnCancel() {
      // 清空
      // this.list = [] // 不行!, 详情见 beforeDestroy
      this.checkedList = []
      this.$emit('update:showRoleDialog', false)
    },
  },
}
</script>
