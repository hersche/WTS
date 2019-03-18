import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export const store = new Vuex.Store({
      state: {
        seeds:[],
        user:undefined
      },
      getters: {
        getSeeds: (state) => () => {
          return state.seeds
        },
        getUser: (state) => () => {
          return state.seeds
        }
      },
      mutations: {
        setSeeds(state,seeds){
          state.seeds = seeds
        },
        setUser(state,user){
          state.user = user
        }
      }
    })