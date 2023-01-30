import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import unoCss from "unocss/vite";
import { presetIcons, presetAttributify, presetUno } from "unocss";
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      unoCss({
        presets: [presetIcons(), presetAttributify(), presetUno()],
      }),
    ],
    base: "./",
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
    server: {
      hmr: true,
    },
  });
};
