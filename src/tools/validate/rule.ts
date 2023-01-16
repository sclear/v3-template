import { done } from ".";

export class rules {
  required() {
    const rule = {
      required: true,
    };
    return done.call(this, rule);
  }
  /**
   * @description 必填项
   * @returns RuleItem
   */
  must(message?: string, trigger?: string) {
    const rule = {
      required: true,
      message: message || "该项为必填项",
      trigger: trigger || "blur",
    };
    return done.call(this, rule);
  }

  /**
   * @description length
   * @returns RuleItem
   */
  length(length: number, message?: string) {
    const rule = {
      length,
      message: message || `请输入${length}位`,
    };

    return done.call(this, rule);
  }
}
