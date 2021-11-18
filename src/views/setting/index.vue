<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roleList" border>
              <el-table-column
                align="center"
                type="index"
                width="50"
                label="序号"
              />
              <!-- <el-table-column label="序号" width="120" prop="id" /> -->
              <el-table-column
                align="center"
                label="角色名称"
                width="240"
                prop="name"
              />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽, 传出 id -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page.sync="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹层组件 dialog -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  delRole,
  getRoleDetail,
  updateRoleDetail,
  addRole,
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      roleList: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0,
      },
      // 公司信息
      formData: {},
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: '',
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['companyId']),
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.roleList = rows
    },
    // 监听页码改变 newPage 是当前点击的页码
    handleCurrentChange(newPage) {
      this.page.page = newPage
      // 重新拉取数据
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async delRole(id) {
      const confirmResult = await this.$confirm('确认删除该角色吗?').catch(
        (err) => console.log(err)
      )
      if (confirmResult !== 'confirm') return
      // 确认删除, 调用接口, 发起请求
      console.log(111)
      await delRole(id)
      this.getRoleList()
      this.$message.success('成功删除了该角色!')
    },
    async editRole(id) {
      // 回写数据
      this.roleForm = await getRoleDetail(id)
      // 展示弹层
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleFormRef.validate()
        // 校验通过, 调用接口
        // 新增 OR 编辑, roleForm 中是否有 id
        if (this.roleForm.id) {
          // 编辑
          await updateRoleDetail(this.roleForm)
        } else {
          // 新增角色
          await addRole(this.roleForm)
        }

        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功!')
        this.showDialog = false // 关闭弹层将会触发 el-dialog 的 @close 事件 => 执行 btnCancel 回调
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: '',
      }
      this.$refs.roleFormRef.resetFields()
      this.showDialog = false
    },
  },
}
</script>

<style></style>
