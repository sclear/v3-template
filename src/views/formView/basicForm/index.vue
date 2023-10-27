<template>
  <ElCard>
    <template #header> 基础使用 </template>
    <Form ref="searchFormRef" :createOption="searchFormRule" />
  </ElCard>
</template>

<script lang="tsx" setup>
import { ref } from "vue";
import { ElButton, ElCard } from "element-plus";
import { Form, CreateForm } from "@/entry";

const searchFormRule = CreateForm({
  row: [12],
  form: [
    {
      type: "Input",
      label: "姓名",
      model: "name",
    },
    {
      type: "Input",
      label: "所在区域",
      model: "address",
    },
    {
      type: "Input",
      label: "联系方式",
      model: "phone",
    },
    {
      type: "Dict",
      label: "性别",
      model: "sex",
      dataSource: "1",
    },
    {
      type: "Dict",
      label: "职业",
      model: "occupation",
      dataSource: "2",
    },
    {
      type: "DateRangePicker",
      label: "职业起始",
      model: ["startTime", "endTime"],
    },
    {
      type: "InputNumber",
      label: "工作年限(年)",
      model: "workTime",
    },
    {
      type: "Dict",
      label: "婚姻状态",
      model: "single",
      dataSource: "3",
    },

    {
      row: [24],
      align: "center",
      render() {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                searchFormRule.validate();
              }}
            >
              Submit
            </ElButton>
            <ElButton
              onClick={() => {
                searchFormRule.reset();
              }}
            >
              Reset
            </ElButton>
          </>
        );
      },
    },
  ],
  data: ref({
    sex: "",
    address: "",
    name: "",
    startTime: "",
    occupation: "",
    endTime: "",
  }),
  createRule(create, data) {
    return {
      name: create.required(),
      address: create.required(),
      phone: create.required().phone(),
      sex: create.required(),
      occupation: create.required(),
      startTime: create.required(),
    };
  },
});
</script>
