<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <!-- 顶层的按钮可添加一级权限，特征是 type = 1 pid = '0' -->
        <template v-slot:after>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="addPermission(1, '0')"
          >
            添加权限
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!--
        树形结构 -> 含有 children 属性
        必须设置 row-key 优化行数据的渲染，树形结构必备唯一值。
        tree-props
          children 设置去哪个属性找子节点
          hasChildren 那些行有子节点（需要展开）
       -->
      <el-table
        border
        :data="list"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <!-- slot-scope="{ row }" -->
          <template v-slot="{ row }">
            <!-- 添加按钮, 只有 type===1 的时候才显示(页面访问权, 第一级权限) -->
            <!-- 要添加的是二级权限（按钮操作权）type===2 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >
              添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)">
              编辑
            </el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增OR编辑弹层 -->
    <el-dialog
      :title="`${showText}权限点`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perFormRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 显示的是 text 收集的是 value -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            active-text="可见"
            inactive-value="0"
            inactive-text="不可见"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  addPermission,
  updatePermission,
  getPermissionDetail,
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        type: '',
        code: '',
        description: '',
        pid: '',
        enVisible: '0',
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    },
  },
  created() {
    this.getPermissionList()
  },

  methods: {
    // 所有权限点
    async getPermissionList() {
      // array => tree
      const listArr = await getPermissionList()
      this.list = tranListToTreeData(listArr, '0')
    },
    async delPermission(id) {
      const confirmRes = await this.$confirm('确定删除该数据吗?').catch(
        (err) => err
      )
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除操作!')
      // 确定删除。
      try {
        await delPermission(id)
        // 重新拉取 tree 形数据
        this.getPermissionList()
        this.$message.success('删除成功!')
      } catch (error) {
        console.log(error)
      }
    },
    addPermission(type, pid) {
      this.showDialog = true
      // 页面访问权 type=1 一级权限, 按钮操作权 type = 2 二级权限
      // 一级权限下添加二级权限传入其 id 值作为二级权限的 pid, id(一级) === pid(二级)
      // 一级权限的特征 pid === ''
      // 这些值, 不是通过表单收集的, 但是最终都需要发送给服务器
      this.formData.type = type
      this.formData.pid = pid
    },
    async editPermission(id) {
      // 回写数据, 编辑往往需要回写数据。
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      // 表单校验
      try {
        await this.$refs.perFormRef.validate()
        // 表单校验成功, 发送请求, 添加 OR 更新权限点
        // 新增 OR 编辑, 根据 id 来判断, 有 id 编辑 无 id 新增
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.getPermissionList()
        this.$message.success('操作成功!')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.showDialog = false
      // 清空
      this.formData = {
        name: '',
        type: '',
        code: '',
        description: '',
        pid: '',
        enVisible: '0',
      }
      // 清除校验结果
      this.$refs.perFormRef.resetFields()
    },
  },
}
</script>

<style></style>
