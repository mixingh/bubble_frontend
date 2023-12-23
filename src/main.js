import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import './plugins/axios.js'
import store from './store/store';
import axiosPlugin from './plugins/axios';

Vue.config.productionTip = false
Vue.use(axiosPlugin); // 安装axios插件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
