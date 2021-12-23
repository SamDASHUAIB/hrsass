<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构--头部 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形控件 -->
        <!-- data 属性 数据源 props 配置对象 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽, 可以自定义树节点的内容 slot-scope={data node} 接收传递给插槽的数据   data 每个节点的数据对象, node 每个节点对象 -->
          <!-- element ui 提供的 el-tree.vue 中定义了一个默认的作用域插槽(<slot :data="每个节点的数据对象" :node="每个节点对象"></slot>) -->
          <!-- 监听子组件发射的 delDepts 自定义事件, 重新拉取数据 -->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门的 dialog -->
    <!-- 将当前操作的节点 node 传给子组件 add-dept -->
    <!--  :show-dialog.sync 是 @update:show-dialog  -->
    <!-- .sync "双向 props" v-on + v-bind -->
    <!-- @closeDialog="closeDialog" -->
    <add-dept
      ref="addDeptRef"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      company: {},
      defaultProps: {
        label: 'name', // 树形控件显示的文本要去找哪一个属性
        children: 'children', // 树形控件, 要去哪一个属性找子节点
      },
      departs: [],
      showDialog: false, // 显示 dialog
      node: null, // 当前点击的 node 节点
      loading: false,
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      // 这里可以 try catch 处理 Promise.reject(error)。
      const res = await getDepartments()
      // id 设为 "" 而不是 undefined, 否则后续校检出错。
      // 在最外层(根级)添加子部门，需要手动将 id 设为 '' 否则 id 值为 undefined。
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // depts 需要转化为树形结构, array => tree(带 children)
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 监听 tree-tools 组件触发的点击添加子部门的事件
    async addDepts(department) {
      // 显示 dialog, 添加了 .sync 事件修饰符
      this.showDialog = true
      this.node = department
    },
    // 监听 tree-tools 组件触发的点击编辑部门的事件
    async editDepts(department) {
      // 显示 dialog
      this.showDialog = true
      this.node = department // props 传值是异步的,
      // 调用 add-dept 子组件中的 getDepartmentDetail 方法, 获取部门详情数据
      this.$refs.addDeptRef.getDepartmentDetail(this.node.id)
    },
    // closeDialog(flag) {
    //   this.showDialog = flag
    // },
  },
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
