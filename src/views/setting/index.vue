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
              <!-- prop 指定对象中的属性名, 完成一列数据填充 -->
              <el-table-column
                align="center"
                label="角色名称"
                width="240"
                prop="name"
              />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <!-- 默认插槽 + 作用域插槽 自定义列的内容, row 当前单元格数据  -->
                <!-- slot="default" slot-scope="{ row }" -->
                <template v-slot="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPermission(row.id)"
                  >
                    分配权限
                  </el-button>
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
              <!--
                layout 要显示的内容
                  prev < 上一页
                  pager 页码值 1 2 3 4 ...
                  next > 下一页
                current-page 当前页数，支持 .sync 修饰符
                page-size 每页显示多少条
                @current-change currentPage（current-page） 改变时会触发
               -->
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
    <!-- 新增角色弹层组件 dialog -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
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
          <!-- btnCancel -->
          <el-button size="small" @click="showDialog = false">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 为角色分配权限弹层组件 dialog -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是一颗树 -->
      <!--
        check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联
        false => 子节点 选中 父节点也必定选中
      -->
      <!-- id作为唯一标识 -->
      <!--
        default-checked-keys 默认选中的项
        注意!!! 这里用了 :default-checked-keys 没有双向绑定, 只有单向数据流 props 的特性，el-tree 作为 子组件，不能直接修改 props
        show-checkbox 可选择节点
        node-key 每个树节点的唯一值(不能重复) 通常就是 id 值
          el-tree 有一个 getCheckedKeys() 方法, 可以获取到所有选中节点的 node-key 值。返回值是一个 数组，通过 $refs 调用这个方法。
       -->
      <el-tree
        ref="permTree"
        show-checkbox
        default-expand-all
        :data="permData"
        :props="defaultProps"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">
            确定
          </el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
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
  assignPrem,
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
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
      showPermDialog: false, // 控制分配权限弹层的显示或隐藏
      defaultProps: {
        label: 'name',
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    },
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
    // 根据 id 删除角色
    async delRole(id) {
      /*
        catch 掉了可能的 reject 值
        confirmResult 只有两种值, 且都是 resolved 状态
          'confirm'
          'cancel'
      */
      const confirmResult = await this.$confirm('确认删除该角色吗?').catch(
        (err) => err
      )
      console.log(confirmResult)
      if (confirmResult !== 'confirm') return
      // 确认删除, 调用接口, 发起请求
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
        /*
          validate 如果不传入回调, 将返回 Promise
        */
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
    /* 分配权限相关方法 */
    async assignPermission(id) {
      // 点击分配权限(获取所有权限以供选择)
      // array => tree
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // template 中的 id 保存到 data 中留待后用
      this.roleId = id
      // 根据 id 获取当前角色的权限列表
      const { permIds } = await getRoleDetail(id)
      // 默认选中项就是当前角色拥有的权限列表
      this.selectCheck = permIds
      // 调用接口分配权限
      this.showPermDialog = true
    },
    async btnPermOK() {
      // 发起请求 this.selectCheck 绑定的 :default-checked-keys 是单向数据流, 父 => 子, props 不能双向绑定。

      // await assignPrem({ id: this.roleId, permIds: this.selectCheck })
      // 使用 this.$refs.permTree.getCheckedKeys() 返回 所有选中的节点的 key 组成的数组 （前提是设置了 node-key）
      await assignPrem({
        id: this.roleId,
        permIds: this.$refs.permTree.getCheckedKeys(),
      })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.permData = []
      this.selectCheck = [] // 清空, 防累计
      this.showPermDialog = false
    },
  },
}
</script>

<style></style>
