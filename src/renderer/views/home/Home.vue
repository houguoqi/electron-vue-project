<template>
  <el-container>
    <el-header>
      <el-menu
        router
        default-active="/upload-file"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
          <el-menu-item index="/upload-file">压缩图片</el-menu-item>
          <el-menu-item index="/mark-down-note">工作台</el-menu-item>
          <el-menu-item index="/user-record">消息中心</el-menu-item>
          <el-menu-item v-if="userInfo" index="4" disabled>Hello, {{userInfo.username}}</el-menu-item>
      </el-menu>
    </el-header>
    <el-main><router-view></router-view></el-main>
  </el-container>
</template>
<script>
export default {
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    if (window.localStorage.getItem('userInfo')) {
      this.$store.commit("app/SET_USERINFO", JSON.parse(window.localStorage.getItem('userInfo')))
    }
    if (window.localStorage.getItem('token')) {
      this.$store.commit("app/SET_TOKEN", window.localStorage.getItem('token'))
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style scoped>
.el-header {
  padding: 0;
}
.mine {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -50%;
  color: #fff;
  z-index: 9;
}
</style>