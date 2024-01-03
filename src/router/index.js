import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Index from '../views/Index.vue';
import { Notification } from 'element-ui';
import store from '../store/store.js'

Vue.prototype.$notify = Notification;

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
    },
    {
      path: '*',
      redirect: '/login', // 重定向任意未匹配路径到登录页
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  // 检查用户是否已经登录或是否正在访问登录页面
  if (to.path !== '/login') {
    try {
      const response = await fetch('/checkLogin', {
        method: 'GET',
        credentials: 'include', // 添加这一行来发送Cookie
      });
      if (response.ok) {
        // 用户已登录，继续导航
        // 在这里获取用户信息
        const userInfoResponse = await fetch('/v1/user/user-info', {
          method: 'GET',
          credentials: 'include', // 添加这一行来发送Cookie
        });
        if (userInfoResponse.ok) {
          const data = await userInfoResponse.json();
          // 直接从响应体中获取 username 和 uid
          const username = data.username;
          const uid = data.uid;
          // 存储 username 和 uid 到 Vuex 中
          store.commit('setUsername', username);
          store.commit('setUID', uid);
        }
        next();
      } else {
        throw new Error('Not logged in');
      }
    } catch (error) {
      Vue.prototype.$notify({
        title: '访问错误',
        message: '未登录，请先登录',
        type: 'warning',
        duration: 2500, // 持续时间，单位毫秒
        onClose: () => {
          next('/login'); // 通知关闭后，重定向到登录页面
        }
      });
    }
  } else {
    // 用户正在访问登录页面
    next(); // 继续导航
  }
});




export default router;
