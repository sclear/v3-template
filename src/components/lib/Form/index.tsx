import {
  defineComponent,
  inject,
  onMounted,
  PropType,
  reactive,
  ref,
  UnwrapRef,
  getCurrentInstance,
  ComponentInternalInstance,
  computed,
  isRef,
  ComputedRef,
  unref,
  Ref,
  provide,
} from "vue";
import { ElForm, ElRow } from "element-plus";
import createRules, { isCreateValidateInstance } from "@/tools/validate";
import { useServer } from "@/hook/useServer";
import { CreateElForm, CreateFormOptions, vFor, RefValue } from "../FormItem";
export * from "../FormItem";
import { RuleItem } from "async-validator";
import { ruleHelper } from "./rule.helper";
import { deepClone, omit } from "@/tools/util";
import { ApiType } from "@/hook/useServer";

export { createRules };

export function CreateForm<T = any, K extends keyof RefValue<T> = never>(
  option: CreateFormOptions<T, K>
) {
  const cache = deepClone(unref(option.data || {}));

  return {
    ...option,
    loading: ref(false),
    disabled: isRef(option.disabled)
      ? option.disabled
      : ref(option.disabled || false),
    omitData: computed(() => {
      return omit(
        unref(option.data) as RefValue<T>,
        (option.omit || []) as K[]
      );
    }),
    // data: ref(option.data),
    instance: ref(),
    reset: () => {
      console.warn("fast-warning: 请勿在Form初始化时调用Form reset");
    },
    validate: function (
      done?: (isClose?: boolean) => void,
      valid?: boolean
    ): Promise<boolean> {
      console.warn("fast-warning: 请勿在Form初始化时调用Form validate");
      return new Promise((resolve, reject) => {});
    },
    cache,
    setData(
      data: Partial<Record<keyof RefValue<T>, RefValue<T>[keyof RefValue<T>]>>,
      clearType: "all" | "default" | "never" = "default"
    ) {
      console.warn("fast-warning: 请勿在Form初始化时调用Form setData");
    },
    setApi(api: ApiType) {
      console.warn("fast-warning: 请勿在Form初始化时设置Api");
    },
  };
}

const Form = defineComponent({
  name: "createForm",
  props: {
    // TODO: fix type
    createOption: {
      type: Object as unknown as PropType<any>,
      // ReturnType<typeof CreateForm<any>>
      default: {
        data: ref({}),
        form: [],
      },
    },
    freeze: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as PropType<UnwrapRef<any>>,
      default: reactive({
        name: "",
      }),
    },
  },
  emit: ["update:data"],
  setup(props, { expose, emit }) {
    const elFormRef = ref();

    props.createOption.instance = elFormRef;

    function searchTableList() {
      // has tableInstance reset pagination
      if (props.createOption.tableInstance) {
        props.createOption.tableInstance?.value?.run &&
          props.createOption.tableInstance?.value?.run(true);
        props.createOption.tableInstance?.run &&
          props.createOption.tableInstance?.run(true);
      }
    }
    function reset() {
      // 初始化data
      props.createOption.data.value = JSON.parse(
        JSON.stringify(props.createOption.cache)
      );
      props.createOption.data.value = deepClone(props.createOption.cache);
      setTimeout(() => {
        elFormRef.value.clearValidate();
      }, 20);

      searchTableList();
    }
    props.createOption.reset = reset;

    // dialog
    const dialog = inject<{
      setFormInstance?: (instance: ComponentInternalInstance | null) => void;
      disabled?: ComputedRef<boolean>;
    }>("DialogProvider", {});

    // table
    const tableRun = inject<{
      run?: () => void;
    }>("TableProvider", {});

    const instance = getCurrentInstance();

    function setData(
      data: Record<string, any> = {},
      clearType: "all" | "default" | "never" = "default"
    ) {
      const keys: string[] = Object.keys(data);

      if (!keys.length) return;

      Object.assign(props.createOption.data.value, data);

      if (clearType === "all") {
        elFormRef.value.clearValidate();
      } else if (clearType === "default") {
        elFormRef.value.clearValidate(keys);
      }
    }

    function setApi(api: ApiType) {
      props.createOption.api = api;
    }

    onMounted(() => {
      dialog?.setFormInstance && dialog?.setFormInstance(instance);

      props.createOption.setData = setData;
      props.createOption.setApi = setApi;

      props.createOption.onReady && props.createOption.onReady();
    });

    const { createOption } = props;

    const requestData = computed(() => {
      return {
        ...createOption.data.value,
      };
    });

    function validate(
      done: (isClose?: boolean) => void = () => {},
      valid: boolean = true
    ): Promise<boolean> {
      const cb = done;
      const validate = valid
        ? elFormRef.value.validate
        : (cb: (valid: boolean) => {}) => {
            cb(true);
          };
      return new Promise((resolve, reject) => {
        validate((valid: boolean) => {
          if (valid) {
            // if has request api
            if (createOption.api) {
              createOption.loading!.value = true;
              const { run } = useServer({
                api: unref(createOption.api),
                data: requestData,
                ...(createOption.useServerProps || {
                  successMessage: "操作成功",
                }),
                onSuccess(resp, res) {
                  if (res.code === 200) {
                    if (createOption.onSuccess) {
                      createOption.onSuccess({
                        done: cb,
                        data: unref(createOption.data),
                        response: res,
                      });
                      createOption.end && createOption.end();
                    } else {
                      cb();
                      if (!props.freeze) {
                        tableRun?.run && tableRun?.run();
                      }
                    }
                    reset();
                  }
                },
                onError() {
                  cb && cb(false);
                  createOption.onError && createOption.onError(cb);
                },
                end() {
                  createOption.loading!.value = false;
                },
              });
              run();
              return;
            }
            createOption.onSuccess &&
              createOption.onSuccess({
                done: cb,
                data: unref(createOption.data),
              });

            // has tableInstance reset pagination
            if (props.createOption.tableInstance) {
              props.createOption.tableInstance?.value?.run &&
                props.createOption.tableInstance?.value?.run(true);
              props.createOption.tableInstance?.run &&
                props.createOption.tableInstance?.run(true);
            }
          } else {
            cb && cb(false);
            createOption.onError && createOption.onError(cb);
          }
          if (!createOption.api) {
            resolve(valid);
          }
        });
      });
    }

    props.createOption.validate = validate;

    expose({
      validate,
      reset,
      resetFields(e: any) {
        elFormRef.value.resetFields(e);
      },
      setData,
      setApi,
    });

    provide("TriggerFormProvider", {
      reset,
      validate,
      searchTableList,
      create(option = {}) {
        props.createOption.tableInstance?.open &&
          props.createOption.tableInstance?.open(option);
        props.createOption.tableInstance?.value?.open &&
          props.createOption.tableInstance?.value?.open(option);
      },
    });

    let formRules =
      createOption.createRule &&
      createOption.createRule(createRules, unref(createOption.data));

    function calcRules(rules: Record<string, RuleItem[] | typeof createRules>) {
      // rule result
      const result: Record<string, RuleItem[]> = {};

      Object.keys(rules).forEach((key: keyof typeof rules) => {
        const ruleItem = rules[key];

        result[key] = ruleHelper(
          ruleItem,
          key,
          typeof createOption.form === "function"
            ? createOption.form({ data: createOption.data.value, vFor })
            : createOption.form
        );
      });
      return result || {};
    }

    const customProps = props.createOption.customProps || {};
    return () => (
      <ElForm
        stripe
        {...customProps}
        ref={elFormRef}
        labelWidth={createOption.labelWidth || 120}
        model={props.createOption.data}
        rules={calcRules(formRules || {})}
      >
        <ElRow>{CreateElForm(createOption, props.createOption, dialog)}</ElRow>
      </ElForm>
    );
  },
});

export default Form;
