import { createApiModule } from "@/hook/useServer/lib/store";

export const login = createApiModule({
  login: {
    url: "//mock",
    method: "get",
    Mock({ data }) {
      console.log(data);
      const { user, pass } = data;
      let code: 200 | 500 = 200;
      if (user !== "admin" || pass !== "123456") {
        code = 500;
      }
      return {
        code: code,
        data: true,
      };
    },
  },
});
