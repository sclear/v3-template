import { defineComponent, unref } from "vue";
import { ElTag } from "element-plus";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  setup(props) {
    return () => <ElTag>{props.value}</ElTag>;
  },
});
