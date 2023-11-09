import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import unoCss from "unocss/vite";
import { presetIcons, presetAttributify, presetUno } from "unocss";

const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

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
    base: "./",
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
      rollupOptions: {
        output: {
          // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
          sanitizeFileName(name) {
            const match = DRIVE_LETTER_REGEX.exec(name);
            const driveLetter = match ? match[0] : "";
            // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
            // Otherwise, avoid them because they can refer to NTFS alternate data streams.
            return (
              driveLetter +
              name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
            );
          },
        },
      },
    },
    // build: {
    //   outDir: "lib", //库输出目录
    //   lib: {
    //     entry: "src/entry.ts", //库打包入口
    //     name: "fast-crud",
    //   }, //库编译模式配置
    //   sourcemap: true, // 输出.map文件

    //   rollupOptions: {
    //     // 确保外部化处理那些你不想打包进库的依赖
    //     external: ["vue", "element-plus", "axios"],
    //     output: {
    //       // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //       globals: {
    //         vue: "Vue",
    //         "element-plus": "ElementPlus",
    //         axios: "Axios",
    //       },
    //     },
    //   }, // rollup打包配置
    // },
  });
};
