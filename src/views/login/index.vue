<template>
  <div class="login-page h-100vh w-full flex justify-end items-center">
    <div class="w-105 pt-20 mr-50px">
      <ElCard class="pt-10 pb-10 pl-2 pr-2">
        <Form ref="formRef" :createOption="createLoginForm"></Form>
      </ElCard>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ElButton, ElCard } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSetting } from "@/store/setting";
import { Form, CreateForm } from "@/entry";
const router = useRouter();
const setting = useSetting();
const formRef = ref();

const createLoginForm = CreateForm({
  data: ref({
    user: "",
    pass: "",
  }),
  form: [
    {
      align: "center",
      render() {
        return <h3 class="text-center c-primary mb-5">Login</h3>;
      },
    },
    {
      model: "user",
      label: "User",
      type: "Input",
      placeholder: "admin",
    },
    {
      model: "pass",
      label: "Password",
      type: "Input",
      placeholder: "123456",
    },
    {
      align: "center",
      render() {
        return (
          <ElButton
            onClick={() => formRef.value.validate()}
            loading={createLoginForm.loading.value}
            type="primary"
            class="w-full mt-6"
          >
            Login
          </ElButton>
        );
      },
    },
  ],
  customProps: {
    "label-position": "top",
  },
  useServerProps: {
    successMessage: "登录成功",
  },
  onSuccess() {
    setting.setToken("001");
    router.push({
      path: "/workplace",
    });
  },
  api: "login.login",
  createRule(create) {
    return {
      user: create.must("请输入userName"),
      pass: create.must("请输入password"),
    };
  },
  labelWidth: 1,
});
</script>

<style>
.login-page {
  background: url("@/assets/img/page.png") no-repeat;
  background-size: 100% 100%;
}
</style>
