<template>
  <div class="home">
    <el-container>
      <!-- 左侧边 -->
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
        :unique-opened="true"
        default-active="2"
        class="el-menu-admin"
        background-color="#F9F9F9"
        active-text-color="#409EFF"
        :router="true"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose">
        <!-- index的值需要每一行都不一样才会发挥unique-opened的属性值，保持只有一行展开 -->
          <el-submenu :index="items.authName" v-for="(items, index) in MenuList" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{items.authName}}</span>
            </template>
            <el-menu-item :index="subItems.path" v-for="(subItems, index) in items.children" :key="index">
              <i class="el-icon-menu"></i>
              <span slot="title">{{subItems.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边部分 -->
      <el-container>
        <el-header>
          <i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
          <div class="system-title">电商后台管理系统</div>
          <div>
            <span class="welcome">你好，{{$store.getters.getterName}}</span>
            <el-button type="warning" round @click="logout">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 给子组件挖一个坑 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {MenusRight} from '@/api'
export default {
  data () {
    return {
      // false时是不收缩的，true时是收起来
      isCollapse: false,
      MenuList: []
    }
  },
  created () {
    MenusRight().then(res => {
      console.log(res)
      this.MenuList = res.data
    })
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      // 清空localStorage，并跳转到登录页面
      localStorage.removeItem('adminToken')
      localStorage.removeItem('getUserName')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #F9F9F9;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409EFF;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
