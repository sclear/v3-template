<template>
  <div class="h-100vh w-full flex justify-center items-center">
    <div class="w-105 pt-20">
      <ElCard class="pt-2 pb-4 pl-2 pr-2">
        <Form ref="formRef" :createOption="createLoginForm"></Form>
      </ElCard>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ElButton, ElCard } from "element-plus";
import { ref, ExtractPropTypes } from "vue";
import { useValidate } from "./../../hook/useValidate/";
import { useRouter } from "vue-router";
import { useSetting } from "@/store/setting";
import Form, { CreateFormOption } from "@/components/Form/index";
const router = useRouter();
const setting = useSetting();
const formRef = ref();

const createLoginForm = CreateFormOption({
  data: ref({
    user: "",
    pass: "",
  }),
  form: [
    {
      align: "center",
      render() {
        return <h3 class="text-center c-#61AFFF mb-5">Login</h3>;
      },
    },
    {
      label: "user",
      model: "user",
      type: "Input",
    },
    {
      label: "pass",
      model: "pass",
      type: "Input",
    },
    {
      align: "center",
      render() {
        return (
          <ElButton
            onClick={() => formRef.value.validate()}
            type="primary"
            class="w-full mt-6"
          >
            Login
          </ElButton>
        );
      },
    },
  ],
  onSuccess() {
    router.push({
      path: "/homepage",
    });
  },
  createRule(create) {
    return {
      user: create.must("请输入userName"),
      pass: create.must("请输入password"),
    };
  },
  labelWidth: 40,
});
</script>
