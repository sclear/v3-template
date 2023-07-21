import { PropType, Ref, ComputedRef } from "vue";

export const propsType = {
  model: {
    type: String,
  },
  modelValue: {
    type: [String, Number, Array],
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  dataSource: {
    type: [Array, Object] as unknown as PropType<unknown[] | Ref<unknown[]>>,
    default: [],
  },
  disabled: {
    type: Object as unknown as PropType<ComputedRef<boolean>>,
  },
  customProps: {
    type: Object as PropType<Record<string, any>>,
    default: {},
  },
  defaultValue: {
    type: [String, Number, Array],
  },
};
