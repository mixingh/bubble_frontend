<template>
  <el-container>
    <el-header>Blue便签</el-header>
  <div class="login">
    <el-card class="login-card">
      <h2 class="login-title">欢迎使用Blue便签</h2>
      <h2 class="login-title">示例用户名和密码:riverk</h2>
       
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm"  @submit.native.prevent="login">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" native-type="submit">登录</el-button>
        <!-- <el-button plain @click="open2" type="primary" >点我获取示例用户名和密码</el-button> -->
      </el-form-item>
    </el-form>
    <el-dialog title="登录失败" :visible="showErrorMessage" @close="showErrorMessage = false" custom-class="custom-dialog">
      <p>请检查用户名和密码是否正确。</p>
    </el-dialog>
  </el-card>
  </div>
  <el-footer>riverk</el-footer>
  </el-container>
</template>

<script>
import jwt_decode from 'jwt-decode';
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      showErrorMessage: false,
    };
  },
  methods: {
    async login() {
      try {
        await this.$refs.loginForm.validate();
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.loginForm.username, password: this.loginForm.password }),
        });
        if (response.ok) {
          const data = await response.json();
          //window.console.log(data.data.username);
        const token = data.token;
        // 存储 token 到 Vuex 和 localStorage 中
        this.$store.commit('setToken', token);
        localStorage.setItem('token', token);

        // 解码 token 获取 username 和 uid 字段
          const decodedToken = jwt_decode(token);
          const username = decodedToken.username;
          const uid = decodedToken.uid;
          // window.console.log(data.data.username);
          // window.console.log(uid);
          //存储 usrname uid 到 Vuex 和 localStorage 中 
          this.$store.commit('setUID', uid);
          localStorage.setItem('uid', uid);
         
          this.$store.commit('setUsername', username);
          localStorage.setItem('username', username);

        // 跳转到对应的页面
        this.$router.push({name:'index',params:{username,uid}});          
        } else {
          this.showErrorMessage  = '账号密码错误';
        
        }
      } catch (error) {
        this.showErrorMessage  = '账号密码错误';
        window.console.error(error);
      }
    },
  },

};
</script>


<style>
.el-header
.el-footer {
  background-color: #409eff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.el-footer {
  background-color: #909399;
  display: block;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.login {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
}

.login-card {
  width: 700px;
}

.login-title {
  font-size: 24px;
  text-align: center;
  /* padding: 20px 0; */
}

.login-form .el-form-item__label {
  font-size: 16px;
}

.login-button {
   margin-left: 44%;
}

.el-dialog {
  text-align: center;
}
.custom-dialog {
  text-align: center;
  width: 300px;
  border-radius: 8px;
}
</style>