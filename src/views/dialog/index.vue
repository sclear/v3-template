<script lang="tsx" setup>
import { ref } from "vue";
import { ElButton } from "element-plus";
import Dialog from "@/components/Dialog";

const dialogRef = ref();

const openDialog = () => {
  dialogRef.value.open();
};

const close = (done: () => void) => {
  setTimeout(() => {
    done();
  }, 3000);
};
</script>

<template>
  <Dialog
    confirmText="Yes"
    cancelText="No"
    :width="900"
    :confirm="close"
    ref="dialogRef"
  >
    点击Yes 3s后关闭
  </Dialog>
  <ElButton @click="openDialog">show Dialog</ElButton>
</template>
