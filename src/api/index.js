// 这里统一处理请求
import axios from 'axios'

const URL = 'http://localhost:8888/api/private/v1/'
// 这里给axios设置一个全局的基准路径，这样以后它发的所有请求，都会带上这个基准路径
axios.defaults.baseURL = URL
// 定义一个请求拦截器，作用是拦截所有的请求，这里的config参数是一个请求对象，
axios.interceptors.request.use(function (config) {
  console.log(config)
  var token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 定义登录请求
export const checkLogin = (params) => {
  return axios.post('login', params).then(res => res.data)
}
// 页面数据请求
export const userDataList = (params) => {
  return axios.get('users', {params: params}).then(res => res.data)
}
// 修改用户状态
export const changeStatus = (obj) => {
  console.log(`users/${obj.uId}/state/${obj.type}`)
  return axios.put(`users/${obj.uId}/state/${obj.type}`).then(res => { return res.data })
}
// 添加用户
export const addUsers = (obj) => {
  return axios.post('users', obj).then(res => { return res.data })
}
// 删除单个用户
export const deletUser = (id) => {
  return axios.delete(`users/${id}`).then(res => { return res.data })
}
// 编辑单个用户
export const editUser = (obj) => {
  return axios.put(`users/${obj.id}`, {email: obj.email, mobile: obj.mobile}).then(res => res.data)
}
// 获取所有权限列表
export const getRightsList = (obj) => {
  return axios.get(`rights/${obj.type}`).then(res => res.data)
}
// 获取角色列表
export const getRolesList = () => {
  return axios.get('roles').then(res => res.data)
}
// 分配角色请求
export const allotUsers = (obj) => {
  return axios.put(`users/${obj.id}/role`, {rid: obj.rid}).then(res => res.data)
}
// 删除角色指定权限
export const deleteUserRight = (obj) => {
  return axios.delete(`roles/${obj.roleId}/rights/${obj.rightId}`).then(res => res.data)
}
// 添加角色
export const addRoles = (obj) => {
  return axios.post('roles', obj).then(res => res.data)
}
// 角色授权
export const grantRight = (obj) => {
  return axios.post(`roles/${obj.roleId}/rights`, {rids: obj.rids}).then(res => res.data)
}
// 左侧菜单权限
export const MenusRight = () => {
  return axios.get('menus').then(res => res.data)
}
// 获取所有分类列表
export const getCategory = (obj) => {
  return axios.get('categories', {params: {type: obj.type, pagesize: obj.pagesize, pagenum: obj.pagenum}}).then(res => res.data)
}
// 添加分类
export const addCate = (obj) => {
  return axios.post('categories', obj).then(res => res.data)
}
