<template>
  <!-- 公共导入组件 -->
  <!-- 需要传入 on-success 值为一个 函数, excel 文件解析的结果将作为函数的参数传出 -->
  <upload-excel :on-success="success" />
</template>
<script>
import { importEmployee } from '@/api/employees'
export default {
  props: {},
  data() {
    return {}
  },
  methods: {
    async success({ header, results }) {
      // header 和 results 中的数据是中文 => 英文
      /*
        username			姓名
        mobile			手机号
        formOfEmployment		聘用形式
        workNumber			工号
        departmentName			组织名称
        timeOfEntry			入职时间
        correctionTime			转正时间
      */
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
      }
      const arr = []
      results.forEach((item) => {
        const userInfo = {}
        Object.keys(item).forEach((key) => {
          // key 是中文 userRelations[key] 是英文 item[key] 是值
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            // 后端接口, 要求必须是 Date 类型, 才能入数据库
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], '/')
            )
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$message.success('导入excel成功!')
      this.$router.back()
    },
    // 转化 excel 的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    },
  },
}
</script>
<style scoped></style>
