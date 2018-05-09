<template>
  <div class="cateory">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-button type="primary" plain @click="showCate">添加分类</el-button>
    <!-- 分类列表 -->
    <tree-grid
      v-loading="loading"
      class="mt-15 mb-15"
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    >
    </tree-grid>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalnum">
    </el-pagination>
    <!-- 添加分类弹框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addFormCate" :label-width="formLabelWidth">
        <el-form-item label="分类名称">
          <el-input v-model="addFormCate.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- Cascader 级联选择器 -->
          <el-cascader
            :options="options"
            :props="props"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
import { getCategory, addCate } from '@/api'
export default {
  // 将功能组件TreeGrid引入Category中
  components: {TreeGrid},
  data () {
    return {
      formLabelWidth: '120px',
      addDialogFormVisible: false,
      loading: true, // 加载器
      pagesize: 10, // 每页显示条数
      pagenum: 1, // 当前页码
      totalnum: 0,
      dataSource: [], // 分类列表数据
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      // 添加商品分类数据
      addFormCate: {
        'cat_name': '',
        'cat_pid': 0,
        'cat_level': 0
      },
      options: [], // 父级名称数据
      selectedOptions: [], // 选中的数组
      props: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    deleteCategory (cid) {
      console.log(cid)
    },
    editCategory (cid) {
      console.log(cid)
    },
    // 获取分类列表数据
    initList () {
      getCategory({type: 3, pagesize: this.pagesize, pagenum: this.pagenum})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.loading = false
            this.dataSource = res.data.result
            this.totalnum = res.data.total
          }
        })
    },
    // 2分页器
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    // 显示添加分类弹框
    showCate () {
      this.addDialogFormVisible = true
      getCategory({type: 2}).then(res => {
        console.log(res)
        this.options = res.data
      })
    },
    // 父级名称输入框值改变触发的事件
    handleChange (value) {
      console.log(value) // 是一个数组，对应props属性value的值
      this.addFormCate.cat_pid = value[value.length - 1]
      this.addFormCate.cat_level = value.length
    },
    // 提交添加分类
    submitCategory () {
      console.log(this.addFormCate)
      addCate(this.addFormCate)
        .then(res => {
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.addDialogFormVisible = false
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        }).catch(res => { this.$message.error('授权失败') })
    }
  }

}
</script>
