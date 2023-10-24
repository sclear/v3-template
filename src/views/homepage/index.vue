<template>
  <div>
    <Form ref="searchFormRef" :createOption="searchForm" />
    <Table
      ref="tableRef"
      :createOption="tableOption"
      :search-params="searchForm.omitData"
      class="mt-2"
    >
      <Dialog :width="900" ref="dialogRef">
        <Form :createOption="dialogForm" />
      </Dialog>
    </Table>
  </div>
</template>

<script lang="tsx" setup>
import { ElMessage, ElCard, ElRow, ElCol } from "element-plus";
import { ref, computed, onMounted } from "vue";
import { ElButton, ElInput } from "element-plus";
import Table, { CreateTable } from "./../../components/Table";
import Dialog from "./../../components/Dialog";
import { useServer, Form, CreateForm } from "@/entry";

const dialogRef = ref();
const searchFormRef = ref();
const tableRef = ref();
const searchForm = CreateForm({
  tableInstance: tableRef,
  row: [8],
  form: [
    {
      type: "Input",
      label: "姓名",
      model: "name",
    },
    {
      type: "Input",
      label: "电话号码",
      model: "phone",
    },
    {
      type: "Input",
      label: "身份证号",
      model: "idCard",
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
      type: "DatePicker",
      label: "日期范围",
      model: "startTime",
      defaultValue(data) {
        return [data.startTime, data.endTime];
      },
      onChange({ value, data }) {
        data.startTime = value[0];
        data.endTime = value[1];
      },
      customProps: {
        type: "daterange",
        "value-format": "YYYY-MM-DD hh:mm:ss",
      },
    },
    {
      align: "right",
      render() {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                dialogRef.value.open({
                  title: "新增用户",
                });
              }}
            >
              新增
            </ElButton>

            <Form.Trigger htmlType="submit" class="ml-12px">
              <ElButton type="success">查询</ElButton>
            </Form.Trigger>

            <Form.Trigger htmlType="reset" class="ml-12px">
              <ElButton type="info">重置</ElButton>
            </Form.Trigger>
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
    startTime: "",
    endTime: "",
  }),
  createRule(create) {
    return {
      // startTime: create.required(),
    };
  },
});

const dialogForm = CreateForm({
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
  api: "createUser",
  labelWidth: 120,
  data: ref({
    name: "",
    age: "",
    birth: "",
    idCard: "",
    phone: "",
  }),
  createRule(create) {
    return {
      name: create.required(),
      birth: create.required(),
      age: create.required(),
      idCard: create.required(),
      phone: create.required(),
    };
  },
});

const tableOption = CreateTable({
  api: "list",
  autoRun: true,
  formatRowText(text) {
    if (text === undefined) {
      return "-";
    }
  },
  useServerProps: {
    beforeRequest({ data }) {
      return {
        data,
      };
    },
  },
  column: [
    {
      type: "Index",
      label: "序号",
    },
    {
      type: "Tag",
      prop: ["tag", "des"],
      label: "标签",
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
      prop: "name",
      label: "年龄",
    },
    {
      label: "操作",
      render(text, data, index) {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                dialogRef.value.open({
                  title: "用户编辑",
                  disabled: false,
                });
                dialogForm.data.value = { ...data };
              }}
            >
              编辑
            </ElButton>
            <ElButton
              onClick={() => {
                dialogRef.value.open({
                  disabled: true,
                  title: "详情",
                });
                dialogForm.data.value = { ...data };
              }}
            >
              详情
            </ElButton>
            <ElButton
              type="danger"
              onClick={() => {
                useServer({
                  api: "user.del",
                  data: {
                    num: index,
                  },
                  autoRun: true,
                  successMessage: "删除成功",
                  errorMessage: "删除失败",
                });
              }}
            >
              删除
            </ElButton>
          </>
        );
      },
    },
  ],
});
</script>
