<template>
  <div class="page-container box-border">
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  box-sizing: border-box;
  height: calc(100vh - 105px);
  overflow-y: auto;
  padding: 15px 15px 0 15px;
}
</style>
