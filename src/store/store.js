import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    uid: '',
    username: '',
  },
  mutations: {
    setUID(state, uid) {
      state.uid = uid;
    },
    setUsername(state, username) {
      state.username = username;
    },
  },
});
