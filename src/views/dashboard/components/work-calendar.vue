<template>
  <div>
    <el-row type="flex" justify="end">
      <!-- 年 用组件的, 给一个日期, 获取年, 前五年 + 后五年 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </el-option>
      </el-select>
      <!-- 月 -->
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px; margin-left: 10px"
        @change="dateChange"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">
          {{ item }}
        </el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <!-- data.day 是格式化的日期，格式为 yyyy-MM-dd -->
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    },
  },
  props: {
    // 父组件可以传递一个 日期
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: [], // 要遍历的年的数组
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear() // 得到当前的年份。
    this.currentMonth = this.startDate.getMonth() + 1 // 得到当前的月份。
    // 快速生成数组
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
    // 主动执行 dateChange
    this.dateChange()
  },
  methods: {
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    },
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
  },
}
</script>

<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>
