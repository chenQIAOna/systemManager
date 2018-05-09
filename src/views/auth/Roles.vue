<template>
  <div class="roles">
      <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户 -->
    <el-button type="primary" plain @click="addUsers">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table
      border
      class="mt-15 mb-15"
      :data="rolesList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24" v-if="scope.row.children.length === 0">
              <el-tag type="danger">该角色未授予权限，请先授权</el-tag>
            </el-col>
          </el-row>
          <el-row v-for="(firstItems, index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag type="" closable @close="handleClose(scope.row, firstItems)">{{firstItems.authName}}</el-tag>
              <i class="el-icon-arrow-right" v-if="firstItems.children.length !== 0"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(secondItems, index) in firstItems.children" :key="index">
                <el-col :span="4">
                  <el-tag type="success" closable @close="handleClose(scope.row, secondItems)">{{secondItems.authName}}</el-tag>
                  <i class="el-icon-arrow-right" v-if="secondItems.children.length !== 0"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag closable @close="handleClose(scope.row, thirdItems)" type="warning" v-for="(thirdItems, index) in secondItems.children" :key="index">{{thirdItems.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain
            size="mini" icon="el-icon-edit"></el-button>
          <el-button
            size="mini"
            type="danger" plain icon="el-icon-delete"></el-button>
          <el-button
            size="mini"
            type="warning" plain icon="el-icon-check" @click="showGrantTree(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权角色弹框 -->
    <el-dialog title="授权角色" :visible.sync="grantDialogFormVisible">
      <!-- 这里使用树形控件展示 Tree -->
      <div class="tree-container">
        <!-- default-expand-all 设置展开所有节点 -->
        <el-tree
          default-expand-all
          :data="roleData"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-checked-keys="checkRight"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addRolesForm" :rules="rules" :label-width="formLabelWidth" ref="addRolesForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitAddRoles('addRolesForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getRolesList, deleteUserRight, getRightsList, grantRight, addRoles} from '@/api'
export default {
  data () {
    return {
      rolesList: [],
      formLabelWidth: '120px',
      addDialogFormVisible: false,
      grantDialogFormVisible: false,
      roleData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkRight: [], // 树形数据默认选中的数组
      currentRow: {},
      // 添加用户表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单验证
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      getRolesList()
        .then(res => {
          console.log(res)
          this.rolesList = res.data
        })
    },
    // 取消管理权限
    handleClose (row, tag) {
      console.log(row)
      console.log(tag)
      deleteUserRight({roleId: row.id, rightId: tag.id})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
          } else {
            this.$messgae.error(res.meta.msg)
          }
        }).catch(res => this.$message.error('权限获取失败'))
    },
    // 显示授权角色对话框
    showGrantTree (row) {
      this.currentRow = row
      this.grantDialogFormVisible = true
      // 获取所有权限列表填充到树形控件中
      getRightsList({type: 'tree'})
        .then(res => {
          console.log(res)
          this.roleData = res.data
        })
      // 每次点击都应该将checkRight数组清空
      this.checkRight.length = 0
      // 循环遍历每一行数据的children,获取到最后一个children的id值，将每一行最后一个children的id值push到checkRight数组中
      this.currentRow.children.forEach(firstVal => {
        if (firstVal.children && firstVal.children.length !== 0) {
          firstVal.children.forEach(secondVal => {
            if (secondVal.children && secondVal.children.length !== 0) {
              secondVal.children.forEach(thirdVal => {
                this.checkRight.push(thirdVal.id)
              })
            }
          })
        }
      })
    },
    // 提交权限设置
    grantSubmit () {
      var nodeArr = this.$refs.tree.getCheckedNodes()
      console.log(nodeArr)
      nodeArr = nodeArr.map(item => { return item.id + ',' + item.pid })
      console.log(nodeArr) // ["152,104,101", "153,104,101"]
      // Arr.join(",")将数组以，号的形式分割成字符串，Str.split(),将字符串以，号的形式分割成数组
      var tempArr = nodeArr.join(',').split(',') // ["152", "104", "101", "153", "104", "101"]
      // 去掉重复
      var idArr = [...new Set(tempArr)]
      // 将数组转为字符串
      var rids = idArr.join(',')
      grantRight({ roleId: this.currentRow.id, rids: rids })
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.grantDialogFormVisible = false
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        }).catch(res => {
          this.$message.error(res.meta.msg)
        })
    },
    // 显示添加用户弹框
    addUsers () {
      this.addDialogFormVisible = true
    },
    // 提交添加角色
    sumbitAddRoles (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRoles(this.addRolesForm)
            .then(res => {
              if (res.meta.status) {
                this.$message.success(res.meta.msg)
                this.addDialogFormVisible = false
                this.initList()
              } else {
                this.$message.error(res.meta.msg)
              }
            }).catch(res => { this.$message.error('授权失败') })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag{   // 为什么明明是标签，却写成类选择器的形式
  margin:5px 5px 0 5px;
}
.tree-container{
  height: 300px;
  overflow: auto;
}
</style>
