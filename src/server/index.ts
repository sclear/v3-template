import { createApi, createApiModule } from "@/hook/useServer/lib/store";

export const api = createApiModule({
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
});

const user = createApiModule({
  del: {
    method: "get",
    url: "del",
    Mock({ data }) {
      console.log(data);
      return {
        code: data.num % 2 === 1 ? 200 : 500,
        message: "ok",
        data: false,
      };
    },
  },
  list: {
    method: "get",
    url: "list",
    Mock: {
      code: 200,
      message: "ok",
      data: [
        {
          type: "唱",
          value: 1,
        },
        {
          type: "跳",
          value: 2,
        },
        {
          type: "Rap",
          value: 3,
        },
        {
          type: "篮球",
          value: 4,
        },
      ],
    },
  },
});

export default createApi({
  ...api,
  user,
});
