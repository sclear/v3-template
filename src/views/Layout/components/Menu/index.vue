<template>
  <div class="w-full relative z-20 el-menu-height">
    <ElMenu
      :default-active="setting.currentTab"
      :router="true"
      :collapse="setting.isCollapse"
      @open="handleOpen"
      @close="handleClose"
      background-color="#ffffff"
      class="el-menu-vertical-demo"
      active-text-color="#505CAB"
      text-color="#413d3d"
    >
      <MenuItem :menus="setting.menus" />
    </ElMenu>
    <div
      @click="setting.changeCollapse"
      class="absolute left-0px bottom-0px w-full h-40px lh-40px bg-#E4EFFF c-#333333 cursor-pointer"
    >
      {{ !setting.isCollapse ? "《" : "》" }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMenu, ElIcon } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import MenuItem from "./menuItem";
import { useSetting } from "@/store/setting";

const setting = useSetting();

const handleOpen = (key: string, keyPath: string[]) => {};

const handleClose = (key: string, keyPath: string[]) => {};

onMounted(() => {
  // setting.initRoute();
});
</script>

<style lang="less">
.el-menu-height {
  // width: 200px;
  // color: #413d3d;
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
