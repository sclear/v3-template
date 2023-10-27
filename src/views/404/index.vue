<template>
  <h1 class="h-full text-center mt-40vh">Not Found</h1>
  <div class="text-center mt-5">
    <ElButton @click="back" type="info">back</ElButton>
  </div>
</template>

<script setup>
import { ElButton } from "element-plus";

function back() {
  history.back();
}
</script>
