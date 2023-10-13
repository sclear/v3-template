import { defineComponent, unref } from "vue";
import { ElTag } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  setup(props: any) {
    return () => (
      <>
        <ElTag>{props.value[0] || ""}</ElTag>
        {props.value[1]}
      </>
    );
  },
});
