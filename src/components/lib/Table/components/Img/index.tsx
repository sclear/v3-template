import { defineComponent } from "vue";
import { propsType } from "./../propsType";

export default defineComponent({
  props: propsType,
  setup(props: any) {
    return () => (
      <>
        <img class="w-30px" src={props.defaultValue} />
      </>
    );
  },
});
