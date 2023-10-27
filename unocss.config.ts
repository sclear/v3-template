import {
  defineConfig,
  presetIcons,
  presetUno,
  presetAttributify,
} from "unocss";

export const theme = {
  colors: {
    primary: "var(--el-color-primary)",
    warning: "var(--el-color-warning)",
    info: "var(--el-color-info)",
    success: "var(--el-color-success)",
    danger: "var(--el-color-danger)",
    text: "var(--adm-color-text)",
    sed: "var(--adm-color-text-secondary)",
    light: "var(--adm-color-light)",
  },
};

export const unocssPresets = [presetUno(), presetAttributify(), presetIcons()];

export default defineConfig({
  presets: unocssPresets,
  rules: [
    [/^w-(\d+)$/, ([, d]: any) => ({ width: `${d / 4}rem` })],
    [/^h-(\d+)$/, ([, d]: any) => ({ height: `${d / 4}rem` })],
  ],
  shortcuts: [
    ["wh-full", "w-full h-full"],
    ["f-c-c", "flex justify-center items-center"],
    ["flex-col", "flex flex-col"],
    ["text-ellipsis", "truncate"],
    [
      "icon-btn",
      "text-16 inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary !outline-none",
    ],
  ],
  theme: theme,
});
