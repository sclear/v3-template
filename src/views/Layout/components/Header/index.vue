<template>
  <div class="text-center h-15 lh-15 c-white flex">
    <div class="w-200px">FastCrud</div>
    <div class="flex-1 flex items-center justify-end pr-4">
      <ElDropdown @command="handleCommand">
        <i
          class="iconfont icon-zhutiqiehuan text-20px c-white mr-4 cursor-pointer"
        ></i>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="item in list"
              :command="item.value"
              :key="item.value"
              >{{ item.label }}</ElDropdownItem
            >
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <div class="mr-5">
        <ElTooltip :content="isFullscreen ? '退出全屏' : '全屏'">
          <ElIcon class="cursor-pointer">
            <i
              class="iconfont"
              :class="!isFullscreen ? 'icon-quanping' : 'icon-screen-half_line'"
              @click="toggle"
            ></i>
          </ElIcon>
        </ElTooltip>
      </div>

      <div class="mr-5">
        <ElTooltip content="github">
          <ElIcon class="cursor-pointer">
            <i
              class="iconfont icon-github"
              @click="lineOut('//github.com/sclear/fast-crud')"
            ></i>
          </ElIcon>
        </ElTooltip>
      </div>

      <div class="mr-5">
        <ElTooltip content="查看文档">
          <ElIcon class="cursor-pointer">
            <i
              class="iconfont icon-wendang1"
              @click="lineOut('//sclear.github.io/fastcrud/')"
            ></i>
          </ElIcon>
        </ElTooltip>
      </div>

      <ElDropdown @command="userhandle">
        <div class="flex items-center">
          <img
            class="rd-50% w-40px cursor-pointer"
            src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg"
          />
          <div class="c-white ml-2">西施</div>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="1">个人中心</ElDropdownItem>
            <ElDropdownItem command="2">退出</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<script setup lang="tsx">
import {
  ElIcon,
  ElTooltip,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { useRouter } from "vue-router";
import { useFullscreen } from "@vueuse/core";
import { useTheme, Theme } from "@/hook/useTheme";

const { isFullscreen, toggle } = useFullscreen();
const { list, set } = useTheme();

function logout() {
  sessionStorage.clear();
  router.push("/login");
  setTimeout(() => {
    location.reload();
  }, 200);
}

function lineOut(url: string) {
  window.open(url, "_blank");
}

function handleCommand(command: Theme) {
  set(command);
}
function userhandle(command: "1" | "2") {
  if (command === "2") {
    logout();
  } else {
    router.push("/center");
  }
}

const router = useRouter();
</script>
