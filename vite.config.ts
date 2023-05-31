import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import unoCss from "unocss/vite";
import { presetIcons, presetAttributify, presetUno } from "unocss";
export default ({ mode }) => {
  // const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      unoCss({
        presets: [presetIcons(), presetAttributify(), presetUno()],
      }),
    ],
    // base: "./",
    // define: {
    //   "process.env": env,
    // },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
    server: {
      hmr: true,
      // port: 8001,
    },
    build: {
      outDir: "lib", //库输出目录
      lib: {
        entry: "src/entry.ts", //库打包入口
        name: "fast-crud",
      }, //库编译模式配置
      sourcemap: true, // 输出.map文件

      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ["vue", "element-plus", "axios"],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: "Vue",
            "element-plus": "ElementPlus",
            axios: "Axios",
          },
        },
      }, // rollup打包配置
    },
  });
};
