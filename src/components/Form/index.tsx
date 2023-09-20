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
} from "vue";
import { ElForm, ElRow } from "element-plus";
import createRules, { isCreateValidateInstance } from "./../../tools/validate";
import { useServer } from "../../hook/useServer";
import { CreateElForm, CreateFormOptions, vFor, RefValue } from "./../FormItem";
export * from "./../FormItem";
import { RuleItem } from "async-validator";
import { ruleHelper } from "./rule.helper";
import { omit } from "@/tools/util";

export { createRules };

export function CreateFormOption<T = any, K extends keyof RefValue<T> = never>(
  option: CreateFormOptions<T, K>
) {
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
    validate: function (done?: (isClose?: boolean) => void): Promise<boolean> {
      console.warn("fast-warning: 请勿在Form初始化时调用Form validate");
      return new Promise((resolve, reject) => {});
    },
  };
}

export default defineComponent({
  name: "createForm",
  props: {
    // TODO: fix type
    createOption: {
      type: Object as unknown as PropType<any>,
      // ReturnType<typeof CreateFormOption<any>>
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
    let store: any = [];

    const elFormRef = ref();
    props.createOption.instance = elFormRef;

    store = JSON.parse(JSON.stringify(props.createOption.data.value));

    function reset() {
      // 初始化data
      props.createOption.data.value = JSON.parse(JSON.stringify(store));
      setTimeout(() => {
        elFormRef.value.resetFields();
      }, 4);

      // has tableRef reset pagination
      if (props.createOption.tableRef) {
        props.createOption.tableRef?.value?.run &&
          props.createOption.tableRef?.value?.run(true);
      }
    }
    props.createOption.reset = reset;

    // dialog
    const dialog = inject<{
      setFormInstance?: (instance: ComponentInternalInstance | null) => void;
      disabled?: ComputedRef<boolean>;
    }>("renderDialog", {});

    // table
    const tableRun = inject<{
      run?: () => void;
    }>("formTable", {});

    const instance = getCurrentInstance();

    onMounted(() => {
      dialog?.setFormInstance && dialog?.setFormInstance(instance);
    });

    const { createOption } = props;

    const requestData = computed(() => {
      return {
        ...createOption.data.value,
      };
    });

    function validate(done?: (isClose?: boolean) => void): Promise<boolean> {
      const cb = done || function () {};
      return new Promise((resolve, reject) => {
        elFormRef.value.validate((valid: boolean) => {
          if (valid) {
            // if has request api
            if (createOption.api) {
              createOption.loading!.value = true;
              const { run } = useServer({
                api: unref(createOption.api),
                data: requestData,
                ...(createOption.requestData
                  ? createOption.requestData(
                      unref(createOption.data),
                      unref(createOption.api)
                    )
                  : { successMessage: "操作成功" }),

                onSuccess(resp, res) {
                  createOption.loading!.value = false;
                  if (res.code === 200) {
                    if (createOption.onSuccess) {
                      createOption.onSuccess(cb, unref(createOption.data), res);
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
                  createOption.loading!.value = false;
                  cb && cb(false);
                  createOption.onError && createOption.onError(cb);
                },
              });
              run();
              return;
            }
            createOption.onSuccess &&
              createOption.onSuccess(cb, unref(createOption.data.value));
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
