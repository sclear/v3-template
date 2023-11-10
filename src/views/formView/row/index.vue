<template>
  <ElCard>
    <template #header>
      <div>
        <p>栅格表单</p>
        <p class="text-14px">
          使用row对表单设置表单项所在格数, 也可单独对某一表单设置
        </p>
      </div>
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
      row: [24],
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
      type: "Select",
      label: "职业",
      model: "occupation",
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
      row: [24],
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
    sex: "",
    address: "",
    name: "",
    startTime: "",
    occupation: "",
    endTime: "",
  }),
  createRule(create) {
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
