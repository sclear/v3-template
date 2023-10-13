import { createApi } from "@/hook/useServer/lib/store";

export const api = {
  user: {
    method: "get",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/user-list",
  },
  list: {
    method: "get",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/list",
    _Mock_: true,
    Mock: ({ data }: any) => {
      console.log(data.page.pageNo);
      const list: any = {
        1: [
          {
            name: "小红",
            tag: "tag",
            des: "简单的描述",
          },
          {
            name: "小红",
            tag: "tag",
            des: "简单的描述",
          },
          {
            name: "小红",
            tag: "tag",
            des: "简单的描述",
            age: "14",
            birth: "19/10/03",
          },
          {
            name: "小红",
            tag: "tag",
            des: "简单的描述",
          },
        ],
        2: [
          {
            name: "小张",
            tag: "test",
            des: "不简单的描述",
          },
          {
            name: "小张",
            tag: "test",
            des: "不简单的描述",
          },
          {
            name: "小张",
            tag: "test",
            des: "不简单的描述",
            age: "14",
            birth: "19/10/03",
          },
          {
            name: "小张",
            tag: "test",
            des: "不简单的描述",
          },
        ],
      };
      return {
        code: 200,
        count: 15,
        data: list[data.page.pageNo],
      };
    },
  },
  createUser: {
    method: "post",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/create-user",
  },
  full: {
    method: "get",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/full",
  },
  fullPost: {
    method: "post",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/full",
  },
};

const user = {
  list: {
    method: "get",
    url: "url1",
  },
  getIds: {
    method: "get",
    url: "url2",
  },
};

export default createApi({
  ...api,
  user,
});
