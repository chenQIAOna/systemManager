<template>
    <div class="login">
        <!-- 这里只能有一个根节点 -->
        <!-- model表示表单数据对象 -->
        <!-- 写属性校验的第一步：给el-form绑定rules属性，传入约定的验证规则 第二步：给form-items的prop属性设置为需要校验的字段名-->
      <el-form ref="loginFormref" :model="loginForm" class="container" :rules="loginRules">
          <el-form-item class="avatar">
            <img src="../assets/avatar.jpg" alt="">
          </el-form-item>
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" prefix-icon="myicon myicon-user" placeholder="用户" @keyup.enter.native="login('loginFormref')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="myicon myicon-key" placeholder="密码" @keydown.enter.native="login('loginFormref')"></el-input>
            <!-- 在element ui input组件中键盘回车事件要在@keydown.enter后面加上.atctive -->
            <!-- 这是之前的键盘回车绑定方式 -->
            <!-- <input type="text" @keydown.enter="login('loginForm')"> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="login('loginFormref')">登录</el-button>
            <!-- click里的参数loginFrom指向的是ref里的值 -->
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {checkLogin} from '@/api'
export default {
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      //  定义校验规则
      loginRules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login (formName) {
      // validate()是一个校验函数，它里面跟一个带参数的函数作为参数，这个函数的参数是一个布尔值，为true表示校验通过
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          // 发送请求
          checkLogin({username: this.loginForm.userName, password: this.loginForm.password})
            .then(res => {
              console.log(res)
              if (res.meta.status === 200) {
                // 保存服务器返回的token,并且获取到输入的userName的值
                localStorage.setItem('adminToken', res.data.token)
                this.$router.push({name: 'Home'})
                this.$store.commit('setUserName', res.data.username)
              } else {
                this.$message.error(res.meta.msg)
              }
            })
        } else {
          if (this.loginForm.userName === '') {
            this.$message.error('请输入用户名')
          } else if (this.loginForm.password === '') {
            this.$message.error('请输入密码')
          }
          // 这里一定要return false
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// scoped表示局部样式，就是说下面的样式只能再Login组件中使用，在其他组件使用无效
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
