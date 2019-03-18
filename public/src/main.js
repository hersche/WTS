import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {store} from './store'

Vue.config.productionTip = false

const axios = require('axios');

// Make a request for a user with a given ID
axios.get('/api/seedList')
  .then(function (response) {
    // handle success
    store.commit("setSeeds",response.data)
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  
  axios.get('/api/user')
    .then(function (response) {
      // handle success
      console.log("got user!",response)
      var u = response.data
      if(u==""){
        u=undefined
      }
      store.commit("setUser",u)
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
