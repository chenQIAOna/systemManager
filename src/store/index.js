import Vue from 'vue'
import Vuex from 'vuex'
// 开启vuex
Vue.use(Vuex)
// 定义vuex的核心对象
const state = {
  userName: ''
}
const mutations = {
  setUserName: (state, inpName) => {
    localStorage.setItem('getUserName', inpName)
    state.userName = inpName
  }
}
const actions = {}
const getters = {
  getterName: state => localStorage.getItem('getUserName')
}
// 暴露核心对象
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
