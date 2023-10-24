<template>
  <div class="text-center h-15 lh-15 c-white flex">
    <div class="w-200px">FastCrud</div>
    <div class="flex-1 flex items-center justify-end">
      <div>
        <ElTooltip content="退出">
          <ElIcon class="cursor-pointer">
            <SwitchButton @click="logout"></SwitchButton>
          </ElIcon>
        </ElTooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElIcon, ElTooltip } from "element-plus";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  SwitchButton,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();

function logout() {
  sessionStorage.clear();
  router.push("/login");
  setTimeout(() => {
    location.reload();
  }, 200);
}
</script>
