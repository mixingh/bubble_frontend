import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Index from '../views/Index.vue';
import { Notification } from 'element-ui';

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

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  // 检查用户是否已经登录或是否正在访问登录页面
  if (to.path !== '/login' && !token) {
    Vue.prototype.$notify({
      title: '访问错误',
      message: '未登录，请先登录',
      type: 'warning',
      duration: 2500, // 持续时间,，单位毫秒
      onClose: () => {
        next('/login'); // 通知关闭后，重定向到登录页面
      }
    });
  } else {
    // 用户已登录或正在访问登录页面
    next(); // 继续导航
  }
});

export default router;
