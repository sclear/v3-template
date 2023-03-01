import { createRouter, createWebHashHistory } from "vue-router";
import { useSetting } from "@/store/setting";
import { activeRoutes } from "./modules/active.router";
interface Tab {
  path: string;
  query: any;
  title: string;
  name: string;
}

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0, left: 0 }),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
  ],
});

const NotFound = {
  path: "/:catchAll(.*)",
  name: "404",
  component: () => import("@/views/404/index.vue"),
};

let isFirst = true;

const whiteList = ["/", "/login"];

router.beforeEach(async (to, from, next) => {
  // 白名单
  if (whiteList.includes(to.path)) {
    return next();
  }

  const setting = useSetting();

  if (setting.token) {
    // 首次进入 无路由权限
    if (isFirst) {
      isFirst = false;
      const routes = await setting.registerRoute();
      router.addRoute(routes);
      router.addRoute(NotFound);
      return next({ ...to, replace: true });
    }
    // 新增tabs
    if (
      setting.flatMenu.some((tab: Tab) => tab.path === to.path) ||
      activeRoutes.some((route) => route.path === to.path)
    ) {
      setting.addTab({
        path: to.path,
        query: to.query,
        title: to.meta.title,
        name: to?.meta?.activeMenu || to.path,
      });
    }
    return next();
  }

  next({ path: "/" });
});
export default router;
