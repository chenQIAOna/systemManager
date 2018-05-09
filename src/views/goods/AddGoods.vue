<template>
  <div class="addGoods">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/goods'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="goodsInfo">添加商品信息</div>
    <!-- 步骤条 Steps-->
    <el-steps :space="200" :active="activeIndex" finish-status="success" class="mt-15">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="mt-15" tab-position="left">
      <el-tab-pane label="基本信息" name="first">基本信息</el-tab-pane>
      <el-tab-pane label="商品参数" name="second">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="third">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <!-- action是上传地址，需要后台接口规定好 -->
      <el-upload
        action="http://localhost:8888/api/private/v1/upload"
        :headers="myHeader"
        :on-success="handleAvatarSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
        <!-- vue-quill-editor插件 -->
        <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'first',
      activeIndex: 0, // 这里需要是数字类型
      content: null, // 文本编辑内容
      editorOption: {},
      fileList: [], // 存储图片上传数据
      myHeader: {
        Authorization: localStorage.getItem('adminToken')
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
      this.activeIndex = parseInt(tab.index)
    },
    // Vue-quill-editor编辑器事件
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    },
    // 图片上传事件
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    // 图片上传成功的回调函数
    handleAvatarSuccess (res, file) {
      console.log(res, file)
      // var fileObj = {name: file.name, url: res.data.url}
      // console.dir(fileObj)
      var a = {}
      this.fileList.push(a)
      console.log(a)
      // var obj = {a: 1, b: 1}
      // console.log(obj)
    }
  }
}
</script>
<style lang="scss">
.addGoods{
  .goodsInfo{
    height:50px;
    line-height: 50px;
    padding-left:30px;
    background: #d7e2ef;
  }
}
.add-goods {
  .el-tabs {
    height: 400px;
  }
}
.quill-editor {
  height: 400px;
  .ql-container {
    height: 300px;
  }
}
</style>
