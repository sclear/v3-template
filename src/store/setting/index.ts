import { defineStore } from "pinia";
import { asyncRoutes, wrapRoutes } from "@/router/modules/async.router";
import { activeRoutes } from "@/router/modules/active.router";
import router from "@/router";
import { listToTree } from "@/tools/util";

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

export const useSetting = defineStore<string, SettingState, any, any>(
  "setting",
  {
    state: () => ({
      // tabs
      tabs: [defaultTab],
      // current tab
      currentTab: "/homepage",
      // menus
      menus: [],

      // token
      token: "",

      isCollapse: false,
    }),

    getters: {
      flatMenu(state: SettingState): any[] {
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
        return menus;
      },
    },

    actions: {
      addTab(tab: Tab) {
        const isRepetition = this.tabs.some((item: Tab) => {
          if (item.path === tab.path) {
            this.currentTab = tab.name;
            item.query = tab.query;
          }
          return item.path === tab.path;
        });
        if (isRepetition) return;
        this.tabs.push(tab);
        this.currentTab = tab.name;
      },
      removeTab(targetName: string) {
        // 检测禁删最后一项
        if (this.tabs.length === 1) return;

        const tabs = this.tabs;

        let activeName = this.currentTab;

        this.tabs = this.tabs.filter((tab: Tab, index: number) => {
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

        this.currentTab = activeName;
      },

      // register route
      registerRoute() {
        return new Promise((resolve, reject) => {
          const menuJsonPaths = menuJson.map((item) => item.path);
          const registerRoutes = asyncRoutes.filter((item: any) => {
            return (
              item.meta.permission === false ||
              menuJsonPaths.includes(item.path)
            );
          });
          this.menus = listToTree(
            menuJson.map((item) => ({
              ...item,
              path: item.path || item.id,
              name: item.path || item.id,
            })),
            0
          );
          resolve(wrapRoutes([...activeRoutes, ...registerRoutes]));
        });
      },

      setToken(token: string) {
        this.token = token;
      },
      changeCollapse() {
        this.isCollapse = !this.isCollapse;
      },
    },

    persist: {
      enabled: true,
    },
  }
);
