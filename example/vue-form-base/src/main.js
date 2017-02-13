import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    data:null,      // vuex state object holding the edited data 
    schema:null     // vuex state object holding the possible modified schema
  },
  mutations: {
  setDataState: (state, val) => { state[this.dataStateName] = val },
  setSchemaState: (state, val) => { state[this.schemaStateName] = val }
  }

});
import App from './App.vue'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
