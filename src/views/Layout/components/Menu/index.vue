<template>
  <div class="w-full relative z-20 el-menu-height">
    <ElMenu
      :default-active="setting.currentTab"
      :router="true"
      :collapse="setting.isCollapse"
      @open="handleOpen"
      @close="handleClose"
      unique-opened
      background-color="#ffffff"
      class="el-menu-vertical-demo"
      active-text-color="#505CAB"
      text-color="#413d3d"
    >
      <MenuItem :menus="setting.menus" />
    </ElMenu>
    <div
      @click="setting.changeCollapse"
      class="collapse absolute overflow-hidden left-0px bottom-0px w-full h-25px lh-25px bg-red c-#505CAB cursor-pointer"
    >
      <i
        class="iconfont"
        :class="setting.isCollapse ? 'icon-E' : 'icon-zuo'"
      ></i>
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

.el-menu-item.is-active {
  background-color: var(--el-color-primary-light-9) !important;
  border-right: 2px solid var(--el-color-primary);
  color: var(--el-color-primary) !important;
}
.el-menu-item:hover {
  background-color: var(--el-color-primary-light-9) !important;
  border-right: 2px solid var(--el-color-primary);
  color: var(--el-color-primary) !important;
}
.el-sub-menu__title:hover {
  background-color: var(--el-color-primary-light-9) !important;
  border-right: 2px solid var(--el-color-primary);
  color: var(--el-color-primary) !important;
}
.el-menu-height:hover .collapse {
  opacity: 1;
}
.collapse {
  opacity: 0;
  transition: all 0.6s linear;
  background-color: var(--el-color-primary-light-9) !important;
  i {
    color: var(--el-color-primary);
  }
}
</style>
