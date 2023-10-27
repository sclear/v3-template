import { RouteRecordRaw } from "vue-router";

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/workplace",
    meta: {
      title: "工作台",
      permission: false,
    },
    component: () => import("@/views/workplace/index.vue"),
  },

  {
    path: "/test",
    meta: {
      title: "test",
      permission: false,
    },
    component: () => import("@/views/test/index.vue"),
  },
  {
    path: "/form",
    meta: {
      title: "功能汇总演示",
      permission: false,
    },
    component: () => import("@/views/form/index.vue"),
  },
  {
    path: "/basic-form",
    meta: {
      title: "基础表单",
      permission: false,
    },
    component: () => import("@/views/formView/basicForm/index.vue"),
  },
  {
    path: "/row",
    meta: {
      title: "栅格表单",
      permission: false,
    },
    component: () => import("@/views/formView/row/index.vue"),
  },
  {
    path: "/advanced-form",
    meta: {
      title: "高级表单",
      permission: false,
    },
    component: () => import("@/views/formView/advancedForm/index.vue"),
  },
  {
    path: "/dialog",
    meta: {
      title: "Dialog",
      permission: false,
    },
    component: () => import("@/views/dialog/index.vue"),
  },
  // {
  //   path: "/table",
  //   meta: {
  //     title: "Table",
  //     permission: false,
  //   },
  //   component: () => import("@/views/table/index.vue"),
  // },
  {
    path: "/table-list",
    meta: {
      title: "查询列表",
      permission: false,
    },
    component: () => import("@/views/table/table/index.vue"),
  },
  {
    path: "/advanced-table-list",
    meta: {
      title: "高级列表",
      permission: false,
    },
    component: () => import("@/views/table/advancedTable/index.vue"),
  },
  {
    path: "/center",
    meta: {
      title: "个人中心",
      permission: false,
    },
    component: () => import("@/views/center/index.vue"),
  },
];

export function wrapRoutes(children: RouteRecordRaw[]): RouteRecordRaw {
  return {
    path: "/layout",
    name: "layout",
    component: () => import("@/views/Layout/index.vue"),
    children,
  };
}
