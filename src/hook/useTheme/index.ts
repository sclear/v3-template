import { onBeforeMount } from "vue";

function checkMode(mode: string, color: string) {
  const PRE = `--el-color-${mode}`;
  const PRE_LIGHT = `${PRE}-light`;
  const PRE_DARK = `${PRE}-dark`;
  const Level = [3, 5, 7, 8, 9];

  const WHITE = "#FFFFFF";
  const BLACK = "#000000";

  const root = document.documentElement;

  const mix = (color1: string, color2: string, weight: number) => {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    const r = Math.round(r1 * (1 - weight) + r2 * weight);
    const g = Math.round(g1 * (1 - weight) + g2 * weight);
    const b = Math.round(b1 * (1 - weight) + b2 * weight);
    const _r = ("0" + (r || 0).toString(16)).slice(-2);
    const _g = ("0" + (g || 0).toString(16)).slice(-2);
    const _b = ("0" + (b || 0).toString(16)).slice(-2);
    return "#" + _r + _g + _b;
  };

  root.style.setProperty(PRE, color);
  Level.forEach((level) => {
    root.style.setProperty(
      `${PRE_LIGHT}-${level}`,
      mix(color, WHITE, level * 0.1)
    );
  });
  const dark = mix(color, BLACK, 0.2);
  root.style.setProperty(`${PRE_DARK}-2`, dark);
}

const theme = {
  default: [
    {
      mode: "primary",
      color: "#409EFF",
    },
    {
      mode: "success",
      color: "#67C23A",
    },
    {
      mode: "warning",
      color: "#E6A23C",
    },
    {
      mode: "danger",
      color: "#F56C6C",
    },
    {
      mode: "info",
      color: "#909399",
    },
  ],
  /**
   * @description 传统风格
   */
  tradition: [
    {
      mode: "primary",
      color: "#3772FF",
    },
    {
      mode: "success",
      color: "#80EB9A",
    },
    {
      mode: "warning",
      color: "#FECA40",
    },
    {
      mode: "danger",
      color: "#DF2935",
    },
    {
      mode: "info",
      color: "#E6E8E5",
    },
  ],
  /**
   * @description 深色风格
   */
  brunette: [
    {
      mode: "primary",
      color: "#505CAB",
    },
    {
      mode: "success",
      color: "#67C23A",
    },
    {
      mode: "warning",
      color: "#E6A23C",
    },
    {
      mode: "danger",
      color: "#F56C6C",
    },
    {
      mode: "info",
      color: "#909399",
    },
  ],
  /**
   * @description 中国风
   */
  china: [
    {
      mode: "primary",
      color: "#2FA0EE",
    },
    {
      mode: "success",
      color: "#3C8E93",
    },
    {
      mode: "warning",
      color: "#C57544",
    },
    {
      mode: "danger",
      color: "#EA5845",
    },
    {
      mode: "info",
      color: "#A78F6F",
    },
  ],
};

function set(type: Theme): void {
  theme[type].forEach((mode) => {
    checkMode(mode.mode, mode.color);
  });
}
export type Theme = keyof typeof theme;

export function useTheme(defaultTheme?: Theme) {
  onBeforeMount(() => {
    set("default");
  });

  return {
    set,
    list: [
      {
        label: "默认",
        value: "default",
      },
      {
        label: "传统风",
        value: "tradition",
      },
      {
        label: "深色风",
        value: "brunette",
      },
      {
        label: "中国风",
        value: "china",
      },
    ],
  };
}
