import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
  },
  mutations: {
    setToken (state, token) {
      state.token = token;
    },
    setUID(state, uid) {
      state.uid = uid;
    },
    setUsername(state, username) {
      state.username = username;
    },
  },
});