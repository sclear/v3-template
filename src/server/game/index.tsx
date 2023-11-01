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
  test: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      return {
        code: 200,
        data: [],
      };
    },
  },
  testSave: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      console.log(data);
      console.log("testSave");
      return {
        code: 200,
        data: [],
      };
    },
  },
  createHero0: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      console.log(data);
      console.log("createHero0");
      return {
        code: 200,
        data: [],
      };
    },
  },
  createHero1: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      console.log(data);
      console.log("createHero1");
      return {
        code: 200,
        data: [],
      };
    },
  },
  confirm: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      console.log(data);
      console.log("confirm");
      return {
        code: 200,
        data: [],
      };
    },
  },
});
