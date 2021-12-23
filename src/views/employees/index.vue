<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部 -->
      <page-tools :show-before="true">
        <!-- 左侧 -->
        <!-- <span slot="before">共166条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <!-- 右侧 -->
        <!-- <template slot="after"> -->
        <template v-slot:after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >
            excel导入
          </el-button>
          <el-button size="small" type="danger" @click="exportData">
            excel导出
          </el-button>
          <!-- 使用 formatter 格式化内容 -->
          <el-button size="small" type="primary" @click="addEmployee">
            新增员工
          </el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="employeeList">
          <el-table-column label="序号" sortable type="index" />
          <!--
            label 列标题
            prop 列数据来源, 对应 哪一个属性。
           -->
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <!-- formatter 格式化指定列的值 -->
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable>
            <!-- <template slot-scope="{ row }">
              {{ row.timeOfEntry }}
            </template> -->
            <!-- 默认插槽 + 作用域插槽 	自定义列的内容 -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <!-- 这里的账户状态是只读的 -->
          <el-table-column label="账户状态" sortable>
            <template v-slot="{ row }">
              <!-- value 值控制开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                :disabled="!checkPermission('POINT-USER-UPDATE')"
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">
                角色
              </el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">
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
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 添加员工 dialog -->
    <!-- 使用 sync 修饰符 子组件修改父组件数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />

    <!-- 角色弹层 -->
    <assign-role
      ref="assignRoleRef"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'

export default {
  components: {
    AddEmployee,
    AssignRole,
  },
  data() {
    return {
      employeeList: [], // 员工列表
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      loading: false,
      showDialog: false,
      showRoleDialog: false, // 控制角色 dialog 的显示与隐藏
      userId: null,
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.employeeList = rows
      this.loading = false
    },
    // newPage 当前页码
    changePage(newPage) {
      this.page.page = newPage
      // 重新拉取数据
      this.getEmployeeList()
    },
    /*
      row 行数据
      cellValue 单元格值
      行数据和单元格数据之间的关系: row.prop(绑定的值) === cellValue
      在这里就是 row.formatEmployment === cellValue
    */
    formatEmployment(row, column, cellValue, index) {
      // 要去找枚举值 1 OR 2 所对应的值
      // const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      // return obj ? obj.value : '未知'
      const obj1 = EmployeeEnum.hireType.find(
        (item) => item.id === row.formOfEmployment
      )
      return obj1 ? obj1.value : '未知'
    },
    async delEmployee(id) {
      // try {
      //   await this.$confirm('确定删除此员工吗?')
      //   // 确认删除, 调用接口
      //   await delEmployee(id)
      //   this.$message.success('删除员工成功!')
      //   this.getEmployeeList()
      // } catch (err) {
      //   console.log(err)
      // }
      const confirmRes = await this.$confirm('确定删除此员工吗?').catch(
        (err) => err
      )
      if (confirmRes !== 'confirm') return
      // 确认删除, 调用接口
      await delEmployee(id)
      this.$message.success('删除员工成功!')
      // 拉取新数据
      this.getEmployeeList()
    },
    // 监听 "新增员工" 按钮的点击, 显示弹层
    addEmployee() {
      this.showDialog = true
    },
    exportData() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName',
      }

      // 懒加载
      import('@/vendor/Export2Excel').then(async (excel) => {
        /*
          header 一个数组 ['姓名', '工资'] 标题
          data 一个数组 要求的格式 [['张三','3000'], ['李四','4000']]
        */
        //  获取所有的员工数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        })
        const data = this.formatJson(headers, rows)
        // 复杂表头，如果跨列，多余的需要定义成空串
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // 定义合并单元格的形式
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料',
          multiHeader,
          merges,
        })
      })
      // data 要求的格式 [['张三','3000'], ['李四','4000']]
      // 现有的格式 [{username: '张三', salary: '3000'}, {username: '李四', salary: '4000'}]
      // 同时表头的顺序要和转化后的对应上, 不能错乱
      // 标题: 英文 => 中文
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      // map 后变成二维数组
      return rows.map((item) => {
        // Object.keys 的结果是一个数组
        return Object.keys(headers).map((key) => {
          // 时间格式处理
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
    // 分配角色弹层
    async editRole(id) {
      this.userId = id
      // 使用 id 调用子组件的方法, 获得当前用户拥有的角色
      // getUserDetailById 是一个异步方法, 等待其执行完成后, 才弹层, 这样数据就一定能够在弹层之前取得
      await this.$refs.assignRoleRef.getUserDetailById(id)
      this.showRoleDialog = true
    },
  },
}
</script>

<style></style>
