<template>
  <div class="goods">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索部分 input输入框组件-->
    <el-input placeholder="请输入搜索内容" class="search-input">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="primary" plain @click="JumpToAdd">添加商品</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    JumpToAdd () {
      this.$router.push({name: 'AddGoods'})
    }
  }
}
</script>
<style lang="scss" scoped>
.search-input {
  width:400px;
}
</style>
