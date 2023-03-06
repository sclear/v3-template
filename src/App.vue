<template>
  <ElConfigProvider :locale="zhCn">
    <router-view class="h-100vh" />
  </ElConfigProvider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
</script>
<style lang="less">
html,
body,
.app {
  height: 100vh;
  width: 100%;
}
</style>
