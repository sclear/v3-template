<template>
  <ElContainer class="h-100vh">
    <ElHeader>
      <Header />
    </ElHeader>
    <ElContainer>
      <ElAside width="auto">
        <Menu />
      </ElAside>
      <ElMain>
        <Tabs />
        <Container />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts" setup>
import { ElContainer, ElAside, ElMain, ElHeader } from "element-plus";
import Menu from "./components/Menu/index.vue";
import Header from "./components/Header/index.vue";
import Tabs from "./components/Tabs/index.vue";
import Container from "./components/Container/index.vue";
</script>

<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
// .container {
//   height: 100vh;
// }
.el-header {
  background-color: var(--el-color-primary-light-3) !important;
  //   color: #333;
  text-align: center;
  line-height: 60px;
  height: 60px;
  padding: 0;
}

.el-aside {
  text-align: center;
  // line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}
</style>
