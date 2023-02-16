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
import Form, { CreateFormOption } from "@/components/Form/index";
import { omit } from "@/tools/util";

const searchFormRef = ref();

const searchForm = CreateFormOption({
  form(data) {
    return [
      ...data.phone.split(",").map((item) => {
        return {
          type: "Input" as const,
          label: "VFor",
          model: "phone",
          row: [8],
        };
      }),
      {
        type: "Input",
        label: "phone",
        model: "phone",
        row: [8],
      },
    ];
  },
  // form: [
  //   {
  //     type: "Input",
  //     label: "name",
  //     model: "name",
  //     row: [8],
  //   },
  //   {
  //     type: "Input",
  //     label: "phone",
  //     model: "phone",
  //     row: [8],
  //   },
  //   {
  //     type: "Input",
  //     label: "idCard",
  //     model: "idCard",
  //     row: [8],
  //   },
  //   {
  //     type: "Select",
  //     label: "sex",
  //     model: "sex",
  //     dataSource: [
  //       {
  //         value: 0,
  //         label: "男",
  //       },
  //       {
  //         value: 1,
  //         label: "女",
  //       },
  //     ],
  // row: [8],
  // },
  //   {
  //     type: "DatePicker",
  //     label: "birth",
  //     model: "birth",
  //     defaultValue(data) {
  //       return [data.value.sDate, data.value.eDate];
  //     },
  //     onChange({ data, value }) {
  //       data.value.sDate = value[0];
  //       data.value.eDate = value[1];
  //     },
  //     row: [8],
  //     customProps: {
  //       type: "daterange",
  //       rangeSeparator: "To",
  //       startPlaceholder: "Startdate",
  //       endPlaceholder: "End date",
  //     },
  //   },
  //   {
  //     row: [24],
  //     align: "center",
  //     render() {
  //       return (
  //         <>
  //           <ElButton
  //             type="info"
  //             onClick={() => {
  //               searchFormRef.value.reset();
  //             }}
  //           >
  //             Reset
  //           </ElButton>
  //           <ElButton
  //             onClick={() => {
  //               ElMessage({
  //                 message: "Search success !!!",
  //                 type: "success",
  //               });
  //             }}
  //           >
  //             Search
  //           </ElButton>
  //         </>
  //       );
  //     },
  //   },
  // ],
  data: ref({
    name: "",
    age: "",
    idCard: "",
    birth: "",
    phone: "wer,wer,wer,ew",
    sDate: "2022-12-07",
    eDate: '"2199-12-09"',
    arr: [],
  }),
});

const searchFormRefVIf = ref();
const searchFormVIf = CreateFormOption({
  form: [
    {
      type: "Select",
      label: "vIfName",
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
      vIf({ data, value }) {
        return data.value.showName === 1;
      },
      vDisabled({ data }) {
        return data.value.vDisabledName === 1;
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
    name: "",
    showName: 1,
    vDisabledName: undefined,
  }),
});
const searchFormRefRender = ref();
const searchFormRender = CreateFormOption({
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
const searchFormRenderFormItem = CreateFormOption({
  form: [
    {
      row: [6],
      render() {
        return <div>{searchFormRenderFormItem.data.value.val}</div>;
      },
    },
    {
      row: [6],
      label: "value",
      model: "value",
      renderFormItem(model, data) {
        return <ElInput v-model={data.value.val}></ElInput>;
      },
    },
  ],
  data: ref({
    val: "Please Input",
  }),
});
const searchFormRefRule = ref();
const searchFormRule = CreateFormOption({
  form: [
    {
      type: "Input",
      label: "names",
      model: "obj.link.0.name",
      row: [8],
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
      row: [8],
    },
    {
      row: [8],
      align: "center",
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
  api: "update",
  data: ref({
    val: "Please Input",
    obj: {
      link: [
        {
          o: "",
        },
      ],
    },
  }),
  requestData(data, api) {
    return {
      data: {},
      urlParams: "",
      // successMessage: ""
    };
  },
  createRule(create, data) {
    return {
      "obj.link.0.name": create.required(),
      phone: create.equal(data, "val", "obj"),
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
