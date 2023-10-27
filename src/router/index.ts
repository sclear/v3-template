import { createRouter, createWebHashHistory } from "vue-router";
import { useSetting } from "@/store/setting";
import { activeRoutes } from "./modules/active.router";
import NProgress from "nprogress";
NProgress.configure({
  easing: "ease",
  speed: 2000,
});

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
  NProgress.start();
  // 白名单
  if (whiteList.includes(to.path)) {
    return next();
  }

  const setting = useSetting();

  if (setting.token) {
    // 首次进入 无路由权限
    if (isFirst || !setting.flatMenu.length) {
      isFirst = false;
      const routes = await setting.registerRoute();
      router.addRoute(routes);
      router.addRoute(NotFound);
      return next({ ...to, replace: true });
    }
    // 新增tabs
    if (
      setting.flatMenu.some((tab) => tab.path === to.path) ||
      activeRoutes.some((route) => route.path === to.path)
    ) {
      setting.addTab({
        path: to.path,
        query: to.query,
        title: to.meta.title as string,
        name: (to?.meta?.activeMenu as string) || (to.path as string),
      });
    }
    return next();
  }

  next({ path: "/" });
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
