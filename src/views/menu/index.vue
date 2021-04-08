<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="菜单名称："  v-permission="'menu:search'"> 
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData" 
        v-permission="'menu:search'"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- row-key="id" 指定唯一标识的属性名，其中数据要包含children才会被渲染为树状 -->
    <el-table row-key="id" :data="list" stripe border style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="url"
        label="请求地址"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="code"
        label="权限标识"
      ></el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">
          <!-- 1目录，2菜单，3按钮 -->
          <span v-if="scope.row.type === 1">目录</span>
          <span v-if="scope.row.type === 2">菜单</span>
          <span v-if="scope.row.type === 3">按钮</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="icon" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from "@/api/menu";

export default {
  name: "Menu", // 和对应路由表中配置的name值一致
  data() {
    return {
      list: [], // 列表数据
      query: {}, // 查询条件
      edit: {
        title: "",
        visible: false,
        formData: {},
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await api.getList(this.query);
      this.list = data;
    },
    // 重置
    reload() {
      this.query = {};
      this.fetchData();
    },
  },
};
</script>