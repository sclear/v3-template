import type { PropType } from "vue";

export const propsType = {
  value: {
    type: [String, Array],
  },
  data: {
    type: [String, Number, Array, Object],
  },
  index: {
    type: Number,
  },
  args: {
    type: Object as unknown as PropType<{
      index: number;
    }>,
  },
};
