import { defineComponent, PropType, Ref, unref } from "vue";
import {
  ElInput,
  ElCol,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
} from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { placeholder, label, model, disabled } = props;
    return () => (
      <>
        <ElRadioGroup
          modelValue={props.modelValue as any}
          disabled={unref(disabled)}
          onChange={(e) => {
            emit("update:modelValue", e);
            emit("change", e, model);
          }}
          {...(props.customProps || {})}
        >
          {unref(props.dataSource).map((item: any) => {
            return <ElRadio label={item.value}>{item.label}</ElRadio>;
          })}
        </ElRadioGroup>
      </>
    );
  },
});
