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
import { CreateElForm, CreateFormOptions } from "./../FormItem";
export * from "./../FormItem";
import { RuleItem } from "async-validator";
import { ruleHelper } from "./rule.helper";
import { omit } from "@/tools/util";

export { createRules };

export function CreateFormOption<T>(option: CreateFormOptions<T>) {
  return {
    ...option,
    disabled: isRef(option.disabled)
      ? option.disabled
      : ref(option.disabled || false),
  };
}

export default defineComponent({
  name: "createForm",
  props: {
    createOption: {
      type: Object as unknown as PropType<CreateFormOptions>,
      default: {
        data: ref({}),
        form: [],
      },
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

    store = JSON.parse(JSON.stringify(props.createOption.data.value));

    function reset() {
      props.createOption.data.value = JSON.parse(JSON.stringify(store));
      setTimeout(() => {
        elFormRef.value.resetFields();
      }, 4);
    }

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

    expose({
      validate(done: (isClose?: boolean) => void) {
        elFormRef.value.validate((valid: boolean) => {
          if (valid) {
            // if has request api
            if (createOption.api) {
              const { run } = useServer({
                api: unref(createOption.api),
                data: requestData,
                ...(createOption.requestData
                  ? createOption.requestData(
                      unref(createOption.data),
                      unref(createOption.api)
                    )
                  : { succussMessage: "操作成功" }),

                onSuccess(resp, res) {
                  if (res.code === 200) {
                    // createOption.onSuccess
                    //   ? createOption.onSuccess(
                    //       done,
                    //       unref(createOption.data),
                    //       res
                    //     )
                    //   : (done(); tableRun?.run())
                    if (createOption.onSuccess) {
                      createOption.onSuccess(
                        done,
                        unref(createOption.data),
                        res
                      );
                    } else {
                      done();
                      tableRun?.run && tableRun?.run();
                    }
                    reset();
                  }
                },
                onError() {
                  done && done(false);
                  createOption.onError && createOption.onError(done);
                },
              });
              run();
              return;
            }
            createOption.onSuccess &&
              createOption.onSuccess(done, unref(createOption.data.value));
          } else {
            done && done(false);
            createOption.onError && createOption.onError(done);
          }
        });
      },
      reset,
    });

    let formRules =
      createOption.createRule && createOption.createRule(createRules);

    function calcRules(rules: Record<string, RuleItem[] | typeof createRules>) {
      // rule result
      const result: Record<string, RuleItem[]> = {};

      Object.keys(rules).forEach((key: keyof typeof rules) => {
        const ruleItem = rules[key];

        // if (isCreateValidateInstance(ruleItem)) {
        //   result[key] = ruleItem.rules;
        // } else {
        //   result[key] = ruleItem;
        // }
        result[key] = ruleHelper(ruleItem, key, createOption.form);
      });
      return result || {};
    }

    const formProp = props.createOption.formProp || {};
    return () => (
      <>
        <ElForm
          stripe
          {...formProp}
          ref={elFormRef}
          labelWidth={createOption.labelWidth || 120}
          model={props.createOption.data}
          rules={calcRules(formRules || {})}
        >
          <ElRow>
            {CreateElForm(createOption, props.createOption, dialog)}
          </ElRow>
        </ElForm>
      </>
    );
  },
});
