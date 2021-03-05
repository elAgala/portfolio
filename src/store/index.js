import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    language: 'EN',
  },
  mutations: {
    changeLanguage(state, payload){
      state.language = payload
    }
  },
  getters: {
    getTextForComponent: state => componentName => {
      const { info } = require(`../language/${state.language}/${componentName}`)
      return info
    },
    actualLanguage: state => {
      return state.language
    }
  }
})
