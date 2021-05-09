<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="400px"
    :before-close="handleClose"
  >
    <el-form
      :rules="rules"
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 300px"
      status-icon
    >
      <el-form-item label="标签名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称：" prop="categoryId">
        <el-select v-model="formData.categoryId" clearable filterable>
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
        <el-button type="primary" @click="submitForm('formData')" size="mini"
          >确定</el-button
        >
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import api from "@/api/label";

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      // 提交表单数据
      type: Object,
      default: {},
    },
    categoryList: {
      // 正常状态的分类列表数据
      type: Array,
      default: [],
    },
    remoteClose: Function,
  },

  data() {
    return {
      rules: {
        name: [
          // 标签名称
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
        categoryId: [
          // 分类
          { required: true, message: "请选择分类名称", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    handleClose() {
      // 表单清空
      this.$refs["formData"].resetFields();
      this.remoteClose();
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交表单数据
          this.submitData();
        } else {
          return false;
        }
      });
    },

    async submitData() {
      let response = null;

      if (this.formData.id) {
        // 编辑
        response = await api.update(this.formData);
      } else {
        // 新增
        response = await api.add(this.formData);
      }

      if (response.code === 20000) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        // 关闭窗口
        this.handleClose();
      } else {
        this.$message({
          message: "保存失败",
          type: "error",
        });
      }
    },
  },
};
</script>