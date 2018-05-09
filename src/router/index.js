import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome/Welcome.vue'
import Users from '@/views/users/users.vue'
import Roles from '@/views/auth/Roles'
import Rights from '@/views/auth/Rights'
import Category from '@/views/category/Category.vue'
import Goods from '@/views/goods/Goods'
import AddGoods from '@/views/goods/AddGoods'
import Reports from '@/views/reports/Reports'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      // 以下两种写法都可以设定重定向到welcome页面
      // redirect: '/welcome',
      redirect: {name: 'Welcome'},
      children: [
        {name: 'Welcome', path: 'welcome', component: Welcome},
        {name: 'Users', path: 'users', component: Users},
        {name: 'Roles', path: 'roles', component: Roles},
        {name: 'Rights', path: 'rights', component: Rights},
        {name: 'Ctategory', path: 'categories', component: Category},
        {name: 'Goods', path: 'goods', component: Goods},
        {name: 'AddGoods', path: 'toadd', component: AddGoods},
        {name: 'Reports', path: 'reports', component: Reports}
      ]
    }
  ]
})
