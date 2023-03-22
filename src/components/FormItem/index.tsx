import { Ref, computed, unref, ComputedRef, ref } from "vue";
import { ElCol, ElFormItem, ElRow } from "element-plus";
import { Components } from "../Form/components";
import { pick, setValueByPath } from "../../tools/util";
import { RuleItem } from "async-validator";
import createRules, { isCreateValidateInstance } from "./../../tools/validate";
import { ApiType } from "../../hook/useServer";
import { getValueByPath } from "../../tools/util";
import { ruleHelper } from "../Form/rule.helper";

export { createRules };
export type FormType<T> = FormGroupType<T> | FormSettingType<T>;

type FormGroupType<T> = {
  children: FormSettingType<T>[];
  row?: number[];
  vIf?: (args: { value: unknown; model: string; data: T }) => boolean;
};

export function isFormGroupType(formItem: any): formItem is FormGroupType<any> {
  if (formItem.children) {
    return true;
  }
  return false;
}

export type FormSettingType<T> = {
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
  createRule?: (
    ruleInstance: typeof createRules,
    data: RefValue<T>
  ) => RuleItem[] | typeof createRules;
};
/**
 * T : data
 * U : omit
 */

type RefValue<T> = T extends Ref<infer A> ? A : T;

export type CreateFormOptions<T = any> = {
  form:
    | FormType<T>[]
    | ((formOption: { data: RefValue<T>; vFor: typeof vFor }) => FormType<T>[]);
  disabled?: Ref<boolean> | undefined;
  type?: any;
  data: T;
  labelWidth?: number;
  api?: ApiType | Ref<ApiType>;
  customProps?: any;
  tableRef?: Ref<any>;
  loading?: Ref<boolean>;
  requestData?: (data: RefValue<T>, api: ApiType) => any;
  onChange?: (data: { value: unknown; type: string; data: T }) => void;
  onSuccess?: (done: () => void, data: RefValue<T>, requestData?: any) => void;
  onError?: (done: () => void) => void;
  createRule?: (
    ruleInstance: typeof createRules,
    data: RefValue<T>
  ) => Record<string, RuleItem[] | typeof createRules>;
};

export function vFor<T>(
  array: T[],
  cb: (item: T, index: number) => FormType<any>
): FormType<any>[] {
  return array.map(cb);
}

export function CreateElForm(
  option: CreateFormOptions,
  props: any,
  dialog: any
): JSX.Element {
  return (
    <>
      {(typeof option.form === "function"
        ? option.form({
            data: option.data.value,
            vFor,
          })
        : option.form
      ).map((item) => {
        if (item) {
          // render group
          if (isFormGroupType(item)) {
            // computed v-if
            const vif = computed(() => {
              console.log(item.vIf);
              if (
                (item.vIf &&
                  item.vIf({ data: props.data, value: "", model: "" })) ||
                item.vIf === undefined
              ) {
                return true;
              }
              return false;
            });
            if (!vif.value) return "";

            const row = item.row || [24, 0];
            return (
              <ElCol
                style={{
                  display: "flex",
                  "flex-wrap": "wrap",
                }}
                span={row[0] || 24}
                offset={row[1] || 0}
              >
                {item.children.map((item) =>
                  renderItem(option, props, dialog, item)
                )}
              </ElCol>
            );
          }
          return renderItem(option, props, dialog, item);
        }
      })}
    </>
  );
}

function renderItem(
  option: CreateFormOptions,
  props: any,
  dialog: any,
  item: FormSettingType<any>
) {
  let prop = pick(item, [
    "label",
    "model",
    "placeholder",
    "dataSource",
    "customProps",
  ]);

  let rule: { rules?: any } = {};

  if (item.createRule) {
    const ruleOrInstanceRule = item.createRule(createRules, unref(option.data));
    rule.rules = ruleHelper(ruleOrInstanceRule, item.model || "", [item]);
  }

  // computed v-if
  const vif = computed(() => {
    console.log(item.vIf);
    if (
      (item.vIf &&
        // item.model &&
        item.vIf({
          model: item.model || "",
          value: getValueByPath(props.data.value, item.model || ""),
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
          ? getValueByPath(props.data.value, item.model)
          : props.data.value,
        data: props.data,
        api: props.api,
      }) === false
    )
      return false;
    if (unref(option.disabled) === true || unref(dialog.disabled)) return true;
    else if (
      item.model &&
      !unref(option.disabled) &&
      item.vDisabled &&
      item.vDisabled({
        model: item.model || "",
        value: getValueByPath(props.data.value, item.model),
        data: props.data,
        api: props.api,
      })
    ) {
      return true;
    } else return false;
  });

  // align
  const row = item.row || [24, 0];
  const rowSpan = row[0] || 24;
  const rowOffset = row[1] || 0;
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
          <ElCol span={rowSpan} offset={rowOffset}>
            <div
              style={{
                display: "flex",
                justifyContent: alignGroup[align],
              }}
            >
              {item.render("", props.data, disabled)}
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
            span={rowSpan}
            offset={rowOffset}
          >
            <div
              style={{
                display: "flex",
                justifyContent: alignGroup[align],
              }}
            >
              {item.render(
                getValueByPath(props.data.value, item.model),
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
        <ElCol span={rowSpan} offset={rowOffset}>
          <ElFormItem
            {...rule}
            labelWidth={item.labelWidth || undefined}
            label={item.label ? item.label + ":" : ""}
            class={item.className}
            prop={item.model}
          >
            {item.renderFormItem(
              getValueByPath(props.data.value, item.model),
              props.data,
              disabled
            )}
          </ElFormItem>
        </ElCol>
      );
    } else if (item.renderFormItem && !item.model) {
      return (
        <ElCol span={rowSpan} offset={rowOffset}>
          <ElFormItem
            {...rule}
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

  return (
    <>
      <ElCol span={rowSpan} offset={rowOffset}>
        <ElFormItem
          labelWidth={item.labelWidth || undefined}
          label={item.label ? item.label + ":" : ""}
          class={item.className}
          prop={item.model}
          {...rule}
        >
          <CustomComponent
            {...childProp}
            modelValue={getValueByPath(props.data.value, item.model || "")}
            onUpdate:modelValue={(e) => {
              setValueByPath(props.data.value, item.model || "", e);
            }}
            // v-model={props.data.value[item.model]}
          />
        </ElFormItem>
      </ElCol>
    </>
  );
}
