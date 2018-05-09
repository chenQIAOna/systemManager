// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 是APP.vue的简写
// 这里默认会去查找router文件夹下面的index.js文件
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueQuilEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import store from '@/store'
/* VueQuilEditor的样式 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入vue-echarts
import Echarts from 'vue-echarts'
Vue.config.productionTip = false
// 启用elementUI
Vue.use(ElementUI)
Vue.component('chart', Echarts)
// 启用VueQuilEditor
Vue.use(VueQuilEditor)
// 设置路由拦截
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('adminToken')
  if (token) {
    // 如果登录了，就继续执行下一步操作
    next()
  } else {
    // 如果没有登录，并且访问的不是login页面，就跳转到login页面
    if (to.path !== '/login') {
      next({path: '/login'})
    } else {
      // 如果没有登录，并且访问的是login页面，就不拦截，让其继续访问
      next()
    }
  }
})

/* eslint-disable no-new */
// router和store都是关键字，规定只能这样子写
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
