import createRules, { isCreateValidateInstance } from "./../../tools/validate";
import { RuleItem } from "async-validator";
import type { FormType, FormSettingType } from "./../FormItem";
import { isFormGroupType } from "./../FormItem";
import { setting } from "@/tools/setting/setting";

const isArray = Array.isArray;
function getFirstModel(model: Model): string {
  return isArray(model) ? model[0] : model;
}
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
  console.log(formFlat);
  const formItem = formFlat.find((item) => getFirstModel(item.model) === key);
  // 存在校验 没有实际Form
  if (!formItem) return rules;

  if (Array.isArray(rules) && rules.length) {
    return rules.map((item) => {
      if (item.required === true && Object.keys(item).length === 1) {
        return {
          ...item,
          trigger:
            setting.form.eventTrigger[formItem.type || "default"] ||
            setting.form.eventTrigger["default"],
          message: `${
            setting.form.labelMessage[formItem.type || "default"] ||
            setting.form.labelMessage["default"]
          }${formItem.label || ""}`,
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
      trigger: setting.form.eventTrigger[formItem.type || "default"],
      message: `${setting.form.labelMessage[formItem.type || "default"]}${
        formItem.label || ""
      }`,
    };
  }
}
