import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Index from '../views/Index.vue';

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
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (to.path !== '/login' && !token) {
     alert('未登录，请先登录');
     next('/login');
  }
  else{next();}
  
});

export default router;