import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import role from './modules/role'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    role
  },
  getters
})

export default store
