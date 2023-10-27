import { defineStore } from "pinia";
import { asyncRoutes, wrapRoutes } from "@/router/modules/async.router";
import { activeRoutes } from "@/router/modules/active.router";
import router from "@/router";
import { listToTree } from "@/tools/util";
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

interface MenuItem {
  path: string;
  icon: string;
  title: string;
  children?: MenuItem[];
}

interface Tab {
  path: string;
  query: any;
  title: string;
  name: string;
}

interface SettingState {
  tabs: Tab[];
  currentTab: string;
  menus: MenuItem[];
}

const defaultTab = {
  path: "/workplace",
  query: {},
  title: "工作台",
  name: "/workplace",
};

const menuJson = [
  {
    title: "工作台",
    icon: "icon-gongzuotai",
    path: "/workplace",
    name: "/workplace",
    parentId: 0,
    id: "gzt-0",
  },
  {
    title: "表单页",
    icon: "icon-biaodanzujian-biaoge",
    path: "",
    parentId: 0,
    id: 1,
  },
  {
    title: "基础表单",
    icon: "",
    path: "/basic-form",
    name: "/basic-form",
    parentId: 1,
    id: "1-0",
  },
  {
    title: "高级表单",
    icon: "",
    path: "/advanced-form",
    name: "/advanced-form",
    parentId: 1,
    id: "1-0",
  },
  {
    title: "栅格表单",
    icon: "",
    path: "/row",
    name: "/row",
    parentId: 1,
    id: "1-2",
  },
  // {
  //   title: "高级表单",
  //   icon: "",
  //   path: "/advanced-form",
  //   name: "/advanced-form",
  //   parentId: 1,
  //   id: "1-1",
  // },
  {
    title: "功能汇总演示",
    icon: "",
    path: "/form",
    name: "/form",
    parentId: 1,
    id: 2,
  },
  {
    title: "Dialog",
    icon: "icon-danchuang1",
    path: "",
    parentId: 0,
    id: 6,
  },
  {
    title: "Dialog",
    icon: "",
    path: "/dialog",
    name: "/dialog",
    parentId: 6,
    id: "6-0",
  },
  {
    title: "列表页",
    icon: "icon-liebiao",
    path: "",
    parentId: 0,
    id: 5,
  },
  {
    title: "查询列表",
    icon: "",
    path: "/table-list",
    name: "/table-list",
    parentId: 5,
    id: "5-0",
  },
  {
    title: "高级列表",
    icon: "",
    path: "/advanced-table-list",
    name: "/advanced-table-list",
    parentId: 5,
    id: "5-1",
  },
  {
    title: "个人中心",
    icon: "icon-gerenzhongxin",
    path: "/center",
    name: "/center",
    parentId: 0,
    id: "9",
  },
  {
    title: "404",
    icon: "icon-icon-404",
    path: "/404",
    name: "/404",
    parentId: 0,
    id: "404",
  },
];

export const useSetting = defineStore(
  "setting",
  () => {
    const state = reactive({
      // tabs
      tabs: [defaultTab],
      // current tab
      currentTab: "/homepage",
      // menus
      menus: [] as MenuItem[],

      // token
      token: "",

      isCollapse: false,

      flatMenu: [] as MenuItem[],
    });

    // tab新增
    function addTab(tab: Tab) {
      console.log(tab);
      console.log(tab);
      console.log(tab);
      console.log(tab);
      console.log(tab);
      if (tab?.path === "/404") return;
      const isRepetition = state.tabs.some((item: Tab) => {
        if (item.path === tab.path) {
          state.currentTab = tab.name;
          item.query = tab.query;
        }
        return item.path === tab.path;
      });
      if (isRepetition) return;
      state.tabs.push(tab);
      state.currentTab = tab.name;
    }

    // tab删除
    const route = useRoute();

    function removeTab(targetName: string) {
      // 检测禁删最后一项
      if (state.tabs.length === 1) return;

      const tabs = state.tabs;

      let activeName = state.currentTab;

      state.tabs = state.tabs.filter((tab: Tab, index: number) => {
        if (tab.path === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];

          if (nextTab && state.currentTab === targetName) {
            activeName = nextTab.name;
            router.push({
              path: nextTab.path,
              query: nextTab.query,
            });
          }
        }
        return tab.path !== targetName;
      });

      state.currentTab = activeName;
    }

    // register route
    function registerRoute(): Promise<any> {
      return new Promise((resolve, reject) => {
        const menuJsonPaths = menuJson.map((item) => item.path);
        flatMenu();

        const registerRoutes = asyncRoutes.filter((item: any) => {
          return (
            item.meta.permission === false || menuJsonPaths.includes(item.path)
          );
        });
        state.menus = listToTree(
          menuJson.map((item) => ({
            ...item,
            path: String(item.path || item.id),
            name: item.path || item.id,
          })),
          0
        );
        setTimeout(() => {
          resolve(wrapRoutes([...activeRoutes, ...registerRoutes]));
        }, 500);
      });
    }

    // 设置token
    function setToken(token: string) {
      state.token = token;
    }

    // 菜单收缩
    function changeCollapse() {
      state.isCollapse = !state.isCollapse;
    }

    // 平铺菜单
    function flatMenu() {
      const menus: MenuItem[] = [];
      function findTab(menu: MenuItem[]) {
        menu.forEach((item) => {
          if (item.children && item.children.length) {
            findTab(item.children);
          } else {
            menus.push({
              ...item,
            });
          }
        });
      }
      findTab(state.menus);
      state.flatMenu = menus;
    }

    function initRoute() {
      const route = useRoute();
      state.currentTab = route.path || "/workplace";
    }

    return {
      ...toRefs(state),
      changeCollapse,
      setToken,
      registerRoute,
      removeTab,
      addTab,
      initRoute,
    };
  },
  {
    persist: {
      enabled: true,
    },
  }
);
