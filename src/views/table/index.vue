<template>
  <div>
    <div>
      <ElButton @click="search" type="primary">查询</ElButton>
    </div>
    <Table
      ref="tableRef"
      :createOption="tableOption"
      :search-params="{}"
      class="mt-2"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from "vue";
import { ElButton } from "element-plus";
import Table, { CreateTable } from "@/components/Table";

const tableRef = ref();

const search = () => {
  console.log("run");
  tableRef.value.run();
};

const tableOption = CreateTable({
  api: "list",
  column: [
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "birth",
      label: "出生日期",
    },
    {
      prop: "age",
      label: "年龄",
    },
    {
      prop: "xz",
      label: "星座",
    },
  ],
});
</script>
