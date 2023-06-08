import { defineComponent, unref, PropType, watch } from "vue";
import { ElCheckboxGroup, ElCheckbox, ElRate } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model } = props;
    console.log(props.dataSource);
    const prop = props.customProps || {};
    return () => (
      <>
        <ElRate
          style={{
            width: "100%",
          }}
          onUpdate:modelValue={(e) => {
            emit("update:modelValue", e);
            emit("change", e, model);
          }}
          modelValue={props.modelValue as any}
          disabled={unref(props.disabled)}
          {...prop}
        ></ElRate>
      </>
    );
  },
});
