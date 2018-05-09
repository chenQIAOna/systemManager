<template>
  <div class="right">
    <!-- element-ui的栅格布局 -->
    <el-row>
      <el-col :span="24">
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 权限表格列表 -->
    <el-table
      class="mt-15 mb-15"
      ref="singleTable"
      border
      :data="RightList"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        property="path"
        label="路径">
      </el-table-column>
      <el-table-column
        label="层级">
        <template slot-scope="scope">
          {{scope.row.level | filterLevel}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getRightsList} from '@/api'
export default {
  data () {
    return {
      RightList: []
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      getRightsList({type: 'list'})
        .then(res => {
          console.log(res)
          this.RightList = res.data
        })
    }
  },
  // 过滤层级数据，将数字过滤成一级，二级，三级的格式
  filters: {
    filterLevel (val) {
      if (val === '0') {
        return '一级'
      } else if (val === '1') {
        return '二级'
      } else {
        return '三级'
      }
    }
  }
}
</script>
