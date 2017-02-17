import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  
  state: {

    // <form-base data-state-name="stateDataForm" />
    // stateDataForm: null     
    data: null,    // vuex state object holding the edited data  <form-base data-state-name="data" />

    // <form-base schema-state-name="stateSchemaForm" />     
    // stateSchemaForm: null     
    schema: null   // vuex state object holding the possible modified schema <form-base schema-state-name="schema" />   
  
  }

});

import App from './App.vue'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
