<template>
  <div class="w-full relative el-menu-height">
    <ElMenu
      :default-active="setting.currentTab"
      :router="true"
      :collapse="setting.isCollapse"
      @open="handleOpen"
      @close="handleClose"
      class="el-menu-vertical-demo"
    >
      <MenuItem :menus="setting.menus" />
    </ElMenu>
    <div
      @click="setting.changeCollapse"
      class="absolute left-0px bottom-0px w-full h-40px lh-40px bg-#E4EFFF cursor-pointer"
    >
      {{ !setting.isCollapse ? "《" : "》" }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMenu, ElIcon } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import MenuItem from "./menuItem";
import { useSetting } from "@/store/setting";

const setting = useSetting();

const isCollapse = ref(false);

const handleOpen = (key: string, keyPath: string[]) => {};

const handleClose = (key: string, keyPath: string[]) => {};
</script>

<style lang="less">
.el-menu-height {
  // width: 200px;
  min-height: calc(100vh - 60px) !important;
}
.w-full {
  & > .el-menu {
    min-height: calc(100vh - 60px) !important;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
