import { Ref, computed, unref, ComputedRef, ref } from "vue";
import { ElCol, ElFormItem, ElRow } from "element-plus";
import { Components } from "../Form/components";
import { pick, setValueByPath } from "../../tools/util";
import { RuleItem } from "async-validator";
import createRules, { isCreateValidateInstance } from "./../../tools/validate";
import { ApiType } from "../../hook/useServer";
import { getValueByPath } from "../../tools/util";
import { ruleHelper } from "../Form/rule.helper";

type WrapperCol = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

type Row = [number] | [number, number];

const isArray = Array.isArray;

export { createRules };
export type FormType<T> = FormGroupType<T> | FormSettingType<T>;

export type Model = string | string[];

type FormGroupType<T> = {
  children: FormSettingType<T>[];
  row?: Row;
  wrapperCol?: WrapperCol;
  vIf?: (args: { value: unknown; model: Model; data: RefValue<T> }) => boolean;
};

function getStrAryValue(data: Ref<any>, model?: Model): any[] | any {
  if (!model) return "";

  if (isArray(model)) {
    return model.map((key) => {
      return getValueByPath(data.value, key || "");
    });
  }
  return getValueByPath(data.value, model || "");
}

function getFirstModel(model: Model): string {
  return isArray(model) ? model[0] : model;
}

export function isFormGroupType(formItem: any): formItem is FormGroupType<any> {
  if (formItem.children) {
    return true;
  }
  return false;
}

export type FormSettingType<T> = {
  type?: keyof typeof Components;
  label?: string;
  model?: Model;
  row?: Row;
  wrapperCol?: WrapperCol;
  align?: "left" | "right" | "center" | "start" | "end";
  labelWidth?: number;
  placeholder?: string;
  className?: string;
  dataSource?: Ref<any[]> | any[] | string;
  customProps?: object;
  vIf?: (args: { value: unknown; model: Model; data: RefValue<T> }) => boolean;
  vDisabled?: (args: {
    value: unknown;
    model: Model;
    data: RefValue<T>;
    api: ApiType;
  }) => boolean;
  render?: (args: {
    model: Model;
    value: any;
    data: RefValue<T>;
    disabled: ComputedRef<boolean>;
  }) => JSX.Element | string;
  top?: string | number;
  renderFormItem?: (args: {
    model: Model;
    value: any;
    data: RefValue<T>;
    disabled: ComputedRef<boolean>;
  }) => JSX.Element | string;
  renderLabel?: () => JSX.Element | string;
  onChange?: (data: { value: any; type: string; data: RefValue<T> }) => void;
  defaultValue?: (data: RefValue<T>) => any;
  createRule?: (
    ruleInstance: typeof createRules,
    data: RefValue<T>
  ) => RuleItem[] | typeof createRules;
};
/**
 * T : data
 * U : omit
 */

export type RefValue<T> = T extends Ref<infer A> ? A : T;

type SuccessArgs<T> = {
  done?: () => void;
  data: RefValue<T>;
  response?: any;
};

export type CreateFormOptions<T = any, K = unknown> = {
  form:
    | FormType<T>[]
    | ((formOption: { data: RefValue<T>; vFor: typeof vFor }) => FormType<T>[]);
  disabled?: Ref<boolean> | undefined;
  type?: any;
  data: T;
  omit?: K[];
  row?: Row;
  wrapperCol?: WrapperCol;
  labelWidth?: number;
  api?: ApiType | Ref<ApiType>;
  customProps?: any;
  tableInstance?: Ref<any>;
  loading?: Ref<boolean>;
  requestData?: (data: RefValue<T>, api: ApiType) => any;
  onChange?: (data: {
    value: unknown;
    type: string;
    data: RefValue<T>;
  }) => void;
  // onSuccess?: (done: () => void, data: RefValue<T>, requestData?: any) => void;
  onSuccess?: (args: SuccessArgs<T>) => void;
  onError?: (done: () => void) => void;
  onReady?: () => void;
  end?: () => void;
  createRule?: (
    ruleInstance: typeof createRules,
    data: RefValue<T>
  ) => Record<string, RuleItem[] | typeof createRules>;
  // instance: Ref<any>;
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
              if (
                (item.vIf &&
                  item.vIf({
                    data: unref(props.data),
                    value: "",
                    model: "",
                  })) ||
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
                {...(item.wrapperCol || {})}
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
    console.log(getFirstModel(item.model || ""));
    rule.rules = ruleHelper(
      ruleOrInstanceRule,
      getFirstModel(item.model || ""),
      [item]
    );
  }

  // computed v-if
  const vif = computed(() => {
    if (
      (item.vIf &&
        // item.model &&
        item.vIf({
          model: item.model || "",
          // value: getValueByPath(props.data.value, item.model || ""),
          value: getStrAryValue(props.data, item.model),
          data: unref(props.data),
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
        value: getStrAryValue(props.data, item.model),
        // value: item.model
        //   ? getValueByPath(props.data.value, item.model)
        //   : props.data.value,
        data: unref(props.data),
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
        value: getStrAryValue(props.data, item.model),
        // value: getValueByPath(props.data.value, item.model),
        data: unref(props.data),
        api: props.api,
      })
    ) {
      return true;
    } else return false;
  });

  // align
  const row = item.row || option.row || [24, 0];
  const wrapperCol = item.wrapperCol || option.wrapperCol || {};
  const rowSpan = row[0] || 24;
  const rowOffset = row[1] || 0;
  const align = item.align || "left";
  const alignGroup = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    start: "flex-start",
    end: "flex-end",
  };

  // render custom component
  if (item.render || item.renderFormItem || !item.type) {
    if (item.render && !item.model) {
      return (
        <>
          <ElCol span={rowSpan} offset={rowOffset} {...wrapperCol}>
            <div
              style={{
                display: "flex",
                justifyContent: alignGroup[align],
              }}
            >
              {item.render({
                model: "",
                value: "",
                data: unref(props.data),
                disabled: disabled,
              })}
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
            {...wrapperCol}
            span={rowSpan}
            offset={rowOffset}
          >
            <div
              style={{
                display: "flex",
                justifyContent: alignGroup[align],
              }}
            >
              {item.render({
                model: item.model,
                value: getStrAryValue(props.data, item.model),
                data: unref(props.data),
                disabled: disabled,
              })}
            </div>
          </ElCol>
        </>
      );
    }
    if (item.renderFormItem && item.model) {
      return (
        <ElCol span={rowSpan} offset={rowOffset} {...wrapperCol}>
          <ElFormItem
            {...rule}
            labelWidth={item.labelWidth || undefined}
            label={item.label ? item.label + ":" : ""}
            class={item.className}
            prop={getFirstModel(item.model)}
          >
            {item.renderFormItem({
              model: item.model,
              value: getStrAryValue(props.data, item.model),
              data: unref(props.data),
              disabled: disabled,
            })}
          </ElFormItem>
        </ElCol>
      );
    } else if (item.renderFormItem && !item.model) {
      return (
        <ElCol span={rowSpan} offset={rowOffset} {...wrapperCol}>
          <ElFormItem
            {...rule}
            labelWidth={item.labelWidth || undefined}
            label={item.label ? item.label + ":" : ""}
            class={item.className}
          >
            {item.renderFormItem({
              model: "",
              value: "",
              data: unref(props.data),
              disabled: disabled,
            })}
          </ElFormItem>
        </ElCol>
      );
    }
    return "";
  }

  const CustomComponent = Components[item.type];

  const actionProp = {
    ...prop,
    data: props.data,
  };

  if (!item.model && item.type) {
    return (
      <>
        <ElCol span={rowSpan} offset={rowOffset} {...wrapperCol}>
          <div
            style={{
              display: "flex",
              justifyContent: alignGroup[align],
            }}
          >
            <CustomComponent {...actionProp} />
          </div>
        </ElCol>
      </>
    );
  }

  if (!item.model) return "";

  const childProp = {
    ...prop,
    disabled: disabled,
    onChange: (value: unknown, type: string) => {
      const data = {
        type,
        value,
        data: unref(props.data),
      };
      item.onChange && item.onChange(data);
      option.onChange && option.onChange(data);
    },
    defaultValue: item.defaultValue && item.defaultValue(unref(props.data)),
  };
  const labelSlot = item.renderLabel
    ? {
        label: item.renderLabel(),
      }
    : {};
  return (
    <>
      <ElCol span={rowSpan} offset={rowOffset} {...wrapperCol}>
        <ElFormItem
          labelWidth={item.labelWidth || undefined}
          label={item.label ? item.label + ":" : ""}
          v-slots={labelSlot}
          class={item.className}
          prop={getFirstModel(item.model || "")}
          {...rule}
        >
          <CustomComponent
            {...childProp}
            modelValue={
              childProp.defaultValue !== undefined
                ? childProp.defaultValue
                : getStrAryValue(props.data, item.model)
            }
            onUpdate:modelValue={(e) => {
              if (!item.defaultValue) {
                if (isArray(item.model)) {
                  if (!e?.key) {
                    console.error(
                      "fast-error: model为Array的列, 基础组件须携带key value"
                    );
                    return;
                  }
                  const { key, value } = e;
                  setValueByPath(props.data.value, key, value);
                } else {
                  setValueByPath(props.data.value, item.model || "", e);
                }
              }
            }}
          />
        </ElFormItem>
      </ElCol>
    </>
  );
}
