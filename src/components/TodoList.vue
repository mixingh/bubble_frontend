<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="16" :offset="2">
        <el-input v-model="newTitle" size placeholder="请输入待办事项..." />
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          circle
        ></el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column
        align="center"
        label="待办事项"
        prop="title"
      ></el-table-column>

      <el-table-column
        prop="CreatedAt"
        label="创建时间"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.CreatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEditContent(scope.$index, scope.row)"
            circle
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            v-show="!scope.row.status"
            @click="handleEdit(scope.$index, scope.row)"
            circle
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-refresh-left"
            v-show="scope.row.status"
            @click="handleEdit(scope.$index, scope.row)"
            circle
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="handleDelete(scope.$index, scope.row.ID)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑待办事项" :visible.sync="dialogVisible" width="30%">
      <el-input
        v-model="editingContent"
        placeholder="请输入待办事项内容..."
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateContent"
            >保存</el-button
          >
        </div>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import moment from 'moment';
import { mapState } from "vuex";
export default {
  name: "TodoList",
  data() {
    return {
      tableData: [],
      newTitle: "",
      dialogVisible: false,
      editingContent: "",
      editingRow: null, // 在此处初始化
    };
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
      return '';
    }
  },
  mounted() {
    this.getTodoList();
  },
  computed: {
  ...mapState(['uid'])
},
  methods: {
    //编辑内容
    handleEditContent(_index, row) {
      if (row.hasOwnProperty("ID")) {
        window.console.log(row); // 打印 row 对象以便确认它是否包含 id 属性
        this.editingRow = row;
        this.editingContent = row.title;
        this.dialogVisible = true;
      } else {
        window.console.log("Row 对象没有 id 属性");
      }
    },
    //编辑好的内容更新到服务器
    handleUpdateContent() {
      const token = localStorage.getItem("token");
      this.axios
        .put(
          "/v1/todo/" + this.editingRow.ID,
          {
            title: this.editingContent,
          },
          {
            headers: {
              token: `${token}`,
            },
          }
        )
        .then(() => {
          this.editingRow.title = this.editingContent;
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            duration: 1500,
            message: "更新待办事项成功",
            type: "success",
          });
        });
    },
    tableRowClassName({ row }) {
      if (row.status) {
        return "success-row";
      } else {
        return "";
      }
    },
    //根据UID获取待办事项内容
    getTodoList() {
      this.axios
        .get("/v1/todo/" + this.uid)
        .then((response) => {
          //window.console.log(response.data); // 输出完整的响应数据
          this.tableData = response.data;
          //this.tableData = [todo]; // 将单个待办事项对象包装在数组中
        })
        .catch((error) => {
          window.console.error(error);
        });
    },
    handleEdit(index, row) {
      let messageSuffix = row.status ? " 置为未完成" : " 置为已完成";
      this.axios
        .put(
          "/v1/todo/" + row.ID,
          {
            status: !row.status,
          }
        )
        .then(() => {
          this.tableData[index].status = !row.status;
          this.$message({
            showClose: true,
            duration: 1500,
            message: `<${row.title}> ${messageSuffix}`,
            type: "success",
          });
        });
    },
    handleDelete(index, ID) {
      this.axios
        .delete("/v1/todo/" + ID)
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            showClose: true,
            duration: 1500,
            message: "删除待办事项成功",
            type: "success",
          });
        });
    },
    handleAdd() {
      if (this.newTitle !== "" && !isNaN(this.uid)) {
        this.axios
          .post(
            "/v1/todo/",
            {
              title: this.newTitle,
            }
          )
          .then(() => {
            this.getTodoList();
            this.$message({
              showClose: true,
              duration: 1500,
              message: "添加待办事项成功",
              type: "success",
            });
          });
        this.newTitle = "";
      } else {
        this.$message({
          showClose: true,
          duration: 1500,
          message: "title不能为空哦",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  text-decoration: line-through;
}
</style>