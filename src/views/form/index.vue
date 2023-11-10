<template>
  <!-- <ElInput v-model="k"></ElInput> -->
  <div>
    <ElCard>
      <template #header> basics </template>
      <Form ref="searchFormRef" :createOption="searchForm" />
    </ElCard>
    <ElCard class="mt-2">
      <template #header> vIf / vDisabled </template>
      <Form ref="searchFormRefVIf" :createOption="searchFormVIf" />
    </ElCard>
    <ElCard class="mt-2">
      <template #header> Render </template>
      <Form ref="searchFormRefRender" :createOption="searchFormRender" />
    </ElCard>
    <ElCard class="mt-2">
      <template #header> Render FormItem </template>
      <Form
        ref="searchFormRefRenderFormItem"
        :createOption="searchFormRenderFormItem"
      />
    </ElCard>
    <ElCard class="mt-2 mb-10">
      <template #header> validate rules </template>
      <Form ref="searchFormRefRule" :createOption="searchFormRule" />
    </ElCard>
  </div>
</template>

<script lang="tsx" setup>
import { ref, Ref } from "vue";
import { ElButton, ElCard, ElInput, ElMessage } from "element-plus";
import { Form, CreateForm } from "@/entry";
import { omit } from "@/tools/util";

const searchFormRef = ref();

const searchForm = CreateForm({
  form({ data, vFor }) {
    return [
      ...vFor(data.arr, (item, index) => {
        return {
          row: [12],
          children: [
            {
              type: "Input",
              label: "vFor",
              model: `arr.${index}.name`,
              row: [8],
              createRule(create) {
                return create.required();
              },
            },
            {
              type: "Input",
              label: "vFor",
              model: `arr.${index}.name`,
              row: [8],
              createRule(create) {
                return create.required();
              },
            },
            {
              row: [2, 1],
              render() {
                return (
                  <ElButton
                    onClick={() => {
                      data.arr.push({
                        name: 6,
                        age: 6,
                      });
                    }}
                  >
                    submit
                  </ElButton>
                );
              },
            },
          ],
        };
      }),
      {
        render() {
          return (
            <ElButton onClick={() => searchForm.validate()}>submit</ElButton>
          );
        },
      },
    ];
  },
  data: ref({
    arr: [
      { name: 1, age: 29 },
      { name: 2, age: 18 },
      { name: 4, age: 100 },
    ],
  }),
  onSuccess() {
    console.log("success");
  },
  onError() {
    console.log("error");
  },
});

const searchFormRefVIf = ref();
const searchFormVIf = CreateForm({
  omit: ["name"],
  form: [
    {
      type: "Select",
      label: "vIfName12",
      model: "showName",
      dataSource: [
        {
          value: 1,
          label: "true",
        },
        {
          value: 0,
          label: "false",
        },
      ],
      row: [8],
    },
    {
      type: "Input",
      label: "name",
      model: "name",
      row: [8],
      vIf({ data }) {
        return data.showName === 1;
      },
      vDisabled({ data }) {
        return data.vDisabledName === 1;
      },
    },
    {
      type: "Select",
      label: "vDisabledName",
      model: "vDisabledName",
      dataSource: [
        {
          value: 1,
          label: "true",
        },
        {
          value: 0,
          label: "false",
        },
      ],
      row: [8],
    },
  ],
  data: ref({
    name: 0,
    showName: 1,
    vDisabledName: 0,
  }),
});
const searchFormRefRender = ref();
const searchFormRender = CreateForm({
  wrapperCol: {
    md: 24,
    lg: 8,
  },
  form: [
    {
      align: "left",
      render() {
        return <ElButton>Render Button(align left)</ElButton>;
      },
    },
    {
      align: "center",
      render() {
        return <ElButton>Render Button(align center)</ElButton>;
      },
    },
    {
      align: "right",
      render() {
        return <ElButton>Render Button(align right)</ElButton>;
      },
    },
  ],
  data: ref({}),
});

const searchFormRefRenderFormItem = ref();
const searchFormRenderFormItem = CreateForm({
  form: [
    {
      row: [6],
      render({ data }) {
        return data.val;
      },
    },
    {
      row: [6],
      label: "val",
      model: "val",
      type: "Input",
      onChange({ value, data }) {
        console.log(value);
        console.log(data);
      },
      // renderFormItem({ data }) {
      //   return <ElInput v-model={data.val}></ElInput>;
      // },
    },
  ],
  data: ref({
    val: "Please Input",
  }),
});
setTimeout(() => {
  searchFormRenderFormItem.data.value.val = "234234";
}, 5000);
const searchFormRefRule = ref();
const searchFormRule = CreateForm({
  row: [6],
  form: [
    {
      type: "Input",
      label: "name",
      model: "name",
    },
    {
      type: "Select",
      label: "sex",
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
      type: "DateRangePicker",
      label: "时间",
      model: ["startTime", "endTime"],
    },
    {
      align: "right",
      render() {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                searchFormRefRule.value.validate();
              }}
            >
              submit
            </ElButton>
          </>
        );
      },
    },
  ],
  data: ref({
    sex: "",
    name: "",
    startTime: "",
    endTime: "",
  }),
  createRule(create, data) {
    return {
      sex: create.required(),
      startTime: create.required(),
    };
  },
});
// searchFormRule.api = ''
</script>
