<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <!-- 表单验证: (el-form) model + rules + prop(el-form-item) -->
    <el-form
      ref="addEmployeeFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <!-- 存进数据库的是 1 OR 2 也就是 item.id -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- @focus input 获得焦点时, 拉取最新数据(树形) -->
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          default-expand-all
          :data="treeList"
          :props="treeProps"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单数据对象
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
      },
      // 表单验证对象
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位',
          },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur',
          },
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' },
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' },
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }, // 这里必须使用 change 而不是 blur, 否则校验永远无法通过, 使用 blur 时, 我们离开 input 框去选数据时, 此时 input 框输入为空, 由于失去了焦点, 所以触发验证 => 部门不能为空
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
      },
      treeList: [], // 树形结构
      treeProps: {
        children: 'children', // 子节点找哪一个属性
        label: 'name', // 文本显示找哪一个属性
      },
      showTree: false, // 控制 el-tree 的显示与隐藏
      loading: false,
      EmployeeEnum, // 将 "引用的数据" 存一份在 data 中, 这样 template 中就可以绑定了
    }
  },
  methods: {
    async getDepartments() {
      this.loading = true
      this.showTree = !this.showTree
      const { depts } = await getDepartments()
      // Array => tree 树形结构, 递归
      this.treeList = tranListToTreeData(depts, '')
      this.loading = false
    },
    handleNodeClick(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      // 校验表单
      try {
        /*
          validate() 不传入回调, 将返回一个 Promise
        */
        await this.$refs.addEmployeeFormRef.validate()
        // 通过校验, 调用接口
        await addEmployee(this.formData)
        // 通知父组件更新数据, $parent
        // 好的编码习惯, 直接拿 DOM 或组件, 可能拿不到的, 所以必须先判断是否为空
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        // 关闭 dialog 父组件用了 sync 修饰符
        // this.$parent.showDialog = false
        this.$emit('update:showDialog', false)
        this.$message.success('添加员工成功!')
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
      }
      // this.showDialog = false
      this.$refs.addEmployeeFormRef.resetFields()
      this.$emit('update:showDialog', false)
    },
  },
}
</script>

<style></style>
