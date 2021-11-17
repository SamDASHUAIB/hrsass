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
          <el-dropdown @command="operateDepts">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
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
    //   定义一个props属性
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
    // type: 新增 删除 编辑
    async operateDepts(type) {
      if (type === 'add') {
        // 添加子部门
        // 告诉父组件 显示 dialog
        // 在当前点击的部门下, 添加子部门
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        // 编辑部门, 点击谁编辑谁
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        const confirmRes = await this.$confirm('确定删除此部门?').catch(
          (err) => {
            console.log(err)
          }
        )
        if (confirmRes === 'confirm') {
          // treeNode 中有部门的 id
          // 后端数据已经修改了, 但是前端展示还没变, 需要通知父组件重新拉取数据。
          await delDepartments(this.treeNode.id)
          this.$emit('delDepts')
          this.$message.success('删除部门成功!')
        }
      }
    },
  },
}
</script>
