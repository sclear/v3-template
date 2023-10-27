import { createApi, createApiModule } from "@/hook/useServer/lib/store";

const echoList: any = {
  1: [
    {
      value: 0,
      label: "男",
    },
    {
      value: 1,
      label: "女",
    },
  ],
  2: [
    {
      value: 1,
      label: "战士",
    },
    {
      value: 2,
      label: "法师",
    },
    {
      value: 4,
      label: "射手",
    },
    {
      value: 6,
      label: "辅助",
    },
    {
      value: 4,
      label: "刺客",
    },
  ],
  3: [
    {
      value: 0,
      label: "已婚",
    },
    {
      value: 1,
      label: "未婚",
    },
  ],
};

export const dictionaries = createApiModule({
  list: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      return {
        code: 200,
        data: echoList[data.type],
      };
    },
  },
});
