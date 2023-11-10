<template>
  <div>
    <ElCard>
      <Form :createOption="searchForm" />
    </ElCard>
    <ElCard class="mt-3">
      <Table
        ref="tableRef"
        :createOption="tableOption"
        :search-params="searchForm.omitData"
      >
        <Dialog :width="900" ref="dialogRef">
          <Form :createOption="dialogForm" />
        </Dialog>
      </Table>
    </ElCard>
  </div>
</template>

<script lang="tsx" setup>
import { ElCard, ElPopconfirm } from "element-plus";
import { ref } from "vue";
import { ElButton, ElTag } from "element-plus";
import {
  useServer,
  Form,
  CreateForm,
  Dialog,
  CreateTable,
  Table,
  Trigger,
} from "@/entry";

const dialogRef = ref();
const tableRef = ref();

const searchForm = CreateForm({
  tableInstance: tableRef,
  row: [8],
  form: [
    {
      type: "Input",
      label: "姓名",
      model: "cname",
    },
    {
      type: "Input",
      label: "别称",
      model: "title",
    },
    {
      type: "Radio",
      label: "状态",
      model: "type",
      dataSource: [
        {
          label: "显示",
          value: 1,
        },
        {
          label: "隐藏",
          value: 0,
        },
      ],
    },
    {
      row: [24],
      align: "right",
      render() {
        return (
          <>
            <ElButton
              type="primary"
              onClick={() => {
                dialogRef.value.open({
                  title: "新增装备",
                });
              }}
            >
              新增
            </ElButton>

            <Trigger htmlType="submit" class="ml-12px">
              <ElButton type="success">查询</ElButton>
            </Trigger>

            <Trigger htmlType="reset" class="ml-12px">
              <ElButton type="info">重置</ElButton>
            </Trigger>
          </>
        );
      },
    },
  ],
  data: ref({
    cname: "",
    title: "",
    hero_type: "",
    type: 1,
  }),
});

const dialogForm = CreateForm({
  row: [12],
  form: [
    {
      type: "Input",
      label: "装备",
      model: "item_name",
    },
    {
      type: "Input",
      label: "价格",
      model: "total_price",
    },
    {
      type: "Input",
      label: "描述",
      model: "des1",
    },
  ],
  api: "game.createHero",
  labelWidth: 120,
  data: ref({
    item_name: "",
    des1: "",
    total_price: "",
  }),
  createRule(create) {
    return {
      item_name: create.required(),
      des1: create.required(),
      total_price: create.required(),
    };
  },
});

const tableOption = CreateTable({
  api: "game.itemList",
  autoRun: true,
  column: [
    {
      type: "Index",
      label: "序号",
      width: 70,
    },
    {
      prop: "item_id",
      label: "装备",
      width: 100,
      render(text) {
        return (
          <img
            class="w-30px"
            src={`//game.gtimg.cn/images/yxzj/img201606/itemimg/${text}.jpg`}
          />
        );
      },
    },
    {
      prop: "item_name",
      label: "装备名称",
      width: 130,
    },
    {
      prop: "total_price",
      label: "价格",
    },
    {
      prop: "des1",
      label: "基本描述",
      customProps: {
        "show-overflow-tooltip": true,
      },
      vIf() {
        return searchForm.data.value.type === 1;
      },
    },
    {
      label: "操作",
      render(text, data, index) {
        return (
          <>
            <ElTag
              class="mr-2 cursor-pointer"
              onClick={() => {
                dialogRef.value.open({
                  title: "编辑装备",
                  data: {
                    ...data,
                  },
                  action: [
                    {
                      function: "cancel",
                    },
                    {
                      function: "confirm",
                      type: "warning",
                      label: "保存",
                      api: "game.testSave",
                    },
                    {
                      function: "confirm",
                      label: "提交",
                      api: "game.confirm",
                    },
                  ],
                });
              }}
            >
              编辑
            </ElTag>
            <ElTag
              type="info"
              class="mr-2 cursor-pointer"
              onClick={() => {
                dialogRef.value.open({
                  disabled: true,
                  title: "详情",
                  api: "test",
                  data: {
                    ...data,
                  },
                });
              }}
            >
              装备详情
            </ElTag>

            <ElPopconfirm
              onConfirm={() => {
                useServer({
                  api: "user.del",
                  data: {
                    num: index,
                  },
                  autoRun: true,
                  successMessage: "删除成功",
                  errorMessage: "删除失败",
                  onSuccess() {
                    tableOption.run();
                  },
                });
              }}
              v-slots={{
                reference: () => (
                  <ElTag class="cursor-pointer" type="danger">
                    删除
                  </ElTag>
                ),
              }}
              title="Are you sure to delete this?"
            ></ElPopconfirm>
          </>
        );
      },
    },
  ],
});
</script>
