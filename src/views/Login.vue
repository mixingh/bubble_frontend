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
        <el-button type="info" @click="showRegisterDialog = true">注册</el-button>
        <!-- <el-button plain @click="open2" type="primary" >点我获取示例用户名和密码</el-button> -->
      </el-form-item>
    </el-form>
    <el-dialog title="登录失败" :visible="showErrorMessage" @close="showErrorMessage = false" custom-class="custom-dialog">
      <p>请检查用户名和密码是否正确。</p>
    </el-dialog>
    <el-dialog title="注册新用户" :visible.sync="showRegisterDialog">
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
    <!-- 注册表单内容，例如用户名、密码等 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="registerForm.username" placeholder="设置用户名"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="registerForm.password" placeholder="设置密码"></el-input>
    </el-form-item>
    <!-- ......可能还有其他字段比如邮箱、确认密码等 -->
    <el-form-item>
      <el-button type="primary" @click="register">注册</el-button>
    </el-form-item>
  </el-form>
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
       // 新增注册表单数据
    registerForm: {
      username: '',
      password: ''
    },
    // 新增注册表单验证规则
    registerRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    },
    // 控制注册对话框显示的状态
    showRegisterDialog: false,
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

    // 新添加的注册方法
  async register() {
    try {
      await this.$refs.registerForm.validate();
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: this.registerForm.username,
          password: this.registerForm.password
        }),
      });
      if (response.ok) {
        // 注册成功后的逻辑，比如提示用户注册成功，关闭注册对话框等
        this.showRegisterDialog = false;
        this.$message.success('注册成功，请登录。');
      } else {
        // 注册失败的逻辑，比如显示错误信息
        this.$message.error('注册失败，请检查输入或重试。');
      }
    } catch (error) {
      this.$message.error('注册失败，请检查输入或重试。');
      window.console.error(error);
    }
  }
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
   display: flex;
   justify-content: center;
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