import { createApi } from "@/hook/useServer/lib/store";

export const api = {
  user: {
    method: "get",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/user-list",
  },
  list: {
    method: "get",
    url: "https://mock.mengxuegu.com/mock/635605c88c53a558a4840c72/test/list",
    _Mock_: false,
    Mock: {
      total: 30,
      data: [],
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
