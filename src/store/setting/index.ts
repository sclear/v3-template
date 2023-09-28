import { defineStore } from "pinia";
import { asyncRoutes, wrapRoutes } from "@/router/modules/async.router";
import { activeRoutes } from "@/router/modules/active.router";
import router from "@/router";
import { listToTree } from "@/tools/util";
import { reactive, toRefs } from "vue";
import { useRoute } from "vue-router";

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
  path: "/homepage",
  query: {},
  title: "主页",
  name: "/homepage",
};

const menuJson = [
  {
    title: "演示列表",
    icon: "",
    path: "",
    parentId: 0,
    id: 1,
  },
  {
    title: "Form",
    icon: "",
    path: "/form",
    name: "/form",
    parentId: 1,
    id: 2,
  },
  {
    title: "Dialog",
    icon: "",
    path: "/dialog",
    name: "/dialog",
    parentId: 1,
    id: 3,
  },
  {
    title: "Table",
    icon: "",
    path: "/table",
    name: "/table",
    parentId: 1,
    id: 4,
  },
  {
    title: "组合演示",
    icon: "",
    path: "/homepage",
    name: "/homepage",
    parentId: 0,
    id: 5,
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
    function removeTab(targetName: string) {
      // 检测禁删最后一项
      if (state.tabs.length === 1) return;

      const tabs = state.tabs;

      let activeName = state.currentTab;

      state.tabs = state.tabs.filter((tab: Tab, index: number) => {
        if (tab.path === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
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
        resolve(wrapRoutes([...activeRoutes, ...registerRoutes]));
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
      state.currentTab = route.path || "/homepage";
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
