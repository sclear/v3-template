<template>
  <ElCard>
    <template #header>
      <p>高级表单</p>
      <p class="text-14px">
        演示vIf实现显隐效果，演示vDisabled实现禁用效果，演示render渲染自定义元素
      </p>
    </template>
    <Form :createOption="searchFormRule" />
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
      type: "Select",
      label: "性别",
      model: "sex",
      dataSource: [
        {
          value: 0,
          label: "男",
        },
        {
          value: 1,
          label: "女",
        },
      ],
    },
    {
      align: "center",
      render() {
        return "该行仅在性别为男时显示";
      },
      vIf({ data }) {
        return data.sex === 0;
      },
    },
    {
      type: "Input",
      label: "联系方式",
      model: "phone",
    },
    {
      type: "Select",
      label: "职业",
      model: "occupation",
      placeholder: "在输入联系方式后该项被禁用",
      vDisabled({ data }) {
        return !!data.phone;
      },
      dataSource: [
        {
          value: 0,
          label: "战士",
        },
        {
          value: 1,
          label: "法师",
        },
        {
          value: 2,
          label: "射手",
        },
        {
          value: 3,
          label: "辅助",
        },
        {
          value: 4,
          label: "刺客",
        },
      ],
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
      type: "Radio",
      label: "婚姻状态",
      model: "single",
      dataSource: [
        {
          value: 0,
          label: "已婚",
        },
        {
          value: 1,
          label: "未婚",
        },
      ],
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
    sex: 0,
    address: "",
    name: "",
    startTime: "",
    occupation: "",
    phone: "",
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
