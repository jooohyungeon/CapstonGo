import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    SetInfo: [],
    SetClass: [],
  },
  mutations: {
    SetInfo: function (state, data) {
      this.state.SetInfo = data
    },
    SetClass: function (state, data) {
      this.state.SetClass = data
    },
  },
  actions: {
  },
  modules: {
  }
})
