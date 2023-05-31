<template>
  <!-- {{ searchForm.omitData }} -->
  <Form ref="searchFormRef" :createOption="searchForm" />
  <Table
    ref="tableRef"
    :createOption="tableOption"
    :search-params="searchForm.omitData"
    class="mt-2"
  >
    <Dialog :width="900" ref="dialogRef">
      <Form :freeze="true" :createOption="dialogForm" />
    </Dialog>
  </Table>
</template>

<script lang="tsx" setup>
import { ElMessage, ElCard, ElRow, ElCol } from "element-plus";
import { ref, computed } from "vue";
import { ElButton, ElInput } from "element-plus";
import Table, { CreateTableOption } from "./../../components/Table";
import Form, { CreateFormOption } from "./../../components/Form/index";
import Dialog from "./../../components/Dialog";
import { useServer } from "./../../hook/useServer";
import { omit } from "lodash";
// import qs from 'qs'

const dialogRef = ref();
const searchFormRef = ref();
const tableRef = ref();

const searchForm = CreateFormOption({
  tableRef,
  omit: ["name"],
  form: [
    {
      type: "Input",
      label: "姓名",
      model: "name",
      row: [8],
    },
    {
      type: "Input",
      label: "电话号码",
      model: "phone",
      row: [8],
    },
    {
      type: "Input",
      label: "身份证号",
      model: "idCard",
      row: [8],
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
      row: [8],
    },
    {
      type: "DatePicker",
      label: "出生日期",
      model: "birth",
      row: [8],
    },
    {
      row: [8],
      align: "right",
      render() {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                dialogForm.data.value = {
                  name: "",
                  phone: "",
                  idCard: "",
                  birth: "",
                  age: "",
                };
                dialogRef.value.open({
                  title: "新增用户",
                  disabled: false,
                });
              }}
            >
              新增
            </ElButton>
            <ElButton
              type="info"
              onClick={() => {
                searchFormRef.value.reset();
              }}
            >
              重置
            </ElButton>
            <ElButton
              type="success"
              onClick={() => {
                tableRef.value.run();
              }}
            >
              查询
            </ElButton>
          </>
        );
      },
    },
  ],
  data: ref({
    name: "",
    age: "111",
    idCard: "",
    birth: "",
    phone: "",
  }),
  createRule(create) {
    return {
      "obj.link.0.name": create.required(),
      name1: create.required(),
    };
  },
  // labelWidth: 80,
});

const dialogForm = CreateFormOption({
  disabled: ref(false),
  form: [
    {
      type: "Input",
      label: "姓名",
      model: "name",
      row: [12],
    },
    {
      children: [
        {
          type: "Input",
          label: "name1",
          model: "name1",
          row: [12],
          createRule(create) {
            return create.required().phone();
          },
        },
        {
          type: "Input",
          label: "name2",
          model: "name2",
          row: [12],
        },
      ],
    },
    {
      type: "Input",
      label: "电话号码",
      row: [12],
      model: "phone",
    },
    {
      type: "Input",
      label: "身份证号",
      row: [12],
      model: "idCard",
    },
    {
      type: "DatePicker",
      label: "出生日期",
      row: [12],
      model: "birth",
    },
    {
      type: "Input",
      label: "年龄",
      row: [12],
      model: "age",
    },
  ],
  api: ref("createUser"),
  labelWidth: 120,
  data: ref({
    name: "",
    name1: "",
    name2: "",
    age: "",
    birth: "",
  }),
  createRule(create) {
    return {
      // name1: create.required(),
      // name2: create.required(),
      name: create.must(),
      birth: create.must(),
      age: create.must(),
      idCard: create.must(),
      phone: create.must().rules,
    };
  },
});

const tableOption = CreateTableOption({
  api: "list",
  column: [
    {
      label: "序号",
      render(text, data, index) {
        return index + 1;
      },
    },
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
    {
      label: "操作",
      render(text, data, index) {
        return (
          <>
            <ElButton
              onClick={() => {
                dialogRef.value.open({
                  title: "用户编辑",
                  disabled: false,
                });
                dialogForm.data.value = {
                  name: "",
                  phone: "",
                  idCard: "",
                  birth: "",
                  age: "",
                };
              }}
            >
              编辑
            </ElButton>
            <ElButton
              type="primary"
              onClick={() => {
                dialogRef.value.open({
                  disabled: true,
                  title: "详情",
                });
                dialogForm.data.value = {
                  name: "pxpx",
                  phone: "1234",
                  idCard: "123234",
                  birth: "2022-02-03",
                  age: "12",
                };
              }}
            >
              详情
            </ElButton>
          </>
        );
      },
    },
  ],
});
</script>
