import { defineComponent, inject } from "vue";

export default defineComponent({
  props: {
    htmlType: {
      type: String,
    },
  },
  setup(props, { slots }) {
    const { htmlType } = props;

    const Trigger = inject<{
      reset: any;
      validate: any;
    }>("TriggerFormProvider", {
      reset() {
        new Error();
      },
      validate() {},
    });

    return () => (
      <div
        onClick={() => {
          if (htmlType === "submit") {
            Trigger.validate();
          } else if (htmlType === "reset") {
            Trigger.reset();
          }
        }}
        class="inline-block"
      >
        {(slots.default && slots.default()) || ""}
      </div>
    );
  },
});
