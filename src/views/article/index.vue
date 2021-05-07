<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form
      :inline="true"
      :model="query"
      size="mini"
    >
      <el-form-item label="文章标题:">
        <el-input v-model.trim="query.title"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select
          v-model="query.status"
          clearable
          filterable
          style="width: 120px"
        >
          <el-option label="已删除" :value="0"></el-option>
          <el-option label="未审核" :value="1"></el-option>
          <el-option label="审核通过" :value="2"></el-option>
          <el-option label="审核未通过" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- stripe 带斑马纹 -->
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="文章标题"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="viewCount"
        label="浏览数"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="thumhup"
        label="点赞数"
      ></el-table-column>
      <el-table-column align="center" prop="ispublic" label="是否公开">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
          <el-tag v-if="scope.row.ispublic === 1" type="warning">公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.status === 1" type="info">未审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateDate"
        label="最后更新时间"
        min-width="90px"
      >
        <template slot-scope="scope">
          {{ scope.row.updateDate|getFormat }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="210">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="openView(scope.row.id)"
            size="mini"
            >查看</el-button>
          <!-- 审核：只有status===1 才显示，其他不显示。删除：只有status !==0 才显示，其他不显示-->
          <el-button
            v-if="scope.row.status === 1"
            type="success"
            @click="openAudit(scope.row.id)"
            size="mini"
            >审核</el-button
          >

          <el-button
            v-if="scope.row.status !== 0"
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

    <audit
      :title="audit.title"
      :visible="audit.visible"
      :remoteClose="remoteClose"
      :id="audit.id"
      :isAudit="audit.isAudit"
    />

  </div>
</template>
<script>
import api from "@/api/article";

import { format } from "@/utils/date";

import Audit from "./audit";

export default {
  name: "Article", 
  components: { Audit },

  data() {
    return {
      list: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      query: {}, // 查询条件

      audit: {
        // 审核子组件传递的对象属性
        title: "",
        visible: false,
        id: null, // 文章id
        isAudit: true, // 是否打开的为审核页面，true审核，false查看
      },
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const { data } = await api.getList(
        this.query,
        this.page.current,
        this.page.size
      );
      this.list = data.records;
      this.page.total = data.total;
    },



    // 当每页显示多少条改变后触发
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchData();
    },
    // 切换页码触发
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchData();
    },

    queryData() {
      this.page.current = 1;
      this.fetchData();
    },

    reload() {
      this.query = {};
      this.fetchData();
    },

    openAudit(id) {
      // 文章id
      this.audit.id = id;
      // 标识为审核页面
      this.audit.isAudit = true;
      this.audit.title = "审核文章";
      this.audit.visible = true;
    },

    remoteClose() {
      this.audit.visible = false;
      this.fetchData();
    },

    openView(id) {
      // 文章id
      this.audit.id = id;
      // 标识为查看详情页
      this.audit.isAudit = false;
      this.audit.title = "文章详情";
      this.audit.visible = true;
    },

    handleDelete(id) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let response = await api.deleteById(id);
          this.$message({
            type: response.code === 20000 ? "success" : "error",
            message: response.message,
          });
          this.fetchData();
        })
        .catch(() => {
          console.log("点击取消")
        });
    },
  },
  filters:{
    getFormat(date) {
      return format(date);
    },
  }
};
</script>