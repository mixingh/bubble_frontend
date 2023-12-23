"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '@/router';
import jwt_decode from 'jwt-decode';

let config = {};

const _axios = axios.create(config);

// 请求拦截器
_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const current_time = Date.now() / 1000;
      if (decodedToken.exp < current_time) {
        // Token已过期
        localStorage.removeItem('token'); // 清理localStorage中的token
        router.push('/login'); // 重定向到登录界面
        return Promise.reject("Token expired.");
      } else {
        config.headers.token = `${token}`; // 设置请求头的授权字段
      }
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(response => {
  // 请求成功时直接返回响应内容
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
      // 如果响应的状态码是 401，可能是因为token无效或未提供token
      localStorage.removeItem('token');
      router.replace({ path: '/login' });
  }
  // 请求错误时做些事情
  return Promise.reject(error);
});

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
