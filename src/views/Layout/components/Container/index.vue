<template>
  <div class="page-container box-border relative overflow-x-hidden">
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  box-sizing: border-box;
  height: calc(100vh - 105px);
  overflow-y: auto;
  padding: 15px 15px 0 15px;
  background-color: #f0f2f5;
}

// 透明度
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 幻灯片
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s linear;
  width: 100%;
}

.slide-enter-to {
  position: absolute;
  right: 0;
}

.slide-enter-from {
  position: absolute;
  // right: -1193px;
  right: -100%;
}

.slide-leave-to {
  position: absolute;
  left: -100%;
}

.slide-leave-from {
  position: absolute;
  left: 0;
}

//  缩放
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-to {
  opacity: 1;
  transform: scale(1);
  height: 100%;
}

.scale-leave-from {
  opacity: 1;
  transform: scale(1);
  height: 100%;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0);
  height: 100%;
}
.scale-leave-to {
  opacity: 0;
  transform: scale(0);
  height: 0;
}

// 组合动画
.scale-slide-enter-active,
.scale-slide-leave-active {
  position: absolute;
  transition: all 0.85s ease;
}

.scale-slide-enter-from {
  left: -100%;
}

.scale-slide-enter-to {
  left: 0%;
}

.scale-slide-leave-from {
  transform: scale(1);
}

.scale-slide-leave-to {
  transform: scale(0.8);
}
</style>
