import { defineComponent, PropType, Ref, unref } from "vue";
import { ElInputNumber, ElCol, ElFormItem } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model, disabled } = props;
    return () => (
      <>
        <ElInputNumber
          min={0}
          max={100000}
          disabled={unref(disabled)}
          onChange={(e) => {
            console.log(e);
            emit("update:modelValue", e);
            emit("change", e, model);
          }}
          placeholder={placeholder || `请输入`}
          modelValue={props.modelValue as number}
          {...(props.customProps || {})}
        />
      </>
    );
  },
});
