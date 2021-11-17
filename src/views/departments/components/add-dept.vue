<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="formRef"
      label-width="120px"
      :model="formData"
      :rules="validateRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- el-select 中 v-model 的值为 el-option 中 value 绑定的属性值 -->
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK"> 确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import {
  getDepartments,
  addDepartments,
  getDepartmentDetail,
  updateDepartment,
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    // 控制 dialog 的显示与隐藏
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    /*
      同级部门名称不能重复
      value 就是部门名称
    */
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // depts是所有的部门数据
      if (this.formData.id) {
        // 有 id 编辑部门
        // 数据库中本来就有 "待编辑的数据", 同级部门下, "其他" 的部门名不能和 "待编辑的部门"部门名重复
        // 找 "其他同级部门" => 共同点 pid 相同, 之后将 "自己" 排除
        isRepeat = depts
          .filter(
            (item) =>
              this.formData.pid === item.pid && item.id !== this.formData.id
          )
          .some((item) => item.name === this.formData.name)
      } else {
        // 没有 id 新增子部门
        // 找出当前节点的所有子节点 pid(子) === id(父) filter
        // 在所有的子节点中, 查找同名 some
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有了名为${value}的部门了`))
        : callback()
    }
    /*
      部门编码不能重复, 唯一
    */
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑部门
        // 排除 "自己" 再看是否有重复的 code
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        )
      } else {
        isRepeat = depts.some((item) => item.code === value && value) // 我们的部门编码可能为空(还未填写)
      }

      isRepeat
        ? callback(new Error(`组织架构中已有部门使用了${value}`))
        : callback()
    }
    return {
      // 表单数据对象
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '', // 部门介绍
      },
      // 表单校验对象
      validateRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度在 1 到 50 个字符',
            trigger: 'blur',
          },
          {
            validator: checkNameRepeat,
            trigger: 'blur',
          },
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码长度在 1 到 50 个字符',
            trigger: 'blur',
          },
          {
            validator: checkCodeRepeat,
            trigger: 'blur',
          },
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' },
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍长度在 1 到 300 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 员工名列表
      people: [],
    }
  },
  computed: {
    showTitle() {
      // 新增部门, formData 中一开始肯定没有 id 值
      return this.formData.id ? '编辑部门' : '新增子部门'
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple()
    },
    // 点击确定时触发
    btnOK() {
      this.$refs.formRef.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 有 id 编辑部门
            await updateDepartment(this.formData)
          } else {
            // 没有 id 新增部门
            // 添加的是当前节点的子部门, pid(待添加部门) === id(当前节点)
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 通知父组件, 重新拉取数据
          this.$emit('addDepts')
          // 通知父组件, 关闭 dialog
          // this.$emit('closeDialog', false)
          // (父)使用 sync 修饰符, (子)更新 props 中的 showDialog 值为 false
          this.$emit('update:showDialog', false)
          // 关闭 dialog 的时候(手动, 点击按钮, 点叉号...), 会触发 el-dialog 的 close 事件, 因而, @close 绑定的回调, 将会执行, 所以也就清空了校验结果
        }
      })
    },
    btnCancel() {
      // 重置数据, formData 中还有类似于 id 之类的数据(非表单绑定数据)无法通过 resetFields 重置, 只能手动重置, 防止出错
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: '',
      }
      // 点击取消, 关闭弹层
      this.$emit('update:showDialog', false)
      // 重置整个表单(仅仅是表单中的数据), 清除之前的校验结果, 并将所有字段重置为初始值
      this.$refs.formRef.resetFields()
    },
    async getDepartmentDetail(id) {
      // 回写数据
      this.formData = await getDepartmentDetail(id)
      // props 传值是异步的, 此时的 treeNode 值不一定传过来了, 因此不可取。
      // this.formData = await getDepartmentDetail(this.treeNode.id)
    },
  },
}
</script>
<style scoped></style>
