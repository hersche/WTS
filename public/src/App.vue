<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase hidden-sm-and-down">
        <span>WTS</span>
        <span class="font-weight-light text-lowercase">[webtorrent-seeder]</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="">
        <v-btn small flat icon="true" title="Refresh seeds" @click="refreshSeeds()">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-btn small flat to="/">
          Home
        </v-btn>
        <v-btn small flat v-if="user!=undefined" to="/upload">
          Upload
        </v-btn>
        <v-btn small flat class="hidden-sm-and-down" to="/about">
          About
        </v-btn>
        <v-btn small flat v-if="user!=undefined" href="/api/logout">
          Logout
        </v-btn>
        <v-btn small flat v-if="user==undefined" href="/api/login">
          Login
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 md11 lg10>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {store} from './store'
const axios = require('axios');
export default {
  name: "App",
  components: {},
  methods: {
    refreshSeeds(){
      axios.get('/api/seedList')
        .then(function (response) {
          store.commit("setSeeds",response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  },
  computed:{
    user:function(){
      return store.state.user
    },
  },
  data() {
    return {
    };
  }
};
</script>