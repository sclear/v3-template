import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  provide,
  reactive,
  inject,
  ref,
  ComponentInternalInstance,
  useSlots,
  unref,
} from "vue";
import type { PropType } from "vue";
import { ElDialog, ElButton, ElIcon } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import "./index.less";
import { setting } from "@/tools/setting/setting";
import { omit } from "@/tools/util";
import { ApiType } from "@/hook/useServer";

export type DialogOpenArgs = {
  disabled?: boolean;
  title?: string;
  data?: Object;
  api?: ApiType;
  action?: Action[];
};

type Action = {
  label?: string;
  function?: string;
  type?: string;
  api?: string;
  props?: Object;
};

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

    const formDialog = computed(() => {
      return dialogDisabled.value || props.disabled;
    });

    // provide
    provide("renderDialog", {
      setFormInstance(instance: any | null) {
        formInstance.value = instance;
      },
      disabled: formDialog,
    });

    onMounted(() => {
      const instance = getCurrentInstance();
    });

    // close callback
    function closeModel(api?: string) {
      buttonLoading.value = true;
      // form联动
      if (formInstance.value && !props.freeze) {
        if (api) formInstance.value?.exposed?.setApi(api);
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

      // has confirm callback
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
            {/* <ElButton
              onClick={() => {
                props.cancel && props.cancel();
                cancelCallReset();
                visible.value = false;
                buttonLoading.value = false;
              }}
            >
              {props.cancelText || setting.dialog.cancelText || "取消"}
            </ElButton>
            <ElButton
              type="primary"
              onClick={closeModel}
              loading={buttonLoading.value}
            >
              {props.confirmText || setting.dialog.confirmText || "确定"}
            </ElButton> */}
            {action.value.map((vNode) => {
              return vNode();
              // return <vNode loading={unref(buttonLoading)} />;
            })}
          </>
        );
      },
    };

    const currentClickLabel = ref("");

    const handleList = {
      cancel: (handleProps: object, label?: string) => {
        return () => (
          <ElButton
            {...handleProps}
            onClick={() => {
              props.cancel && props.cancel();
              cancelCallReset();
              visible.value = false;
              buttonLoading.value = false;
            }}
          >
            {label || props.cancelText || setting.dialog.cancelText || "取消"}
          </ElButton>
        );
      },
      confirm: (handleProps: object, label?: string, api?: string) => {
        return () => (
          <ElButton
            type="primary"
            {...handleProps}
            onClick={() => {
              closeModel(api);
              currentClickLabel.value = label || "确认";
            }}
            loading={
              unref(buttonLoading) &&
              (label ||
                props.confirmText ||
                setting.dialog.confirmText ||
                "确认") === currentClickLabel.value
            }
          >
            {label || props.confirmText || setting.dialog.confirmText || "确认"}
          </ElButton>
        );
      },
    };

    const action = ref<any[]>([]);

    const defaultAction: Action[] = [
      {
        label: "取消",
        function: "cancel",
        type: "default",
      },
      {
        label: "确定",
        function: "confirm",
        type: "primary",
      },
    ];

    function open(params: DialogOpenArgs = {}) {
      dialogTitle.value = params.title || "";
      dialogDisabled.value = params.disabled || false;
      visible.value = true;

      action.value = (params.action || defaultAction).map((item: Action) => {
        if (item.function === "cancel") {
          return handleList.cancel(
            omit(item, ["function", "label"]),
            item.label
          );
        }
        if (item.function === "confirm") {
          return handleList.confirm(
            omit(item, ["function", "label", "api"]),
            item.label,
            item.api
          );
        }
      });
      // 防止首次Form示例未生成
      setTimeout(() => {
        if (params.data && formInstance?.value?.exposed) {
          formInstance?.value?.exposed?.setData(params.data);
          if (params.api) {
            formInstance?.value?.exposed?.setApi(params.api);
          }
        }
      }, 50);
    }
    function close() {
      props.cancel && props.cancel();
      cancelCallReset();
      visible.value = false;
      buttonLoading.value = false;
    }

    // exports
    ctx.expose({
      open,
      close,
    });

    // 传递dialog instance 至 table
    const setTable = inject<{
      setDialogInstance?: (instance: any | null) => void;
    }>("GetDialogInstance", {
      // setDialogInstance()
    });

    onMounted(() => {
      setTable.setDialogInstance &&
        setTable.setDialogInstance({
          open,
          close,
        });
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
