<template>
  <div class="dashboard-container">
    <!-- 面板统计组件 -->
    <panel-group
      :userTotal="userTotal"
      :articleTotal="articleTotal"
      :questionTotal="questionTotal"
    />

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <!-- 饼状图：各技术频道文章统计 -->
          <pie-chart
            v-if="flag"
            :legendData="categoryTotal.nameList"
            :seriesData="categoryTotal.nameAndValueList"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
          <!-- 
            注意：echarts 在初始化实例的时候就要拿到数据，有数据就会展示出来
           -->
          <!-- 饼状图：各技术频道文章统计 -->
          <bar-chart
            v-if="flag"
            :xAxisData="monthArticleTotal.yearMonthList"
            :seriesData="monthArticleTotal.aritcleTotalList"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import PanelGroup from "./components/PanelGroup";

// 1. 导入home.js
import api from "@/api/home";

export default {
  name: "DashBoard",
  components: { PieChart, BarChart, PanelGroup },

  data() {
    return {
      userTotal: 0, // 总用户
      articleTotal: 0, //总文章
      questionTotal: 0, // 总提问

      flag: false, // 判断是否显示图表组件
      categoryTotal: {}, // 每个分类下的文章数
      monthArticleTotal: {}, // 查询近6个月发布文章数
    };
  },

  mounted() {
    // 查询面板中相关的总记录数
    this.getTotal();
    // 统计各技术频道文章数和近6个月发布文章数
    this.getAricleTotal();
  },

  methods: {
    async getTotal() {
      //查询总用户。 data取别名userTotal
      const { data: userTotal } = await api.getUserTotal();
      this.userTotal = userTotal;

      // 总文章
      const { data: articleTotal } = await api.getArticleTotal();
      this.articleTotal = articleTotal;

      // 总提问
      const { data: questionTotal } = await api.getQuestionTotal();
      this.questionTotal = questionTotal;
    },

    async getAricleTotal() {
      // 统计各技术频道文章数
      const { data: categoryTotal } = await api.getCategoryTotal();
      this.categoryTotal = categoryTotal;

      // 近6个月发布文章数
      const { data: monthArticleTotal } = await api.getMonthArticleTotal();
      this.monthArticleTotal = monthArticleTotal;

      // 先查询到数据后，再加载图表组件，将数据渲染，
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
