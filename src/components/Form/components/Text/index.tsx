import { defineComponent } from "vue";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  setup(props) {
    return () => <>{props.modelValue}</>;
  },
});
