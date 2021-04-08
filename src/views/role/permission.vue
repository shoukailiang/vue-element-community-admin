<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
  >
    <!-- v-loading 值为true 显示加载中 -->
    <el-form ref="formData" v-loading="loading" label-width="80px">
      <!-- 
                :data 绑定的渲染数据，数组
                show-checkbox 显示勾选框
                node-key 树节点的唯一标识属性名
                props 配置响应数据中对应展示的属性名 children 是子菜单的属性名，label显示的菜单名属性名
                :default-checked-keys 默认勾选的集合
                accordion 每次只能展开一个，会将之前展开把它隐藏
             -->
      <el-tree
        ref="tree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :props="{ children: 'children', label: 'name' }"
        accordion
      >
      </el-tree>

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
import menuApi from "@/api/menu";
import roleApi from "@/api/role";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    remoteClose: Function,

    roleId: null, // 角色id
  },

  data() {
    return {
      menuList: [], // 存储所有菜单
      loading: false, // 加载中, true 则显示加载中, false 不显示加载中
    };
  },

  watch: {
    visible(val) {
      if (val) {
        // visible=true 则加载所有菜单
        this.getMenuList();
      }
    },
  },

  methods: {
    // 获取所有菜单
    getMenuList() {
      // 加载中
      this.loading = true;
      menuApi.getList({}).then((response) => {
        // console.log('response.data', response.data)
        this.menuList = response.data;
        // 查询角色之前所拥有的菜单ids ,然后进行回显
        this.getMenuIdsByRoleId();
      });
      // 加载完成
      this.loading = false;
    },

    // 查询角色之前所拥有的菜单ids ,然后进行回显
    async getMenuIdsByRoleId() {
      const { data } = await roleApi.getMenuIdsByRoleId(this.roleId);
      // this.menuIds = data;
      // 循环出每个菜单id,然后找到菜单树中的节点对象
      data.forEach(id=>{
        // 获取节点对象
        const node =this.$refs.tree.getNode(id)
        // 判断是否为子节点，如果是子节点就选中 ，否则不勾选
        if(node.isLeaf){
          this.$refs.tree.setChecked(id,true);
        }
      })
    },

    submitForm(formName) {
      // 获取所有被选中的菜单id
      const checkedMenuIds = this.$refs.tree.getCheckedKeys();

      const checkedMenuParentIds = this.$refs.tree.getHalfCheckedKeys();

      const menuIds = checkedMenuParentIds.concat(checkedMenuIds);
      // 调用保存角色权限菜单接口
      roleApi.saveRoleMenu(this.roleId, menuIds).then((response) => {
        if (response.code === 20000) {
          this.$message({ message: "分配权限成功", type: "success" });
          //关闭窗口
          this.handleClose();
        } else {
          this.$message({ message: "分配权限失败", type: "error" });
        }
      });
    },

    // 关闭窗口
    handleClose() {
      this.menuList = [];
      this.remoteClose();
    },
  },
};
</script>