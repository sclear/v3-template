import { defineComponent, unref, PropType, watch } from "vue";
import { ElSelect, ElOption, ElCol, ElFormItem } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model } = props;
    const prop = props.customProps || {};
    return () => (
      <>
        <ElSelect
          {...prop}
          style={{
            width: "100%",
          }}
          placeholder={placeholder || `请选择${label}`}
          onChange={(e) => {
            emit("update:modelValue", e);
            emit("change", e, model);
          }}
          modelValue={props.modelValue}
          disabled={unref(props.disabled)}
        >
          {unref(props.dataSource as []).map((item: any) => {
            return (
              <ElOption
                key={item.value}
                label={item.label}
                value={item.value}
              />
            );
          })}
        </ElSelect>
      </>
    );
  },
});
