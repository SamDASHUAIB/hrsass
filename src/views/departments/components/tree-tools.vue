<template>
  <!-- 用了一个行列布局, 开启 type="flex" 布局 -->
  <!--  align 垂直方向上的布局 -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 名称应该变成 对应的节点中的name -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <!-- @command 将不同的 command="xxx" 作为参数, 传递给事件回调 operateDepts -->
          <el-dropdown @command="operateDepts">
            <!-- 没有下拉时候的 文本 -->
            <!-- 默认插槽, 指定 触发下拉列表显示的元素。 -->
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉列表 -->
            <!-- slot="dropdown" 具名插槽 element ui 中 el-dropdown.vue 中定义的一个具名插槽, 指定下拉列表具体内容 -->
            <!-- command 区分不同的 el-dropdown-item -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: {   props属性: {  配置选项 }  }

  props: {
    // 定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    // 如果是根节点, 不显示删除和编辑子节点, 只能显示增加子节点。
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // type: 新增 删除 编辑, command 传递的 key
    async operateDepts(type) {
      if (type === 'add') {
        // 添加子部门, 在当前点击的节点(部门)下, 添加子部门, 所以要传出, 当前节点 this.treeNode
        // 告诉父组件 显示 dialog 在当前点击的部门下, 添加子部门
        // 数据在哪里, 对数据操作的方法就在哪, departments 数据在 父组件, 所以, 必须通知父组件去对数据进行相关操作
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        // 编辑部门, 点击谁编辑谁，所以同样需要将 this.treeNode 传入到父组件
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        const confirmRes = await this.$confirm('确定删除此部门?').catch(() => {
          this.$message.info('已取消删除操作!')
        })
        if (confirmRes === 'confirm') {
          // treeNode 中有部门的 id
          // 后端数据已经修改了, 但是前端展示还没变, 需要通知父组件重新拉取数据。
          await delDepartments(this.treeNode.id)
          // 通知父组件, 更新数据
          this.$emit('delDepts')
          this.$message.success('删除部门成功!')
        }
      }
    },
  },
}
</script>
