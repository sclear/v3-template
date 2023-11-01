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
import { ElCard, ElButton, ElPopconfirm } from "element-plus";
import { ref } from "vue";
import { ElTag } from "element-plus";
import {
  useServer,
  Form,
  CreateForm,
  Dialog,
  CreateTable,
  Table,
} from "@/entry";

const dialogRef = ref();
const dialogRef1 = ref();
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
      type: "Dict",
      label: "职业",
      model: "hero_type",
      dataSource: "2",
    },
    {
      type: "Action",
      row: [24],
      align: "right",
      dataSource: [
        {
          api: "game.test",
          type: "create",
        },
        "reset",
        "search",
      ],
    },
  ],
  data: ref({
    cname: "",
    title: "",
    hero_type: "",
  }),
});

const dialogForm = CreateForm({
  row: [12],
  form: [
    {
      type: "Input",
      label: "姓名0",
      model: "cname",
    },
    {
      type: "Input",
      label: "别称",
      model: "title",
    },
    {
      type: "Dict",
      label: "职业",
      model: "hero_type",
      dataSource: "2",
    },
    {
      type: "Input",
      label: "皮肤清单",
      model: "skin_name",
    },
  ],
  api: "game.createHero0",
  labelWidth: 120,
  data: ref({
    cname: "",
    title: "",
    hero_type: "",
    skin_name: "",
  }),
  createRule(create) {
    return {
      cname: create.required(),
      title: create.required(),
      hero_type: create.required(),
    };
  },
});

const tableOption = CreateTable({
  api: "game.heroList",
  autoRun: true,
  column: [
    {
      type: "Index",
      label: "序号",
      width: 70,
    },
    {
      prop: "ename",
      label: "头像",
      width: 100,
      // render(text) {
      //   return (
      //     // <img
      //     //   class="w-30px"
      //     //   src={`//game.gtimg.cn/images/yxzj/img201606/heroimg/${text}/${text}.jpg`}
      //     // />
      //   );
      // },
    },
    {
      prop: "cname",
      label: "姓名",
      width: 130,
    },
    {
      prop: "title",
      label: "别称",
    },
    {
      prop: "hero_type",
      label: "职业",
      render(text) {
        return ["刺客", "战士", "法师", "打野", "射手", "辅助", "辅助"][text];
      },
    },

    {
      prop: "skin_name",
      label: "皮肤清单",
      customProps: {
        "show-overflow-tooltip": true,
      },
    },
    {
      label: "操作",
      type: "Action",
      action: [
        {
          type: "edit",
          api: "game.test",
        },
        {
          type: "view",
        },
        {
          type: "remove",
          api: "game.del",
        },
      ],
    },
  ],
});
</script>
