<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ userName }}</div>
    <page-tools :show-before="true">
      <!-- slot 两种用法, slot="xxx" 和 v-slot:xxx -->
      <!-- <span slot="before">哈哈哈哈哈哈</span> -->
      <template v-slot:before>
        <span>哈哈哈哈哈</span>
      </template>
      <el-button slot="after" size="small" type="primary">导入excel</el-button>
    </page-tools>
    <!-- <upload-excel /> -->
    <image-upload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userName']),
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
