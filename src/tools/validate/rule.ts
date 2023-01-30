import { done } from ".";

export class rules {
  /**
   * @description 自动基础校验
   * @returns RuleItem
   */
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

  /**
   * @description 限制位数
   * @returns RuleItem
   */
  max(max: number, message?: string) {
    const rule = {
      max,
      message: message || `高于最大限制${max}位`,
      trigger: "blur",
    };

    return done.call(this, rule);
  }

  /**
   * @description 限制位数
   * @returns RuleItem
   */
  min(min: number, message?: string) {
    const rule = {
      min,
      message: message || `低于最小限制${min}位`,
      trigger: "blur",
    };

    return done.call(this, rule);
  }

  /**
   * @description 验证email
   * @returns RuleItem
   */
  email(message?: string) {
    const rule = {
      validator(rule: any, value: any, callback: any) {
        if (
          !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
            value
          ) &&
          value.length > 0
        ) {
          callback(new Error(message || "请正确填写您的邮箱!"));
        } else {
          callback();
        }
      },
    };

    return done.call(this, rule);
  }

  /**
   * @description 英文校验
   * @returns RuleItem
   */
  english(message?: string) {
    const rule = {
      validator(rule: any, value: any, callback: any) {
        if (!/[A-Za-z]+$/.test(value)) {
          callback(new Error(message || "请输入英文字符"));
        } else {
          callback();
        }
      },
    };

    return done.call(this, rule);
  }

  /**
   * @description 中文校验
   * @returns RuleItem
   */
  chinese(message?: string) {
    const rule = {
      validator(rule: any, value: any, callback: any) {
        if (!/^[\u4E00-\u9FA5]{0,}$/.test(value)) {
          callback(new Error(message || "请填写正确的中文"));
        } else {
          callback();
        }
      },
    };

    return done.call(this, rule);
  }

  /**
   * @description 验证电话号
   * @returns RuleItem
   */
  phone(message?: string) {
    const rule = {
      validator(rule: any, value: any, callback: any) {
        if (!/^(1[3567984]\d{9})$/.test(value)) {
          callback(new Error(message || "请正确填写手机号"));
        } else {
          callback();
        }
      },
    };

    return done.call(this, rule);
  }

  /**
   * @description 银行卡号
   * @returns RuleItem
   */
  bankCard(message?: string) {
    const rule = {
      validator(rule: any, value: any, callback: any) {
        if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(value)) {
          callback(new Error(message || "请正确填写您的银行卡号!"));
        } else {
          callback();
        }
      },
    };

    return done.call(this, rule);
  }
}
