import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style/index.less";
import "element-plus/dist/index.css";
import { ElLoading } from "element-plus";
import { store } from "@/store";
import "uno.css";
import "nprogress/nprogress.css";

createApp(App).use(router).use(store).use(ElLoading).mount("#app");
