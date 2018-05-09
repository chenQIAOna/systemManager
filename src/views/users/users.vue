<template>
  <div class="users">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索部分 input输入框组件-->
    <el-input placeholder="请输入搜索内容" v-model="searchVal" class="search-input">
      <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
    </el-input>
    <el-button type="primary" plain @click="addUserList">添加用户</el-button>
     <!-- @current-change="handleCurrentChange" -->
    <!-- 用户表格列表   table表格组件-->
    <el-table
      v-loading="loading"
      class="mt-15 mb-15"
      ref="singleTable"
      border
      :data="tableData"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        property="username"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        property="email"
        label="邮箱"
        width="120">
      </el-table-column>
      <el-table-column
        property="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <!-- scope指向的是上面tableData整体的数据，row指向的是tableData数据的每一行 -->
          <!-- switch开关组件 -->
          <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain
            size="mini" icon="el-icon-edit"
            @click="handleEdit(scope.row)"></el-button>
          <el-button
            size="mini"
            type="danger" plain icon="el-icon-delete"
            @click="handleDelete(scope.row)"></el-button>
          <el-button
            size="mini"
            type="warning" plain icon="el-icon-check"
            @click="handleLimit(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 Pagination分页组件-->
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
    <!-- 添加用户弹框 MessageBox弹框组件-->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" :label-width="formLabelWidth" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitAddUser('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" :label-width="formLabelWidth" ref="editUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitEditUser('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配弹框 -->
    <el-dialog title="分配角色" :visible.sync="rolesDialogFormVisible">
      <el-form :model="formRoles" :label-width="formLabelWidth">
        <el-form-item label="当前用户">
          <el-tag type="info">{{formRoles.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色" >
          <!-- :value的值会赋给v-model的值 -->
          <el-select v-model="formRoles.rid" placeholder="请选择角色">
            <el-option :label="items.roleName" :value="items.id" v-for="(items, index) in rolesList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAllot">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userDataList, changeStatus, addUsers, deletUser, editUser, getRolesList, allotUsers } from '@/api'
export default {
  data () {
    return {
      rolesList: [], // 角色列表数据
      loading: true, // 加载的设置，true表示为正在加载
      tableData: [],
      currentRow: null,
      searchVal: '',
      pagesize: 10, // 每页显示条数
      pagenum: 1, // 当前页码
      totalnum: 0,
      formLabelWidth: '120px', //  添加用户弹框的宽度
      addDialogFormVisible: false, // 添加用户弹框默认为隐藏，当为true时是显示
      editDialogFormVisible: false, // 编辑用户弹框默认为隐藏
      rolesDialogFormVisible: false, // 角色分配弹框默认隐藏
      // 添加用户弹框的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑弹框数据
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 角色分配弹框的数据
      formRoles: {
        username: '',
        id: '',
        rid: ''

      },
      // 6添加用户的表单验证 require设置为必填项，message是当trigger里的事件触发后就执行message里的提示信息
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        mobile: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
      }
    }
  },
  // 在created和mounted函数里都可以，他们都是组件中生命周期里的其中一个阶段。
  created () {
    this.initList()
  },
  methods: {
    // 1初始化表格数据
    initList () {
      userDataList({
        query: this.searchVal,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          // 将loading设置为false就取消加载的缓冲状态
          this.loading = false
          this.tableData = res.data.users
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
    // 3状态修改
    changeUserStatus (row) {
      console.log(row)
      changeStatus({ uId: row.id, type: row.mg_state }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('更改用户状态成功')
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    // 4搜索功能
    searchList () {
      this.initList()
      this.searchVal = ''
    },
    // 5显示添加用户对话框
    addUserList () {
      this.addDialogFormVisible = true
    },
    // 7提交添加用户
    sumbitAddUser (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUsers(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.addDialogFormVisible = false
              this.$message.success('添加用户成功')
              this.initList()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          this.$message.error('校验未通过，不给提交')
        }
      })
    },
    // 8删除功能
    handleDelete (row) {
      console.log(row) // 这里输出的是后台获取的数据对应的每一行的数据，其中也包含id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletUser(row.id)
          .then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg)
              this.initList()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
          .catch(res => this.$message.error(res.meta.msg))
      })
    },
    // 9显示编辑弹框
    handleEdit (row) {
      console.log(row)
      this.editDialogFormVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 10确定编辑按钮
    sumbitEditUser (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.editDialogFormVisible = false
              this.$message.success('修改用户成功')
              this.initList()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          this.$message.error('校验未通过，不给提交')
        }
      })
    },
    // 11显示分配角色弹框
    handleLimit (row) {
      console.log(row)
      this.rolesDialogFormVisible = true
      this.formRoles.username = row.username
      this.formRoles.id = row.id
      console.log(this.formRoles.id)
      // 12获取角色列表
      getRolesList()
        .then(res => {
          console.log(res)
          this.rolesList = res.data
        })
    },
    // 13提交分配角色
    submitAllot () {
      allotUsers(this.formRoles)
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success('设置角色成功')
          } else {
            this.$message.error('设置角色失败')
          }
          this.rolesDialogFormVisible = false
        })
        .catch(res => { this.$message.error('操作角色分配失败') })
    }
  }
}
</script>
