<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12" style="text-align: right; font-size: 18px">
          <div class="grid-content bg-purple"></div>
          Blue待办事项
        </el-col>
        <el-col :span="12" style="text-align: right; font-size: 18px">
          <span>{{ username }} 你好</span>
          <span class="logout-text">|</span>
          <el-button
            type="text"
            @click="showLogoutConfirm"
            class="logout-button"
            style="color: #fff; font-size: 18px"
            >注销</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :xs="50" :span="24">
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
    <el-dialog
      title="确认退出"
      :visible.sync="logoutConfirmVisible"
      width="30%"
      @close="cancelLogout"
      custom-class="my-custom-dialog"
    >
      <span>确定要注销吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logout">确定</el-button>
        <el-button @click="cancelLogout">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Vue from 'vue';
import jwt_decode from "jwt-decode";
import TodoList from "@/components/TodoList.vue";
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$notify = Notification;
export default {
  name: "Index",
  components: {
    TodoList,
  },
  data() {
    return {
      username: "",
      uid: "",
      logoutConfirmVisible: false,
    };
  },
  created() {
  const token = localStorage.getItem("token");    
  if (token) {
    const decodedToken = jwt_decode(token);
    const current_time = Date.now() / 1000; // 获取当前时间的时间戳，并转换为秒

    if (decodedToken.exp < current_time) {
      // Token 已过期
      // 使用Element UI的Notification显示消息
      this.$notify({
        title: '会话过期',
        message: '会话已过期，请重新登录。',
        type: 'warning', // 通知类型为警告
        duration: 9000, // 显示持续时间，这里设置了5秒
        onClose: () => {
          this.$router.push('/login'); // 在Notification关闭时重定向到登录页面
        }
      });
    } else {
      // Token 仍然有效
      this.username = decodedToken.username;
      this.uid = decodedToken.uid;
    }
  }
},
  methods: {
    showLogoutConfirm() {
      this.logoutConfirmVisible = true;
    },
    logout() {
  this.axios.post('/v1/signout')
    .then(() => {
      // 注销成功
      this.clearSession(); // 清理session数据
      this.$router.push("/login"); // 重定向到登录页面
    })
    .catch(error => {
      // 注销失败，处理错误
      window.console.error('注销请求有问题:', error);

      // 使用Element UI的Notification显示错误
      this.$notify({
        title: '注销失败',
        message: '注销失败，请稍后再试。',
        type: 'error', // 通知类型为错误
        duration: 9000 // 显示持续时间
      });
    });
},
clearSession() {
  // 清除Vuex和localStorage中的数据
  this.$store.commit("setToken", "");
  localStorage.removeItem("token");
  this.$store.commit("setUID");
  localStorage.removeItem("uid");
  this.$store.commit("setuername");
  localStorage.removeItem("username");
},
    cancelLogout() {
      this.logoutConfirmVisible = false;
    },
  },
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

.el-footer {
  background-color: #909399;
  display: block;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.el-col {
  text-align: center;
}

.l-divider__text.is-center {
  text-align: center;
}

.el-main {
  padding: 10px;
}

.logout-button {
  margin-left: 1px;
}

.logout-text {
  margin-left: 1px;
  margin-right: 1px;
  color: #fff;
}

.logout-button:hover {
  color: #409eff;
}

@media (max-width: 768px) {
  .el-header {
    font-size: 16px;
  }
}


</style>
