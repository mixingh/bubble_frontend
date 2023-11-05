<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12" style="text-align: right;font-size: 18px">
          Blue便签<div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <span>{{ username }},你好</span>
          <el-button type="primary" round style="font-size: 18px" @click="logout" class="el-button">注销</el-button>
          <div class="grid-content bg-purple-light"></div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
    
    <el-row type="flex" justify="center">
      <el-col :xs="50" :span="12">
        <div class="l-divider__text.is-center">
          <el-divider>
            <h1>清单</h1>
          </el-divider>
          <TodoList></TodoList>
        </div>
      </el-col>
    </el-row>
  </el-main>
    <el-footer>riverk</el-footer>
    
  </el-container>
</template>


<script>
// import router from '@/router'; 
import jwt_decode from 'jwt-decode';
import TodoList from "@/components/TodoList.vue";
//import MessageBox from 'element-ui';


export default {
  name: "Index",
  components: {
    TodoList
  },
  data() {
    return {
      username: '',
      uid:''
    };
  },
  created() {
  // Check if token exists in local storage
  const token = localStorage.getItem('token');

  if (token) {
    // Extract and set the username from the decoded token
    const decodedToken = jwt_decode(token);
    if (decodedToken) {
      this.username = decodedToken.username;
      this.uid = decodedToken.uid;
    } else {
      // Token decoding failed, handle appropriately
      window.console.error('Token decoding failed');
    }
  } 
},
  methods: {
    logout() {
      // Clear the token from local storage and redirect to login
      this.$store.commit('setToken', '');
      localStorage.removeItem('token');
      this.$store.commit('setUID');
      localStorage.removeItem('uid');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #409eff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.login-prompt {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.el-footer {
  background-color: #909399;
  display: block;
  width: 100%;
  position: fixed;
  bottom: 0;
}

/* .el-button1 {
  margin-left: 1%;
} */
/* .bg-purple-light {
    background: #e5e9f2;
  } */


    .el-divider__text.is-center {
    left: 45%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}
/* .el-table td.is-center, .el-table th.is-center {
    left: 15%;
} */

</style>
