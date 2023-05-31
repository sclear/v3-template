import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  provide,
  reactive,
  ref,
  ComponentInternalInstance,
  useSlots,
} from "vue";
import type { PropType } from "vue";
import { ElDialog, ElButton, ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import "./index.less";

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
    },
    confirm: {
      type: Function as PropType<(cb: (isClose?: boolean) => void) => void>,
    },
    cancel: {
      type: Function as PropType<() => void>,
    },
    width: {
      type: Number as PropType<number>,
    },
    elProps: {
      type: Object as PropType<Record<string, number | string | boolean>>,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    freeze: {
      type: Boolean,
      default: () => false,
    },
    confirmText: {
      type: String as PropType<string>,
    },
    cancelText: {
      type: String as PropType<string>,
    },
  },
  emits: {
    valid: () => void 0,
  },
  setup(props, ctx) {
    const { width, elProps, title, confirm, cancel, disabled } = props;

    const dialogTitle = ref("");

    const dialogDisabled = ref(false);

    const visible = ref(false);

    const buttonLoading = ref(false);

    const slot = ctx.slots;

    let formInstance = ref<ComponentInternalInstance | null>(null);

    onMounted(() => {
      const instance = getCurrentInstance();
    });

    // close callback
    function closeModel() {
      buttonLoading.value = true;
      // form联动
      if (formInstance.value && !props.freeze) {
        formInstance.value?.exposed?.validate &&
          formInstance.value?.exposed?.validate((isClose?: boolean) => {
            if (isClose || isClose === undefined) {
              buttonLoading.value = false;
              visible.value = false;
            } else {
              buttonLoading.value = false;
            }
          });
        return;
      }

      // if props has confirm callback
      if (props.confirm) {
        props.confirm((isClose?: boolean) => {
          if (isClose || isClose === undefined) {
            buttonLoading.value = false;
            visible.value = false;
          } else {
            buttonLoading.value = false;
          }
        });
        return;
      }
      buttonLoading.value = false;
      visible.value = false;
    }

    // cancel call form reset
    function cancelCallReset() {
      if (formInstance.value) {
        formInstance.value?.exposed?.validate &&
          formInstance.value?.exposed?.reset();
      }
    }

    // slots
    const slots = {
      header: () => (
        <div>
          <div class="dialog-header">
            <span>{dialogTitle.value || props.title || "标题"}</span>
            <div
              onClick={() => {
                visible.value = false;
                buttonLoading.value = false;
              }}
            >
              <ElIcon>
                <Close class="pointer" />
              </ElIcon>
            </div>
          </div>
        </div>
      ),
      footer: () => {
        if (dialogDisabled.value || props.disabled) {
          return "";
        }
        return (
          <>
            <ElButton
              onClick={() => {
                props.cancel && props.cancel();
                cancelCallReset();
                visible.value = false;
              }}
            >
              {props.confirmText || "取消"}
            </ElButton>
            <ElButton
              type="primary"
              onClick={closeModel}
              loading={buttonLoading.value}
            >
              {props.cancelText || "确定"}
            </ElButton>
          </>
        );
      },
    };

    type openOptions = {
      disabled?: boolean;
      title?: string;
    };

    // exports
    ctx.expose({
      open(params: openOptions = {}) {
        dialogTitle.value = params.title || "";
        dialogDisabled.value = params.disabled || false;
        visible.value = true;
      },
    });

    const formDialog = computed(() => {
      return dialogDisabled.value || props.disabled;
    });

    // provide
    provide("renderDialog", {
      setFormInstance(instance: ComponentInternalInstance | null) {
        console.log(formInstance);
        formInstance.value = instance;
      },
      disabled: formDialog,
    });

    // destroy-on-close={true}
    return () => (
      <>
        <ElDialog
          {...elProps}
          v-model={visible.value}
          width={width}
          append-to-body={true}
          v-slots={slots}
          onClose={() => {
            cancelCallReset();
          }}
          show-close={false}
          close-on-click-modal={false}
          close-on-press-escape={false}
        >
          {(slot.default && slot.default()) || ""}
        </ElDialog>
      </>
    );
  },
});
