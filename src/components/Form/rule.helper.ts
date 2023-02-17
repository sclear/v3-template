import createRules, { isCreateValidateInstance } from "./../../tools/validate";
import { RuleItem } from "async-validator";
import type { FormType, FormSettingType } from "./../FormItem";
import { isFormGroupType } from "./../FormItem";

const trigger = {
  Select: "change",
  Input: "blur",
  DatePicker: "change",
  Radio: "change",

  default: "change",
};

const message = {
  Select: "请选择",
  DatePicker: "请选择",
  Radio: "请选择",
  Input: "请输入",

  default: "请选择",
};

export function ruleHelper(
  rule: RuleItem[] | typeof createRules,
  key: string,
  form: FormType<any>[]
) {
  const rules = isCreateValidateInstance(rule) ? rule.rules : rule;
  // const formItem = form.find((item) => item.model === key);
  let formFlat: FormSettingType<any>[] = [];
  form.forEach((item) => {
    if (isFormGroupType(item)) {
      formFlat = [...formFlat, ...item.children];
    } else {
      formFlat.push(item);
    }
  });
  const formItem = formFlat.find((item) => item.model === key);
  // 存在校验 没有实际Form
  if (!formItem) return rules;

  if (Array.isArray(rules) && rules.length) {
    return rules.map((item) => {
      if (item.required === true && Object.keys(item).length === 1) {
        return {
          ...item,
          trigger: trigger[formItem.type || "default"],
          message: `${message[formItem.type || "default"]}${
            formItem.label || ""
          }`,
        };
      }
      return item;
    });
  }
  return rules;
}

function requiredGenerate(item: RuleItem, formItem: FormSettingType<any>) {
  if (item.required === true && Object.keys(item).length === 1) {
    return {
      ...item,
      trigger: trigger[formItem.type || "default"],
      message: `${message[formItem.type || "default"]}${formItem.label || ""}`,
    };
  }
}
