import { defineComponent, unref, PropType, watch } from "vue";
import { ElSelect, ElOption, ElSwitch } from "element-plus";
import { propsType } from "../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model, dataSource } = props;

    const prop = props.customProps || {};
    return () => (
      <>
        <ElSwitch
          onChange={(e) => {
            emit("update:modelValue", e);
            emit("change", e);
          }}
          modelValue={props.modelValue}
          disabled={unref(props.disabled)}
          {...prop}
        ></ElSwitch>
      </>
    );
  },
});
