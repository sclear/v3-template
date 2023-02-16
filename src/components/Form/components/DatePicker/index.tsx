import { defineComponent, unref } from "vue";
import { ElDatePicker } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model, disabled, customProps } = props;
    return () => (
      <>
        <ElDatePicker
          type="date"
          style={{
            width: "100%",
          }}
          placeholder={placeholder || `请选择${label}`}
          onUpdate:modelValue={(e: any) => {
            emit("update:modelValue", e);
            emit("change", e, model);
          }}
          modelValue={props.modelValue || (props.defaultValue as any)}
          disabled={unref(disabled)}
          value-format="YYYY-MM-DD"
          {...(customProps || {})}
        />
      </>
    );
  },
});
