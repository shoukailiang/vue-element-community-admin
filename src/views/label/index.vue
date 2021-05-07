<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="标签名称：" >
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称："  >
        <el-select v-model="query.categoryId" clearable filterable>
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData"  
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="openAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="标签名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="categoryName"
        label="分类名称"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="handleEdit(scope.row.id)"
            size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row.id)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>

    <!--  新增或编辑组件 -->
    <edit
      :title="edit.title"
      :visible="edit.visible"
      :formData="edit.formData"
      :remoteClose="remoteClose"
      :categoryList="categoryList"
    />
  </div>
</template>
<script>
import api from "@/api/label";
import categoryApi from "@/api/category";

import Edit from "./edit";

export default {
  name: "Lable", 

  components: { Edit },

  data() {
    return {
      list: [], // 封装列表数据

      page: {
        // 分页对象
        current: 1,
        size: 10,
        total: 0,
      },

      query: {}, //条件查询

      categoryList: [], // 正常状态的分类
      edit: {
        // 子组件引用属性对象
        title: "",
        visible: false,
        formData: {},
      },
    };
  },

  created() {
    this.fetchData();
    // 获取 正常 状态的分类列表数据
    this.getCategoryList();
  },

  methods: {
    async fetchData() {
      let response= await api.getList(this.query, this.page.current, this.page.size);
      if(response.code===20000){
        this.list = response.data.records;
        this.page.total = response.data.total;
      }else{
        this.$message({
          type:"error",
          message:"出错了"
        })
      }
    },

    async handleEdit(id) {
      // console.log('编辑', id)
      let response  = await api.getById(id);
      if (response.code === 20000) {
          // console.log(response.data)
          this.edit.formData = response.data;
          //弹出窗口
          this.edit.visible = true;
          this.edit.title = "编辑";
      }else{
        this.$message({
          type:"error",
          message:"出错了"
        })
      }
    },

    handleDelete(id) {
      // console.log('删除', id)
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除请求
          let response = await api.deleteById(id);
          this.$message({
            type: response.code === 20000 ? "success" : "error",
            message: response.message,
          });
          this.fetchData();
        })
        .catch(() => {
          console.log("取消")
        });
    },

    // 每页显示多少条改变后触发
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchData();
    },

    // 获取 正常 状态的分类列表数据
    async getCategoryList() {
      let response = await categoryApi.getNormalList();
      if(response.code===20000){
        this.categoryList = response.data;
      }else{
        this.$message({
          type:"error",
          message:"出错了"
        })
      }
    },

    queryData() {
      this.page.current = 1;
      this.fetchData();
    },

    reload() {
      this.query = {};
      this.fetchData();
    },

    openAdd() {
      this.getCategoryList();
      this.edit.visible = true;
      this.edit.title = "新增";
    },

    remoteClose() {
      this.edit.formData = {};
      this.edit.visible = false;
      this.fetchData();
    },
  },
};
</script>