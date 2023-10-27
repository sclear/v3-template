import { createApi, createApiModule } from "@/hook/useServer/lib/store";
import { heroList } from "./data/herolist";
import { item } from "./data/item";
import { ming } from "./data/ming";

export const game = createApiModule({
  heroList: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      const start = (data.page.pageNo - 1) * 10;
      return {
        code: 200,
        data: heroList.slice(start, start + 10),
        count: heroList.length,
      };
    },
  },
  createHero: {
    url: "//mock",
    method: "get",
    Mock: {
      code: 200,
      data: [],
    },
  },
  itemList: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      const start = (data.page.pageNo - 1) * 10;
      return {
        code: 200,
        data: item.slice(start, start + 10),
        count: item.length,
      };
    },
  },
});
