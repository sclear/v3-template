<template>
  <!-- <ElInput v-model="k"></ElInput> -->
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
</template>

<script lang="tsx" setup>
import { ref, Ref } from "vue";
import { ElButton, ElCard, ElInput, ElMessage } from "element-plus";
import Form, { CreateForm } from "@/components/Form/index";
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
      label: "vIfName",
      model: "showName",
      renderLabel() {
        return <div>title</div>;
      },
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
setTimeout(() => {
  searchFormVIf.data.value.showName = 0;
}, 5000);
setTimeout(() => {
  // searchFormVIf.data.value.vDisabledName = 1;
  searchFormVIf.data.value.showName = 1;
}, 10000);
const searchFormRefRender = ref();
const searchFormRender = CreateForm({
  form: [
    {
      align: "left",
      row: [24],
      render() {
        return <ElButton>Render Button(align left)</ElButton>;
      },
    },
    {
      align: "center",
      row: [24],
      render() {
        return <ElButton>Render Button(align center)</ElButton>;
      },
    },
    {
      align: "right",
      row: [24],
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
  labelWidth: 80,
  row: [6],
  form: [
    {
      type: "Input",
      label: "names",
      model: "obj",
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
    val: "",
    obj: "",
    startTime: "2023-11-22",
    endTime: "2023-11-23",
  }),
  createRule(create, data) {
    return {
      obj: create.required(),
      startTime: create.required(),
    };
  },
  onSuccess(done) {
    ElMessage({
      message: "success !!!",
      type: "success",
    });
  },
  onError() {
    ElMessage({
      message: "error !!!",
      type: "error",
    });
  },
});
// searchFormRule.api = ''
</script>
