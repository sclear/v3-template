import { Ref, computed, unref, ComputedRef, ref } from "vue";
import { ElCol, ElFormItem } from "element-plus";
import { Components } from "../Form/components";
import { pick } from "../../tools/util";
import { RuleItem } from "async-validator";
import createRules from "./../../tools/validate";
import { ApiType } from "../../hook/useServer";

export { createRules };
export interface FormType<T> {
  type?: keyof typeof Components;
  label?: string;
  model?: string;
  row?: number[];
  align?: "left" | "right" | "center";
  vIf?: (args: { value: unknown; model: string; data: T }) => boolean;
  vDisabled?: (args: {
    value: unknown;
    model: string;
    data: T;
    api: ApiType;
  }) => boolean;
  render?: (
    model: string,
    data: T,
    disabled: ComputedRef<boolean>
  ) => JSX.Element | string;
  top?: string | number;
  renderFormItem?: (
    model: string,
    data: T,
    disabled: ComputedRef<boolean>
  ) => JSX.Element | string;
  labelWidth?: number;
  placeholder?: string;
  className?: string;
  onChange?: (data: { value: any; type: string; data: T }) => void;
  dataSource?: Ref<any[]> | any[];
  customProps?: object;
  defaultValue?: (data: T) => any;
}
/**
 * T : data
 * U : omit
 */

type RefValue<T> = T extends Ref<infer A> ? A : T;

export type CreateFormOptions<T = any> = {
  form: FormType<T>[];
  disabled?: Ref<boolean> | undefined;
  type?: any;
  data: T;
  labelWidth?: number;
  api?: ApiType | Ref<ApiType>;
  formProp?: any;
  tableRef?: Ref<any>;
  requestData?: (data: RefValue<T>, api: ApiType) => any;
  onChange?: (data: { value: unknown; type: string; data: T }) => void;
  onSuccess?: (done: () => void, data: RefValue<T>, requestData?: any) => void;
  onError?: (done: () => void) => void;
  createRule?: (
    ruleInstance: typeof createRules
  ) => Record<string, RuleItem[] | typeof createRules>;
};

export function CreateElForm(
  option: CreateFormOptions,
  props: any,
  dialog: any
): JSX.Element {
  return (
    <>
      {option.form.map((item) => {
        let prop = pick(item, [
          "label",
          "model",
          "placeholder",
          "dataSource",
          "customProps",
        ]);

        // computed v-if
        const vif = computed(() => {
          console.log(item.vIf);
          if (
            (item.vIf &&
              // item.model &&
              item.vIf({
                model: item.model || "",
                value: props.data.value[item.model || ""],
                data: props.data,
              })) ||
            item.vIf === undefined
          ) {
            return true;
          }
          return false;
        });
        if (!vif.value) return "";

        // component v-disabled
        const disabled = computed(() => {
          // 局部disabled最大权重
          if (
            item.vDisabled &&
            item.vDisabled({
              model: item.model || "",
              value: item.model
                ? props.data.value[item.model]
                : props.data.value,
              data: props.data,
              api: props.api,
            }) === false
          )
            return false;
          // if (unref(option.disabled) === true) return true;
          if (unref(option.disabled) === true || unref(dialog.disabled))
            return true;
          else if (
            item.model &&
            !unref(option.disabled) &&
            item.vDisabled &&
            item.vDisabled({
              model: item.model || "",
              value: props.data.value[item.model],
              data: props.data,
              api: props.api,
            })
          ) {
            return true;
          } else return false;
        });

        const row = item.row || [24, 0];
        const align = item.align || "left";
        const alignGroup = {
          left: "flex-start",
          center: "center",
          right: "flex-end",
        };

        // render custom component
        if (item.render || item.renderFormItem || !item.type) {
          if (item.render && !item.model) {
            return (
              <>
                <ElCol span={row[0] || 24} offset={row[1] || 0}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: alignGroup[align],
                    }}
                  >
                    {item.render("", ref(null), disabled)}
                  </div>
                </ElCol>
              </>
            );
          } else if (item.model && item.render) {
            return (
              <>
                <ElCol
                  style={{
                    marginTop:
                      typeof item.top === "number" ? `${item.top}px` : item.top,
                  }}
                  span={row[0] || 24}
                  offset={row[1] || 0}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: alignGroup[align],
                    }}
                  >
                    {item.render(
                      props.data.value[item.model],
                      props.data,
                      disabled
                    )}
                  </div>
                </ElCol>
              </>
            );
          }
          if (item.renderFormItem && item.model) {
            return (
              <ElCol span={row[0] || 24} offset={row[1] || 0}>
                <ElFormItem
                  labelWidth={item.labelWidth || undefined}
                  label={item.label ? item.label + ":" : ""}
                  class={item.className}
                  prop={item.model}
                >
                  {item.renderFormItem(
                    props.data.value[item.model],
                    props.data,
                    disabled
                  )}
                </ElFormItem>
              </ElCol>
            );
          } else if (item.renderFormItem && !item.model) {
            return (
              <ElCol span={row[0] || 24} offset={row[1] || 0}>
                <ElFormItem
                  labelWidth={item.labelWidth || undefined}
                  label={item.label ? item.label + ":" : ""}
                  class={item.className}
                >
                  {item.renderFormItem("", props.data, disabled)}
                </ElFormItem>
              </ElCol>
            );
          }
          return "";
        }

        const CustomComponent = Components[item.type];

        if (!item.model) return "";

        const childProp = {
          ...prop,
          disabled: disabled,
          onChange: (value: unknown, type: string) => {
            const data = {
              type,
              value,
              data: props.data,
            };
            item.onChange && item.onChange(data);
            option.onChange && option.onChange(data);
          },
          defaultValue: item.defaultValue && item.defaultValue(props.data),
        };
        console.log(item.label);

        return (
          <>
            <ElCol span={row[0] || 24} offset={row[1] || 0}>
              <ElFormItem
                labelWidth={item.labelWidth || undefined}
                label={item.label ? item.label + ":" : ""}
                class={item.className}
                prop={item.model}
              >
                <CustomComponent
                  {...childProp}
                  v-model={props.data.value[item.model]}
                />
              </ElFormItem>
            </ElCol>
          </>
        );
      })}
    </>
  );
}
