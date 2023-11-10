import { defineComponent, unref, PropType, watch } from "vue";
import { ElCheckboxGroup, ElCheckbox, ElCol, ElFormItem } from "element-plus";
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
        <ElCheckboxGroup
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
        >
          {unref(props.dataSource).map((item: any) => {
            return (
              <ElCheckbox key={item.value} label={item.value}>
                {item.label}
              </ElCheckbox>
            );
          })}
        </ElCheckboxGroup>
      </>
    );
  },
});
