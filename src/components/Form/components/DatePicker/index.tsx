import { defineComponent, unref } from "vue";
import { ElDatePicker } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, disabled, customProps } = props;
    const model: [string, string] = props.model as any;
    if (Array.isArray(props.model) && props.model) {
      return () => (
        <>
          <ElDatePicker
            type="date"
            style={{
              width: "100%",
            }}
            placeholder={placeholder || `请选择${label}`}
            onUpdate:modelValue={(e: any) => {
              emit("update:modelValue", {
                key: model[0],
                value: e[0],
              });
              emit("change", e[0], model[0]);
              emit("update:modelValue", {
                key: model[1],
                value: e[1],
              });
              emit("change", e[1], model[1]);
            }}
            modelValue={props.modelValue || (props.defaultValue as any)}
            disabled={unref(disabled)}
            value-format="YYYY-MM-DD"
            {...(customProps || {})}
          />
        </>
      );
    }
  },
});
